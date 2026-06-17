# Agentic QA Pipeline — Claude Skill

A packaged, reusable Claude skill that drops the **agentic QA pipeline** in this repo
(`qa/` + `.github/workflows/qa-*.yml`) into any web-app repository and operates it — plus the
LambdaTest/TestMu API contracts and the symptom→fix troubleshooting runbook reverse-engineered
while getting it working. It exists so the next team doesn't have to re-debug the integration.

## What the pipeline does (three loops)

- **Suite Sync** — kane-cli authors the regression tests on real Chrome, uploads them to Test
  Manager, records the test-case IDs.
- **Daily Regression** — full suite → Test Run → HyperExecute → poll → evidence packs → one
  GitHub issue per failing test (auto-closes on recovery).
- **PR-Impact + self-heal** — diff → impacted tests → boot the PR's code behind a LambdaTest
  Tunnel → run via `replaced_url` → sticky verdict + P0/P1 gate; failed tests are re-authored.

Every bug ships a jam.dev-style evidence pack (AI RCA root cause + suggested fix, Test-Manager
preview, console/network logs, repro steps).

## Install

- **As a packaged skill:** install `agentic-qa-pipeline.skill` in Claude Code/Cowork.
- **Or copy the source** (Claude Code): `cp -r agentic-qa-pipeline ~/.claude/skills/`

Then ask Claude to "set up the agentic QA pipeline" in a target repo and it will copy the
assets in, help fill the two config files, set the GitHub secrets/variables, and run the
validation sequence — using the bundled API contracts so it skips the known gotchas.

## Contents

| Path | What |
|---|---|
| `agentic-qa-pipeline/SKILL.md` | when-to-use + setup runbook + cost-conscious validation order |
| `agentic-qa-pipeline/assets/qa/` | the 7 validated scripts, config/manifest templates, example tests, docs |
| `agentic-qa-pipeline/assets/workflows/` | the three GitHub Actions workflows |
| `agentic-qa-pipeline/assets/lambdatest/` | TestMu GitHub App config (optional hybrid mode) |
| `agentic-qa-pipeline/references/api-contracts.md` | working TM / HyperExecute / RCA / kane-cli / tunnel contracts |
| `agentic-qa-pipeline/references/troubleshooting.md` | every failure mode → root cause → fix |
| `agentic-qa-pipeline.skill` | the installable package |

App-specific IDs/URLs in the templates are stripped to `REPLACE_ME` — no tenant data is bundled.
