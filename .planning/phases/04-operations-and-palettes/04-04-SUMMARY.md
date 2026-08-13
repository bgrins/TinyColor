---
phase: 4
plan: 4
subsystem: readability-compatibility
provides: [readability JSONL dispatch and WCAG differential evidence]
commits: [0c72f8c, 817ad71, 469b9f4]
---

# Phase 4 Plan 4: Readability Compatibility Summary

Added Node and Go dispatch for `readability`, `isReadable`, and
`mostReadable`, preserving adapter-owned option defaults, truthiness, and null
results. The fixed corpus covers source ratios, WCAG families, coercion,
first ties, fallback selection, and empty candidates.

Adapter tests, Go tests, and the operations corpus passed in the final gate.