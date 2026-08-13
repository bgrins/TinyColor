# Project State

**Updated:** 2026-08-01

## Current Position

- Phase 5 of 5: Delivery Evidence — complete.
- All three Phase 5 plans and all milestone implementation plans are complete.
- Remaining human submission action: record, upload, and link the five-minute demo video.

## Verified Evidence

- Public repository: https://github.com/rajeet-04/TinyColor
- Unauthenticated `ls-remote` returned branch `rajeet` at
  `1c218b669d192e37b7019b08395cf348410dde79`.
- GitHub Actions run 30686980719 passed `make verify`, Deno, build, and artifact
  upload for that exact commit:
  https://github.com/rajeet-04/TinyColor/actions/runs/30686980719
- Immutable JavaScript oracle hashes: 3/3 verified.
- Exact corpora: smoke 9/9, HEX/RGB 26/26, parser 23/23, conversion 35/35,
  operations 71/71; 164/164 total and zero mismatches.
- Go tests/vet and 15 Node tests pass.
- Immutable Deno source suite: 45 passed, 0 failed, 1 ignored.
- Byte-identical original suite against native Go: 45 passed, 0 failed, 1 ignored.
- Differential fuzz evidence: 60.012 seconds, seed 20260801, 1,091,630 cases,
  zero divergences.
- Shared benchmark: 20 cold starts and 1,000 persistent requests per runtime,
  with startup p99, latency p99, throughput, and peak RSS recorded.
- Go `unsafe` source occurrences: 0.

## Recent Decisions

- Use the pinned V8-derived 8-bit luminance transfer table for exact `Math.pow` parity.
- Apply TinyColor's sub-one RGB rounding once at the `FromCompat` boundary.
- Keep fuzz comparisons exact and normalize benchmark workload newlines before hashing.
- Never claim external evidence until public access and exact-commit CI are observed.
- Use a test-only synchronous facade to run unchanged source assertions against
  the native Go binary without duplicating TinyColor algorithms.

## Session Continuity

Last session: 2026-08-01
Stopped at: Phase 5 complete; demo video remains a human submission action.
Resume file: none
