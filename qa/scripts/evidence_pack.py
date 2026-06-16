"""
Evidence pack builder — jam.dev-style bug bundles for every failed test.

For each failed instance in reports/run_result.json, assembles:
  • Repro steps (from the source .testmd file)
  • Session replay + video links
  • AI RCA (Insights API): root cause, category, suggested fix
  • HyperExecute categorized errors (per failed stage)
  • Console errors and failing network calls (4xx/5xx) from the session
  • Environment metadata (browser/OS, build, commit)

Outputs:
  reports/evidence/<REG-ID>/EVIDENCE.md   — human-readable bug report
  reports/evidence/<REG-ID>/*.json        — raw artifacts
  reports/bugs.json                       — structured list for report.py
"""
from __future__ import annotations

import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from lt_client import LTClient, load_config, load_manifest, read_json, write_json  # noqa: E402

FAILED_STATES = {"failed", "error", "lambda error", "timeout"}


def repro_steps(test_file: str) -> list[str]:
    """Extract '## step' headings + bodies from a kane-cli testmd file."""
    p = Path(test_file)
    if not p.exists():
        return []
    steps, current = [], None
    in_frontmatter = False
    for line in p.read_text(encoding="utf-8").splitlines():
        if line.strip() == "---":
            in_frontmatter = not in_frontmatter
            continue
        if in_frontmatter:
            continue
        if line.startswith("## "):
            current = {"step": line[3:].strip(), "detail": []}
            steps.append(current)
        elif current and line.strip() and not line.startswith("#"):
            current["detail"].append(line.strip())
    return [f"{i + 1}. **{s['step']}** — {' '.join(s['detail'])}" for i, s in enumerate(steps)]


def failing_network_calls(network_log: dict) -> list[str]:
    """Pull 4xx/5xx requests out of whatever shape the network log API returns."""
    entries = []
    candidates = network_log.get("log", {}).get("entries", []) if isinstance(network_log, dict) else []
    if not candidates and isinstance(network_log, dict):
        candidates = network_log.get("data", []) if isinstance(network_log.get("data"), list) else []
    for e in candidates[:500]:
        try:
            status = int(e.get("response", {}).get("status", e.get("status", 0)))
            url = e.get("request", {}).get("url", e.get("url", ""))
            if status >= 400:
                entries.append(f"`{status}` {url[:160]}")
        except Exception:  # noqa: BLE001
            continue
    return entries[:25]


def console_errors(console_log: dict) -> list[str]:
    out = []
    items = console_log.get("data", console_log.get("logs", [])) if isinstance(console_log, dict) else []
    if isinstance(items, list):
        for item in items[:500]:
            level = str(item.get("level", item.get("type", ""))).lower()
            if level in {"severe", "error"}:
                out.append(str(item.get("message", item.get("text", "")))[:300])
    return out[:25]


def rca_summary(rca: dict) -> dict:
    """Normalize the Insights RCA response into {category, root_cause, fix}."""
    # RCA wiring is deferred (the tms-report/rca-category POST contract is TBD),
    # so show a clean placeholder rather than a raw HTTP error.
    if not rca or rca.get("_error"):
        return {"category": "", "root_cause": "RCA pending", "fix": ""}
    data = rca.get("data", rca) if isinstance(rca, dict) else {}
    def pick(d, *keys):
        for k in keys:
            v = d.get(k)
            if isinstance(v, str) and v.strip():
                return v.strip()
        return ""
    return {
        "category": pick(data, "failure_category", "category", "root_cause_type", "errorType"),
        "root_cause": pick(data, "root_cause", "rootCause", "rca", "summary", "description", "message")
                      or json.dumps(data)[:400],
        "fix": pick(data, "how_to_fix", "remediation", "suggested_fix", "recommendation"),
    }


def preview_link(project_id: str, test_run_id: str, inst: dict) -> str:
    """Test Manager test-instance URL (the 'Preview' link in the report)."""
    instance_id = inst.get("instance_id")
    if not (project_id and test_run_id and instance_id):
        return ""
    url = (f"https://test-manager.lambdatest.com/projects/{project_id}"
           f"/test-run/{test_run_id}/test-instance/{instance_id}")
    test_id = inst.get("test_id") or inst.get("session_id")
    return f"{url}?testID={test_id}" if test_id else url


def build_evidence(client: LTClient, inst: dict, test_meta: dict, run: dict,
                   out_dir: Path, project_id: str = "") -> dict:
    out_dir.mkdir(parents=True, exist_ok=True)
    session_id = inst.get("session_id") or ""
    reg_id = test_meta.get("id", inst.get("test_case_id", "UNKNOWN"))

    rca = client.get_ai_rca(session_id) if session_id else {}
    network = client.get_session_network_log(session_id) if session_id else {}
    console = client.get_session_console_log(session_id) if session_id else {}
    video = client.get_session_video(session_id) if session_id else {}
    session = client.get_session(session_id) if session_id else {}

    for name, blob in (("rca", rca), ("network", network), ("console", console),
                       ("session", session)):
        if blob:
            write_json(out_dir / f"{name}.json", blob)

    rca_n = rca_summary(rca)
    net_fail = failing_network_calls(network)
    con_err = console_errors(console)
    steps = repro_steps(test_meta.get("file", ""))
    sdata = session.get("data", session) if isinstance(session, dict) else {}
    video_url = ""
    if isinstance(video, dict):
        video_url = video.get("url") or video.get("data", {}).get("video_url", "") \
            if isinstance(video.get("data", {}), dict) else ""
    replay_link = f"https://automation.lambdatest.com/test?testID={session_id}" if session_id else ""
    tm_test_run_id = run.get("executed_test_run_id") or run.get("test_run_id") or ""
    tm_preview_link = preview_link(project_id, tm_test_run_id, inst)

    bug = {
        "reg_id": reg_id,
        "title": test_meta.get("title", inst.get("name", "Unknown test")),
        "priority": test_meta.get("priority", "P2"),
        "features": test_meta.get("features", []),
        "status": inst.get("status"),
        "test_case_id": inst.get("test_case_id"),
        "session_id": session_id,
        "preview_link": tm_preview_link,
        "replay_link": replay_link,
        "video_url": video_url,
        "job_link": run.get("job_link", ""),
        "rca": rca_n,
        "console_errors": con_err,
        "failing_network_calls": net_fail,
        "browser": sdata.get("browser", ""),
        "os": sdata.get("platform", sdata.get("os", "")),
        "evidence_dir": str(out_dir),
    }

    commit = os.environ.get("GITHUB_SHA", "")[:10]
    md = [
        f"# 🐞 {bug['title']}",
        "",
        f"**Test:** `{reg_id}` · **Priority:** {bug['priority']} · "
        f"**Features:** {', '.join(bug['features'])}",
        f"**Run:** [{run.get('title', '')}]({run.get('job_link', '')}) · "
        f"**Commit:** `{commit}` · **When:** {run.get('finished_at', '')}",
        "",
        "## What happened",
        f"- **Failure category:** {rca_n['category'] or 'n/a'}",
        f"- **Root cause (AI RCA):** {rca_n['root_cause']}",
    ]
    if rca_n["fix"]:
        md += [f"- **Suggested fix:** {rca_n['fix']}"]
    md += [
        "",
        "## Evidence",
        f"- 🔍 Preview (Test Manager): {tm_preview_link or 'n/a'}",
        f"- ▶️ Session replay: {replay_link or 'n/a'}",
        f"- 🎬 Video: {video_url or 'see session replay'}",
        f"- 🧪 Environment: {bug['browser']} on {bug['os'] or 'n/a'}",
        f"- 📦 Raw artifacts: `{out_dir}` (rca/network/console/session JSON)",
        "",
    ]
    if con_err:
        md += ["### Console errors", ""] + [f"- `{c}`" for c in con_err] + [""]
    if net_fail:
        md += ["### Failing network calls (4xx/5xx)", ""] + [f"- {n}" for n in net_fail] + [""]
    if steps:
        md += ["## Steps to reproduce", ""] + steps + [""]
    md += ["---", "_Generated by the Agentic QA pipeline (KaneAI + HyperExecute + AI RCA)._"]
    (out_dir / "EVIDENCE.md").write_text("\n".join(md) + "\n", encoding="utf-8")
    return bug


def main() -> None:
    run = read_json("reports/run_result.json", {})
    if not run:
        sys.exit("ERROR: reports/run_result.json not found — run trigger_run.py first")
    manifest = load_manifest()
    by_tm_id = {str(t.get("tm_test_case_id")): t for t in manifest["tests"]}
    project_id = load_config()["test_manager"]["project_id"]
    client = LTClient()

    failed = [i for i in run.get("instances", [])
              if str(i.get("status", "")).lower() in FAILED_STATES]
    print(f"[evidence] {len(failed)} failed instance(s) out of {len(run.get('instances', []))}")

    bugs = []
    for inst in failed:
        meta = by_tm_id.get(str(inst.get("test_case_id")), {})
        reg_id = meta.get("id", str(inst.get("test_case_id", "unknown")))
        out_dir = Path("reports/evidence") / reg_id
        try:
            bugs.append(build_evidence(client, inst, meta, run, out_dir, project_id))
            print(f"[evidence] built pack for {reg_id}")
        except Exception as exc:  # noqa: BLE001
            print(f"[evidence] WARNING: pack for {reg_id} incomplete: {exc}")
            bugs.append({"reg_id": reg_id, "title": meta.get("title", reg_id),
                         "priority": meta.get("priority", "P2"),
                         "status": inst.get("status"), "rca": {}, "error": str(exc),
                         "job_link": run.get("job_link", "")})

    write_json("reports/bugs.json", {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "run_title": run.get("title"),
        "job_link": run.get("job_link"),
        "total": len(run.get("instances", [])),
        "failed": len(failed),
        "bugs": bugs,
    })
    print(f"[evidence] wrote reports/bugs.json ({len(bugs)} bug(s))")


if __name__ == "__main__":
    main()
