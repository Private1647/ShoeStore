---
name: agentic-qa-pipeline
description: >-
  Set up and operate an end-to-end agentic QA / regression pipeline for a web app on
  LambdaTest TestMu AI — AI-authored kane-cli tests, Test Manager test runs, HyperExecute
  cloud execution, AI RCA evidence packs, a daily regression loop, a PR-impact loop that
  tests the changed code over a LambdaTest Tunnel, and self-heal. Use this skill whenever
  the user wants automated regression testing, a CI/CD test pipeline, "are there bugs or
  not" checks on every PR or every day, KaneAI / kane-cli / HyperExecute / Test Manager
  automation, jam.dev-style bug evidence packs, or wants to drop this QA pipeline into a
  new repository — even if they don't name the specific tools. It bundles validated,
  app-agnostic scripts + GitHub workflows AND the exact API contracts and ~18 gotchas
  reverse-engineered while getting it working, so you don't have to rediscover them.
---

# Agentic QA Pipeline (LambdaTest TestMu AI)

This skill drops a working, three-loop agentic QA pipeline into any web-app repo and
operates it. The scripts and workflows are app-agnostic; everything app-specific lives in
two config files. **The real value is the bundled know-how**: the pipeline talks to five
LambdaTest/TestMu services whose API contracts are easy to get subtly wrong, and this skill
encodes the working contracts so you skip days of debugging.

## What it does — three loops

| Loop | Trigger | What happens |
|---|---|---|
| **Suite Sync** | manual / on `qa/tests/**` change | kane-cli authors each `*_test.md` on real Chrome (headless), uploads the test case to Test Manager, records the id in `qa/manifest.json` |
| **Daily Regression** | cron + manual | full suite → Test Run → HyperExecute → poll → evidence packs → one GitHub issue per failing test (auto-closes on recovery) |
| **PR-Impact + self-heal** | pull_request | diff → impacted tests → boot the PR's code on the runner behind a LambdaTest Tunnel → run via `replaced_url` → sticky verdict + P0/P1 gate; failed tests are re-authored (drift→heal) |

Every bug ships a jam.dev-style evidence pack (AI RCA root cause + suggested fix, session
replay/preview, console/network logs, repro steps).

## When to use

Setting up automated regression/QA for a web app, wiring KaneAI/HyperExecute/Test Manager
into CI, adding "test the changed code on every PR" checks, or porting this pipeline to a
new repo. Also use it to **debug** an existing instance — the troubleshooting runbook maps
every failure mode we hit to its fix.

## Prerequisites

- A **LambdaTest TestMu** account; a **Test Manager project + folder**; `LT_USERNAME` and
  `LT_ACCESS_KEY` (Settings → Account → Password & Security / API key).
- **kane-cli ≥ 0.4.4** (`npm install -g @testmuai/kane-cli`); auth via `kane-cli login`.
- A **GitHub repo** with Actions enabled (the app must boot locally for the PR loop).
- `gh` CLI authenticated with `repo` + `workflow` scopes.

## Bundled files (in `assets/`)

- `assets/qa/` — `scripts/` (lt_client, sync_suite, impact_analysis, trigger_run,
  evidence_pack, heal_suite, report), `config.yml` (template), `manifest.json` (template),
  `requirements.txt`, `tests/` (9 example testmd files), `docs/`.
- `assets/workflows/` — `qa-suite-sync.yml`, `qa-daily-regression.yml`, `qa-pr-impact.yml`.
- `assets/lambdatest/` — `config.yaml` + `agent.md` (TestMu GitHub App, optional hybrid mode).

## Setup runbook

Work through these in order. **Read `references/api-contracts.md` first** — it prevents the
common mistakes.

1. **Copy assets into the repo**
   - `assets/qa/` → `qa/`
   - `assets/workflows/*.yml` → `.github/workflows/`
   - `assets/lambdatest/` → `.lambdatest/` (only if using the TestMu GitHub App)

2. **Author the test suite for the app.** Don't reuse the bundled ShoeStore `*_test.md`
   verbatim — they're examples. Generate app-specific tests with `kane-cli generate`
   (see the `kane-cli` skill) or hand-write `qa/tests/NN_*_test.md` (intent-based prose;
   frontmatter `mode: testing`, `max_steps`). Update `qa/manifest.json` (id, file, title,
   features, priority) and `qa/config.yml`'s `impact_map` (regex on changed paths → features).

3. **Fill `qa/config.yml`** — `app.target_url` (deployed URL), `app.local`
   (`start_command`/`port`/`ready_path` so the PR loop can boot the app),
   `test_manager.project_id` + `folder_id`, and `execution.environment` (a valid LambdaTest
   browser/OS — the bundled macOS Monterey/Chrome combo works). Leave `environment_id` and
   `template_test_run_id` null for now (you'll pin them after the first run — see step 6).

4. **Set GitHub secrets + variables**
   - Secrets: `LT_USERNAME`, `LT_ACCESS_KEY` (`gh secret set`).
   - Variables: `TM_PROJECT_ID`, `TM_FOLDER_ID` (`gh variable set`). `QA_TARGET_URL` is
     optional — the workflows fall back to `config.yml`'s `target_url` (and note that an
     **environment-scoped** variable is NOT readable by these jobs; use a **repository**
     variable or rely on config).
   - The three `workflow_dispatch` workflows must be on the **default branch** before GitHub
     will let you dispatch them — merge them to `main` first.

5. **Run Suite Sync** (`gh workflow run "QA · Suite Sync (author & upload)" --ref main`).
   Validate cheaply first: `-f only=REG-001` for one test (~3 min) before the full run
   (~25-40 min). Confirm every `tm_test_case_id` is filled in `qa/manifest.json`.

6. **Validate the daily/HyperExecute path cheaply.** Dispatch Daily Regression with
   `-f dry_run=true` (no GitHub issues). With only a subset synced it runs just those tests.
   The first run **creates an environment + a template Test Run** and logs their ids —
   **pin them** into `config.yml` (`test_manager.environment_id`, `template_test_run_id`) so
   later runs reuse them instead of orphaning a new run each time.

7. **Validate the PR loop.** Open a small PR touching a file in the `impact_map`. Confirm:
   impact selects the right tests → app boots on the configured port → tunnel comes up →
   HyperExecute runs against localhost via `replaced_url` → sticky verdict comment with a
   Test-Manager preview link → P0/P1 gate.

8. **Go live.** Drop `dry_run`; the daily cron + PR checks now open real issues / enforce
   the gate. Optionally install the **TestMu GitHub App** (fills `.lambdatest/config.yaml`)
   for hybrid mode (App generates NEW tests for the diff; this pipeline re-runs the impacted
   EXISTING suite). Enable **Automatic AI RCA** in Org Settings so evidence packs are richer.

## Cost-conscious validation order

HyperExecute/authoring runs cost time + credits. Always: **one test before the whole suite,
dry-run before real issues, the API/trigger path before paying for full execution.** A
malformed payload fails in ~1s before consuming execution minutes; surface stderr and read
the actual error rather than re-running blind.

## Critical gotchas (skim before you touch anything)

These are the non-obvious contracts. Full detail + the symptom→fix table are in
`references/api-contracts.md` and `references/troubleshooting.md` — **read them when wiring or
debugging the corresponding piece.**

- **kane-cli** must run `--headless` on CI (it drives real Google Chrome) and needs the start
  URL via **`--url`** on ≥0.4.4 (the old `Open {{BASE_URL}}` body no longer resolves). The TM
  test-case id is in `output-<stem>/.internal/meta.json`, not the NDJSON.
- **Create Test Run** ignores inline instances — create it, then **`PUT /api/v1/test-run/{id}`**
  to attach `test_run_instances`. It needs `title` (not `name`).
- **HyperExecute clones the run** and executes the clone (its id is the response's top-level
  `test_run_id`). **Poll that clone** via `GET /api/v1/test-run/instances/{id}` — NOT the run
  you created (orphaned at "not started"), NOT the HyperExecute job API (returns "unknown").
  Reuse a pinned environment + template run to avoid orphans.
- **Tunnel** must start with **`--env ht-prod`** or HyperExecute 500s ("Failed to check if
  tunnel is active"); readiness string is "You can start testing now".
- **AI RCA** is `GET /insights/api/v3/public/rca?test_ids=<csv>` (+ a `/rca/generate` POST
  when missing) — keyed by the instance's automation `test_id`, not `session_id`/`internal_id`.

## Troubleshooting

When a stage fails, open `references/troubleshooting.md` — it lists each failure we hit
(symptom → root cause → fix), e.g. "authored nothing in 52s", "No start URL provided",
"Instances does not exists for this test run", "polls status=unknown forever", "two runs per
execution", "Failed to check if tunnel is active", broken RCA / replay links.
