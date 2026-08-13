# Phase 5 Research: Delivery Evidence

## Scope and current state

Phase 5 is an integration phase, not a new color-behavior phase. The Go package
and JSONL adapter already cover the required TinyColor operations. Delivery
work should expose those paths, make every claim reproducible, and replace
placeholders with measured evidence.

Current gaps:

- `src/cmd/tinycolor-compat/main.go` only reads JSONL from stdin; there is no
  human command interface or command-level test.
- `Makefile` builds `bin/tinycolor-compat` and omits conversion/operation
  corpora, formatting, hash verification, and a single full gate.
- `.github/workflows/deno.yml` is the upstream Deno build workflow, not the Go
  port CI gate.
- `fuzz/README.md`, `bench/methodology.md`, and `bench/results.json` are Phase 1
  placeholders.
- The root `README.md` describes the JavaScript package rather than the port.
- `DECISIONS.md` has seven entries; the Decision Log bonus needs ten substantive
  decisions.
- `COMPATIBILITY.md` has correct fixed-corpus evidence but no Phase 5 CLI, hash,
  fuzz, benchmark, unsafe, or coverage evidence.

## Recommended architecture

### Human CLI without a second binary

Keep `cmd/tinycolor-compat` as the only executable. Select JSONL mode when no
positional arguments are present and human mode when a command is present.
Move argument parsing and rendering into small functions in the same package so
`main_test.go` can test them without process fixtures. Reuse `tinycolor.Parse`,
conversion methods, modifiers, palettes, and readability directly; do not route
human commands through encoded JSONL requests.

Use Go's `flag.FlagSet` per command. Required surface:

- `parse <color>`: inspection/state.
- `convert <color> --to hex|hex8|rgb|percentage-rgb|hsl|hsv|name`.
- `lighten <color> [--amount 10]`.
- `palette <color> --type complement|splitcomplement|triad|tetrad|analogous|monochromatic`.
- `contrast <first> <second>`: ratio and AA/AAA small/large booleans.
- `--json` on every command; stable object/array output through `encoding/json`.

Usage errors must return status 2, parse/runtime errors status 1, and success 0.
Invalid TinyColor input remains a successful black-like TinyColor value because
that is source behavior; JSON inspection exposes `valid: false`.

### One source of truth for checks

Add `tests/original/verify.mjs` using `node:crypto` to validate
`manifest.sha256` on Windows and Linux. Expand the Makefile:

- `make build` -> `bin/tinycolor`.
- `make test` -> port-owned unit/adapter/differential checks.
- `make verify` -> formatting check, tests, vet, oracle hash verification, and
  all five fixed corpora.
- `make fuzz` and `make bench` -> documented evidence generators.

CI should install pinned Go, Node, and Deno versions; call `make verify`; run the
untouched `deno task test`; and build the binary. Do not duplicate individual
test commands in YAML beyond the Deno-only source-suite check.

### Differential fuzzing

The current `compat/run.mjs` starts `go run` once per case, which is too slow
for a 60-second fuzz session. `fuzz/harness.mjs` should build the Go binary once,
start one JavaScript runner and one Go runner, stream the same JSONL requests to
both, and compare response lines with `isDeepStrictEqual`. Use an explicit
seeded PRNG and public operations already accepted by the adapter. Print a
machine-readable header/footer and every mismatch request. Exit nonzero on any
divergence.

The committed `fuzz/log.txt` must be output from an actual `--duration 60`
session. A deterministic seed makes a mismatch reproducible even though the
case count varies by machine. The fixed corpus remains the correctness gate;
the fuzz run is additional evidence.

### Honest benchmarks

Use `bench/workload.jsonl` as the identical request stream for both runners.
`bench/run.mjs` should build once, measure multiple cold process starts, then
measure a persistent runner for latency and throughput. Compute p99 by sorting
all elapsed samples and selecting `ceil(0.99*n)-1`. Sample peak RSS while each
child is alive: read `/proc/<pid>/status` on Linux and query
`Get-Process -Id <pid>` on Windows. If RSS sampling is unsupported, emit `null`
and a limitation instead of inventing a value.

`bench/results.json` needs timestamp, OS/CPU, Go/Node versions, workload hash,
sample counts, and for each implementation: startup p99, request latency p99,
throughput, and peak RSS. Run both implementations on the same host in one
command and state that results are local observations, not universal speedups.

### Documentation

Rewrite `README.md` for judges but retain the upstream project link and MIT
attribution. Link detailed evidence instead of duplicating it. Expand
`DECISIONS.md` with the CLI dual mode, immutable manifest verification,
standard-library fuzz harness, shared benchmark workload, and honest Deno/video
claim policy. Update `COMPATIBILITY.md` only after commands have produced fresh
results. Add `docs/DEMO.md` as a five-minute live script; video recording remains
a manual submission action.

## Pitfalls

- Go `flag` stops parsing at the first positional argument. Either document
  flags before values or normalize the small supported grammar before parsing;
  tests must lock the chosen syntax.
- Do not make invalid TinyColor inputs CLI errors; that would contradict source
  behavior.
- Keep JSONL stdin mode byte-compatible with existing adapter tests.
- Do not benchmark `go run`; compile once before measuring.
- Do not compare a hot Go function with a cold Node process. Shared workload and
  lifecycle are required.
- A generated zero-divergence log is credible only when duration and seed are
  recorded and the harness itself is checked in.
- `unsafe` is a lexical/code audit for this pure-Go repository; report the exact
  command and count rather than merely saying "safe".
- Go coverage and Deno coverage measure different suites. Report them separately
  and do not describe their percentage difference as behavioral parity.

## Validation Architecture

### Fast feedback

| Change | Command | Expected result |
|---|---|---|
| CLI | `go -C src test ./cmd/tinycolor-compat` | exit 0 |
| Hash verifier | `node tests/original/verify.mjs` | 3 files verified |
| Fuzz harness | `node fuzz/harness.mjs --duration 1 --seed 1` | zero divergences |
| Benchmark runner | `node bench/run.mjs --quick` | valid `bench/results.json` |
| Documentation | `git diff --check` | exit 0 |

### Full phase gate

```powershell
make build
make verify
node fuzz/harness.mjs --duration 60 --seed 20260801
node bench/run.mjs
git diff --check
```

Then verify `tests/original/manifest.sha256` still matches, validate
`bench/results.json` with `JSON.parse`, confirm `fuzz/log.txt` records at least
60 seconds and zero divergences before claiming the bonus, and run
`deno task test` only where Deno is installed.

### Requirement mapping

| Requirement | Automated evidence |
|---|---|
| DEL-01 | CLI tests, `make build`, CI, fuzz run, benchmark JSON, documentation checks |
| QLT-03 | `make verify`, oracle manifest verifier, fixed corpora, clean-checkout CI |

Existing Go tests and JSONL corpora are sufficient infrastructure. No new test
framework or dependency is needed.
