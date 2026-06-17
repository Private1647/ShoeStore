<!-- Read this when a pipeline stage fails. Symptom → root cause → fix for every issue hit while getting the pipeline working. -->

# Troubleshooting runbook

Each entry: **symptom → root cause → fix**. Ordered by stage. These are the actual failures
encountered bringing the pipeline up; the bundled scripts already contain the fixes, so this
is mainly for diagnosing a fresh setup or a regression.

## Setup / GitHub

- **`gh workflow run` says "could not find any workflows".** The `workflow_dispatch`
  workflows aren't on the default branch. → GitHub only registers `workflow_dispatch` from
  the **default branch**. Merge the workflows to `main` first.
- **`TARGET_URL` env is empty in the job / wrong URL used.** `QA_TARGET_URL` was created as an
  **environment-scoped** variable, which these jobs can't read. → Use a **repository** variable,
  or rely on `config.yml`'s `target_url` (scripts fall back to it when `TARGET_URL` is empty).

## Suite Sync (kane-cli authoring)

- **Run "succeeds" in ~50s but authors nothing; each test logs `exit=2` in ~1s.** kane-cli
  ran headed; Chrome can't launch on a displayless runner (exit 2 = setup error, before any
  NDJSON). → Add `--headless`. (Surface kane-cli stderr — the scripts do — or this is invisible.)
- **`run_end ... "No start URL provided. Pass --url..."` (~3s, 0 credits).** kane-cli ≥0.4.4
  dropped the legacy `Open {{BASE_URL}}` start-URL resolution. → Pass `--url <START_URL>`. Do
  NOT also pass `--variables BASE_URL` (a flag can't override a file-defined var; the conflict
  leaves no URL).
- **Test passed but `tc_id=(none parsed)`; manifest not filled.** On a clean replay-pass the
  NDJSON omits `commit.testcase_id`. → Read `testcase_id` from `output-<stem>/.internal/meta.json`.
- **Local `*_test.md` replay fails after committing a stale recording.** A bad committed
  `output-<stem>/` recording replays and fails. → Delete it and re-author, or `--author`.

## Daily / HyperExecute (run creation + execution)

- **`POST /api/v1/test-run -> 422 "title is a required field"`.** Payload sent `name`. → Send
  `title`.
- **`POST /api/atm/v1/hyperexecute -> 422 "Instances does not exists for this test run"`.**
  The create endpoint ignores inline `test_run_instances`. → Attach them with
  `PUT /api/v1/test-run/{id}` (full body incl. instances) BEFORE triggering HyperExecute.
- **`POST /api/v1/environments -> 422 "Configuration with this name already exists"`.** Tried
  to create an environment whose unique name already exists. → Reuse it (GET + match by name)
  or pin `test_manager.environment_id`.
- **`list_environments` returns 0 even though the env exists.** GET parsing/shape mismatch. →
  Response is `{"data":{"environments":[...]}}`; simplest is to **pin** `environment_id`.
- **`[poll] ... status=unknown` forever until timeout.** Polling the HyperExecute job API
  (`api.hyperexecute.cloud/v2.0/job/{id}`), which returns `unknown`. → Poll the **Test Run**:
  `GET /api/v1/test-run/instances/{id}`.
- **Test run stuck at `not started`; TWO test runs appear per execution (one `0/N` orphan, one
  `N/N` executed).** HyperExecute **clones** the run it's given and executes the clone; you
  were polling the original orphan. → Poll the clone id from the trigger response's top-level
  `test_run_id`. Reuse a pinned `template_test_run_id` so you don't orphan a fresh run each run.

## PR-Impact (tunnel + replaced_url)

- **"Start LambdaTest Tunnel" step fails, but `tunnel.log` shows the tunnel up
  ("You can start testing now", "Tunnel ID: …").** The readiness check grepped for the old
  string "Secure connection established". → Match "You can start testing now" (tunnel v3.x).
- **`POST .../hyperexecute -> 500 "Failed to check if tunnel is active"` (tunnel is up).**
  Tunnel started in the default env; HyperExecute looks in `ht-prod`. → Start the tunnel with
  **`--env ht-prod`**. (A trigger retry on tunnel/5xx also helps with propagation lag.)
- **App boot step fails.** The app needs a DB/env the runner lacks, or wrong port. → Confirm
  `config.yml app.local` (start_command/port/ready_path) and that the app boots without
  external deps (the demo used in-memory storage).

## Self-heal

- **Heal runs but re-authors against the DEPLOYED url, not localhost (`replay_decisions>0`,
  `author_decisions:0`).** kane-cli replays the committed recording (recorded URL), ignoring
  `--url`, even with `--author`. → Delete `output-<stem>/` before re-authoring so it must
  author fresh against `--url localhost`.
- **No clean "drift → heal" ever happens.** HyperExecute execution is **AI-adaptive** — it
  absorbs cosmetic UI changes rather than breaking, so the brittleness gap self-heal assumes
  (brittle replay vs adaptive re-author) largely doesn't exist. In practice self-heal is a
  **flaky-test re-runner + real-bug confirmer**, not a reliable drift-updater. Set expectations
  accordingly; don't burn cycles manufacturing a drift demo. Also note a healed test is
  authored against `localhost`, which conflicts with daily runs that target the deployed URL —
  a design tension to resolve before relying on auto-committed heals.

## Reporting / evidence

- **`report.py` crashes `FileNotFoundError: reports/summary.md`.** A prior step (trigger)
  failed so `reports/` was never created. → `report.py` now `mkdir -p reports`; the real fix
  is the upstream trigger failure.
- **RCA shows `GET .../public/rca?session_id=... -> HTTP 400`.** Wrong param + wrong id. → Use
  `GET /insights/api/v3/public/rca?test_ids=<csv>` keyed by the instance `test_id`; trigger
  `/rca/generate` when missing (or enable Automatic AI RCA org-wide). See `api-contracts.md` §6.
- **"replay" evidence link is broken / points to the wrong place.** It used `internal_id`
  (`TC-…`) as the session id. → Use the instance `test_id`; link "Preview" to the TM
  test-instance: `…/projects/{pid}/test-run/{trid}/test-instance/{instance_id}?testID={test_id}`.

## General method

- **Validate cheapest-first**: one test before the suite, dry-run before real issues, the
  API/trigger path before paying for full execution. Malformed payloads fail in ~1s.
- **Surface stderr**: kane-cli failures hide in stderr; the scripts print it on failure.
- **Read the actual error** (HTTP code + body) rather than re-running blind — a 422 tells you
  the missing field; a 500 "tunnel" tells you the tunnel/env; a 404 means wrong endpoint.
