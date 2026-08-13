---
phase: 2
slug: parsing-and-color-state
status: draft
nyquist_compliant: true
wave_0_complete: false
created: 2026-08-01
---

# Phase 2 — Validation Strategy

| Property | Value |
|---|---|
| Framework | Go standard `testing` plus Node 24.18.0 |
| Quick run | `go test ./internal/color ./internal/parser` from `go/` |
| Full run | `go test ./...; node compat/run.mjs compat/cases/parser.jsonl` |
| Static checks | `go vet ./...` and no output from `gofmt -d` |

## Sampling rate

- After each parser/model task: focused Go tests and `go vet ./...`.
- After Plan 02-01: HEX/RGB/name differential corpus.
- After Plan 02-02: full parser corpus and Phase 1 smoke corpus.

## Verification map

| Task | Plan | Requirement | Automated proof |
|---|---|---|---|
| 02-01-01 | 02-01 | PAR-02 | `go test ./internal/color` |
| 02-01-02 | 02-01 | PAR-01 | `node compat/run.mjs compat/cases/parser-hex-rgb.jsonl` |
| 02-02-01 | 02-02 | PAR-01, PAR-02 | `go test ./internal/parser` |
| 02-02-02 | 02-02 | QLT-02 | `node compat/run.mjs compat/cases/parser.jsonl` |

## Manual-only check

When Deno is available, run `deno task test`; until then it remains explicitly
unverified and does not substitute for Node differential evidence.

