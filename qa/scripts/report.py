"""
Reporting + quality gate.

  --mode daily : writes $GITHUB_STEP_SUMMARY and opens/updates one GitHub
                 issue per failing test (label: qa-bug), each carrying the
                 evidence pack. Closes stale qa-bug issues whose test passed.
  --mode pr    : writes $GITHUB_STEP_SUMMARY and posts/updates a single sticky
                 PR comment with results + bug highlights. Exits 1 when a test
                 with a blocking priority (gates.block_on_priorities) failed —
                 this is what turns the PR check red.

The end-user outcome in one line at the top: "Are there bugs or not?"
"""
from __future__ import annotations

import argparse
import json
import os
import sys
import urllib.request
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from lt_client import load_config, read_json  # noqa: E402

MARKER = "<!-- agentic-qa-report -->"
PASSED_STATES = {"passed", "completed", "pass"}


# ── GitHub REST helpers (urllib, GITHUB_TOKEN) ────────────────────────────────
def gh_request(method: str, path: str, body: dict | None = None):
    token = os.environ.get("GITHUB_TOKEN", "")
    repo = os.environ.get("GITHUB_REPOSITORY", "")
    if not token or not repo:
        print("[report] GITHUB_TOKEN/GITHUB_REPOSITORY missing — skipping GitHub API call")
        return None
    url = f"https://api.github.com/repos/{repo}{path}"
    data = json.dumps(body).encode() if body is not None else None
    req = urllib.request.Request(url, data=data, method=method, headers={
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    })
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            payload = resp.read().decode()
            return json.loads(payload) if payload.strip() else {}
    except Exception as exc:  # noqa: BLE001
        print(f"[report] WARNING: GitHub API {method} {path} failed: {exc}")
        return None


def build_summary(run: dict, bugs_doc: dict, cfg: dict, impact: dict | None,
                  heal: dict | None = None) -> str:
    instances = run.get("instances", [])
    total = len(instances)
    healed_ids = {h["reg_id"] for h in (heal or {}).get("healed", [])}
    all_failed = bugs_doc.get("bugs", [])
    failed_bugs = [b for b in all_failed if b.get("reg_id") not in healed_ids]
    failed = len(failed_bugs)
    passed = sum(1 for i in instances if str(i.get("status", "")).lower() in PASSED_STATES)
    pass_rate = round(100 * passed / total, 1) if total else 0.0

    gates = cfg.get("gates", {})
    blocking = [b for b in failed_bugs
                if b.get("priority") in gates.get("block_on_priorities", ["P0", "P1"])]
    healed_note = f" {len(healed_ids)} failure(s) auto-healed (test drift)." if healed_ids else ""
    if failed == 0 and total > 0:
        verdict = f"✅ **NO BUGS FOUND** — all regression tests passed.{healed_note}"
    elif blocking:
        verdict = (f"❌ **BUGS FOUND — action required.** {failed} failing test(s), "
                   f"{len(blocking)} blocking ({', '.join(sorted({b['priority'] for b in blocking}))})."
                   f"{healed_note}")
    elif failed:
        verdict = (f"⚠️ **BUGS FOUND (non-blocking).** {failed} failing test(s), "
                   f"none at blocking priority.{healed_note}")
    else:
        verdict = "⚠️ No test results returned — check the HyperExecute job."

    lines = [
        MARKER,
        f"## 🧪 Agentic QA — {run.get('title', 'regression run')}",
        "",
        verdict,
        "",
        f"| Total | Passed | Failed | Pass rate | Job |",
        f"|---|---|---|---|---|",
        f"| {total} | {passed} | {failed} | {pass_rate}% | "
        f"[HyperExecute]({run.get('job_link', '')}) |",
        "",
    ]

    if impact:
        feats = ", ".join(impact.get("impacted_features", [])) or "—"
        lines += [
            f"**Scope:** `{impact.get('scope')}` · **Impacted features:** {feats} · "
            f"**Changed files:** {len(impact.get('changed_files', []))}",
            "",
        ]

    if healed_ids:
        lines += ["### 🩹 Auto-healed (test drift, not app bugs)", "",
                  "| Test | What happened |", "|---|---|"]
        for h in (heal or {}).get("healed", []):
            link = f" ([session]({h['share_url']}))" if h.get("share_url") else ""
            lines.append(f"| **{h['reg_id']}** {h['title'][:60]} | App changed legitimately; "
                         f"test re-authored and updated on this branch{link} |")
        lines += [""]

    if failed_bugs:
        lines += ["### 🐞 Bugs (with evidence packs)", "",
                  "| Test | Priority | Root cause (AI RCA) | Evidence |",
                  "|---|---|---|---|"]
        for b in failed_bugs:
            rca = (b.get("rca") or {}).get("root_cause", "")[:140].replace("|", "/")
            replay = b.get("replay_link", "")
            evidence = f"[replay]({replay})" if replay else "see artifacts"
            lines.append(f"| **{b['reg_id']}** {b['title'][:60]} | {b.get('priority', '')} "
                         f"| {rca or 'n/a'} | {evidence} |")
        lines += ["", "_Full evidence packs (video, console, network, RCA, repro steps) are "
                      "attached as the `qa-evidence` workflow artifact._", ""]
    return "\n".join(lines)


def write_step_summary(text: str) -> None:
    path = os.environ.get("GITHUB_STEP_SUMMARY")
    if path:
        with open(path, "a", encoding="utf-8") as fh:
            fh.write(text + "\n")


def upsert_pr_comment(body: str) -> None:
    pr = os.environ.get("PR_NUMBER", "")
    if not pr:
        print("[report] PR_NUMBER not set — skipping PR comment")
        return
    comments = gh_request("GET", f"/issues/{pr}/comments?per_page=100") or []
    existing = next((c for c in comments if MARKER in c.get("body", "")), None)
    if existing:
        gh_request("PATCH", f"/issues/comments/{existing['id']}", {"body": body})
        print(f"[report] updated PR comment {existing['id']}")
    else:
        gh_request("POST", f"/issues/{pr}/comments", {"body": body})
        print("[report] posted PR comment")


def sync_bug_issues(bugs_doc: dict, run: dict) -> None:
    """One issue per failing regression test; close issues for recovered tests."""
    open_issues = gh_request("GET", "/issues?labels=qa-bug&state=open&per_page=100") or []
    by_marker = {}
    for issue in open_issues:
        for line in issue.get("body", "").splitlines():
            if line.startswith("<!-- qa-bug:"):
                by_marker[line.strip()] = issue

    failing_markers = set()
    for b in bugs_doc.get("bugs", []):
        marker = f"<!-- qa-bug:{b['reg_id']} -->"
        failing_markers.add(marker)
        evidence_md = Path(b.get("evidence_dir", ""), "EVIDENCE.md")
        body_core = evidence_md.read_text(encoding="utf-8") if evidence_md.exists() else \
            f"Test `{b['reg_id']}` failed. Job: {b.get('job_link', '')}"
        body = f"{marker}\n{body_core}"
        if marker in by_marker:
            issue = by_marker[marker]
            gh_request("POST", f"/issues/{issue['number']}/comments",
                       {"body": f"Still failing in [{run.get('title', 'latest run')}]"
                                f"({run.get('job_link', '')}). Updated evidence in workflow artifacts."})
            print(f"[report] issue #{issue['number']} still failing ({b['reg_id']})")
        else:
            created = gh_request("POST", "/issues", {
                "title": f"[QA Bug] {b['reg_id']} — {b['title']}",
                "body": body,
                "labels": ["qa-bug", f"priority:{b.get('priority', 'P2')}"],
            })
            if created:
                print(f"[report] opened issue #{created.get('number')} for {b['reg_id']}")

    for marker, issue in by_marker.items():
        if marker not in failing_markers:
            gh_request("POST", f"/issues/{issue['number']}/comments",
                       {"body": f"✅ Recovered in [{run.get('title', 'latest run')}]"
                                f"({run.get('job_link', '')}). Closing."})
            gh_request("PATCH", f"/issues/{issue['number']}", {"state": "closed"})
            print(f"[report] closed recovered issue #{issue['number']}")


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--mode", choices=["daily", "pr"], required=True)
    args = ap.parse_args()

    cfg = load_config()
    run = read_json("reports/run_result.json", {})
    bugs_doc = read_json("reports/bugs.json", {"bugs": []})
    impact = read_json("reports/impact.json", None) if args.mode == "pr" else None
    heal = read_json("reports/heal.json", None)
    healed_ids = {h["reg_id"] for h in (heal or {}).get("healed", [])}

    summary = build_summary(run, bugs_doc, cfg, impact, heal)
    write_step_summary(summary)
    Path("reports/summary.md").write_text(summary + "\n", encoding="utf-8")

    if args.mode == "pr":
        upsert_pr_comment(summary)
        blocking = [b for b in bugs_doc.get("bugs", [])
                    if b.get("priority") in cfg["gates"]["block_on_priorities"]
                    and b.get("reg_id") not in healed_ids]
        if blocking:
            print(f"[report] GATE FAILED — blocking bugs: {[b['reg_id'] for b in blocking]}")
            sys.exit(1)
        print("[report] gate passed")
    else:
        if healed_ids:
            bugs_doc = {**bugs_doc,
                        "bugs": [b for b in bugs_doc["bugs"]
                                 if b.get("reg_id") not in healed_ids]}
        sync_bug_issues(bugs_doc, run)
        print("[report] daily report complete")


if __name__ == "__main__":
    main()
