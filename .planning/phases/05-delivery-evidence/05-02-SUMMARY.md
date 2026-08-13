---
phase: 5
plan: 2
subsystem: fuzz-benchmark-evidence
tags: [fuzz, differential, benchmark, p99, rss]
provides: [validated 60-second fuzz log, shared-workload benchmark evidence]
---

# Phase 5 Plan 2 summary

Published a deterministic persistent-process differential harness and validated
60-second zero-divergence log, then measured the original JavaScript adapter and
Go adapter with one representative workload on the same host.

## Evidence

- `fuzz/log.txt`: 60.012 seconds, seed 20260801, 1,091,630 cases, 0 divergences.
- `bench/results.json`: 20 cold starts and 1,000 persistent requests per runtime.
- JavaScript: 41.4131 ms startup p99, 0.2795 ms latency p99, 7,834.77 ops/s,
  42,868,736-byte peak RSS.
- Go: 11.0109 ms startup p99, 0.1808 ms latency p99, 16,756.79 ops/s,
  12,668,928-byte peak RSS.
- Benchmark tests, normalized workload SHA-256 validation, all Node checks, all
  164 fixed corpus cases, Go tests, and Go vet passed.

GNU Make is unavailable in the local PowerShell environment, so its constituent
commands were executed directly with the repository-local Go cache. The final
Ubuntu Actions run remains the direct `make verify` proof.

## Commits

- `6b4506a`, `0e54f1a`: persistent fuzz harness and exact-parity fixes.
- `ad69b3e`: validated 60-second fuzz evidence.
- `03683ec`: shared benchmark workload, runner, tests, methodology, and results.

## Remaining external action

Record and publish the five-minute demo video; no URL is claimed yet.
