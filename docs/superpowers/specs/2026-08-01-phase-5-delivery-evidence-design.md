# Phase 5 Delivery Evidence Design

## Goal

Turn the completed TinyColor Go port into a reproducible Track H submission
that a judge can build, exercise, measure, and audit from a clean checkout.

## Submission structure

Keep the existing advisory layout as the actual submission layout:

```text
TinyColor/
├── README.md
├── DECISIONS.md
├── Dockerfile
├── src/
├── tests/original/
├── tests/port/
├── fuzz/
│   ├── harness.mjs
│   └── log.txt
├── bench/
│   ├── methodology.md
│   └── results.json
└── .port-mortem.toml
```

Existing project files remain in place. No parallel submission tree or new
dependency is introduced.

## CLI

Reuse the existing Go compatibility binary and TinyColor package. Add a human
command interface for `parse`, `convert`, `lighten`, `palette`, and `contrast`.
Every command accepts `--json`; JSON output is deterministic and suitable for
demo comparisons. Invalid commands and missing values return nonzero status
with a concise stderr message. The JSONL compatibility mode remains available
so the differential driver does not change.

## Reproducible checks and CI

`make build` produces `bin/tinycolor`. `make verify` runs formatting checks,
Go tests, vet, immutable-oracle hash verification, adapter tests, and every
fixed differential corpus. GitHub Actions invokes the same commands rather
than maintaining a second CI-only procedure. Docker continues to build the
same binary in one command.

## Differential fuzz evidence

Add a standard-library Node harness that generates deterministic and randomized
public-API requests, sends the identical stream to the checked-in JavaScript
oracle and Go port, and reports duration, seed, case count, and divergences.
Publish an actual run lasting at least 60 continuous seconds in `fuzz/log.txt`.
A zero-divergence bonus is claimed only if that run finishes with zero
divergences; any mismatch is retained as a reproducible input.

## Benchmark evidence

Use one shared workload file for the original JavaScript and Go runners.
Measure cold startup, request latency p99, throughput, and peak RSS with the
same host and tool versions. Record the commands and limitations in
`bench/methodology.md` and machine-readable measurements in
`bench/results.json`. Results state sample counts and do not infer universal
speedups from one machine.

## Documentation and scoring evidence

Rewrite the root README around the Go port while retaining upstream attribution
and links. Expand `DECISIONS.md` to at least ten non-trivial, defensible
divergences. Update `COMPATIBILITY.md` with pass rates per corpus, immutable
hash status, unsafe count, coverage data where measured, and known limitations.
Keep team ownership and license attribution explicit. Add a five-minute demo
script, but do not claim that a video was recorded or published unless an
actual video artifact or URL is supplied.

## Verification

The phase closes only after CLI tests pass, `make build` and `make verify`
succeed, all pinned oracle hashes match, the 60-second fuzz session is recorded,
benchmark JSON validates, documentation contains no unsupported claims, and
the worktree passes `git diff --check`. Deno remains an honest environment gap
unless it is installed and the untouched source suite is run successfully.

## Deliberate exclusions

- No GUI, package publication, transpiler, JavaScript runtime embedding, or FFI.
- No new dependency when Go or Node standard libraries cover the need.
- No speculative Bug Catcher claim; document it only if differential testing
  produces a real upstream defect.
