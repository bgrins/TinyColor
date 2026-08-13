---
phase: 1
slug: foundation-and-oracle
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-08-01
---

# Phase 1 — Validation Strategy

## Test Infrastructure

| Property | Value |
|---|---|
| Framework | Go standard `testing` plus Node 24.18.0 |
| Config file | `go/go.mod` (created by Plan 01-01) |
| Quick run command | `go test ./...` from `go/` |
| Full suite command | `node compat/run.mjs compat/cases/smoke.jsonl` |
| Estimated runtime | under 10 seconds |

## Sampling Rate

- After every task commit: `go test ./...` and `go vet ./...` from `go/`.
- After Wave 0: `node compat/run.mjs compat/cases/smoke.jsonl`.
- Before phase verification: run both commands, `go vet ./...`, and `git diff --check`.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---|---|---|---|---|---|---|---|
| 01-01-01 | 01 | 0 | QLT-01 | static | `git diff -- mod.js test.js tinycolor.js` | ❌ W0 | pending |
| 01-01-02 | 01 | 0 | EQV-01 | unit | `go test ./...` | ❌ W0 | pending |
| 01-01-03 | 01 | 0 | EQV-01, QLT-03 | differential | `node compat/run.mjs compat/cases/smoke.jsonl` | ❌ W0 | pending |

## Wave 0 Requirements

- [ ] `go/go.mod` and a minimal Go runner test.
- [ ] `go/tinycolor/color.go` implements only fixed smoke-corpus inputs.
- [ ] `compat/js-runner.mjs`, `compat/run.mjs`, and smoke corpus.
- [ ] A documented protocol schema in `docs/ARCHITECTURE.md`.

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|---|---|---|---|
| Upstream Deno source suite | QLT-03 | Deno unavailable locally | After installing Deno, run `deno task test` from repo root and record result. |

## Validation Sign-Off

- [x] Every planned task has an automated check or a declared Wave 0 dependency.
- [x] No three consecutive tasks lack automated verification.
- [x] The unavailable Deno check is explicit rather than claimed.
- [ ] Phase checks are green.
