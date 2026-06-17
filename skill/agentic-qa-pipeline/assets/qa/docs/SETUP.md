# Setup — Agentic QA Pipeline

15 minutes, in order. After this, daily regression and PR validation run on
their own.

## 1. Secrets and variables (GitHub repo → Settings)

| Name | Type | Value |
|---|---|---|
| `LT_USERNAME` | Secret | TestMu AI username (Dashboard → Settings → Keys) |
| `LT_ACCESS_KEY` | Secret | TestMu AI access key |
| `QA_TARGET_URL` | **Repository** variable | Deployed ShoeStore URL (daily runs) |
| `TM_PROJECT_ID` | Repository variable | Test Manager project ID |
| `TM_FOLDER_ID` | Repository variable | Test Manager folder ID for the regression suite |

`GITHUB_TOKEN` is provided automatically by Actions. Note: variables scoped
to a GitHub *environment* (e.g. "Prod") are NOT visible to these workflows
unless the job declares that environment — use Repository variables. The
deployed URL is also baked into `qa/config.yml`, so `QA_TARGET_URL` is an
optional override.

## 2. Test Manager

1. Create (or reuse) a project for ShoeStore in Test Manager; create a folder
   `Regression`.
2. Put both IDs into the repo variables above **and** into
   `qa/config.yml` → `test_manager` (env vars override the file, so either
   works; the file keeps local runs working too).

## 3. Edit the two config files

- `qa/config.yml` — set `app.target_url`. Review the `impact_map` and
  `gates`; defaults fit ShoeStore.
- `qa/tests/*_test.md` — replace the placeholder `BASE_URL` value in each
  frontmatter with the deployed URL (or leave: runs override it).

## 4. TestMu GitHub App (hybrid PR flow)

1. Install <https://github.com/apps/lambdatest-ai-cloud> on this repo.
2. Copy project/folder/assignee/environment IDs from
   <https://integrations.lambdatest.com/githubci/install> into
   `.lambdatest/config.yaml` and set `test_url`.
3. `.lambdatest/agent.md` is already written for ShoeStore — adjust if
   priorities change.

## 5. Enable Automatic AI RCA (once, org settings)

Organization Settings → Insights → Automatic AI RCA → enable, scope **All
failures** (or target by project `ShoeStore`). Needs available credits.

## 6. Author the suite (Loop 1)

Run the **QA · Suite Sync** workflow (Actions tab → run workflow). It:
authors each `qa/tests/*_test.md` with kane-cli against `QA_TARGET_URL`,
uploads them to Test Manager, and commits the test case IDs into
`qa/manifest.json`.

Check after: every test in `qa/manifest.json` has a `tm_test_case_id`. If a
test failed to author, fix the test wording and re-run with
`only: REG-00X`. If IDs were not parsed from kane-cli output, copy them from
the Test Manager UI into the manifest once (see ARCHITECTURE.md → gaps).

## 7. Smoke the loops

- **Daily:** Actions → *QA · Daily Regression* → Run workflow. Expect: a
  HyperExecute job link in the summary, `reports/` artifact, and — if
  anything fails — a `qa-bug` issue with the evidence pack.
- **PR:** open a trivial PR touching `client/src/components/cart-slideout.tsx`.
  Expect: impact analysis selects the cart tests (REG-005/006/007), app
  boots, tunnel starts, sticky comment appears with the verdict, plus the
  App's own generated-test comments. If a test fails because the PR changed
  the UI legitimately, expect a `chore(qa): self-heal` commit on the PR
  branch and a 🩹 healed row instead of a bug.

## Troubleshooting

| Symptom | Likely cause |
|---|---|
| `create_test_run` HTTP 4xx | Payload mismatch on your tenant — set `template_test_run_id` fallback (see ARCHITECTURE.md) |
| Tunnel never "established" | Org network policy / IP allowlist; check `tunnel.log` artifact |
| All PR tests skipped | `impact_map` didn't match the diff — extend patterns |
| RCA empty in evidence pack | AI RCA not enabled or out of credits (step 5) |
| Suite sync passes but no TM IDs | NDJSON key mismatch — paste IDs into manifest once |
