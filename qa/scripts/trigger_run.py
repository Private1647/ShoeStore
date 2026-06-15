"""
Create a Test Run in Test Manager, trigger it on HyperExecute, poll to
completion, and collect per-test-case results.

Usage:
  python qa/scripts/trigger_run.py --mode full   --title "Daily regression #42"
  python qa/scripts/trigger_run.py --mode impacted --test-ids ID1,ID2 \
      --title "PR #7 impact run" --tunnel qa-pr-7 \
      --replace-url "https://deployed.example.com=http://localhost:5000"

Outputs: reports/run_result.json
  { test_run_id, job_id, job_link, job_status, started_at, finished_at,
    instances: [ {test_case_id, name, status, session_id, ...} ] }

Exit code: 0 if the job reached a terminal state (pass/fail gating happens in
report.py); 1 only on infrastructure errors (could not create/trigger run).
"""
from __future__ import annotations

import argparse
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from lt_client import LTClient, load_config, load_manifest, write_json  # noqa: E402


def parse_args():
    p = argparse.ArgumentParser()
    p.add_argument("--mode", choices=["full", "impacted"], default="full")
    p.add_argument("--test-ids", default="",
                   help="Comma-separated Test Manager test case IDs (impacted mode)")
    p.add_argument("--title", default="")
    p.add_argument("--tunnel", default="", help="LambdaTest tunnel name (PR runs)")
    p.add_argument("--replace-url", default="",
                   help="pattern=replacement — rewrites test URLs at run time")
    p.add_argument("--out", default="reports/run_result.json")
    return p.parse_args()


# Test-case priority (manifest) → Test Manager test-run-instance priority.
PRIORITY_MAP = {"P0": "High", "P1": "High", "P2": "Medium", "P3": "Low"}


def resolve_tests(args, manifest) -> list[dict]:
    """Return the manifest test entries to include (with title + priority)."""
    by_id = {t["tm_test_case_id"]: t for t in manifest["tests"] if t.get("tm_test_case_id")}
    if args.mode == "impacted":
        ids = [t.strip() for t in args.test_ids.split(",") if t.strip()]
        if not ids:
            sys.exit("ERROR: --mode impacted requires --test-ids")
        # Map ids back to manifest entries for title/priority; tolerate unknowns.
        return [by_id.get(i, {"tm_test_case_id": i, "title": f"Test {i}", "priority": "P2"})
                for i in ids]
    tests = [t for t in manifest["tests"] if t.get("tm_test_case_id")]
    if not tests:
        sys.exit("ERROR: no tm_test_case_id values in qa/manifest.json — "
                 "run the qa-suite-sync workflow to author/upload the suite first.")
    return tests


def build_instances(tests: list[dict], environment_id) -> list[dict]:
    """One Test Run instance per test case, grouped under the environment."""
    instances = []
    for i, t in enumerate(tests, start=1):
        instances.append({
            "test_case_id": t["tm_test_case_id"],
            "environment_id": environment_id,
            "serial_no": i,
            "priority": PRIORITY_MAP.get(t.get("priority"), "Medium"),
            "name": t.get("title") or t["tm_test_case_id"],
        })
    return instances


def main() -> None:
    args = parse_args()
    cfg = load_config()
    manifest = load_manifest()
    client = LTClient()
    tm, ex = cfg["test_manager"], cfg["execution"]

    title = args.title or (f"{cfg['app']['name']} {args.mode} regression "
                           f"{datetime.now(timezone.utc):%Y-%m-%d %H:%M}")
    tests = resolve_tests(args, manifest)
    test_case_ids = [t["tm_test_case_id"] for t in tests]
    print(f"[trigger] {args.mode} run with {len(tests)} test case(s)")

    # 1a. Resolve the execution environment (browser/OS). Reuse a pinned id if
    #     set, else create one from the config spec.
    env_id = tm.get("environment_id")
    if not env_id:
        env_id = client.create_environment(ex["environment"])
        print(f"[trigger] created environment_id={env_id}")
    else:
        print(f"[trigger] using pinned environment_id={env_id}")

    # 1b. Create (or duplicate) the Test Run with per-test instances.
    instances = build_instances(tests, env_id)
    try:
        run_id = client.create_test_run(
            title=title,
            project_id=tm["project_id"],
            test_run_instances=instances,
            objective=f"Automated {args.mode} regression for {cfg['app']['name']}",
        )
    except Exception as exc:  # noqa: BLE001
        if tm.get("template_test_run_id"):
            print(f"[trigger] create_test_run failed ({exc}); duplicating template run")
            run_id = client.duplicate_test_run(tm["template_test_run_id"], title)
        else:
            sys.exit(f"ERROR: could not create Test Run: {exc}")
    print(f"[trigger] Test Run created: {run_id}")

    # 2. Trigger on HyperExecute
    payload = {
        "test_run_id": run_id,
        "concurrency": ex.get("concurrency", 2),
        "title": title,
        "console_log": ex.get("console_log", "error"),
        "network_logs": ex.get("network_logs", True),
        "network_full_har": ex.get("network_full_har", False),
        "region": ex.get("region", "eastus"),
        "retry_on_failure": ex.get("retry_on_failure", True),
        "max_retries": ex.get("max_retries", 1),
        "report_enabled": ex.get("report_enabled", True),
    }
    if ex.get("report_email_to"):
        payload["report_email_to"] = ex["report_email_to"]
    if args.tunnel:
        payload["tunnel"] = args.tunnel
    if args.replace_url:
        pattern, _, replacement = args.replace_url.partition("=")
        payload["replaced_url"] = [{"pattern_url": pattern, "replacement_url": replacement}]
    if env_id:
        payload["environment_id"] = env_id

    resp = client.trigger_hyperexecute(payload)
    job_id = resp.get("job_id")
    job_link = resp.get("job_link", "")
    if not job_id:
        sys.exit(f"ERROR: hyperexecute trigger returned no job_id: {resp}")
    print(f"[trigger] HyperExecute job: {job_id}\n[trigger] {job_link}")

    # 3. Poll to terminal state
    started = datetime.now(timezone.utc).isoformat()
    job = client.poll_job(job_id,
                          interval_s=ex.get("poll_interval_seconds", 30),
                          timeout_min=ex.get("poll_timeout_minutes", 45))

    # 4. Collect per-test-case results from Test Manager
    instances_raw = client.get_test_run_instances(run_id, tm["project_id"])
    instances = []
    for inst in instances_raw:
        instances.append({
            "test_case_id": inst.get("test_case_id") or inst.get("test_id"),
            "instance_id": inst.get("id"),
            "name": inst.get("name") or inst.get("title", ""),
            "status": str(inst.get("status", "unknown")).lower(),
            "session_id": inst.get("session_id") or inst.get("test_session_id"),
            "duration": inst.get("duration"),
            "raw": inst,
        })

    result = {
        "mode": args.mode,
        "title": title,
        "test_run_id": run_id,
        "test_case_ids": test_case_ids,
        "job_id": job_id,
        "job_link": job_link,
        "job_status": str(job.get("status", "unknown")).lower(),
        "job_summary": job.get("summary", {}),
        "started_at": started,
        "finished_at": datetime.now(timezone.utc).isoformat(),
        "instances": instances,
    }
    write_json(args.out, result)
    print(f"[trigger] wrote {args.out} — job_status={result['job_status']}, "
          f"instances={len(instances)}")


if __name__ == "__main__":
    main()
