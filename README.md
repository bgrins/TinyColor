# TinyColor Go port

An idiomatic Go port of the behavior in the pinned
[`bgrins/TinyColor`](https://github.com/bgrins/TinyColor) checkout. The
JavaScript source remains in this repository as an immutable oracle. Exact
JSONL differential checks and a byte-identical original-suite runner exercise
the compiled Go port without modifying the source tests.

Source commit: `b49018c9f2dbca313d80d7a4dad25e26143cfe01`. TinyColor and this port retain
Brian Grinstead's MIT license in [`LICENSE`](LICENSE). The original JavaScript
project documentation remains available in the upstream repository history.

## Build once

Requirements: Go 1.26+, Node.js, and GNU Make.

```sh
make build
```

This creates `bin/tinycolor` on Linux/macOS or `bin/tinycolor.exe` on Windows.
Docker produces the same runnable CLI in one command:

```sh
docker build -t tinycolor-go .
docker run --rm tinycolor-go parse --json red
```

## Try it in GitHub Codespaces

[![Open in GitHub Codespaces](https://github.com/codespaces/badge.svg)](https://codespaces.new/rajeet-04/TinyColor?ref=rajeet&quickstart=1)

The Codespaces environment installs Go, Node.js, Deno, and GNU Make, then
builds the native CLI. In the terminal, run:

```sh
./bin/tinycolor parse --json red
./bin/tinycolor convert --to hsl --json red
./bin/tinycolor palette --type triad --json red
```

The browser launch link opens the `rajeet` branch used for this submission.

## CLI

```sh
./bin/tinycolor parse --json red
./bin/tinycolor convert --to hsl --json red
./bin/tinycolor lighten --amount 10 --json '#000'
./bin/tinycolor palette --type triad --json red
./bin/tinycolor contrast --json '#000' '#fff'
```

Remove `.exe` from the examples on Unix; add it on Windows. Without `--json`,
commands print human-readable output. `convert` supports `hex`, `hex8`, `rgb`,
`percentage-rgb`, `hsl`, `hsv`, and `name`; `palette` supports `complement`,
`splitcomplement`, `triad`, `tetrad`, `analogous`, and `monochromatic`.

## Go package

The Go module lives under `src/`:

```go
package main

import (
    "fmt"

    "github.com/rajeet-04/tinycolor-go/tinycolor"
)

func main() {
    color, _ := tinycolor.FromCompat("#336699", false)
    color.Lighten(10)
    fmt.Println(color.ToHSLString())
}
```

## Verify parity

```sh
make verify
node tests/original-go/run.mjs
deno test test.js
```

`make verify` checks formatting, the three kickoff hashes in
[`tests/original/manifest.sha256`](tests/original/manifest.sha256), Node and Go
tests, all fixed differential corpora, the recorded fuzz log, the byte-identical
original suite against Go, and `go vet`. The direct Deno command separately
checks the untouched source oracle. Both original-suite runs report 45 passed,
0 failed, and the same upstream `polyad` test ignored.

Evidence:

- [Compatibility matrix](COMPATIBILITY.md) — fixed-corpus, Deno, coverage, and safety counts.
- [Differential fuzz log](fuzz/log.txt) and [reproduction guide](fuzz/README.md) — 60.012 seconds, seed 20260801, 1,091,630 cases, zero divergences.
- [Benchmark results](bench/results.json) and [methodology](bench/methodology.md) — same-host startup p99, latency p99, throughput, and peak RSS.
- [Architectural decisions](DECISIONS.md), [architecture](docs/ARCHITECTURE.md), [testing](docs/TESTING.md), and [team ownership](docs/TEAM-OWNERSHIP.md).
- [Five-minute demo script](docs/DEMO.md).
- [GitHub Actions runs for `rajeet`](https://github.com/rajeet-04/TinyColor/actions?query=branch%3Arajeet).

## Repository layout

```text
src/             Go module, public API, and CLI
tests/original/  kickoff hash manifest and verifier
tests/original-go/ byte-identical suite runner and test-only Go facade
tests/port/      port-owned adapter tests
compat/          JSONL oracle, driver, and fixed corpora
fuzz/            differential harness and 60-second log
bench/           shared workload, runner, methodology, and results
docs/            architecture, testing, ownership, and demo guide
```

## Known limits

- Compatibility is claimed for the pinned checkout and measured public corpus,
  not every future TinyColor revision or arbitrary JavaScript coercion.
- Random colors are checked by validity/range invariants because independent
  runtimes do not share a random stream.
- Benchmark figures are observations from one host, not universal speedup
  claims.
- The required demo video must still be recorded, uploaded, and linked by a
  human; no video URL is claimed in this repository yet.

## Submission checklist

- [x] Public source URL and pinned kickoff commit recorded.
- [x] One-command native and Docker builds documented.
- [x] Immutable oracle hashes and byte-identical original suite verified against Go.
- [x] Exact fixed-corpus and 60-second differential evidence published.
- [x] Same-host benchmark methodology and results published.
- [x] Decisions, ownership, limitations, and demo script documented.
- [ ] Five-minute demo video recorded and published.
