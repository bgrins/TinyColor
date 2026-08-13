# Delivery Plan — TinyColor.js to Go

## Outcome

Ship an independent Go library and CLI that reproduce the behavior of this
checkout's `mod.js`, prove parity with a repeatable Node-to-Go differential
harness, and explain every known difference. The original JavaScript source
remains intact in the repository.

## Guardrails

- Compatibility is against the checked-out source, not a remembered npm API.
- The port uses only the Go standard library unless a dependency is approved in
  `DECISIONS.md`.
- Do not claim whole-suite parity while `deno task test` is unavailable.
- A zero mismatch report covers only the exercised corpus; label the corpus and
  command precisely.

## Waves

| Wave | Scope | Owners | Exit gate |
|---|---|---|---|
| 0 | Baseline and oracle protocol | C, D | one JSON case reaches Node and Go |
| 1 | Color model plus HEX/RGB/name parsing | A, C | parser corpus is differential-green |
| 2 | HSL/HSV, conversion, formatting, analysis | A, B, C | conversion and output corpus is green |
| 3 | Mutation, utilities, readability, palettes | B, C | source categories are represented and green |
| 4 | CLI, CI, benchmarks, release documentation | D, all | clean checkout can verify and demonstrate |

## Wave 0 — Foundation and behavioral oracle

1. Create `src/` as an independent module; add a minimal public package, a JSON
   Lines request/response protocol, and a Go runner executable. Implement only
   the fixed smoke-corpus inputs needed to prove the protocol; all generalized
   parsing and public API behavior remains in later waves.
2. Add `compat/js-runner.mjs`, which imports local `./mod.js`, accepts the same
   request object, and serializes values deterministically. The process must
   report structured errors rather than swallowing JavaScript exceptions.
3. Add a differential driver that launches both runners, normalizes JSON
   numbers only where JSON itself requires it, and emits each mismatch with
   case ID, operation, source output, Go output, and suspected package.
4. Seed `compat/cases/smoke.jsonl` from existing tests: `red`, `#000`, invalid
   text, transparent, `rgba(255, 0, 0, .5)`, HSL, HSV, objects, and `fromRatio`.
5. Record baseline tool versions and the missing-Deno constraint in
   `COMPATIBILITY.md`.

**Gate:** `node compat/run.mjs compat/cases/smoke.jsonl` exits non-zero until
the Go operation exists, then exits zero and prints a case count and mismatch
count. The original JavaScript files remain unmodified (`git diff --` shows no
changes under the oracle paths).

## Wave 1 — Normalized model and parser parity

1. Define private normalized RGBA storage, validity, detected format, original
   input metadata, and explicit Go input structs. Keep the dynamic decoder only
   in the compatibility boundary.
2. Port `bound01`, `boundAlpha`, percentage conversion, and hue wrapping before
   implementing parsers. Add boundary regressions for negative, overflow,
   `1`, `1.0`, `%`, alpha, and invalid values.
3. Implement HEX (`3/4/6/8`), RGB/RGBA, CSS percentage RGB, HSL/HSLA,
   HSV/HSVA, named colors, and `transparent` by following `stringInputToObject`
   and `inputToRGB` in `mod.js` exactly.
4. Convert every parser-related `Deno.test` group into JSONL cases or explicit
   Go table cases that invoke both runners. Do not hand-copy expected outputs
   from memory.

**Gate:** all cases categorized Parsing, Object Input, Invalid Input, Names,
and Alpha normalize with zero unexplained mismatches. `COMPATIBILITY.md` names
the corpus revision and count.

## Wave 2 — Conversion, representation, and analysis

1. Port RGB↔HSL, RGB↔HSV, RGB/hex/ARGB conversion with JavaScript-equivalent
   rounding at each observable boundary.
2. Implement `ToRGB`, percentage RGB, HSL, HSV, hex/hex8, name, filter, and
   general string formatting. Test alpha fallback in `toString` and compact
   hex behavior independently.
3. Implement brightness, luminance, `IsDark`, `IsLight`, equality, random
   (injectable randomness for tests), and cloning behavior.
4. Add exact-string and exact-number cases from the existing conversion,
   formatting, filter, and analysis tests.

**Gate:** all output strings match byte-for-byte; numeric JSON fields match
source results or a documented IEEE-754 serialization normalization. No blanket
epsilon comparison is allowed.

## Wave 3 — Manipulation and combinations

1. Implement static and instance equivalents of lighten, brighten, darken,
   saturate, desaturate, greyscale, and spin. Verify defaults, explicit zero,
   clamping, hue wrap, alpha preservation, and receiver mutation.
2. Implement `Mix`, readability, `IsReadable`, and `MostReadable` using the
   source decision paths and WCAG option defaults.
3. Implement complement, analogous, monochromatic, split complement, triad,
   and tetrad; preserve output order and source default counts.
4. Add seeded randomized inputs and preserve every discovered mismatch as a
   deterministic JSONL regression before fixing it.

**Gate:** source categories Modifications, Spin, Mix, Readability, and every
palette family are covered by deterministic cases; fuzz seeds reproduce every
failure.

## Wave 4 — Submission-quality delivery

1. Add a `tinycolor` CLI with `parse`, `convert`, `lighten`, `palette`, and
   `contrast` commands. Its `--json` output must use the compatibility schema.
2. Add GitHub Actions for Go formatting, tests, vet, differential smoke tests,
   and platform builds. Keep Node as the oracle runtime; add Deno source-test
   execution only when its runner is provisioned in CI.
3. Add Go benchmarks for parsing, conversion, manipulation, allocations, and
   the documented Node comparison methodology. Do not claim direct speedups
   from incomparable machines or workloads.
4. Finish README additions, architecture, testing guide, demo script,
   compatibility matrix, decisions, and attribution/license notices.

**Gate:** a new contributor can clone, run the documented setup, execute Go
tests and the differential report, use the CLI, read performance methodology,
and see the known-difference list.

## Explicitly deferred

- Any behavior outside the current `mod.js` and `test.js` checkout.
- CSS Color Level 4 syntaxes not accepted by this source.
- Replacing the Go API with a JavaScript interpreter or vendoring TinyColor.
- A GUI, web service, or package publication before parity evidence exists.

## Risk controls

| Risk | Control |
|---|---|
| JavaScript coercion differs from Go | keep coercion in adapter; turn each mismatch into a fixture |
| Floating point string drift | compare rendered strings; document only narrow JSON normalization |
| Unchanged tests are hard to call from Go | use JSONL adapters, never edit `test.js` |
| Four people collide | enforce module ownership and wave gates |
| Deno is absent locally | Node adapter is the working oracle; mark Deno suite unverified |
