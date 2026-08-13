---
phase: 1
plan: 1
subsystem: compatibility-foundation
provides: [Go module, Node and Go JSONL runners, differential smoke corpus]
commits: [78423e3]
---

# Phase 1 Plan 1: Foundation and Oracle Summary

Created the independent Go module, shared JSONL protocol, local JavaScript
oracle runner, Go compatibility runner, and fixed nine-case smoke corpus.

Final evidence: Go tests and vet passed; `compat/cases/smoke.jsonl` passed 9/9
with zero mismatches; `mod.js`, `test.js`, and `tinycolor.js` stayed unchanged.
