# Testing strategy

| Layer | Purpose | Command |
|---|---|---|
| Full local gate | Format, hashes, unit, differential, fuzz-log, vet | `make verify` |
| Original suite against Go | Byte-identical upstream assertions served by native Go | `node tests/original-go/run.mjs` |
| Original source suite | Untouched upstream implementation behavior | `deno test test.js` |
| Go unit/coverage | Package behavior and honest coverage | `go -C src test -cover ./...` |
| Fixed differential | Exact JS/Go response parity | `node compat/run.mjs compat/cases/operations.jsonl` |
| Fuzz smoke | Seeded broad exact comparison | `node fuzz/harness.mjs --duration 1 --seed 20260801` |
| Fuzz evidence | Validate recorded 60-second run | `node fuzz/validate-log.mjs fuzz/log.txt` |
| Benchmark smoke | Real quick measurement to temporary output | `node bench/run.mjs --quick --output <temporary-path>` |
| Benchmark evidence | Full same-host measurement | `node bench/run.mjs --output bench/results.json` |

Strings, booleans, arrays, errors, formats, and parsed numeric results are
compared exactly. No global epsilon is used. Every discovered mismatch becomes
a deterministic regression before the shared implementation boundary is fixed.

The fixed corpora cover source-test inputs, permissive and malformed parsing,
numeric boundaries, alpha and hue behavior, conversions, mutation, WCAG
readability, mixing, and ordered palettes. Random output is invariant-tested.

The Go-backed runner verifies the kickoff manifest, copies `test.js` without
changing its bytes, and places a test-only `mod.js` facade beside it in a
temporary directory. The facade invokes the compiled Go binary directly and is
removed with the temporary overlay after the run.
