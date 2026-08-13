# Phase 3: Conversion and Representation - Research

**Researched:** 2026-08-01  
**Domain:** TinyColor JavaScript-to-Go conversion, representation, and analysis compatibility  
**Confidence:** HIGH

## User Constraints

No `03-CONTEXT.md` exists. The phase remains constrained by the roadmap, requirements, `AGENT.md`, and the immutable local TinyColor oracle.

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|---|---|---|
| FMT-01 | Reproduce color conversion and every documented output representation. | Map source output/analysis methods from `mod.js` and add operation-level differential cases for every observable result. |
| QLT-02 | Record every mismatch with complete reproducer and owner. | Keep every output case as one JSONL request, let `compat/run.mjs` emit the request plus both results, and assign output/conversion mismatches to B (`src/tinycolor`) or protocol mismatches to C (`compat`). |
</phase_requirements>

## Project Constraints (from AGENT.md)

- `mod.js`, `test.js`, `tinycolor.js`, `npm/`, `dist/`, and `demo/` are immutable JavaScript oracle material; do not change them to obtain parity.
- Implement port behavior only under `src/`; put adapters, generated fixtures, and mismatch reports under `compat/`.
- Preserve TinyColor quirks: precision until observable rounding, alpha normalization, detected-format fallback, invalid-as-black output, and permissive source behavior. Do not introduce a broad floating-point tolerance.
- Keep the public Go API explicit and idiomatic, but preserve dynamic source quirks at the JSON compatibility boundary.
- B owns `src/tinycolor` conversion/formatting/analysis; C owns `compat`, corpus/schema, and mismatch reporting. Do not change A's parser/model contract unilaterally.
- Required phase checks are `go test ./...`, `go vet ./...`, `node compat/js-runner.mjs <cases.json`, and `go test -run TestDifferential ./...`; Deno is unavailable locally, so no source-suite pass can be claimed.

## Summary

Phase 2 already supplies the right substrate: `color.Model` retains floating RGB channels, alpha, validity, detected format, and original input; `parser` normalizes all supported input forms. Phase 3 should add public output and analysis methods to `src/tinycolor/color.go`, using the model without reparsing or adding dependencies. The partial `Color.String`, `rgbToHSL`, and `rgbToHSV` implementations in that file are Phase-1 scaffolding and must be replaced or reused behind the complete source-equivalent methods rather than becoming a second conversion implementation.

The authoritative behavior is the local `mod.js`, not a CSS or Go color library. In particular, its observable contract includes formatting decisions and legacy output: lower-case hex, source-style `Math.round` values, alpha rounded to two decimal places in strings, `toName` returning `false` except for alpha-zero `transparent`, ARGB order in `toFilter`, and `toString` falling back according to both input format and whether the caller explicitly supplied a format. It also defines analysis in terms of rounded RGB output. These are compatibility requirements, not opportunities to make the Go API more idiomatic.

The present JSONL runners only support `inspect`, `string`, and `fromRatio`; that surface cannot prove FMT-01. Extend both runners with narrowly named output/analysis/equality/clone operations and a fixed conversion corpus. Retain the existing protocol and `string` request behavior so Phase-1/2 corpora stay executable.

**Primary recommendation:** Implement all Phase-3 conversion, formatting, and analysis as methods on `tinycolor.Color`; add matching thin Node/Go adapter dispatch and source-derived JSONL cases, with exact comparison for every deterministic operation.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---|---:|---|---|
| Go standard library (`math`, `strconv`, `fmt`) | Go 1.26.1 installed | conversion math, source-style rounding/formatting, numeric text | Project decision D-005 requires standard library first; all source algorithms are small and already represented by the model. |
| Local `mod.js` / `test.js` | checked-out oracle | behavioral specification and expected cases | D-001 selects this exact checkout as the parity target. |
| Existing JSONL harness (`compat/`) | repository-local | Node-to-Go exact differential evidence | D-004 selects JSONL adapters; it records complete reproductions instead of approximate assertions. |

### Supporting

| Library | Version | Purpose | When to Use |
|---|---:|---|---|
| Go `math/rand/v2` | Go 1.26.1 installed | non-deterministic public `Random` equivalent | Only for the source-like random-color API; corpus validation must test invariants, not equality across independent random generators. |

### Alternatives Considered

| Instead of | Could Use | Tradeoff |
|---|---|---|
| Source algorithms over `Model` | `image/color`, third-party CSS/color library | Reject: different rounding, alpha/string conventions, and no TinyColor `toFilter`/format-fallback contract. |
| Fixed JSONL source differential cases | broad floating-point tolerance | Reject: QLT-02 and `AGENT.md` require observable mismatches to be preserved and diagnosed. |
| `math/rand/v2` for public random values | shared seeded JS/Go random stream | Reject for Phase 3: TinyColor calls ambient `Math.random()`; a shared generator would invent a non-source API. Test only output invariants. |

**Installation:** None. Do not add a dependency.

**Version verification:** Node `v24.18.0` and Go `go1.26.1 windows/amd64` are installed. The source suite's Deno executable is absent, as recorded in `.planning/STATE.md`.

## Architecture Patterns

### Recommended Project Structure

```text
src/
├── internal/color/model.go       # existing normalized RGBA + validity + format contract
├── internal/parser/              # existing input normalization; Phase 3 does not change it
├── tinycolor/color.go            # B: conversion, output, clone/equality/random/analysis API
└── cmd/tinycolor-compat/main.go  # thin Go JSONL operation dispatch only
compat/
├── js-runner.mjs                 # thin local-mod.js operation dispatch only
├── run.mjs                       # unchanged comparator/report writer
└── cases/conversion.jsonl        # C: deterministic FMT-01/QLT-02 corpus
```

### Pattern 1: Preserve normalized state, round only at the source-observable boundary

**What:** Build conversions from `Color.model.R/G/B/A`; preserve floating channels through `toHsl`, `toHsv`, and percentage calculation, and round only where the corresponding TinyColor method calls `Math.round`.

**When to use:** Every conversion/output method in `src/tinycolor/color.go`.

**Source evidence:** `mod.js` lines 69-217 define `toHsv`, `toHsl`, RGB/percentage/hex methods; lines 428-645 define the conversion and hex helpers. `docs/ARCHITECTURE.md` likewise requires internal channels to retain precision until an observable method rounds.

```go
// Source: local mod.js rgbToHsl/toHslString contract.
func (c Color) HSL() HSL { // h in degrees; s/l and alpha remain fractional
    h, s, l := rgbToHSL(c.model.R, c.model.G, c.model.B)
    return HSL{H: h * 360, S: s, L: l, A: c.model.A}
}

func (c Color) HSLString() string {
    h := c.HSL()
    // Use source-equivalent integer rounding only in this representation.
    // Return hsl/hsla depending on A == 1.
}
```

The eventual exported field/type names are planner discretion, but no output method should mutate `Model` and no method should parse its own string output.

### Pattern 2: One internal formatter per source primitive; public methods compose it

**What:** Implement small private helpers corresponding to source primitives: RGB/HSL/HSV conversion, channel rounding, decimal-alpha-to-hex, RGB hex, RGBA hex, and ARGB hex. Public `ToHex*`, `ToFilter`, and `ToString` compose those helpers.

**When to use:** When one source conversion is shared by several public methods.

**Source evidence:** `mod.js` lines 573-635 use `rgbToHex`, `rgbaToHex`, and `rgbaToArgbHex` for all hex/filter variants.

**Do not split helpers into an abstraction package.** They belong beside `Color` because they define this facade's observable source behavior.

### Pattern 3: Keep compatibility dispatch thin and operation-specific

**What:** Add the same named operations to `compat/js-runner.mjs` and `src/cmd/tinycolor-compat/main.go`; each constructs a color once and calls the public method. Keep `compat/run.mjs` generic.

**When to use:** To expose every deterministic Phase-3 behavior to the existing JSONL differential driver.

Suggested stable operations:

| Operation | Request fields | Result |
|---|---|---|
| `output` | `input`, `args.method`, optional flags/options | the exact result of one `to*` method |
| `analysis` | `input`, `args.method` | brightness, luminance, `isDark`, or `isLight` result |
| `equals` | `input`, `args.other` | source static equality result |
| `clone` | `input` | an `inspect` record of `color.clone()` |
| `randomInvariant` | no input | `{valid, alpha, rgbInRange}`; never compare an independent random color string |

For new constructor options use a nested field such as `args.options`, leaving current `string` requests' `args.format` meaning unchanged. This is needed because source `toFilter` reads constructor `gradientType` and source format fallback can be overridden by constructor `format`.

### Pattern 4: Source-compatible clone/equality are representations, not structural operations

**What:** Implement clone by reparsing the source-equivalent generic string, and equality by comparing source-equivalent `toRgbString` values after the source's falsy-input guard.

**When to use:** `Clone` and static `Equals` only.

**Source evidence:** `mod.js` lines 244-246 define `clone` as `tinycolor(this.toString())`; lines 637-640 define equality as `!color1 || !color2` then a `toRgbString()` comparison. Thus clone can normalize its detected format and equality deliberately compares two-decimal alpha text, not raw float fields.

### Anti-Patterns to Avoid

- **Using `Color.String` as the complete API:** It currently covers only the Phase-1 snapshot and has no requested-format/short-hex/filter surface. Replace its branching with the canonical `ToString(format)` path and keep `String()` as a no-argument delegation if needed.
- **Rounding at parse/conversion time:** This breaks round trips and causes failures at half/percentage boundaries. Store parsed floats; round only as `mod.js` does per method.
- **Treating `toName` as a map lookup only:** alpha `0` must return `transparent`; alpha in `(0,1)` returns boolean false; missing opaque names also return false.
- **Comparing raw Go floats for equality:** source equality uses formatted `toRgbString`, including alpha rounded to two decimal places.
- **Making random corpus cases exact:** JavaScript `Math.random()` and Go random values are independent. Exact cross-run comparison will produce false mismatches.

## Don't Hand-Roll

| Problem | Don't Build | Use Instead | Why |
|---|---|---|---|
| Color state re-normalization | a second RGBA/format model | existing `internal/color.Model` | It already preserves the Phase-2 parser contract (float channels, alpha, validity, format, original input). |
| Dynamic parity test framework | a new custom runner/report format | existing JSONL `compat/js-runner.mjs`, Go runner, and `compat/run.mjs` | The driver already compares exact JSON and emits request, both outputs, operation, owner, and suspected package. |
| Generic CSS/color formatting library | an external formatter | direct source-derived helpers in `src/tinycolor/color.go` | TinyColor's legacy formatting/fallback/filter behavior is the requirement. |
| Production random generator | custom PRNG or cross-language seed protocol | Go `math/rand/v2` | The source has no seedable public random API; only range/validity is observable parity. |

**Key insight:** The port should reuse the parser/model and differential harness; only the source-defined public behavior needs code. A general color framework would create more incompatible surface than it removes.

## Common Pitfalls

### Pitfall 1: Losing source formatting semantics behind correct RGB values

**What goes wrong:** Numeric conversion looks right, but `toString`, short hex, alpha hex, `toName`, or `toFilter` differs.

**Why it happens:** TinyColor has separate helpers and fallback rules: `toString` detects whether its format argument was explicitly supplied; it forces RGBA only for implicit non-alpha formats with alpha in `[0,1)`.

**How to avoid:** Test each output method directly, including `hex`/`hex3`/`hex4`/`hex8`/`hex6`, `name`, `hsl`, `hsv`, `rgb`, `prgb`, an unknown requested format, alpha `0`, alpha in `(0,1)`, and alpha `1`.

**Warning signs:** A universal "if alpha < 1 then rgba" branch, `toString("name")` returning RGBA, or any uppercase/non-`#` hex string.

### Pitfall 2: Wrong hex-alpha ordering or rounding

**What goes wrong:** `toHex8` appears correct but filter output differs, particularly at `.5` alpha.

**Why it happens:** `toHex8` is RGBA (`rrggbbaa`); `toFilter` uses ARGB (`aarrggbb`). Alpha uses `Math.round(a * 255)`, so `.5` is `80`.

**How to avoid:** Share distinct RGBA and ARGB helpers and pin `red`, `transparent`, `#f0f0f0dd`, `.5` alpha, and four-character compression cases in the corpus.

**Warning signs:** A filter ending in `#ff000080` instead of source `#80ff0000`, or `7f` for alpha `.5`.

### Pitfall 3: Equal colors judged by raw precision instead of source output

**What goes wrong:** Equal source colors fail after different parse/conversion paths, or Go equality disagrees for close alpha values.

**Why it happens:** `tinycolor.equals` compares `toRgbString()` text after a JavaScript truthiness guard. String alpha uses `_roundA`, rounded to two decimals.

**How to avoid:** Use the public RGB string formatter in equality; cover source cases `#ff000066`/`.4`, `#f009`/`.6`, percentage RGB, differing alpha, and falsy input.

**Warning signs:** Equality code directly compares `Model` fields or omits the source-like falsy guard at the adapter boundary.

### Pitfall 4: Making constructor options unreachable in the differential path

**What goes wrong:** Generic strings pass but `toFilter` cannot produce `GradientType = 1`, and `toString` format-override cases cannot be represented.

**Why it happens:** Existing adapters ignore normal-constructor options; `fromRatio` currently forwards options only in Node, while Go `FromCompat` has no options parameter.

**How to avoid:** Add an explicit compatibility-only construction-options field for new operations and route it through both runners without changing existing request meanings. Keep typed Go API options explicit rather than adding dynamic maps everywhere.

**Warning signs:** A test must mutate internals or omit the gradient case because the adapter cannot build it.

### Pitfall 5: Claiming random differential parity

**What goes wrong:** The differential report is flaky or a test incorrectly claims exact JS/Go random equality.

**Why it happens:** Source `tinycolor.random` calls ambient `Math.random()` three times and exposes no seeding hook.

**How to avoid:** Document non-determinism, test each implementation's invariant independently (valid, alpha 1, channels 0..255), and reserve exact differential corpus cases for deterministic behavior.

**Warning signs:** A corpus contains `random` expecting a fixed RGB/hex result.

## Code Examples

Verified patterns from the local oracle:

### Source-compatible generic-string fallback

```go
// Source: mod.js toString (lines 191-242).
// `formatSet` means a caller explicitly requested this representation.
func (c Color) ToString(format string, formatSet bool) string {
    hasAlpha := c.model.A < 1 && c.model.A >= 0
    if !formatSet && hasAlpha && isNonAlphaFormat(format) {
        if format == "name" && c.model.A == 0 {
            return c.ToNameString() // "transparent"
        }
        return c.ToRGBString()
    }
    // Dispatch rgb/prgb/hex/hex3/hex4/hex8/name/hsl/hsv.
    // Unknown or unavailable name falls back to six-digit #hex.
}
```

The public API should distinguish an omitted format from an explicitly supplied empty/unknown format. The compatibility adapter has that information from JSON request shape; a Go convenience `String()` can always call the omitted-format path.

### Exact ARGB filter construction

```go
// Source: mod.js toFilter and rgbaToArgbHex (lines 163-189, 624-635).
func (c Color) ToFilter(second *Color, gradientType bool) string {
    start := "#" + c.argbHex()
    end := start
    if second != nil {
        end = "#" + second.argbHex()
    }
    prefix := ""
    if gradientType {
        prefix = "GradientType = 1, "
    }
    return "progid:DXImageTransform.Microsoft.gradient(" + prefix +
        "startColorstr=" + start + ",endColorstr=" + end + ")"
}
```

### Differential fixture shape

```json
{"id":"fmt-hex8-half-alpha","operation":"output","input":"rgba(255, 0, 0, .5)","args":{"method":"toHex8String"}}
{"id":"fmt-filter-second","operation":"output","input":"transparent","args":{"method":"toFilter","secondColor":"red"}}
{"id":"analysis-brightness-threshold","operation":"analysis","input":"#777","args":{"method":"isDark"}}
{"id":"equal-alpha-string","operation":"equals","input":"#ff000066","args":{"other":"rgba(255, 0, 0, .4)"}}
```

Each JSONL row is independently runnable through `node compat/run.mjs compat/cases/conversion.jsonl`, satisfying QLT-02's complete reproducer requirement.

## State of the Art

| Old Approach | Current Approach | When Changed | Impact |
|---|---|---|---|
| Phase-1 `Color.String` manually covered a small output subset | Phase 3 should make source-method equivalents the canonical conversion/formatting surface | This phase | Avoids divergence between adapter snapshots and public output methods. |
| Fixed smoke/parser corpus only used `inspect`, `string`, and `fromRatio` | Operation-level output/analysis corpus | This phase | Makes FMT-01 and QLT-02 measurable for every deterministic behavior. |

**Deprecated/outdated:** Do not retain the comment in `src/tinycolor/color.go` that calls `String` the complete output API; it explicitly says full output APIs are Phase-3 work.

## Open Questions

1. **What exact exported Go signatures should represent boolean-or-string `toName` and optional formatting flags?**
   - What we know: the compatibility adapter may return JSON `false` or a string; the public Go API should be explicit per `AGENT.md`.
   - What's unclear: whether the project prefers `(string, bool)` for name lookup and separate `ToString(format string)` / `String()` methods, or a compatibility-shaped `any` method.
   - Recommendation: use idiomatic `(string, bool)` for typed `ToName`; preserve `false` only in the adapter. Use a small private formatting dispatcher so `String()` represents omitted format and `ToString(format)` represents explicit format.

2. **How should normal constructor options be represented in the JSONL protocol?**
   - What we know: source options affect `_format` and `_gradientType`; existing normal constructor operations cannot pass them, while Node `fromRatio` forwards `args`.
   - What's unclear: the exact new `args` schema.
   - Recommendation: C defines one backwards-compatible nested `args.options` object for new operations, tests it with `{format:"name"}` and `{gradientType:true}`, and adds a Go compatibility construction helper rather than changing parser state.

3. **How far should random parity go?**
   - What we know: source uses unseeded `Math.random`; exact cross-runtime outputs are not comparable.
   - What's unclear: whether a user-facing seeded API is desired later.
   - Recommendation: do not add a seeded public API in this phase. Document invariant-only parity in `COMPATIBILITY.md`; add seed injection only if a later requirement explicitly needs reproducible random output.

## Environment Availability

| Dependency | Required By | Available | Version | Fallback |
|---|---|---:|---|---|
| Node.js | local JavaScript oracle and differential runner | ✓ | v24.18.0 | — |
| Go | port tests and Go JSONL runner | ✓ | go1.26.1 windows/amd64 | — |
| Deno | untouched source test suite | ✗ | — | Use Node JSONL differential evidence locally; run `deno task test` once Deno is installed/CI provides it. |

**Missing dependencies with no fallback:** None for Phase-3 implementation and differential validation. Deno remains required for the later source-suite gate, but is not needed to execute the existing local oracle adapter.

**Missing dependencies with fallback:** Deno — Node plus `compat/run.mjs` provides local differential evidence but does not constitute a Deno source-suite pass.

## Validation Architecture

### Test Framework

| Property | Value |
|---|---|
| Framework | Go standard `testing` (Go 1.26.1); Node JSONL differential harness; upstream Deno tests unavailable locally |
| Config file | `src/go.mod`; `deno.json` for immutable upstream suite |
| Quick run command | `Set-Location src; go test ./tinycolor ./internal/...; Set-Location ..; node compat/run.mjs compat/cases/conversion.jsonl` |
| Full suite command | `Set-Location src; go test ./...; go vet ./...; Set-Location ..; node tests/port/adapter.test.mjs; node compat/run.mjs compat/cases/smoke.jsonl; node compat/run.mjs compat/cases/parser-hex-rgb.jsonl; node compat/run.mjs compat/cases/parser.jsonl; node compat/run.mjs compat/cases/conversion.jsonl` |

### Phase Requirements → Test Map

| Req ID | Behavior | Test Type | Automated Command | File Exists? |
|---|---|---|---|---|
| FMT-01 | RGB/percentage RGB/HSL/HSV object and string output; six/three/eight/four hex; name; generic fallback | Go unit + Node/Go differential | `node compat/run.mjs compat/cases/conversion.jsonl` | ❌ Wave 0 |
| FMT-01 | legacy ARGB `toFilter`, optional second color, gradient type | Go unit + differential | `node compat/run.mjs compat/cases/conversion.jsonl` | ❌ Wave 0 |
| FMT-01 | brightness, luminance, dark/light, clone, equality, random invariants | Go unit + deterministic differential except random | `Set-Location src; go test ./tinycolor; Set-Location ..; node compat/run.mjs compat/cases/conversion.jsonl` | ❌ Wave 0 |
| QLT-02 | mismatch has request, JS result, Go result, operation, and owner | integration/report | `node compat/run.mjs compat/cases/conversion.jsonl` | ✅ driver; ❌ conversion corpus |

### Sampling Rate

- **Per task commit:** `Set-Location src; go test ./tinycolor ./internal/...; Set-Location ..; node compat/run.mjs compat/cases/conversion.jsonl`
- **Per wave merge:** full suite command above.
- **Phase gate:** full suite green, conversion corpus zero mismatches, and `COMPATIBILITY.md` records both the evidence and any non-deterministic-random limitation before `/gsd:verify-work`.

### Wave 0 Gaps

- [ ] `compat/cases/conversion.jsonl` — deterministic FMT-01 cases grouped by all output methods, alpha/fallback rules, filter options, analysis, clone, and equality.
- [ ] `src/tinycolor/color_test.go` additions — direct source-derived output and analysis tests plus random invariant test.
- [ ] `tests/port/adapter.test.mjs` additions — every newly dispatched adapter operation has success/error protocol coverage.
- [ ] `src/cmd/tinycolor-compat/main.go` / `compat/js-runner.mjs` operation dispatch — adapter surface needed for the corpus.
- [ ] `COMPATIBILITY.md` Phase-3 evidence row and any complete unresolved mismatch records, owned B or C.

## Sources

### Primary (HIGH confidence)

- Local [mod.js](../../../mod.js) — constructor state and public output/analysis methods (lines 5-246); conversion/hex/equality/random helpers (lines 359-645); rounding/bounds helpers (lines 1058-1129).
- Local [test.js](../../../test.js) — source expectations for clone/random (lines 87-114), output/alpha/name/analysis (lines 698-942), conversion round trips (lines 945-1103), equality (lines 1105-1125), and filters (lines 1371-1398).
- Local [AGENT.md](../../../AGENT.md) — immutable oracle, compatibility, ownership, and verification constraints.
- Local [docs/ARCHITECTURE.md](../../../docs/ARCHITECTURE.md) and [DECISIONS.md](../../../DECISIONS.md) — model/facade/adapter boundaries and standard-library-first decision.
- Local [compat/js-runner.mjs](../../../compat/js-runner.mjs), [compat/run.mjs](../../../compat/run.mjs), and [src/cmd/tinycolor-compat/main.go](../../../src/cmd/tinycolor-compat/main.go) — current protocol and missing operation coverage.

### Secondary (MEDIUM confidence)

None. The checked-out source and its source tests are the selected behavior authority.

### Tertiary (LOW confidence)

None.

## Metadata

**Confidence breakdown:**

- Standard stack: HIGH — repository decisions mandate standard library, local oracle, and JSONL harness.
- Architecture: HIGH — direct inspection of the model/parser/facade/adapters and source implementation.
- Pitfalls: HIGH — each is tied to a source branch or test assertion.

**What might have been missed:** The immutable `test.js` is not runnable locally because Deno is unavailable, so its listed cases were inspected rather than executed. Add Phase-3 cases to the JSONL corpus now and run `deno task test` when Deno becomes available; do not claim that pass beforehand.

**Research date:** 2026-08-01  
**Valid until:** Stable for this pinned local source; revisit if the selected oracle checkout changes.
