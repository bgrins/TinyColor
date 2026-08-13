# Phase 2: Parsing and Color State - Context

**Gathered:** 2026-08-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Replace the fixed Phase 1 decoder with the complete input behavior in local
`mod.js`: strings, object input, alpha, source format, validity, and normalized
RGBA state. Output formatting beyond the minimal compatibility snapshot belongs
to Phase 3.
</domain>

<decisions>
## Implementation Decisions

### Ownership and boundaries
- @rajeet-04 owns `go/internal/color` and `go/internal/parser` for this phase.
- `go/tinycolor` remains a thin public facade over the internal model; do not
  move formatting, readability, mutations, or palettes into Phase 2.

### Source equivalence
- `mod.js` is authoritative for `inputToRGB`, `bound01`, `boundAlpha`,
  `isValidCSSUnit`, and `stringInputToObject`.
- Preserve source format values: `rgb`, `prgb`, `hsl`, `hsv`, `hex`, `hex8`,
  `name`, and invalid `false` (represented internally without an empty-string
  ambiguity).
- Invalid input is a valid construction result with `Valid=false`, black RGB,
  alpha 1, and no format; it is not a Go parsing error.

### Supported inputs
- Strings: case-insensitive/trimming names, transparent, 3/4/6/8 hex with
  optional `#`, and the permissive RGB(A)/HSL(A)/HSV(A) grammar from source.
- Objects: RGB, HSL, HSV, optional alpha, CSS-unit values, and `FromRatio`.
- Preserve alpha normalization: malformed, negative, or >1 alpha becomes 1;
  numeric zero remains zero.

### Compatibility evidence
- Use generated JSONL corpus records derived from `test.js`; no edits to the
  upstream test file.
- Each mismatch includes input, operation, source result, Go result, owner, and
  suspected package. No global float tolerance.

### the agent's Discretion
- Exact Go private type names and parser helper decomposition.
- Whether name data is generated from `mod.js` during development or checked in
  as generated Go data, provided the committed table comes from this checkout.
</decisions>

<canonical_refs>
## Canonical References

### Upstream behavior
- `mod.js` lines 359-654 — input-to-RGB and conversion paths invoked by parsing.
- `mod.js` lines 1047-1260 — named colors, bounds, regex grammar, and string parser.
- `test.js` lines 274-747 — ratio, RGB, HSL, HEX, HSV, invalid, name, and alpha tests.

### Project contracts
- `AGENT.md` — ownership and non-negotiable parity behavior.
- `docs/ARCHITECTURE.md` — parser/model and adapter layers.
- `docs/TESTING.md` — comparison rules.
- `.planning/phases/01-foundation-and-oracle/01-01-PLAN.md` — stable protocol that Phase 2 must keep working.
</canonical_refs>

<deferred>
## Deferred Ideas

Public output formats, analysis, manipulation, palettes, CLI, CI, benchmarks,
and any syntax not accepted by the local source checkout.
</deferred>

