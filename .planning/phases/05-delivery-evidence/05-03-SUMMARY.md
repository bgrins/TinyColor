---
phase: 5
plan: 3
subsystem: submission-documentation-closeout
tags: [readme, decisions, compatibility, verification]
provides: [judge-facing guide, honest compatibility evidence, local closeout proof]
status: local-complete-external-pending
---

# Phase 5 Plan 3 summary

Replaced the upstream-oriented landing page with a concise port guide, expanded
the architectural decision log to 15 substantive entries, published current
compatibility/coverage/safety/benchmark evidence, and added a five-minute demo
script with its human actions explicitly unclaimed.

## Task commits

- `82a9532` `docs(05-03): write submission guide and decisions`
- `7c2da11` `docs(05-03): publish final compatibility evidence`
- Closing local-verification commit: this summary and `05-VERIFICATION.md`.

## Fresh local evidence

- Native build and JSON invocations of parse, convert, lighten, palette, and
  contrast exited zero.
- 15 Node tests passed with zero failures.
- Go tests and vet passed using the repository-local Go cache.
- Fixed corpora passed 9/9, 26/26, 23/23, 35/35, and 71/71.
- Fresh one-second seed-20260801 fuzz: 11,103 cases, zero divergences.
- Recorded fuzz log validated: 60.012 seconds, 1,091,630 cases, zero divergences.
- Benchmark schema and normalized workload SHA-256 verified; quick measurement
  wrote only to a temporary path.
- Immutable Deno suite: 45 passed, 0 failed, 1 ignored.
- Three oracle hashes verified; `git diff -- mod.js test.js tinycolor.js` empty.

GNU Make is unavailable in this Windows PowerShell environment, so the exact
commands behind `make build` and `make verify` were executed directly. The
Ubuntu CI run remains the direct Make proof.

## Remaining external actions

- Push the current `rajeet` commit and verify the exact GitHub Actions run.
- Verify unauthenticated public access to the repository.
- Human: record, upload, and link the five-minute demo video.
