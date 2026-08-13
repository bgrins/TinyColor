---
phase: 5
plan: 1
subsystem: cli-build-ci
tags: [go, cli, make, docker, github-actions, sha256]
provides: [human CLI, immutable-oracle verifier, reproducible local gate, delivery CI]
affects: [src/cmd/tinycolor-compat, tests/original, Makefile, Dockerfile, .github/workflows]
tech-stack: [go-standard-library, node-standard-library, github-actions]
key-files:
  created:
    - src/cmd/tinycolor-compat/main_test.go
    - tests/original/verify.mjs
    - tests/original/verify.test.mjs
    - .github/workflows/port.yml
  modified:
    - src/cmd/tinycolor-compat/main.go
    - src/tinycolor/color_test.go
    - Makefile
    - Dockerfile
  deleted:
    - .github/workflows/deno.yml
decisions:
  - One executable selects JSONL mode with zero arguments and human CLI mode with a command.
  - GNU Make exports a repository-local GOCACHE and derives GOEXE for Windows/Linux artifacts.
  - CI calls make verify and runs the untouched Deno suite as a separate environment check.
---

# Phase 5 Plan 1: CLI, Build, and CI Summary

Added tested `parse`, `convert`, `lighten`, `palette`, and `contrast` commands
without changing the zero-argument JSONL protocol. Added cross-platform oracle
hash verification, a complete local parity gate, a one-command build, the
scratch Docker artifact, and one least-privilege port CI workflow.

## TDD and Verification Evidence

- CLI RED: the focused package test failed because `run` was undefined.
- CLI GREEN: focused command tests, all Go tests, and Node adapter tests passed.
- Manifest RED: verifier import was missing; malformed-line regression later
  failed at `path.resolve` before the defensive parser fix.
- Manifest GREEN: two Node tests passed and direct verification printed
  `verified: 3`.
- Formatting: `gofmt -l src` prints no files after the mechanical
  `color_test.go` formatting fix.
- Full local equivalents: Go tests/vet, adapter tests, and all 162 fixed cases
  passed: 9 smoke, 26 parser-hex-rgb, 23 parser, 35 conversion, 69 operations.
- Windows artifact: `bin/tinycolor.exe parse red` executed successfully.

GNU Make is not installed in the current Windows environment, so `make build`
and `make verify` were not directly invoked locally. Their individual commands
passed; the configured Ubuntu CI remains the direct Make/Deno execution gate
until a remote run is observed.

## Commits

- `df1f9b8` `feat(05-01): add human CLI commands`
- `02f9ced` `build(05-01): add reproducible verification gate`
- `a4ad85e` `fix(05-01): make verification gate portable`
- `bc91502` `ci(05-01): verify port and source suite`
- `57e1114` `fix(05-01): close delivery review gaps`

## Deviations from Plan

- The Makefile emits `bin/tinycolor.exe` on Windows and `bin/tinycolor` on
  Linux. This is required for a runnable native Windows artifact.
- The pre-existing unformatted `src/tinycolor/color_test.go` was formatted in
  the portability fix because the new non-mutating format gate correctly
  blocked completion.
- Final review added manifest absolute/traversal containment, wired verifier
  regressions into `make verify`, and aligned usage text with `tinycolor`.

## Known External Checks

- GitHub Actions execution has not yet been observed.
- Deno remains unavailable locally; no original-suite pass is claimed here.
