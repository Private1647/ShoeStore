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
import json
import re
import sys
import time
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


def _norm(s) -> str:
    """Normalize a name for matching: lowercase, alphanumerics only (so an
    em-dash vs hyphen vs spacing never causes a miss)."""
    return re.sub(r"[^a-z0-9]", "", str(s or "").lower())


def _find_env_id(envs: list[dict], spec: dict):
    target = _norm(spec.get("name"))
    for env in envs:
        if _norm(env.get("name")) == target and env.get("environment_id"):
            return env["environment_id"]
    return None


def resolve_environment(client, tm: dict, spec: dict):
    """Reuse a pinned id, then an existing environment matching the configured
    name, else create one — so we don't pile up a new environment every run.
    Environment names are unique, so a create conflict means it already exists:
    re-fetch and reuse it."""
    if tm.get("environment_id"):
        print(f"[trigger] using pinned environment_id={tm['environment_id']}")
        return tm["environment_id"]
    envs = client.list_environments()
    print(f"[trigger] fetched {len(envs)} existing environment(s)")
    found = _find_env_id(envs, spec)
    if found:
        print(f"[trigger] reusing environment_id={found} ({spec.get('name')})")
        return found
    try:
        env_id = client.create_environment(spec)
        print(f"[trigger] created environment_id={env_id} ({spec.get('name')})")
        return env_id
    except Exception as exc:  # noqa: BLE001
        if "already exists" not in str(exc).lower():
            raise
        found = _find_env_id(client.list_environments(), spec)
        if not found:
            raise RuntimeError(f"environment '{spec.get('name')}' exists but was not "
                               f"found in the environments list: {exc}")
        print(f"[trigger] reusing environment_id={found} (after create conflict)")
        return found


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

    # 1a. Resolve the execution environment (browser/OS): pinned → existing → create.
    env_id = resolve_environment(client, tm, ex["environment"])

    instances = build_instances(tests, env_id)
    objective = f"Automated {args.mode} regression for {cfg['app']['name']}"

    # 1b. Resolve the test run to execute. HyperExecute CLONES the run it is given
    #     and executes the clone, so creating a fresh run every time leaves an
    #     orphan. Reuse a pinned template run instead; create one only if none is
    #     pinned (and tell the operator to pin it).
    template_id = tm.get("template_test_run_id")
    if template_id:
        run_id = template_id
        print(f"[trigger] reusing template test run {run_id}")
    else:
        run_id = client.create_test_run(
            title=title, project_id=tm["project_id"],
            test_run_instances=[], objective=objective,
        )
        print(f"[trigger] created test run {run_id} — pin this as "
              f"test_manager.template_test_run_id to stop creating orphan runs")

    # 1c. Set this run's instances (overwrites the template's instances for this
    #     run, e.g. full suite for daily vs. the impacted subset for a PR).
    client.set_test_run_instances(run_id, project_id=tm["project_id"], title=title,
                                  test_run_instances=instances, objective=objective)
    print(f"[trigger] set {len(instances)} instance(s) on run {run_id}")

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

    # The tunnel is registered just before this call; HyperExecute's backend
    # tunnel-active check can briefly 500 ("Failed to check if tunnel is active")
    # until it propagates. Retry on tunnel/5xx errors.
    resp = None
    for attempt in range(1, 7):
        try:
            resp = client.trigger_hyperexecute(payload)
            break
        except Exception as exc:  # noqa: BLE001
            msg = str(exc)
            transient = "tunnel" in msg.lower() or "HTTP 5" in msg
            if transient and attempt < 6:
                print(f"[trigger] hyperexecute not ready ({msg[:140]}); "
                      f"retry {attempt}/6 in 15s", flush=True)
                time.sleep(15)
                continue
            raise
    print(f"[trigger] hyperexecute response: {json.dumps(resp, default=str)[:600]}")
    rdata = resp.get("data") if isinstance(resp.get("data"), dict) else {}
    job_id = resp.get("job_id") or rdata.get("job_id")
    job_link = resp.get("job_link") or rdata.get("job_link", "")
    if not job_id:
        sys.exit(f"ERROR: hyperexecute trigger returned no job_id: {resp}")
    # HyperExecute clones the test run we pass and EXECUTES the clone, leaving the
    # one we created orphaned at 'not started'. Poll the clone's id when the
    # response provides it; otherwise fall back to the run we created.
    executed_run_id = (resp.get("test_run_id") or rdata.get("test_run_id")
                       or resp.get("run_id") or rdata.get("run_id") or run_id)
    print(f"[trigger] HyperExecute job: {job_id} | executed test_run_id="
          f"{executed_run_id} (created={run_id})\n[trigger] {job_link}")

    # 3. Poll the TEST RUN to terminal state (Test Manager is the source of
    #    truth; the HyperExecute job-status API returns 'unknown').
    started = datetime.now(timezone.utc).isoformat()
    final = client.poll_test_run(executed_run_id,
                                 interval_s=ex.get("poll_interval_seconds", 20),
                                 timeout_min=ex.get("poll_timeout_minutes", 45))
    details = final.get("test_run_details") or {}
    inst_data = (final.get("test_run_instances") or {}).get("data") or []

    # 4. Map per-test-case results from the test run.
    result_instances = []
    for inst in inst_data:
        env = inst.get("environment") or {}
        result_instances.append({
            "test_case_id": inst.get("test_case_id"),
            "instance_id": inst.get("id"),
            "internal_id": inst.get("internal_id", ""),
            "name": inst.get("title") or inst.get("name", ""),
            "status": str(inst.get("status", "unknown")).lower(),
            # test_id is the automation session id (e.g. TV4TO-...), used for RCA
            # and session logs; session_id keeps the old key as an alias.
            "test_id": inst.get("test_id", ""),
            "session_id": inst.get("test_id", ""),
            "linked_test_url": inst.get("linked_test_url", ""),
            "auteur_test_id": inst.get("auteur_test_id", ""),
            "environment": env.get("name", ""),
            "browser": env.get("browser", ""),
            "os": env.get("os_name") or env.get("os", ""),
            "raw": inst,
        })

    run_result = details.get("run_result") or {}
    result = {
        "mode": args.mode,
        "title": title,
        "test_run_id": run_id,
        "executed_test_run_id": executed_run_id,
        "test_case_ids": test_case_ids,
        "environment_id": env_id,
        "job_id": job_id,
        "job_link": job_link,
        "job_status": str(details.get("status", "unknown")).lower(),
        "run_result": run_result,
        "complete_percent": details.get("complete_percent"),
        "started_at": started,
        "finished_at": datetime.now(timezone.utc).isoformat(),
        "instances": result_instances,
    }
    write_json(args.out, result)
    print(f"[trigger] wrote {args.out} — status={result['job_status']}, "
          f"instances={len(result_instances)}, run_result={run_result}")


if __name__ == "__main__":
    main()
