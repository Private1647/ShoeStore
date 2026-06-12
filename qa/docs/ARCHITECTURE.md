# Agentic QA Pipeline — Architecture

One sentence: every code change and every day, the pipeline answers **"are there bugs or not?"** — with an evidence pack for each bug, not a log dump.

## The three loops

```
                        ┌──────────────────────────────────────────────┐
 LOOP 1 · AUTHORING     │ qa/tests/*.testmd  ──kane-cli testmd run──▶  │
 (qa-suite-sync)        │ Test Manager test cases (IDs → qa/manifest)  │
                        └──────────────────────────────────────────────┘
                                            │
                        ┌───────────────────▼──────────────────────────┐
 LOOP 2 · DAILY         │ cron → create Test Run (full suite) →        │
 (qa-daily-regression)  │ trigger on HyperExecute → poll → per-failure │
                        │ AI RCA + network/console/video → evidence    │
                        │ pack → GitHub issue per bug (auto-close on   │
                        │ recovery)                                    │
                        └───────────────────┬──────────────────────────┘
                                            │
                        ┌───────────────────▼──────────────────────────┐
 LOOP 3 · PER-PR        │ git diff → impact map → impacted tests →     │
 (qa-pr-impact +        │ boot PR code on runner → LT Tunnel →         │
  TestMu GitHub App)    │ Test Run on HyEx against the PR's own code → │
                        │ failures → SELF-HEAL (kane-cli re-author) →  │
                        │ drifted tests updated + committed to the PR; │
                        │ real bugs keep evidence packs →              │
                        │ sticky PR comment + P0/P1 gate               │
                        │ ── in parallel ──                            │
                        │ @KaneAI comment → GitHub App generates NEW   │
                        │ tests for the diff + pulls semantically      │
                        │ similar existing tests + posts its own RCA   │
                        └──────────────────────────────────────────────┘
```

## Self-heal: editing existing tests when the app legitimately changes

A failed impacted test means one of two things, and the pipeline tells them
apart automatically (`qa/scripts/heal_suite.py`):

1. The PR run fails on HyperExecute → evidence packs are built as usual.
2. Each failed test is **re-authored** on the runner with
   `kane-cli testmd run <file> --author force-author` against the PR's own
   code (`http://localhost:5000`). Re-authoring makes the AI re-interpret the
   same step prose against the NEW UI instead of replaying stale recordings.
3. **Re-authored run passes** → it was test drift: the refreshed
   recording/upload replaces the stale one, the change is committed back to
   the PR branch (`chore(qa): self-heal …`), and the PR comment reports it
   as 🩹 healed — excluded from the bug list and the gate.
4. **Re-authored run still fails** → real bug: evidence pack + gate apply.

Boundary: healing fixes *execution drift* (selectors, layout, intermediate
steps). If the test's *intent* is outdated (e.g. checkout adds an OTP step
the prose never mentions), re-authoring fails too — that's correct behaviour:
the failure surfaces with its failing step so a human (or the GitHub App's
newly generated tests) updates the prose. `--max-heals` (default 5) caps
authoring cost per run; `--author-mode complete-reauthor` is available for
deeper rebuilds. Healing is PR-only by design — daily-run failures on the
deployed environment are regressions by definition and should page, not
self-modify `main`.

## Hybrid split: what the GitHub App does vs. this package

| Concern | TestMu GitHub App | This package |
|---|---|---|
| Generate NEW tests from the PR diff | ✅ (core capability) | ❌ deliberately not duplicated |
| Find semantically similar existing tests | ✅ | ➖ complements with deterministic impact map |
| Run impacted EXISTING regression suite | ❌ | ✅ (manifest + impact map) |
| Test the PR's actual code (not deployed env) | ❌ (tests `test_url`) | ✅ (boot on runner + LT Tunnel + `replaced_url`) |
| Daily scheduled regression | ❌ | ✅ |
| Evidence pack (video, console, network, RCA, repro steps) | partial (RCA in PR comment) | ✅ full bundle per bug |
| Bug lifecycle (issue per bug, auto-close on recovery) | ❌ | ✅ |
| Quality gate / red check on P0-P1 | recommendation only | ✅ hard gate |
| Update EXISTING tests when the app legitimately changes | ❌ | ✅ self-heal re-authoring, committed to the PR |

Two deterministic + one semantic selection mechanism is intentional: the impact
map never misses a mapped dependency, the App's semantic search catches what
static mapping can't, and new flows get net-new generated tests.

## Components

| Path | Role |
|---|---|
| `qa/config.yml` | **The only file to edit when porting to another app.** URLs, TM IDs, impact map, gates, execution options. |
| `qa/manifest.json` | Test inventory: testmd file ↔ TM test case ID ↔ features ↔ priority. |
| `qa/tests/*_test.md` | kane-cli testmd suite — human-readable, replayable, versioned with the app. |
| `qa/scripts/lt_client.py` | Shared API client (Test Manager, HyperExecute, Automation, Insights RCA). |
| `qa/scripts/sync_suite.py` | Loop 1: author/upload suite, record TM IDs. |
| `qa/scripts/impact_analysis.py` | Loop 3: diff → features → impacted tests. |
| `qa/scripts/trigger_run.py` | Loops 2+3: create Test Run → trigger HyEx → poll → collect instance results. |
| `qa/scripts/evidence_pack.py` | Per-failure evidence bundle (RCA, console, network, video, repro steps). |
| `qa/scripts/heal_suite.py` | Self-heal: re-author failed tests against PR code; drift → update test, else → real bug. |
| `qa/scripts/report.py` | Step summary, sticky PR comment, bug issues, P0/P1 gate. |
| `.lambdatest/config.yaml` + `agent.md` | GitHub App wiring + AI context. |

## APIs used

| API | Endpoint | Used by |
|---|---|---|
| Trigger Test Run on HyEx | `POST {tm}/api/atm/v1/hyperexecute` | trigger_run |
| Create Test Run | `POST {tm}/api/v1/test-run` | trigger_run |
| Duplicate Test Run (fallback) | `POST {tm}/api/v1/test-run/{id}/duplicate` | trigger_run |
| Test Run instances | `GET {tm}/api/v1/test-run/{id}/instances` | trigger_run |
| HyEx job status | `GET api.hyperexecute.cloud/v2.0/job/{id}` | trigger_run (poll) |
| HyEx categorized errors | `GET api.hyperexecute.cloud/v1.0/categorizederrors` | evidence_pack |
| AI RCA (Insights) | `GET api.lambdatest.com/insights/api/v3/public/rca?session_id=` | evidence_pack |
| Session network/console/video | `GET api.lambdatest.com/automation/api/v1/sessions/{id}/…` | evidence_pack |

## Multi-repo strategy (the scale question)

**Single-repo app (ShoeStore today): tests live in the app repo.** Tests
version with the code they test, PRs see impact analysis against their own
diff, and the suite travels with forks/branches. This is the default.

**Multi-repo product (e.g., separate frontend, backend, payments services):
do NOT scatter the E2E suite — create one central QA repo.** Rationale: E2E
flows cross service boundaries, so no single service repo owns them; the
manifest/evidence/reporting machinery should exist once, not N times.

Recommended shape:

```
qa-platform/                      ← central repo (this package, generalized)
  apps/
    shoestore/   {config.yml, manifest.json, tests/}
    payments/    {config.yml, manifest.json, tests/}
  qa/scripts/                     ← shared, unchanged
  .github/workflows/
    daily-regression.yml          ← matrix over apps/*
    dispatch-impact.yml           ← repository_dispatch receiver
```

Each service repo keeps only a ~20-line forwarder workflow:

```yaml
on: pull_request
jobs:
  notify-qa:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with: {fetch-depth: 0}
      - name: Send changed paths to qa-platform
        run: |
          FILES=$(git diff --name-only origin/${{ github.base_ref }}...HEAD | jq -R -s -c 'split("\n")[:-1]')
          gh api repos/ORG/qa-platform/dispatches \
            -f event_type=pr-impact \
            -F 'client_payload[repo]=${{ github.repository }}' \
            -F 'client_payload[pr]=${{ github.event.number }}' \
            -F 'client_payload[sha]=${{ github.sha }}' \
            -F "client_payload[changed_files]=$FILES"
        env: {GH_TOKEN: '${{ secrets.QA_DISPATCH_TOKEN }}'}
```

The central repo's impact map gains a `repo:` dimension
(`payments-service:src/api/.* → [checkout]`), so a backend change in one repo
correctly re-runs checkout E2E tests that exercise the whole product. Status
is reported back to the originating PR via the Checks API (or a PR comment).

Migration path: ShoeStore stays self-contained now; when a second repo
appears, lift `qa/scripts/` + workflows into `qa-platform`, move
config/manifest/tests under `apps/shoestore/`, and add forwarders. The
scripts are already repo-agnostic (everything app-specific is in config).

**When to choose which:**

| Situation | Tests location |
|---|---|
| One repo, one deployable | App repo (this setup) |
| Few repos, one product surface | Central QA repo + dispatch forwarders |
| Many teams, many products | Central QA repo per product + reusable `workflow_call` workflows from a template repo |

## Productization path

This package is deliberately structured so the next step is a **template
repo / composite action** ("create-kane-pipeline"): `qa/scripts` +
workflows become `uses: lambdatest/agentic-qa/.github/workflows/pr-impact.yml@v1`
reusable workflows, and adopting an app means writing two config files and
adding two secrets. The GitHub App covers zero-config PR validation;
this package adds the regression backbone, evidence packs, and gates.

## Design decisions & considerations

1. **Tests as `.testmd` files, not exported code.** Replayable (cheap, no
   LLM cost after first run), self-healing on drift via re-author, readable
   by PMs. Code export (Playwright) remains available per test for teams
   that want raw scripts.
2. **`{{BASE_URL}}` variable + `replaced_url`** decouple test definitions
   from environments: same suite runs against deployed env (daily) and
   `http://localhost:5000` over the tunnel (PR).
3. **Evidence-first reporting.** A bug without video/console/network/RCA is
   a re-debugging task; the pack makes each issue directly actionable
   (the jam.dev outcome).
4. **Issues as bug ledger.** One issue per failing test, deduped by marker,
   auto-closed on recovery — trend-friendly and Slack/Jira-integrable later.
5. **Gates are config.** `gates.block_on_priorities` decides what turns a PR
   red; everything else is advisory.
6. **All failure-path API calls are best-effort** (`try_get`): a missing log
   never breaks the run; the pack notes what's unavailable.

## Known gaps / verify on first run

- **Create Test Run payload** (`POST /api/v1/test-run`): field names follow
  TM conventions but tenant plans differ. If creation 4xxs, set
  `test_manager.template_test_run_id` in `qa/config.yml` (duplicate-run
  fallback) or adjust `lt_client.create_test_run` once.
- **kane-cli NDJSON field for the TM test case ID** in `sync_suite.py` —
  parser checks several key spellings and falls back to share-URL scraping;
  worst case, paste IDs into `qa/manifest.json` manually once.
- **Instance result shape** from `GET /test-run/{id}/instances` — mapper is
  defensive; check `reports/run_result.json` after the first daily run.
- **AI RCA needs credits + org-level enablement** (Insights → Automatic AI
  RCA) and only exists for failures.
- **Tunnel + dedicated_proxy + geolocation are mutually exclusive** in the
  trigger payload — the pipeline only ever sets `tunnel`.
