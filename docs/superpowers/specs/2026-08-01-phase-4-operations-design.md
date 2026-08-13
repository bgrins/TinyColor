# Phase 4 Operations Design

## Scope

Port the remaining TinyColor operational behavior in three independently
verifiable slices:

1. Mutating instance modifiers and pure utility operations: lighten, brighten,
   darken, saturate, desaturate, greyscale, spin, and mix.
2. WCAG readability operations: readability, isReadable, and mostReadable.
3. Combination operations: complement, analogous, monochromatic, split
   complement, triad, and tetrad.

## Architecture

`src/tinycolor` remains the single Go facade over the normalized parser/model.
It owns source-equivalent conversion-based operations and mutable `Color`
instance methods. The JSONL runners only whitelist and dispatch these public
methods; they do not contain conversion, palette, or WCAG formulas.

Each slice receives direct Go regression tests and fixed JSONL cases evaluated
against the immutable local `mod.js` oracle. The Go API uses explicit typed
arguments; the compatibility adapter owns JavaScript truthiness/default coercion
where it cannot be represented in that API.

## Behavioral Constraints

- Match source defaults, including explicit zero amounts, clamping, hue
  wrapping, alpha preservation, and receiver mutation for instance modifiers.
- Keep utility and palette results independent of their inputs, preserve source
  result order, and retain source palette defaults.
- Implement WCAG option defaults and fallback-color recursion exactly. Do not
  use a broad numeric tolerance in the differential runner.
- Use only the Go standard library and do not change the JavaScript oracle.

## Verification

Each slice follows red-green-refactor with a focused Go test and a fixed
Node-to-Go JSONL corpus. After every micro-commit, run its focused test and
corpus. Phase completion requires `go test ./...`, `go vet ./...`, all prior
corpora, the Phase 4 corpus, `git diff --check`, and no diff under `mod.js`,
`test.js`, or `tinycolor.js`.