---
phase: 4
plan: 2
subsystem: operations-modifiers-mix-compatibility
tags: [compatibility, jsonl, modifiers, mix]
provides: [presence-aware adapter dispatch, deterministic modifier-mix corpus]
affects: [compat, src/cmd/tinycolor-compat]
key-files:
  created:
    - compat/cases/operations.jsonl
  modified:
    - compat/js-runner.mjs
    - compat/run.mjs
    - src/cmd/tinycolor-compat/main.go
    - tests/port/adapter.test.mjs
decisions:
  - JavaScript omitted, zero, and null amount behavior is confined to the compatibility adapters.
  - Operations corpus mismatches preserve fixed owner and suspected-package metadata.
---

# Phase 4 Plan 2: Modifier and Mix Compatibility Summary

Added thin Node and Go dispatch for pointer-mutating modifiers and pure Mix,
with deterministic owner-tagged operations reproducers.

## TDD Evidence

- RED: `node tests/port/adapter.test.mjs` exited `1` because `modify` returned
  `unsupported operation` instead of the required mutation snapshot.
- GREEN: `node tests/port/adapter.test.mjs` exited `0` after dispatch was added.

## Validation

- `node tests/port/adapter.test.mjs`: exited `0`.
- `Set-Location src; go test ./cmd/tinycolor-compat ./tinycolor -count=1`: exited `0`.
- `node compat/run.mjs compat/cases/smoke.jsonl`: `9` cases passed, `0` mismatches.
- `node compat/run.mjs compat/cases/operations.jsonl`: `32` cases, `26` passed,
  `6` Mix metadata mismatches before the follow-up fix.
- `git diff --check`: exited `0`.

## Differential Evidence

The six Mix mismatch records revealed that the Go value dropped TinyColor's
observable raw interpolated RGBA input. Follow-up commit `d2f22c6`
(`fix(04-02): preserve mix original metadata`) restored that metadata. The
final Phase 4 parity gate passed all `69/69` operations rows with zero mismatches.

## Commits

- `d71ea12` `test(04-02): add modifier adapter failures`
- `b1d0798` `feat(04-02): dispatch modifiers and mix`
- `b322d2c` `test(04-02): add modifier and mix differential corpus`

## Deviations from Plan

The corpus correctly exposed a shared-library defect after the planned adapter
work. It was fixed in a separate focused micro-commit rather than masked in
the harness.
