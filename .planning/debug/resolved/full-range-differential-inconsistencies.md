---
status: resolved
trigger: "A deterministic 100,000-case Node-vs-Go stress run found 6,019 exact mismatches; fix known string-format and HSL percentage parser repros test-first, then classify remaining mismatches one root cause at a time."
created: 2026-08-01T11:57:15.5165643+05:30
updated: 2026-08-01T12:17:02.4360622+05:30
---

## Current Focus

hypothesis: Confirmed resolved.
test: Completed focused RED/GREEN regressions, full repository checks, and repeated 100,000-case differential verification.
expecting: Zero mismatches and no test regressions.
next_action: Archive the resolved session and return the root-cause handoff without committing.

## Symptoms

expected: Exact JSON behavioral parity between compat/js-runner.mjs and the Go adapter for supported TinyColor public operations, including valid percentage strings and explicit toString formats.
actual: 6,019 mismatches in 100,000 seeded broad cases; known exact repros are `string` with input `red` and `args.format=hsl` returning `red` in Go versus `hsl(0, 100%, 50%)` in JS, and `inspect` with `hsl(115, 1%, 1%)` returning white in Go versus `rgb(3, 3, 3)` in JS. Initial distribution: string 5,341; inspect 35; fromRatio 43; output 41; analysis 26; equals 38; clone 45; modify 108; mix 90; readability 73; isReadable 60; mostReadable 82; palette 37; randomInvariant 0.
errors: Exact output mismatch, no crash. Known adapter branch at src/cmd/tinycolor-compat/main.go ignores args.format. Known parser ratio helper at src/internal/parser/parser.go may convert string `1%` into 100% because ParseFloat(`1%`) is 1.
reproduction: Build bin/tinycolor.exe, compare JSONL through `node compat/js-runner.mjs` and the Go binary. Minimal requests: `{"id":"string-format","operation":"string","input":"red","args":{"format":"hsl"}}` and `{"id":"hsl-one-percent","operation":"inspect","input":"hsl(115, 1%, 1%)"}`. Broad runner exists at C:\tmp\tinycolor-stress.mjs and was run from repo root.
started: Found today after narrower Phase 5 fuzz passed; likely pre-existing broad-domain gaps.

## Eliminated

- hypothesis: Correcting percentage RGB output would eliminate all remaining string/output/modify mismatches.
  evidence: The next 100,000-case run eliminated string and output mismatches but retained 12 modify-only cases, all represented by brighten examples; modify has another independent root cause.
  timestamp: 2026-08-01T12:07:40.3112231+05:30
- hypothesis: TinyColor equality rejects all invalid parsed colors before comparison.
  evidence: The immutable oracle only checks JavaScript top-level falsiness (`!color1 || !color2`) and then compares normalized RGB strings; truthy invalid colors may still compare equal as black.
  timestamp: 2026-08-01T12:08:56.2349809+05:30

## Evidence

- timestamp: 2026-08-01T11:58:08.3727772+05:30
  checked: `.planning/debug/knowledge-base.md` for overlap with mismatch, format, percentage, parser, and HSL symptoms.
  found: The only entry concerns saturate rounding and has fewer than two overlapping symptom keywords.
  implication: There is no qualifying known-pattern candidate; investigate the supplied repros directly.
- timestamp: 2026-08-01T11:58:08.3727772+05:30
  checked: Repository status before investigation.
  found: Only the newly created debug session is untracked; no pre-existing user code edits are present.
  implication: Subsequent source/test diffs can be attributed to this investigation while preserving the debug file separately.
- timestamp: 2026-08-01T11:58:39.5190467+05:30
  checked: Complete `src/cmd/tinycolor-compat/main.go` and its tests.
  found: `handle` parses both inspect and string identically, but the string fast path calls `color.String()` and never reads `args["format"]`; the output/toString path correctly calls `color.ToString(format)`.
  implication: The string-format mismatch is caused by a local adapter argument-loss defect, not TinyColor formatting itself.
- timestamp: 2026-08-01T11:58:39.5190467+05:30
  checked: Complete `src/internal/parser/parser.go`, `parser_test.go`, and `hsl.go`.
  found: Shared `ratio` calls `ParseFloat` and promotes every numeric value `<= 1` to percentage text, including the literal string `"1%"`; `hslModel` and `hsvModel` both depend on it.
  implication: The parser cannot distinguish normalized numeric ratios from already-explicit percentage strings and can turn 1% into 100% across HSL and HSV paths.
- timestamp: 2026-08-01T11:59:25.1113451+05:30
  checked: All `ratio` and `ToString` references plus complete `object.go`, `bounds.go`, `color.go`, `compat/js-runner.mjs`, and the broad stress generator.
  found: `ratio` has exactly four production callers (HSL saturation/lightness and HSV saturation/value). `Bound01` already handles explicit `%` correctly. The Go adapter `string` branch and JS oracle both receive the same args, but only JS forwards `format`; the public Go `ToString(format)` behavior already exists and is tested.
  implication: The smallest first fix is one adapter argument forward; the parser fix should preserve `ratio` for raw numbers while skipping its numeric-promotion step for percentage strings.
- timestamp: 2026-08-01T12:00:20.6632996+05:30
  checked: New `JSONL string forwards explicit format` regression before production changes.
  found: RED as predicted: actual result was `red`; expected `hsl(0, 100%, 50%)`.
  implication: The regression reproduces the supplied public mismatch and isolates the adapter string branch.
- timestamp: 2026-08-01T12:01:04.3955140+05:30
  checked: Focused adapter regression after forwarding `args.format` to `Color.ToString`.
  found: GREEN: `go test ./cmd/tinycolor-compat -run TestRunJSONLAndUsageErrors -count=1` passed.
  implication: The one-path fix corrects explicit string formats while preserving the existing JSONL adapter cases.
- timestamp: 2026-08-01T12:02:47.4046947+05:30
  checked: JS oracle and new exact JSONL regression for `hsl(115, 1%, 1%)` before parser changes.
  found: Oracle returns RGB 3,3,3 and value `hsl(115, 1%, 1%)`; RED Go result is RGB 255,255,255 and `hsl(0, 0%, 100%)`.
  implication: The regression exactly reproduces the supplied full-stack mismatch.
- timestamp: 2026-08-01T12:02:47.4046947+05:30
  checked: Immutable oracle `hslToRgb`, `hsvToRgb`, `bound01`, and `convertToPercentage` functions.
  found: String HSL/HSV percentages go directly to `bound01`; object inputs use `convertToPercentage`, whose JavaScript `<=` coercion does not convert strings containing `%`. Go's shared `ratio` combines both paths but converts percentage strings incorrectly.
  implication: Guarding the promotion with `!color.IsPercentage(value)` reproduces the oracle distinction without splitting the parser paths.
- timestamp: 2026-08-01T12:03:31.1535483+05:30
  checked: Exact HSL one-percent regression after guarding explicit percentages.
  found: GREEN: `go test ./cmd/tinycolor-compat -run TestRunJSONLAndUsageErrors/JSONL_inspect_preserves_one-percent_HSL_channels -count=1` passed.
  implication: The smallest parser change fixes the supplied public repro.
- timestamp: 2026-08-01T12:04:19.5752472+05:30
  checked: Unchanged deterministic 100,000-case broad stress after the two fixes.
  found: Mismatches fell from 6,019 to 121. New distribution is string 1, output 6, equals 35, modify 79, and zero in every other operation. String/output/modify examples have identical rounded RGB but percentage strings differ by one point; equals examples compare invalid empty input against a different input that normalizes to black.
  implication: The residuals collapse cleanly into two candidate root causes rather than requiring an architectural change.
- timestamp: 2026-08-01T12:05:16.6121994+05:30
  checked: All Go percentage-output callers, complete `color_test.go`, and immutable oracle `toPercentageRgb`/`toPercentageRgbString`.
  found: Go `ToPercentageRGB` first calls `ToRGB`, rounding each internal channel to an integer; JavaScript applies `bound01` and percentage rounding directly to each internal float channel. All Go percentage strings route through `ToPercentageRGB`.
  implication: A shared two-line correction in `ToPercentageRGB` should eliminate percentage string differences across direct output, string formatting, and modified-color inspections.
- timestamp: 2026-08-01T12:05:58.0357035+05:30
  checked: New direct percentage-output regression before production changes.
  found: RED as predicted: Go returned `rgb(44%, 0%, 100%)`; expected `rgb(43%, 0%, 100%)`.
  implication: Integer RGB pre-rounding is directly observable and sufficient to cause the residual output cluster.
- timestamp: 2026-08-01T12:06:37.9971179+05:30
  checked: Focused percentage-output regression after computing from internal channels.
  found: GREEN: `go test ./tinycolor -run TestPercentageRGBUsesUnroundedChannels -count=1` passed.
  implication: The shared output method now matches the oracle example; broad verification can test all three affected operation families.
- timestamp: 2026-08-01T12:07:40.3112231+05:30
  checked: Deterministic 100,000-case stress after the percentage-output fix.
  found: Mismatches fell from 121 to 47: equals 35 and modify 12; every other operation is exact. All string/output mismatches and 67 of 79 modify mismatches disappeared.
  implication: Percentage output is confirmed across its consumers; invalid equality and brighten behavior remain separate clusters.
- timestamp: 2026-08-01T12:08:56.2349809+05:30
  checked: Every `Equals` caller and complete immutable oracle equality function.
  found: JS returns false for any falsy top-level argument, including empty string; Go checks only `nil` and otherwise compares `ToRGBString`, so empty string becomes invalid black and can equal a clamped black input.
  implication: Equality needs JSON-compatible JS truthiness at its shared public entry point, not validity checks in callers.
- timestamp: 2026-08-01T12:10:06.1947734+05:30
  checked: New exact equality stress regression before production changes.
  found: RED: Go reported the empty input equal to the clamped-black HSL object.
  implication: The missing falsy guard directly reproduces the full equality cluster mechanism.
- timestamp: 2026-08-01T12:11:07.7954806+05:30
  checked: Focused equality regression after adding JSON-compatible falsy handling.
  found: GREEN: `go test ./tinycolor -run TestEqualsRejectsFalsyInput -count=1` passed.
  implication: Empty string is now rejected before invalid-as-black comparison at the shared equality entry point.
- timestamp: 2026-08-01T12:11:45.4137675+05:30
  checked: Deterministic 100,000-case stress after the equality fix.
  found: Exactly 12 mismatches remain, all in modify and both captured examples use brighten; every other operation is exact, including equals.
  implication: Equality is broadly confirmed. Brighten is the only remaining behavior path.
- timestamp: 2026-08-01T12:12:38.0636370+05:30
  checked: Complete oracle constructor, `_applyModification`, and `brighten`, plus every Go Brighten caller and complete modifier tests.
  found: Oracle brighten calls `tinycolor(color).toRgb()` before applying its rounded delta, forcing every starting channel to an integer. Go applies the same delta rounding directly to `model` floats. `_applyModification` then copies the oracle result channels back while preserving original format metadata.
  implication: Starting Brighten from Go's existing `ToRGB()` snapshot matches the oracle mechanism and explains both the percentage and achromatic-hue examples.
- timestamp: 2026-08-01T12:13:14.6239668+05:30
  checked: New exact brighten stress regression before production changes.
  found: RED as predicted: Go returned `rgb(68%, 91%, 13%)`; expected `rgb(67%, 91%, 13%)`.
  implication: Retaining the pre-brighten fractional channel reproduces the final residual mechanism.
- timestamp: 2026-08-01T12:13:55.0190481+05:30
  checked: Focused brighten regression after applying the delta to `ToRGB()` channels.
  found: GREEN: `go test ./tinycolor -run TestBrightenUsesRoundedRGBSnapshot -count=1` passed.
  implication: The final identified root cause is corrected; broad verification can now test completeness.
- timestamp: 2026-08-01T12:15:21.2484424+05:30
  checked: Final deterministic 100,000-case stress after all five fixes.
  found: Zero mismatches in every operation category.
  implication: The original 6,019-case parity failure is eliminated across the unchanged broad input domain.
- timestamp: 2026-08-01T12:15:21.2484424+05:30
  checked: `go test ./... -count=1`, `go vet ./...`, `node --test tests/port/adapter.test.mjs`, `gofmt`, and `git diff --check`.
  found: All checks passed; diff check emitted only existing Windows LF-to-CRLF conversion warnings.
  implication: No test, vet, adapter, formatting, or whitespace regression was detected.
- timestamp: 2026-08-01T12:16:16.8806534+05:30
  checked: Full verification after simplifying equality truthiness through existing `color.ParseFloat`.
  found: `go test ./... -count=1`, `go vet ./...`, adapter tests, and `git diff --check` passed; the repeated 100,000-case stress again reported zero mismatches in every category.
  implication: The final minimal diff is stable under focused, repository-wide, and broad differential checks.
- timestamp: 2026-08-01T12:17:02.4360622+05:30
  checked: Human/primary-agent verification checkpoint.
  found: The broad stress and focused checks were accepted as green, with explicit instruction to finalize the session as resolved without commits.
  implication: The session can be archived; source and planning changes remain uncommitted for primary-agent micro-commit review.

## Resolution

root_cause: Five independent shared-path gaps caused all 6,019 mismatches: string format was discarded; explicit percent strings were re-promoted as ratios; percentage RGB used pre-rounded channels; Equals omitted JavaScript falsy guards; Brighten skipped the oracle's rounded RGB snapshot.
fix: Forward string format; preserve explicit HSL/HSV percentages; calculate percentage RGB from internal floats; apply JS truthiness before equality parsing; start Brighten from `ToRGB()` channels.
verification: Each root cause received a regression that failed before its fix and passed afterward. The final deterministic 100,000-case run passed three times with zero mismatches. Full Go tests, Go vet, 164/164 compatibility cases, port adapter tests, immutable Deno tests (45 passed, 0 failed, 1 ignored), gofmt, build, and diff checks passed.
files_changed: [src/cmd/tinycolor-compat/main.go, src/cmd/tinycolor-compat/main_test.go, src/internal/parser/parser.go, src/tinycolor/color.go, src/tinycolor/color_test.go, src/tinycolor/operations_test.go]
