# Phase 4: Operations and Palettes - Research

**Researched:** 2026-08-01
**Domain:** Source-compatible TinyColor operations, WCAG readability, and color palettes in Go
**Confidence:** HIGH

## User Constraints

No `04-CONTEXT.md` exists. The phase is constrained by the Phase 4 roadmap goal, `OPS-01` and `QLT-02`, [AGENT.md](../../../AGENT.md), the immutable local [mod.js](../../../mod.js) oracle, and the approved [operations design](../../../docs/superpowers/specs/2026-08-01-phase-4-operations-design.md).

<phase_requirements>
## Phase Requirements

| ID | Description | Research Support |
|---|---|---|
| OPS-01 | Reproduce mutation, utilities, readability, and palette operations. | Exact source algorithms, defaults, return/mutation semantics, palette order, and adapter operation shapes below. |
| QLT-02 | Record every mismatch with complete reproducer and owner. | Fixed JSONL cases run through the existing exact comparator; B owns library results and C owns dispatch/corpus protocol mismatches. |

</phase_requirements>

## Project Constraints (from AGENT.md)

- `mod.js`, `test.js`, `tinycolor.js`, `npm/`, `dist/`, and `demo/` are immutable JavaScript oracle material. Do not change them to obtain parity.
- New Go behavior belongs under `src/`; compatibility adapters, fixtures, and reports belong under `compat/`.
- Preserve TinyColor quirks, including defaults, validation, clamping, hue wrapping, alpha, mutation, and invalid-as-black behavior. Do not use a broad floating-point tolerance.
- The public Go API is explicit and typed; the JSON compatibility adapter owns JavaScript truthiness/default coercion that cannot be expressed in the typed API.
- B owns `src/tinycolor` operations, readability, and palettes. C owns `compat`, fixture schema, and reproducible differential evidence.
- Required checks include `go test ./...`, `go vet ./...`, the Node oracle runner, and the differential command. Deno is unavailable locally, so a Deno suite pass must not be claimed.

## Summary

Phase 4 should extend only `src/tinycolor`: its existing normalized `color.Model` and `Color` conversion methods already provide the required RGBA/HSL/HSV substrate. Implement mutating instance methods as pointer receivers that change the existing `Color`, and implement `Mix`, WCAG operations, and palette methods as pure facade operations returning values. No parser/model or third-party color package is needed. The compatibility runners should only construct input colors, apply one public operation, and serialize observable results.

The local source is unusually specific about JavaScript defaults. `lighten`, `brighten`, `darken`, `saturate`, `desaturate`, and `mix` preserve a numeric `0` but turn other falsy amounts into their default. `spin` has no default at all: omitted `undefined` becomes invalid black after conversion, while JSON `null` behaves as `0`. `analogous` and `monochromatic` use `value || default`, so JSON `0` selects their defaults. These rules must be confined to compatibility dispatch; typed Go methods should accept explicit numeric amounts/counts and not pretend that omitted and zero are the same API state.

**Primary recommendation:** make three micro-commit-friendly plans: B implements modifiers and `Mix`, then B implements readability, then B implements palettes; C follows each with thin dual-runner dispatch plus a dedicated exact JSONL corpus. Keep all JS coercion in the adapter and compare deterministic values exactly.

## Standard Stack

### Core

| Library | Version | Purpose | Why Standard |
|---|---:|---|---|
| Go standard library (`math`) | Go 1.26.1 installed | HSL/HSV arithmetic, clamping, and source-compatible rounding | D-005 requires standard-library-first and the oracle algorithms are short. |
| Local `mod.js` and `test.js` | checked-out oracle | Exact behavior and source assertions | D-001 makes this checkout, not a generic color specification, authoritative. |
| Existing JSONL harness | repository-local | Exact Node-to-Go differential validation | It already reports the full request, both results, operation, and owner. |

### Supporting

| Dependency | Purpose | When to Use |
|---|---|---|
| `src/internal/color.Model` | normalized RGBA, alpha, validity, format, original input | Read/write it only through `tinycolor.Color`; do not add another color state type. |
| Existing `rgbToHSL` / `rgbToHSV` helpers in `src/tinycolor/color.go` | source-like conversion inputs | Reuse them and add the reciprocal helpers locally in the same facade. |

**Installation:** None. Do not add a dependency.

## Exact Source Semantics

### Mutating modifiers

Source: [mod.js](../../../mod.js), prototype wrappers around lines 255-321 and algorithms around lines 655-710.

| Method | Amount rule | Calculation | Bounds and alpha | Receiver behavior |
|---|---|---|---|---|
| `Lighten(amount)` | `amount === 0 ? 0 : amount \|\| 10` | HSL `l += amount / 100` | `l = clamp01(l)`; alpha is preserved | Mutates and returns the same instance. |
| `Darken(amount)` | same | HSL `l -= amount / 100` | `l = clamp01(l)`; alpha preserved | Mutates and returns the same instance. |
| `Saturate(amount)` | same | HSL `s += amount / 100` | `s = clamp01(s)`; alpha preserved | Mutates and returns the same instance. |
| `Desaturate(amount)` | same | HSL `s -= amount / 100` | `s = clamp01(s)`; alpha preserved | Mutates and returns the same instance. |
| `Greyscale()` | no argument | equivalent to `desaturate(100)` | saturation becomes 0; alpha preserved | Mutates and returns the same instance. |
| `Brighten(amount)` | same | rounded RGB delta: `round(255 * amount / 100)` added per channel | every RGB channel clamps to `[0,255]`; alpha preserved | Mutates and returns the same instance. |
| `Spin(amount)` | **no default** | `hue = (h + amount) % 360`; if negative, add 360 | hue wraps; alpha preserved for numeric amount | Mutates and returns the same instance. |

The wrapper evaluates the free function against `this`, copies the resulting `_r/_g/_b`, then calls `setAlpha` with the result alpha. It leaves source format, original input, validity, and gradient type intact. Go must therefore use pointer receivers such as `func (c *Color) Lighten(amount float64) *Color`; a value receiver would silently fail the required receiver mutation. Keep typed methods numeric and explicit. The adapter must distinguish omitted amount from JSON `0` and must implement the source defaults before calling the typed method.

Oracle probe results, run against the local source on 2026-08-01:

- `tinycolor("red").lighten(10)` returns the exact same object and changes it from `#ff0000` to `#ff3333`.
- `tinycolor("red").spin()` produces `#000000` because `undefined` yields `NaN`, which reaches object parsing as invalid input.
- `tinycolor("red").spin(null)` and `.spin(0)` both remain `#ff0000`; JSON cannot convey `undefined`, so an omitted JSON amount must be routed separately from `null`.
- The source exposes no `tinycolor.lighten` static operation (`typeof tinycolor.lighten === "undefined"`). Do not invent static modifier APIs in the parity adapter.

### `Mix`

Source: [mod.js](../../../mod.js), lines 771-790; source tests around lines 2013-2078.

`tinycolor.mix(color1, color2, amount)` uses `amount === 0 ? 0 : amount || 50`, converts both inputs with `toRgb()` first (thus channels are already rounded), sets `p = amount / 100`, and linearly interpolates every `r`, `g`, `b`, **and** `a` as `(second - first) * p + first`. It constructs a fresh TinyColor from that RGBA object. It does not clamp `amount`; out-of-range amounts extrapolate before input normalization clamps RGB and normalizes alpha. It does not mutate either input.

Use a pure typed function, for example `func Mix(first, second Color, amount float64) Color`, and do the omitted/falsy default only in compatibility dispatch. Cover absent amount (`50`), explicit `0`, `.5` alpha, `90` (the source test's rounding-sensitive case), and out-of-range values.

### Readability, `IsReadable`, and `MostReadable`

Source: [mod.js](../../../mod.js), lines 797-871 and `validateWCAG2Parms` around lines 1261-1277; source tests around lines 1100-1370.

- `readability(a, b)` constructs both colors and returns `(max(luminanceA, luminanceB) + .05) / (min(...) + .05)`. It inherits the existing `Color.Luminance()` rule, which uses rounded RGB channels.
- `isReadable(a, b, wcag2)` defaults invalid/missing options to `AA/small`. The normalized pair is: `level = (parms.level || "AA").toUpperCase()` and `size = (parms.size || "small").toLowerCase()`, then invalid values become `AA` and `small` respectively. Thresholds are `AA small = 4.5`, `AA large = 3`, `AAA small = 7`, and `AAA large = 4.5`; comparisons are inclusive.
- `mostReadable(base, candidates, args)` scans candidates in input order and changes its best only for a **strictly** larger score, so ties retain the first candidate. It returns that candidate when it meets the normalized readability option or when `includeFallbackColors` is falsy. Otherwise it mutates only the local `args` object by setting `includeFallbackColors = false`, then recursively chooses from `[#fff, #000]` using the same `level` and `size`.
- Empty candidates are source-defined but inconvenient: `bestColor` remains `null`; with base `#fff`, both `includeFallbackColors: false` and `true` return `null` because `isReadable(#fff, null)` treats null as the black TinyColor input and succeeds. Preserve this JSON `null` result in adapter tests; do not dereference it or invent a fallback.

Go ownership should use a typed `WCAG2Options` value (e.g. `Level`, `Size`, `IncludeFallbackColors`) and a normalization helper in `src/tinycolor`. The adapter must preserve source coercion: absent, `null`, `false`, `0`, and empty strings default as JavaScript does; string case is normalized; non-string values must not be prematurely rejected. `MostReadable` needs a nullable typed result, such as `(Color, bool)`, because the source can return null. Serialize `false` only for boolean-or-string source APIs, not this nullable color result.

### Palettes: defaults, order, and input relationship

Source: [mod.js](../../../mod.js), lines 713-769; source tests around lines 2080-2150.

| Operation | Source output order and formula | Defaults / special behavior |
|---|---|---|
| `Complement()` | fresh HSL color with `(h + 180) % 360` | one color; source test confirms input remains unchanged. |
| `SplitComplement()` | `[input, h + 72, h + 216]` | exactly 3 colors, in this order. |
| `Triad()` | `polyad(3)`: `[input, h + 120, h + 240]` | exactly 3 colors. |
| `Tetrad()` | `polyad(4)`: `[input, h + 90, h + 180, h + 270]` | exactly 4 colors. |
| `Analogous(results, slices)` | starts `[input]`; initializes hue to `(h - ((360/slices * results) >> 1) + 720) % 360`, then increments one part for each remaining result | `results \|\| 6`, `slices \|\| 30`; zero therefore yields 6 and 30. Default red order is `ff0000,ff0066,ff0033,ff0000,ff3300,ff6600`. |
| `Monochromatic(results)` | emits HSV `{h,s,v}`, then sets `v = (v + 1/results) % 1` | `results \|\| 6`; zero yields 6. Default red order is `ff0000,2a0000,550000,800000,aa0000,d40000`. |

`polyad` is intentionally not public in the source because its prototype method is commented out; only use a private Go helper for triad/tetrad. Though `tinycolor(color)` returns the same JavaScript object when the input is already a TinyColor instance, the operation's observable colors are as above. Go's value-returning palette slice should contain independent values, as required by the project design; adapters serialize values only and must not claim JavaScript identity parity.

## Architecture Patterns and Ownership

### Recommended project shape

```text
src/
├── tinycolor/color.go              # B: Color methods, private HSL/HSV/RGBA helpers
├── tinycolor/operations_test.go    # B: modifiers, Mix, WCAG, palettes
└── cmd/tinycolor-compat/main.go    # C: Go adapter dispatch/coercion only
compat/
├── js-runner.mjs                   # C: matching local-oracle operation dispatch
└── cases/operations.jsonl          # C: fixed exact Phase 4 corpus
```

### Exact ownership boundaries

| Owner | Owns | Must not do |
|---|---|---|
| B | `Color` pointer modifiers, pure `Mix`, readability/options normalization, palette helpers and methods, direct Go tests | modify parser/model contracts or place JS coercion in public typed APIs. |
| C | operation schema, Node/Go runner whitelists, dynamic JSON coercion/defaults, `operations.jsonl`, adapter protocol tests, mismatch reports | duplicate HSL/HSV/WCAG/palette math in either runner. |
| A | no planned Phase 4 change | absorb operations into parser/model. |

### Minimal micro-commit plan split

1. **B: modifiers and Mix** - add reciprocal local conversion helpers only as needed; pointer-receiver modifiers and pure `Mix`; direct tests for same-receiver mutation, defaults applied by a small compatibility-facing helper, zero, clamp, hue wrap, and alpha.
2. **C: modifier/Mix evidence** - add `operation: "modify"` and `operation: "mix"` dispatch to both runners plus initial `operations.jsonl`; extend adapter protocol tests. Commit only fixture/adapter work.
3. **B: readability** - add `Readability`, `IsReadable`, `MostReadable`, a typed normalized options helper, and nullable result handling; direct tests for each WCAG threshold, first-tie selection, recursive black/white fallback, and empty list.
4. **C: readability evidence** - add `readability`, `isReadable`, and `mostReadable` runner operations and their source-derived corpus rows.
5. **B: palettes** - add pure palette methods and a private polyad helper; direct tests for default red sequences, custom analogous counts/slices, zero/default behavior, order, and alpha preservation.
6. **C: palette evidence and phase gate** - add `palette` dispatch, complete deterministic corpus, run all existing and new corpora, then update compatibility evidence only with actual results.

## Required Adapter Coercion and JSONL Shapes

The existing runners accept `{id, operation, input, args}` and must retain all prior operations. Add only operation-specific request forms; use `Object.hasOwn(args, "amount")` in Node and an equivalent Go map-presence check so omitted differs from `0` and `null`.

```json
{"id":"mod-lighten-default","operation":"modify","input":"#80000080","args":{"method":"lighten"}}
{"id":"mod-lighten-zero","operation":"modify","input":"red","args":{"method":"lighten","amount":0}}
{"id":"mod-spin-null","operation":"modify","input":"red","args":{"method":"spin","amount":null}}
{"id":"mod-spin-omitted","operation":"modify","input":"red","args":{"method":"spin"}}
{"id":"mix-alpha-quarter","operation":"mix","input":"transparent","args":{"other":"#000","amount":25}}
{"id":"readability-black-white","operation":"readability","input":"#000","args":{"other":"#fff"}}
{"id":"is-readable-default","operation":"isReadable","input":"#ff0088","args":{"other":"#5c1a72","options":{}}}
{"id":"most-readable-fallback","operation":"mostReadable","input":"#123","args":{"candidates":["#124","#125"],"options":{"includeFallbackColors":true}}}
{"id":"most-readable-empty","operation":"mostReadable","input":"#fff","args":{"candidates":[],"options":{"includeFallbackColors":true}}}
{"id":"palette-analogous-default","operation":"palette","input":"red","args":{"method":"analogous"}}
{"id":"palette-analogous-zero","operation":"palette","input":"red","args":{"method":"analogous","results":0,"slices":0}}
{"id":"palette-triad","operation":"palette","input":"red","args":{"method":"triad"}}
```

Recommended result encoding: `modify` and `mix` return an `inspect` snapshot so mutation and alpha are observable; `readability` returns its raw number; `isReadable` returns a boolean; `mostReadable` returns `null` or a snapshot; `palette` returns a JSON array of snapshots in source order. Node must construct one instance for `modify`, call it once, and include both `before` and `after` snapshots plus `sameReceiver: returned === color`. Go must return `sameReceiver: true` only when its pointer method is used; this makes the mutation contract testable without exposing internals.

Do not coerce typed public Go inputs through JSON rules. Adapter-only rules required for parity are: absent versus present amount, `0` preservation where source uses the strict zero ternary, null passed to `spin`, `||` defaults for analogous/monochromatic, WCAG string case/default handling, `includeFallbackColors` truthiness, and JSON `null` for no most-readable candidate.

## Don't Hand-Roll

| Problem | Do not build | Use instead | Why |
|---|---|---|---|
| General color library | external CSS/WCAG/color package | direct algorithms over existing `Color` conversion helpers | A library will not preserve TinyColor's defaults, rounding, null behavior, order, and mutation. |
| Dynamic operation framework | reflection or a second protocol | existing JSONL request/response plus switch dispatch | The current protocol is already stable and exact-comparing. |
| Public JavaScript-like argument API | `any`/variadic methods on `Color` | typed methods plus adapter coercion | D-006 explicitly separates Go usability from source quirks. |
| Public `polyad` | new public method | private helper for `Triad` and `Tetrad` | The source deliberately disables its public polyad method. |

## Common Pitfalls

### Defaulting `spin` like the other modifiers

`spin` has no `|| 10` source expression. An omitted JavaScript value is observably invalid black, while JSON null acts like zero. Test both cases separately.

### Using Go's rounding for `Brighten` without checking the source boundary

The source computes `Math.round(255 * amount / 100)` before clamping. Keep this rounding point; do not brighten through HSL or round only at string output.

### Flattening all defaults into Go zero values

`0` means “no change” for amount modifiers and `Mix`, but it means default 6/30 for `Analogous` and default 6 for `Monochromatic`. Presence-aware adapter decoding is required.

### Mutating palettes or returning a reordered sequence

Palette source order is a public result. `Complement` is non-mutating; the first element of analogous/split/triad/tetrad corresponds to the input color. Pin whole ordered arrays, not sets.

### Incorrect fallback logic in `MostReadable`

Fallback occurs only after selecting a best candidate, only when that candidate is not readable, and only when `includeFallbackColors` is truthy. Preserve the strict-greater tie rule and empty-list null behavior.

### Rounding readability or tolerating float drift

`readability` returns a raw float and `isReadable` compares that raw ratio inclusively. The harness compares JSON values exactly; do not round or apply an epsilon.

## Validation Architecture

### Test framework

| Property | Value |
|---|---|
| Framework | Go standard `testing`; Node JSONL differential harness; upstream Deno suite unavailable locally |
| Quick library command | `Set-Location src; go test ./tinycolor; Set-Location ..` |
| Quick corpus command | `node compat/run.mjs compat/cases/operations.jsonl` |
| Full phase command | `Set-Location src; go test ./...; go vet ./...; Set-Location ..; node tests/port/adapter.test.mjs; node compat/run.mjs compat/cases/smoke.jsonl; node compat/run.mjs compat/cases/parser-hex-rgb.jsonl; node compat/run.mjs compat/cases/parser.jsonl; node compat/run.mjs compat/cases/conversion.jsonl; node compat/run.mjs compat/cases/operations.jsonl; git diff --check` |

### Requirements to test map

| Requirement | Behavior | Test type | Command | Initial state |
|---|---|---|---|---|
| OPS-01 | mutable modifiers: default/zero, clamp, wrap, alpha, same receiver | Go unit + exact differential | `node compat/run.mjs compat/cases/operations.jsonl` | Wave 0 needed |
| OPS-01 | Mix rounding and alpha interpolation | Go unit + exact differential | same | Wave 0 needed |
| OPS-01 | WCAG normalization, thresholds, selection/fallback/null | Go unit + exact differential | same | Wave 0 needed |
| OPS-01 | palettes: defaults, custom options, ordered results | Go unit + exact differential | same | Wave 0 needed |
| QLT-02 | stable complete reproducer | differential integration | same | driver exists; Phase 4 rows/dispatch missing |

### Required deterministic corpus groups

- Modifiers: each method with omitted/default, zero, normal, clamp high/low, alpha input, `spin` negative/over-360/omitted/null.
- Mix: omitted 50, zero, 90, transparent alpha progression, and out-of-range amount.
- Readability: ratios `1`, `1.1121078324840545`, `21`; each threshold family; invalid/mixed-case options; first-tie behavior; include-fallback true/false; empty candidate null.
- Palettes: all default red sequences copied from `test.js`; custom analogous `results`/`slices`; zero defaults; a non-red hue-wrapping case; alpha retention.

### Environment availability

| Dependency | Required by | Available | Version | Fallback |
|---|---|---:|---|---|
| Node.js | local JS oracle and differential harness | yes | v24.18.0 | none needed |
| Go | library tests and Go adapter | yes | go1.26.1 windows/amd64 | none needed |
| Deno | unchanged source suite | no | — | Node differential evidence only; does not count as a source-suite pass |

## Sources

### Primary (HIGH confidence)

- [mod.js](../../../mod.js) - constructor/prototype mutation wrapper, modifiers, mix, WCAG operations, palette algorithms, and WCAG parameter validator.
- [test.js](../../../test.js) - exhaustive modifier and mix loops; spin cases; WCAG/fallback assertions; default palette order expectations.
- [docs/superpowers/specs/2026-08-01-phase-4-operations-design.md](../../../docs/superpowers/specs/2026-08-01-phase-4-operations-design.md) - approved scope and architectural separation.
- [src/tinycolor/color.go](../../../src/tinycolor/color.go), [src/cmd/tinycolor-compat/main.go](../../../src/cmd/tinycolor-compat/main.go), [compat/js-runner.mjs](../../../compat/js-runner.mjs), and [compat/run.mjs](../../../compat/run.mjs) - current extension surfaces.
- Oracle probe executed 2026-08-01 with Node v24.18.0 - omitted/null spin, zero palette defaults, empty `mostReadable`, static modifier absence, and identity mutation.

### Secondary (MEDIUM confidence)

None. The selected local source and tests are the authoritative specification.

### Tertiary (LOW confidence)

None.

## Metadata

**Confidence breakdown:**
- Standard stack: HIGH - project decisions and installed versions are local evidence.
- Architecture: HIGH - approved Phase 4 design and existing owner boundaries agree.
- Semantics and pitfalls: HIGH - direct local source, source tests, and oracle edge probe.

**Research date:** 2026-08-01
**Valid until:** this checkout's `mod.js` or `test.js` changes.
