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


def run_test(file: str, base_url: str, timeout_s: int = 1800) -> dict:
    """Run one testmd file via kane-cli in agent mode; return parsed signals."""
    cmd = [
        "kane-cli", "testmd", "run", file, "--agent",
        "--variables", json.dumps({"BASE_URL": {"value": base_url}}),
    ]
    print(f"[sync] $ {' '.join(cmd[:5])} ...", flush=True)
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
        for key in ("share_url", "shareUrl"):
            if evt.get(key):
                signals["share_url"] = evt[key]
        for key in ("test_case_id", "testCaseId", "tms_test_case_id", "tc_id"):
            if evt.get(key):
                signals["test_case_id"] = str(evt[key])
    # Fallback: scrape a TC id out of the share URL if present
    if signals["share_url"] and not signals["test_case_id"]:
        m = re.search(r"(?:test-case|testcase|tc)[/=]([A-Za-z0-9-]+)", signals["share_url"])
        if m:
            signals["test_case_id"] = m.group(1)
    if proc.returncode != 0:
        tail = "\n".join(proc.stdout.splitlines()[-15:])
        print(f"[sync] WARNING: {file} exited {proc.returncode}\n{tail}")
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
