"""
Self-heal — distinguishes TEST DRIFT from REAL BUGS and updates outdated tests.

For every regression test that failed in the current run (reports/bugs.json),
re-author it with kane-cli (`--author force-author`) on this runner against
--base-url (the PR's own code at http://localhost:<port> in the PR workflow):

  • Re-authored run PASSES  → the app changed legitimately and the old
    recording/expectations were stale. The refreshed test (recording +
    updated upload in Test Manager) is committed back to the PR branch by the
    workflow. Reported as 🩹 healed — NOT a bug, does NOT block the PR.
  • Re-authored run FAILS   → even a fresh AI authoring attempt cannot
    complete the intent → real bug. Evidence pack stands, gate applies.

Limit: healing re-interprets the SAME prose against the new UI. If the
*intent* changed (e.g. checkout added an OTP step), the prose itself must be
edited — those stay failed and the report flags the failing step so the test
author (or the GitHub App's newly generated tests) can take over.

Outputs: reports/heal.json {healed: [...], still_failing: [...]}
Exit: always 0 (advisory; report.py applies the gate).
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from lt_client import load_manifest, read_json, write_json  # noqa: E402


def reauthor(test_file: str, base_url: str, timeout_s: int = 1800) -> dict:
    # --author is a boolean flag (force a fresh test+testcase in TMS, replace
    # local output). --headless is required so Chrome can launch on the runner.
    cmd = [
        "kane-cli", "testmd", "run", test_file, "--agent", "--headless",
        "--author",
        "--variables", json.dumps({"BASE_URL": {"value": base_url}}),
    ]
    print(f"[heal] re-authoring: {test_file} against {base_url}", flush=True)
    try:
        proc = subprocess.run(cmd, capture_output=True, text=True,
                              timeout=timeout_s, check=False)
    except subprocess.TimeoutExpired:
        return {"exit_code": -1, "share_url": "", "error": "timeout"}
    share_url = ""
    for line in proc.stdout.splitlines():
        line = line.strip()
        if line.startswith("{"):
            try:
                evt = json.loads(line)
                share_url = evt.get("share_url") or evt.get("shareUrl") or share_url
            except json.JSONDecodeError:
                continue
    if proc.returncode != 0:
        out_tail = "\n".join(proc.stdout.splitlines()[-8:])
        err_tail = "\n".join((proc.stderr or "").splitlines()[-12:])
        print(f"[heal] still failing (exit {proc.returncode}):\n"
              f"--- stdout ---\n{out_tail}\n--- stderr ---\n{err_tail}")
    return {"exit_code": proc.returncode, "share_url": share_url}


def main() -> None:
    ap = argparse.ArgumentParser()
    ap.add_argument("--base-url", required=True,
                    help="URL the re-authoring run targets (PR: http://localhost:5000)")
    ap.add_argument("--max-heals", type=int, default=5,
                    help="Cap re-authoring attempts per run (cost control)")
    args = ap.parse_args()

    bugs_doc = read_json("reports/bugs.json", {"bugs": []})
    manifest = load_manifest()
    by_reg = {t["id"]: t for t in manifest["tests"]}

    candidates = [b for b in bugs_doc.get("bugs", []) if b.get("reg_id") in by_reg]
    if not candidates:
        write_json("reports/heal.json", {"healed": [], "still_failing": [],
                                         "note": "no failed regression tests to heal"})
        print("[heal] nothing to heal")
        return

    healed, still_failing = [], []
    for bug in candidates[: args.max_heals]:
        test = by_reg[bug["reg_id"]]
        outcome = reauthor(test["file"], args.base_url)
        entry = {
            "reg_id": bug["reg_id"],
            "title": test["title"],
            "file": test["file"],
            "priority": test.get("priority"),
            "share_url": outcome.get("share_url", ""),
        }
        if outcome["exit_code"] == 0:
            healed.append(entry)
            print(f"[heal] 🩹 {bug['reg_id']} healed — test drift, recording refreshed")
        else:
            entry["error"] = outcome.get("error", f"exit {outcome['exit_code']}")
            still_failing.append(entry)
            print(f"[heal] ❌ {bug['reg_id']} still failing — real bug")
    skipped = [b["reg_id"] for b in candidates[args.max_heals:]]

    write_json("reports/heal.json", {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "base_url": args.base_url,
        "author_mode": "force-author",
        "healed": healed,
        "still_failing": still_failing,
        "skipped_over_cap": skipped,
    })
    print(f"[heal] done — healed={len(healed)}, real bugs={len(still_failing)}, "
          f"skipped={len(skipped)}")


if __name__ == "__main__":
    main()
