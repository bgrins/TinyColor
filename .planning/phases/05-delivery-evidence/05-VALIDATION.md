---
phase: 5
slug: delivery-evidence
status: draft
nyquist_compliant: true
wave_0_complete: true
created: 2026-08-01
---

# Phase 5 — Validation Strategy

> Per-phase validation contract for feedback sampling during execution.

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Go `testing`, Node built-in modules, existing JSONL differential harness |
| **Config file** | `src/go.mod`, `deno.json`, `Makefile` |
| **Quick run command** | `go -C src test ./...` |
| **Full suite command** | `make verify` |
| **Estimated runtime** | quick under 10 seconds; full under 5 minutes |

## Sampling Rate

- **After every task commit:** Run the task's focused command and `go -C src test ./...` when Go changed.
- **After every plan wave:** Run `make verify`.
- **Before `$gsd-verify-work`:** `make verify`, the recorded fuzz command, and benchmark validation must be green.
- **Max feedback latency:** 10 seconds for focused tests; 5 minutes for the full gate.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 05-01-01 | 01 | 1 | DEL-01 | CLI unit | `go -C src test ./cmd/tinycolor-compat` | ✅ | ⬜ pending |
| 05-01-02 | 01 | 1 | QLT-03 | integration | `make build && make verify` | ✅ make / ❌ expanded targets | ⬜ pending |
| 05-02-01 | 02 | 2 | DEL-01 | differential fuzz | `node fuzz/harness.mjs --duration 1 --seed 1` | ❌ Wave 2 | ⬜ pending |
| 05-02-02 | 02 | 2 | DEL-01 | fuzz evidence | `node --test fuzz/validate-log.test.mjs && node fuzz/validate-log.mjs fuzz/log.txt` | ❌ Wave 2 | ⬜ pending |
| 05-02-03 | 02 | 2 | DEL-01 | benchmark smoke | `node bench/run.mjs --quick --output <temp>` | ❌ Wave 2 | ⬜ pending |
| 05-03-01 | 03 | 3 | DEL-01 | evidence audit | `node tests/original/verify.mjs` | ❌ Wave 1 | ⬜ pending |
| 05-03-02 | 03 | 3 | QLT-03 | full gate | `make verify` | ✅ make / ❌ expanded target | ⬜ pending |
| 05-03-04 | 03 | 3 | DEL-01 | external checkpoint | public clone + exact CI run URL | manual | ⬜ pending |
| 05-03-05 | 03 | 3 | QLT-03 | closeout audit | `git diff --check` | ✅ | ⬜ pending |

*Status: ⬜ pending · ✅ green · ❌ red · ⚠️ flaky*

## Wave 0 Requirements

Existing Go tests, Node adapter tests, JSONL corpora, and Make are sufficient.
Each new runner supplies its own focused standard-library check; no framework
installation or test scaffold is required.

## Manual-Only Verifications

| Behavior | Requirement | Why Manual | Test Instructions |
|----------|-------------|------------|-------------------|
| Five-minute video is actually recorded and published | DEL-01 | Recording and public hosting require a human account and final presentation | Follow `docs/DEMO.md`, record one continuous run, publish it, then add the verified URL to README |
| Public GitHub visibility | DEL-01 | Repository visibility is external account state | Open the GitHub repository logged out and confirm source and release instructions are readable |

## Validation Sign-Off

- [x] All planned tasks have an automated focused command or existing infrastructure.
- [x] Sampling continuity has no three consecutive tasks without automated verification.
- [x] Existing infrastructure covers Wave 0.
- [x] No watch-mode flags are used.
- [x] Focused feedback latency target is under 10 seconds.
- [x] `nyquist_compliant: true` is set in frontmatter.

**Approval:** approved 2026-08-01
