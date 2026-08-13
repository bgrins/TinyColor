# TinyColor.js to Go — Working Agreement

## Mission

Build a fresh Go implementation of the public behavior in this checkout of
[`bgrins/TinyColor`](https://github.com/bgrins/TinyColor), without changing,
copying into, or replacing its JavaScript implementation. The Go port is a
compatibility project: observable TinyColor behavior is the specification.

## Repository boundaries

- `mod.js`, `tinycolor.js`, `test.js`, `npm/`, `dist/`, and `demo/` are the
  immutable JavaScript oracle. Do not edit them except for a separately agreed
  upstream maintenance change.
- New Go work belongs under `src/`; `src/go.mod` is the port module boundary.
- Oracle adapters, generated fixtures, and mismatch reports belong under
  `compat/`. Do not rewrite the original test suite to make it pass.
- `tests/original/manifest.sha256` pins the immutable root oracle. Port-owned
  adapter tests live in `tests/port/`; differential fuzzing and benchmarks live
  in `fuzz/` and `bench/` respectively.
- Human-facing project docs belong in `docs/`; compatibility status belongs in
  `COMPATIBILITY.md`.

## Non-negotiable behavior rules

1. Preserve permissive parsing: whitespace, optional commas/parentheses,
   uppercase input, no-`#` hex, percentages, and object inputs.
2. Preserve TinyColor's validation, clamping, hue wrapping, alpha normalization,
   format selection, rounding, string output, and invalid-input-as-black
   behavior. A more idiomatic result is not a compatible result.
3. Preserve mutation where JavaScript mutates (`setAlpha`, instance modifiers)
   and return independent values where it returns new colors (`clone`, palettes,
   static utilities).
4. Treat a differential mismatch as a defect until a documented source-version
   difference proves otherwise. Do not add broad floating-point tolerances.

## Source-of-truth map

| Behavior | Read first |
|---|---|
| Constructor, output methods, instance mutation | `mod.js` lines 5–358 |
| Input normalization and color conversion | `mod.js` lines 359–654 |
| Manipulation, palettes, readability | `mod.js` lines 655–1046 |
| Parsing regexes, names, low-level helpers | `mod.js` lines 1047–end |
| Existing expected behavior | `test.js` |
| Public usage and supported formats | `README.md` |
| Project choices | `DECISIONS.md`, `docs/ARCHITECTURE.md` |

## Go API direction

Expose an idiomatic, explicit API while keeping a JSON-compatible adapter for
exact comparison. Start with a `Color` value and `Parse(any) (Color, error)`
for Go callers; retain `Valid()`, `Format()`, `Original()`, output methods,
modifiers, palettes, and readability methods that mirror TinyColor names in Go
style. The compatibility adapter—not the public API—may expose dynamic input
and operation names.

Do not finalize exported signatures until Phase 1 proves the adapter can
represent every source test category. Any intentional API divergence needs an
entry in `DECISIONS.md` and must not affect the parity adapter.

## Workflow and ownership

Follow the phases in `PLAN.md` and `.planning/ROADMAP.md`. Keep commits small
and single-purpose. A pull request must state:

```text
Feature implemented:
Source behavior checked:
Differential command and result:
Known differences (or none):
```

| Owner | Primary boundary | Cannot merge without |
|---|---|---|
| A — Parsing/model | `src/internal/color`, `src/internal/parser` | parser differential cases |
| B — Conversion/API | `src/tinycolor`, formatting/readability/palettes | deterministic parity tests |
| C — Compatibility/quality | `compat`, `src/testdata`, `COMPATIBILITY.md` | reproducible report |
| D — Delivery | CLI, CI, benchmarks, docs | clean-checkout commands |

Coordinate through exported contracts, never by editing another owner’s files
without agreement. C can add a regression fixture for any mismatch; the owner
of the implicated module fixes it.

## Required checks

Run the narrowest applicable check while developing, then run the phase gate:

```powershell
go test ./...                         # from src/
node compat/js-runner.mjs < cases.json # from repository root
go test -run TestDifferential ./...    # from src/
go vet ./...                           # from src/
gofmt -w <changed-go-files>
```

Once Deno is installed, additionally run the untouched source suite with
`deno task test`. Its current absence is an environment limitation, not a
passing test result.

## Definition of done

A feature is done only when its source behavior is mapped, Go unit tests pass,
the matching oracle cases pass, the compatibility matrix is updated, and any
remaining mismatch is named with input, JavaScript result, Go result, and owner.
