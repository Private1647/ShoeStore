"""
Change-impact analysis: git diff → product features → impacted regression tests.

Inputs : qa/config.yml (impact_map), qa/manifest.json (test ↔ feature mapping)
Outputs: reports/impact.json, plus `scope` / `test_ids` / `test_count` written
         to $GITHUB_OUTPUT for the workflow to branch on.

scope = "full"     → a changed file matched a rule with features: [ALL]
        "impacted" → at least one test's features intersect the changed features
        "none"     → no regression-relevant change (workflow skips execution)

Always exits 0 — impact analysis is advisory; the quality gate lives in report.py.
"""
from __future__ import annotations

import json
import os
import re
import subprocess
import sys
from datetime import datetime, timezone
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from lt_client import load_config, load_manifest, write_json  # noqa: E402


def changed_files() -> list[str]:
    strategies = []
    base_ref = os.environ.get("GITHUB_BASE_REF", "")
    if base_ref:
        strategies.append(["git", "diff", "--name-only", f"origin/{base_ref}...HEAD"])
    strategies += [
        ["git", "diff", "--name-only", "HEAD~1"],
        ["git", "diff", "--name-only", "HEAD"],
    ]
    for cmd in strategies:
        try:
            r = subprocess.run(cmd, capture_output=True, text=True, timeout=30, check=False)
            if r.returncode == 0 and r.stdout.strip():
                return [ln.strip() for ln in r.stdout.splitlines() if ln.strip()]
        except Exception:  # noqa: BLE001
            continue
    return []


def main() -> None:
    cfg = load_config()
    manifest = load_manifest()
    files = changed_files()

    features: set[str] = set()
    file_details = []
    for f in files:
        matched = []
        for rule in cfg.get("impact_map", []):
            if re.search(rule["pattern"], f, re.IGNORECASE):
                matched.extend(rule["features"])
        file_details.append({"file": f, "features": sorted(set(matched)) or ["(unmapped)"]})
        features.update(matched)

    full_run = "ALL" in features
    if full_run:
        selected = manifest["tests"]
    else:
        selected = [t for t in manifest["tests"] if features & set(t["features"])]

    scope = "full" if full_run else ("impacted" if selected else "none")
    result = {
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "changed_files": file_details,
        "impacted_features": sorted(features - {"ALL"}),
        "scope": scope,
        "selected_tests": [
            {k: t[k] for k in ("id", "file", "title", "features", "priority", "tm_test_case_id")}
            for t in selected
        ],
        "unsynced_tests": [t["id"] for t in selected if not t.get("tm_test_case_id")],
    }
    write_json("reports/impact.json", result)

    test_ids = ",".join(str(t["tm_test_case_id"]) for t in selected if t.get("tm_test_case_id"))
    gh_out = os.environ.get("GITHUB_OUTPUT")
    if gh_out:
        with open(gh_out, "a", encoding="utf-8") as fh:
            fh.write(f"scope={scope}\n")
            fh.write(f"test_ids={test_ids}\n")
            fh.write(f"test_count={len(selected)}\n")

    print(json.dumps({"scope": scope, "changed": len(files),
                      "features": result["impacted_features"],
                      "tests": [t["id"] for t in selected]}, indent=2))
    if result["unsynced_tests"]:
        print(f"WARNING: tests not yet synced to Test Manager (no tm_test_case_id): "
              f"{result['unsynced_tests']} — run the qa-suite-sync workflow first.")


if __name__ == "__main__":
    main()
