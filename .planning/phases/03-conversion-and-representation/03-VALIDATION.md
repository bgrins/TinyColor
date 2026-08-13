---
phase: 3
slug: conversion-and-representation
status: ready
nyquist_compliant: true
wave_0_complete: false
created: 2026-08-01
---

# Phase 3 — Validation Strategy

## Test Infrastructure

| Property | Value |
|----------|-------|
| **Framework** | Go standard `testing`; Node JSONL differential harness |
| **Config file** | `src/go.mod` |
| **Quick run command** | `Set-Location src; go test ./tinycolor ./internal/...; Set-Location ..; node compat/run.mjs compat/cases/conversion.jsonl` |
| **Full suite command** | `Set-Location src; go test ./...; go vet ./...; Set-Location ..; node tests/port/adapter.test.mjs; node compat/run.mjs compat/cases/smoke.jsonl; node compat/run.mjs compat/cases/parser-hex-rgb.jsonl; node compat/run.mjs compat/cases/parser.jsonl; node compat/run.mjs compat/cases/conversion.jsonl` |
| **Estimated runtime** | ~20 seconds |

## Sampling Rate

- **After every task commit:** Run the quick command.
- **After every plan wave:** Run the full suite command.
- **Before `$gsd-verify-work`:** Full suite must be green.
- **Max feedback latency:** 30 seconds.

## Per-Task Verification Map

| Task ID | Plan | Wave | Requirement | Test Type | Automated Command | File Exists | Status |
|---------|------|------|-------------|-----------|-------------------|-------------|--------|
| 03-01-01 | 01 | 1 | FMT-01, QLT-02 | direct Go unit | `Set-Location src; go test ./tinycolor -run 'Test.*(Output|String|Hex|Filter|Conversion|Name)' -count=1` | ✅ task creates tests | ⬜ pending |
| 03-01-02 | 01 | 1 | FMT-01, QLT-02 | direct Go unit | `Set-Location src; go test ./tinycolor -run 'Test.*(Brightness|Luminance|Dark|Light|Equal|Clone|Random)' -count=1` | ✅ task creates tests | ⬜ pending |
| 03-02-01 | 02 | 2 | FMT-01, QLT-02 | protocol + regression | `node tests/port/adapter.test.mjs; Set-Location src; go test ./internal/compat` | ✅ task extends tests | ⬜ pending |
| 03-02-02 | 02 | 2 | FMT-01, QLT-02 | exact differential | `node compat/run.mjs compat/cases/conversion.jsonl` | ✅ task creates corpus | ⬜ pending |

## Test-fixture sequencing

No separate Wave 0 is required: Plan 03-01 creates and runs its direct Go
regressions in Wave 1; Plan 03-02 then creates the adapter protocol coverage
and differential corpus after that facade exists in Wave 2. The conversion
corpus is not a prerequisite fixture for Plan 03-01 and must not be referenced
as one.

## Manual-Only Verifications

None. Random output is verified by per-runtime invariants rather than false
cross-runtime exact comparison.

## Validation Sign-Off

- [x] All tasks have automated verification or a Wave 0 dependency.
- [x] Sampling continuity has no three-task validation gap.
- [x] No Wave 0 is required; the conversion fixture is created by Wave 2.
- [x] No watch-mode flags.
- [x] Feedback latency is under 30 seconds.
- [x] `nyquist_compliant: true` is set in frontmatter.

**Approval:** ready 2026-08-01
