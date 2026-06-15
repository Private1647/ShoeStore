"""
Shared TestMu AI / LambdaTest API client for the Agentic QA pipeline.

Auth: Basic base64(LT_USERNAME:LT_ACCESS_KEY) — set as GitHub Actions secrets.

Endpoints used (see qa/docs/ARCHITECTURE.md for the full API inventory):
  Test Manager   https://test-manager-api.lambdatest.com
  HyperExecute   https://api.hyperexecute.cloud
  Automation     https://api.lambdatest.com/automation/api/v1
  Insights RCA   https://api.lambdatest.com/insights/api/v3/public/rca
"""
from __future__ import annotations

import base64
import json
import os
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

import yaml

REPO_ROOT = Path(__file__).resolve().parents[2]
CONFIG_PATH = REPO_ROOT / "qa" / "config.yml"
MANIFEST_PATH = REPO_ROOT / "qa" / "manifest.json"

HYPEREXECUTE_API = "https://api.hyperexecute.cloud"
AUTOMATION_API = "https://api.lambdatest.com/automation/api/v1"
RCA_API = "https://api.lambdatest.com/insights/api/v3/public/rca"


def load_config() -> dict:
    with open(CONFIG_PATH, encoding="utf-8") as fh:
        cfg = yaml.safe_load(fh)
    # Environment overrides
    if os.environ.get("TARGET_URL"):
        cfg["app"]["target_url"] = os.environ["TARGET_URL"]
    for key, path in (("TM_PROJECT_ID", "project_id"), ("TM_FOLDER_ID", "folder_id")):
        if os.environ.get(key):
            cfg["test_manager"][path] = os.environ[key]
    return cfg


def load_manifest() -> dict:
    return json.loads(MANIFEST_PATH.read_text(encoding="utf-8"))


def save_manifest(manifest: dict) -> None:
    MANIFEST_PATH.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")


class LTClient:
    def __init__(self) -> None:
        self.username = os.environ.get("LT_USERNAME", "")
        self.access_key = os.environ.get("LT_ACCESS_KEY", "")
        if not self.username or not self.access_key:
            sys.exit("ERROR: LT_USERNAME / LT_ACCESS_KEY env vars are required")
        token = base64.b64encode(f"{self.username}:{self.access_key}".encode()).decode()
        self.auth = f"Basic {token}"
        self.tm_base = load_config()["test_manager"]["base_url"].rstrip("/")

    # ── HTTP core ────────────────────────────────────────────────────────────
    def request(self, method: str, url: str, body: dict | None = None,
                timeout: int = 60, ok_codes: tuple = (200, 201)) -> dict:
        data = json.dumps(body).encode() if body is not None else None
        req = urllib.request.Request(url, data=data, method=method, headers={
            "Authorization": self.auth,
            "Content-Type": "application/json",
            "Accept": "application/json",
        })
        try:
            with urllib.request.urlopen(req, timeout=timeout) as resp:
                payload = resp.read().decode()
                if resp.status not in ok_codes:
                    raise RuntimeError(f"{method} {url} -> HTTP {resp.status}: {payload[:300]}")
                return json.loads(payload) if payload.strip() else {}
        except urllib.error.HTTPError as exc:
            detail = exc.read().decode()[:500]
            raise RuntimeError(f"{method} {url} -> HTTP {exc.code}: {detail}") from exc

    def get(self, url: str, **kw) -> dict:
        return self.request("GET", url, **kw)

    def post(self, url: str, body: dict, **kw) -> dict:
        return self.request("POST", url, body=body, **kw)

    def try_get(self, url: str, **kw) -> dict:
        """GET that returns {'_error': ...} instead of raising — for optional evidence."""
        try:
            return self.get(url, **kw)
        except Exception as exc:  # noqa: BLE001
            return {"_error": str(exc)}

    # ── Test Manager ─────────────────────────────────────────────────────────
    def list_environments(self) -> list[dict]:
        """GET {tm}/api/v1/environments → existing environments.
        Response: {"data": {"environments": [{environment_id, name, ...}, ...]}}."""
        resp = self.try_get(f"{self.tm_base}/api/v1/environments")
        if "_error" in resp:
            return []
        data = resp.get("data") if isinstance(resp, dict) else None
        if isinstance(data, dict) and isinstance(data.get("environments"), list):
            return data["environments"]
        if isinstance(resp, dict) and isinstance(resp.get("environments"), list):
            return resp["environments"]
        return resp if isinstance(resp, list) else []

    def create_environment(self, spec: dict) -> int:
        """
        Create a Test Manager environment/configuration (the browser+OS the run
        executes on) and return its id.  API: POST {tm}/api/v1/environments
        Response: {"environment_id": [307041], ...} — an array; we take the first.
        """
        body = {"configurations": [{
            "name": spec.get("name", "QA Web"),
            "platform": spec.get("platform", "desktop"),
            "environments": [{
                "os": spec["os"], "os_name": spec["os_name"], "os_id": spec["os_id"],
                "os_version": spec["os_version"],
                "browser": spec["browser"], "browser_id": spec["browser_id"],
                "browser_version": spec["browser_version"],
                "browser_version_id": spec["browser_version_id"],
                "resolution": spec["resolution"], "resolution_id": spec["resolution_id"],
                "url": "", "platform_type": spec.get("platform_type", "web"),
            }],
        }]}
        resp = self.post(f"{self.tm_base}/api/v1/environments", body)
        ids = resp.get("environment_id") or resp.get("data", {}).get("environment_id")
        if isinstance(ids, list):
            ids = ids[0] if ids else None
        if not ids:
            raise RuntimeError(f"Create environment returned no id: {resp}")
        return ids

    def create_test_run(self, title: str, project_id: str,
                        test_run_instances: list[dict], objective: str = "",
                        tags: list | None = None, is_auteur_generated: bool = True) -> str:
        """
        Create a Test Run.  API: POST {tm}/api/v1/test-run
        Body: title + objective + project_id + tags + is_auteur_generated +
        test_run_instances[{test_case_id, environment_id, serial_no, priority,
        name}].  Response: {"id": "<test_run_id>", "type": "Success", ...}.
        """
        body = {
            "title": title,
            "objective": objective or title,
            "project_id": project_id,
            "tags": tags or [],
            "is_auteur_generated": is_auteur_generated,
            "test_run_instances": test_run_instances,
        }
        resp = self.post(f"{self.tm_base}/api/v1/test-run", body)
        run_id = resp.get("id") or resp.get("data", {}).get("id")
        if not run_id:
            raise RuntimeError(f"Create Test Run returned no id: {resp}")
        return run_id

    def set_test_run_instances(self, run_id: str, project_id: str, title: str,
                               test_run_instances: list[dict], objective: str = "",
                               tags: list | None = None,
                               is_auteur_generated: bool = True,
                               run_type: str = "Manual") -> dict:
        """
        Attach the test case instances to a freshly-created run.
        The create endpoint ignores inline test_run_instances (its example shows
        []), so instances are set via PUT {tm}/api/v1/test-run/{id}
        (Update Test Run By ID) with the full run body.
        """
        body = {
            "id": run_id,
            "title": title,
            "objective": objective or title,
            "tags": tags or [],
            "is_auteur_generated": is_auteur_generated,
            "type": run_type,
            "test_run_instances": test_run_instances,
            "project_id": project_id,
        }
        return self.request("PUT", f"{self.tm_base}/api/v1/test-run/{run_id}", body=body)

    def duplicate_test_run(self, template_run_id: str, name: str) -> str:
        """Fallback: POST {tm}/api/v1/test-run/{id}/duplicate."""
        resp = self.post(f"{self.tm_base}/api/v1/test-run/{template_run_id}/duplicate",
                         {"name": name})
        run_id = resp.get("id") or resp.get("data", {}).get("id")
        if not run_id:
            raise RuntimeError(f"Duplicate Test Run returned no id: {resp}")
        return run_id

    def get_test_run_instances(self, test_run_id: str, project_id: str) -> list[dict]:
        """GET test run instances → per-test-case execution results + session ids."""
        url = (f"{self.tm_base}/api/v1/test-run/{test_run_id}/instances"
               f"?project_id={urllib.parse.quote(project_id)}")
        resp = self.try_get(url)
        if "_error" in resp:
            return []
        data = resp.get("data") or resp.get("instances") or resp
        return data if isinstance(data, list) else data.get("instances", [])

    # ── Test Run → HyperExecute trigger ─────────────────────────────────────
    def trigger_hyperexecute(self, payload: dict) -> dict:
        """POST {tm}/api/atm/v1/hyperexecute → {job_id, job_link, ...}."""
        return self.post(f"{self.tm_base}/api/atm/v1/hyperexecute", payload)

    # ── HyperExecute job APIs ────────────────────────────────────────────────
    def get_job(self, job_id: str) -> dict:
        return self.get(f"{HYPEREXECUTE_API}/v2.0/job/{job_id}")

    def poll_job(self, job_id: str, interval_s: int = 30, timeout_min: int = 45) -> dict:
        terminal = {"completed", "failed", "error", "aborted", "cancelled", "lambda error", "timeout"}
        deadline = time.time() + timeout_min * 60
        last = {}
        while time.time() < deadline:
            resp = self.try_get(f"{HYPEREXECUTE_API}/v2.0/job/{job_id}")
            data = resp.get("data", resp)
            status = str(data.get("status", "")).lower()
            last = data
            print(f"[poll] job {job_id} status={status or 'unknown'}", flush=True)
            if status in terminal:
                return data
            time.sleep(interval_s)
        print(f"[poll] WARNING: timed out after {timeout_min} min; last status={last.get('status')}")
        return last

    def get_categorized_errors(self, task_id: str, order, iteration: int = 0) -> list[dict]:
        """HyperExecute per-stage RCA: GET /v1.0/categorizederrors."""
        qs = urllib.parse.urlencode({"taskId": task_id, "order": order, "iteration": iteration})
        resp = self.try_get(f"{HYPEREXECUTE_API}/v1.0/categorizederrors?{qs}")
        return resp.get("data", []) if "_error" not in resp else []

    # ── Insights AI RCA ──────────────────────────────────────────────────────
    def get_ai_rca(self, session_id: str) -> dict:
        return self.try_get(f"{RCA_API}?session_id={urllib.parse.quote(session_id)}", timeout=45)

    # ── Automation session evidence ──────────────────────────────────────────
    def get_session_network_log(self, session_id: str) -> dict:
        return self.try_get(f"{AUTOMATION_API}/sessions/{session_id}/log/network")

    def get_session_console_log(self, session_id: str) -> dict:
        return self.try_get(f"{AUTOMATION_API}/sessions/{session_id}/log/console")

    def get_session_video(self, session_id: str) -> dict:
        return self.try_get(f"{AUTOMATION_API}/sessions/{session_id}/video")

    def get_session(self, session_id: str) -> dict:
        return self.try_get(f"{AUTOMATION_API}/sessions/{session_id}")


def write_json(path: str | Path, data) -> None:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    p.write_text(json.dumps(data, indent=2, default=str) + "\n", encoding="utf-8")


def read_json(path: str | Path, default):
    p = Path(path)
    if not p.exists():
        return default
    try:
        return json.loads(p.read_text(encoding="utf-8"))
    except Exception:  # noqa: BLE001
        return default
