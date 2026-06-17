<!-- Read this when wiring or debugging any LambdaTest/TestMu API call in the pipeline. -->

# LambdaTest TestMu API contracts (the working ones)

Authoritative request/response shapes reverse-engineered to get the pipeline running.
Auth is **Basic** `base64(LT_USERNAME:LT_ACCESS_KEY)` unless noted. Base host:
`https://test-manager-api.lambdatest.com` (EU: `eu-test-manager-api...`).

## Contents
1. kane-cli (authoring / replay)
2. Environments (configurations)
3. Test Runs (create + attach instances)
4. HyperExecute trigger + the clone
5. Polling the Test Run
6. AI RCA (Insights)
7. Session evidence + Preview link

---

## 1. kane-cli (authoring / replay)

- Install `@testmuai/kane-cli` (≥0.4.4). `kane-cli login --username --access-key`,
  `kane-cli config project <id>`, `kane-cli config folder <id>`.
- **Author/replay a test:** `kane-cli testmd run <file> --agent --headless --url <START_URL>`
  - `--headless` is REQUIRED on CI — kane-cli launches **real Google Chrome** via CDP; a
    displayless runner without it exits **2** (setup error) in ~1s, before any NDJSON.
    ubuntu-latest has Chrome preinstalled.
  - `--url` is REQUIRED on ≥0.4.4 — the legacy `Open {{BASE_URL}}` objective body no longer
    resolves into a start URL ("No start URL provided"). `--url` overrides frontmatter and is
    how you retarget (e.g. self-heal at `http://localhost:5000`). Do NOT also pass
    `--variables BASE_URL` — a flag can't override a file-defined variable and the conflict
    leaves no URL.
  - **Force fresh authoring** (e.g. self-heal): delete `output-<stem>/` first, THEN run with
    `--author`. `--author` alone still REPLAYS a committed recording (using the recorded URL,
    ignoring `--url`); only an absent recording forces a real author.
- **TM test-case id** is the authoritative `testcase_id` in
  `output-<stem>/.internal/meta.json` — the NDJSON omits it on a clean replay-pass
  (`commit.committed:false`). `<stem>` = filename minus `_test.md`.
- Exit codes: `0` pass · `1` test failed · `2` auth/setup/infra/parse · `3` timeout.

## 2. Environments (configurations)

The browser/OS a Test Run executes on. Create once, reuse.

- **Create:** `POST /api/v1/environments`
  ```json
  {"configurations":[{"name":"<name>","platform":"desktop","environments":[
    {"os":"macOS Monterey","os_name":"macOS","os_id":"macOS","os_version":"macOS Monterey",
     "browser":"Chrome","browser_id":"Chrome","browser_version":"149.0","browser_version_id":"149.0",
     "resolution":"1600x1200","resolution_id":"1600x1200","url":"","platform_type":"web"}]}]}
  ```
  → `{"environment_id":[307049], "type":"Success"}` (an **array** — take `[0]`).
  Names are **unique** → re-creating one 422s "Configuration with this name already exists".
- **List:** `GET /api/v1/environments` → `{"data":{"environments":[{environment_id, name, os,
  browser, ...}]}}`. Reuse by matching `name`. Simplest: pin `test_manager.environment_id`.

## 3. Test Runs (create + attach instances)

Two steps — **create ignores inline instances**.

- **Create:** `POST /api/v1/test-run`
  ```json
  {"title":"<title>","objective":"<text>","project_id":"<pid>","tags":[],
   "is_auteur_generated":true,"test_run_instances":[]}
  ```
  → `{"id":"<test_run_id>","type":"Success"}`. **`title` is required** (sending `name` →
  422 "title is a required field").
- **Attach instances:** `PUT /api/v1/test-run/{id}` with the full body incl. instances:
  ```json
  {"id":"<run_id>","title":"<title>","objective":"<text>","tags":[],
   "is_auteur_generated":true,"type":"Manual","project_id":"<pid>",
   "test_run_instances":[{"test_case_id":"<tcid>","environment_id":307049,
     "serial_no":1,"priority":"High","name":"<test title>"}]}
  ```
  Skipping this → HyperExecute 422 "Instances does not exists for this test run".
  Priority maps P0/P1→High, P2→Medium, P3→Low.
- **Reuse a template run:** pin `test_manager.template_test_run_id`. Each run updates its
  instances (via the PUT) then triggers — avoids creating a fresh orphan every execution.

## 4. HyperExecute trigger + the clone

- **Trigger:** `POST /api/atm/v1/hyperexecute`
  ```json
  {"test_run_id":"<run_id>","concurrency":4,"title":"<build>","console_log":"error",
   "network_logs":true,"network_full_har":true,"region":"eastus","retry_on_failure":true,
   "max_retries":1,"report_enabled":true,"environment_id":307049,
   "tunnel":"<tunnel-name>",
   "replaced_url":[{"pattern_url":"<deployed>","replacement_url":"http://localhost:5000"}]}
  ```
  → `{"job_id","app_job_id","test_run_id":"<CLONE id>","job_link","mobile_job_link"}`
- **CRITICAL:** HyperExecute **clones** the run it's given and executes the **clone**. The
  clone's id is the response's top-level **`test_run_id`** (≠ the run you passed). **Poll the
  clone.** The run you created stays at "not started" forever if you poll it.
- `tunnel` (PR runs), `replaced_url` (rewrite deployed→localhost) are optional; daily runs
  omit both.

## 5. Polling the Test Run

- **Poll:** `GET /api/v1/test-run/instances/{test_run_id}` (the CLONE id). Note path order:
  `/test-run/instances/{id}`.
  ```json
  {"test_run_details":{"status":"Passed","run_result":{"total_test":3,"passed":3,"failed":0,
    "not_started":0},"complete_percent":100,"job_id":"..."},
   "test_run_instances":{"data":[{"id":238207541,"test_case_id":"...","title":"...",
     "status":"Passed","internal_id":"TC-44642","test_id":"TV4TO-...","linked_test_url":"...",
     "environment":{...}}], "pagination":{...}}}
  ```
- Terminal when `status` is terminal, or `run_result.not_started==0`, or
  `complete_percent>=100`. The **HyperExecute job-status API** (`api.hyperexecute.cloud/v2.0/
  job/{id}`) returns `status=unknown` — do NOT poll it.
- Per-instance fields you need downstream: `id` (instance id), `test_id` (automation session
  id, for RCA + logs), `internal_id` (TC-…), `status`, `environment`.

## 6. AI RCA (Insights)

- **Get (if generated):** `GET https://api.lambdatest.com/insights/api/v3/public/rca?test_ids=<csv>`
  → `{"status":"success","data":[{"test_id","job_id","rca_category","rca_detail":{
  "root_cause_category","parent_failure_category","failure_summary","steps_to_fix":[{"issue",
  "module","suggested_fix"}],"stack_trace","analysis","error_timeline"}}]}`.
  Keyed by the automation **`test_id`** (NOT `session_id`/`internal_id` — that was the bug).
- **Generate (if missing):** `POST .../public/rca/generate` with
  `{"job_ids":[...],"test_ids":[...]}` → triggers async generation (costs credits); then
  re-poll the GET. Or enable **Automatic AI RCA** org-wide so the GET is populated.
- Report mapping: `failure_summary`→root cause, `steps_to_fix[].suggested_fix`→fix,
  `rca_category`→category.

## 7. Session evidence + Preview link

- Session logs (network/console/video) use the automation API
  `https://api.lambdatest.com/automation/api/v1/sessions/{test_id}/log/...` — pass the
  instance **`test_id`**.
- **Preview link** (Test Manager test-instance, the report's "Preview" column):
  `https://test-manager.lambdatest.com/projects/{project_id}/test-run/{test_run_id}/test-instance/{instance_id}?testID={test_id}`
  (note `test-instance` singular; `instance_id` is the numeric `id`; optional `&isMobile=<bool>`).
- The run-level link: `https://test-manager.lambdatest.com/projects/{project_id}/test-run/{test_run_id}`.
