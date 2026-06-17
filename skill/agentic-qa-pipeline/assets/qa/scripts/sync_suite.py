"""
Suite sync — author/refresh the regression suite with kane-cli and upload to
Test Manager, then record the resulting test case IDs in qa/manifest.json.

For each test in the manifest (or those passed via --only REG-001,REG-002):
  1. kane-cli testmd run <file> --agent  (headless; authors on first run,
     replays from recording afterwards; uploads to the configured TM
     project/folder)
  2. Parse the NDJSON --agent output for the share URL / test case ID
  3. Update qa/manifest.json

Requires: kane-cli installed + logged in (LT_USERNAME/LT_ACCESS_KEY), and
`kane-cli config project/folder` already set (the workflow does this).
"""
from __future__ import annotations

import argparse
import json
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from lt_client import load_config, load_manifest, save_manifest  # noqa: E402


def meta_testcase_id(test_file: str) -> str:
    """Read the TM test case id from kane-cli's local meta.json for this test.

    output-<stem>/.internal/meta.json is the authoritative record of the test
    case identity and is written on every run. The NDJSON stream only includes
    commit.testcase_id on some runs (e.g. the first author / a failed run), and
    omits it on a clean replay-pass (commit.committed:false), so meta.json is the
    reliable source for filling the manifest.
    """
    name = Path(test_file).name
    stem = name[: -len("_test.md")] if name.endswith("_test.md") else Path(test_file).stem
    meta = Path(test_file).parent / f"output-{stem}" / ".internal" / "meta.json"
    if not meta.exists():
        return ""
    try:
        return str(json.loads(meta.read_text(encoding="utf-8")).get("testcase_id") or "")
    except Exception:  # noqa: BLE001
        return ""


def run_test(file: str, base_url: str, timeout_s: int = 1800) -> dict:
    """Run one testmd file via kane-cli in agent mode; return parsed signals.

    --headless is REQUIRED: kane-cli drives a real Google Chrome via CDP, and a
    CI runner has no display — without it Chrome cannot launch and kane-cli
    exits 2 (setup error) before any NDJSON is emitted.
    """
    # The start URL MUST be supplied via --url on kane-cli >=0.4.4: the legacy
    # "Open {{BASE_URL}}" objective body is no longer resolved into a navigation
    # target, so without --url the run fails immediately with "No start URL
    # provided". --url overrides frontmatter url:/config default_url. Do NOT also
    # pass --variables BASE_URL — a flag cannot override a file-defined variable
    # and the conflict leaves the run with no usable URL.
    cmd = ["kane-cli", "testmd", "run", file, "--agent", "--headless", "--url", base_url]
    print(f"[sync] $ {' '.join(cmd)}", flush=True)
    proc = subprocess.run(cmd, capture_output=True, text=True, timeout=timeout_s, check=False)

    signals = {"exit_code": proc.returncode, "share_url": "", "test_case_id": "",
               "status": "passed" if proc.returncode == 0 else "failed"}
    for line in proc.stdout.splitlines():
        line = line.strip()
        if not line.startswith("{"):
            continue
        try:
            evt = json.loads(line)
        except json.JSONDecodeError:
            continue
        # share_url is a top-level field on the test_md_summary / test_md_done events
        if evt.get("share_url") or evt.get("shareUrl"):
            signals["share_url"] = evt.get("share_url") or evt.get("shareUrl")
        # The Test Manager test case id lives at commit.testcase_id on test_md_summary
        # (present even when the run failed — the test case is still created/uploaded).
        commit = evt.get("commit") or {}
        tc = (commit.get("testcase_id") or evt.get("testcase_id")
              or evt.get("test_case_id") or evt.get("testCaseId"))
        if tc:
            signals["test_case_id"] = str(tc)
        if evt.get("overall_status"):
            signals["status"] = "passed" if evt["overall_status"] == "passed" else "failed"
    # Fallback: scrape the TC id out of the share URL (…/test-cases/<id>/…)
    if signals["share_url"] and not signals["test_case_id"]:
        m = re.search(r"/test-cases?/([A-Za-z0-9_-]+)", signals["share_url"])
        if m:
            signals["test_case_id"] = m.group(1)
    # Authoritative override: kane-cli's local meta.json always records the id.
    meta_id = meta_testcase_id(file)
    if meta_id:
        signals["test_case_id"] = meta_id
    if proc.returncode != 0 or not signals["test_case_id"]:
        out_tail = "\n".join(proc.stdout.splitlines()[-8:])
        err_tail = "\n".join((proc.stderr or "").splitlines()[-15:])
        print(f"[sync] WARNING: {file} exit={proc.returncode} "
              f"tc_id={signals['test_case_id'] or '(none parsed)'}\n"
              f"--- stdout tail ---\n{out_tail}\n--- stderr tail ---\n{err_tail}")
    return signals


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--only", default="", help="Comma-separated REG ids to sync")
    args = ap.parse_args()

    cfg = load_config()
    manifest = load_manifest()
    base_url = cfg["app"]["target_url"]
    only = {x.strip() for x in args.only.split(",") if x.strip()}

    results = []
    for test in manifest["tests"]:
        if only and test["id"] not in only:
            continue
        signals = run_test(test["file"], base_url)
        if signals["test_case_id"]:
            test["tm_test_case_id"] = signals["test_case_id"]
        test["last_sync"] = {
            "at": datetime.now(timezone.utc).isoformat(),
            "status": signals["status"],
            "share_url": signals["share_url"],
        }
        results.append((test["id"], signals["status"], signals["test_case_id"] or "(no id parsed)"))

    manifest["updated_at"] = datetime.now(timezone.utc).isoformat()
    save_manifest(manifest)

    print("\n[sync] Summary")
    for reg_id, status, tc in results:
        print(f"  {reg_id}: {status} — TM test case: {tc}")
    missing = [t["id"] for t in manifest["tests"] if not t.get("tm_test_case_id")]
    if missing:
        print(f"\n[sync] NOTE: still missing tm_test_case_id for {missing}.\n"
              "       If kane-cli output didn't include the ID, copy it from Test "
              "Manager (the test case URL) into qa/manifest.json once — runs are "
              "selected by these IDs.")


if __name__ == "__main__":
    main()
