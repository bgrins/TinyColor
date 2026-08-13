# GSD Debug Knowledge Base

Resolved debug sessions. Used by `gsd-debugger` to surface known-pattern hypotheses at the start of new investigations.

---

## fuzz-saturate-rounding — Saturate negative rounding differed at an RGB half boundary
- **Date:** 2026-08-01
- **Error patterns:** saturate, rounding, #400140, #202020, #212121, RGB 32, RGB 33, fuzz divergence
- **Root cause:** setHSL called a direct hslToRGB conversion, bypassing TinyColor's object-input percentage conversion and Bound01 truncation before RGB output rounding.
- **Fix:** Route setHSL through the existing hslColor/parser conversion and remove the duplicate direct converter.
- **Files changed:** src/tinycolor/color.go, src/tinycolor/operations_test.go, compat/cases/operations.jsonl
---

## full-range-differential-inconsistencies — Broad adapter parity diverged across formatting, parsing, equality, and brighten
- **Date:** 2026-08-01
- **Error patterns:** 6019 mismatches, string format hsl, hsl 1%, white, percentage RGB, equals empty input, brighten
- **Root cause:** Five shared-path gaps: string format was discarded; explicit percent strings were re-promoted as ratios; percentage RGB used pre-rounded channels; Equals omitted JavaScript falsy guards; Brighten skipped the oracle's rounded RGB snapshot.
- **Fix:** Forward string format; preserve explicit percentages; calculate percentage RGB from internal floats; apply JS truthiness before equality parsing; start Brighten from ToRGB channels.
- **Files changed:** src/cmd/tinycolor-compat/main.go, src/cmd/tinycolor-compat/main_test.go, src/internal/parser/parser.go, src/tinycolor/color.go, src/tinycolor/color_test.go, src/tinycolor/operations_test.go
---
