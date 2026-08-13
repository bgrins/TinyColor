---
status: resolved
trigger: "Investigate and fix Phase 4 parity gaps: JS coercion/defaults, MostReadable empty fallback, Brighten half-boundary rounding, truthy non-string WCAG level/size errors, and trailing whitespace."
created: 2026-08-01T03:25:49.1964363+05:30
updated: 2026-08-01T03:43:31.6647882+05:30
---

## Current Focus

hypothesis: Resolved; automated and independent primary-agent verification both confirm parity.
test: Archive this session and commit only the resolved debug document.
expecting: No active Phase 4 debug session remains and source stays untouched.
next_action: Move this file to `.planning/debug/resolved/` and create the final docs micro-commit.

## Symptoms

expected: Go compatibility behavior exactly matches local mod.js/test.js.
actual: "Reviewer reproducers: (1) modifier/mix amount JS coercion/default gaps for null/false/numeric strings; (2) MostReadable with empty candidates and fallback enabled should still choose white/black; (3) Brighten half-boundary must mirror -Math.round(-delta); (4) truthy non-string WCAG level/size should reproduce source throw/error behavior."
errors: Existing 58-row corpus passes because these cases are absent.
reproduction: Use direct Node oracle requests and new fixed JSONL rows for the reported edge cases.
started: Introduced during Phase 4 commits from base 38a7483 through 5601b29.

## Eliminated

## Evidence

- timestamp: 2026-08-01T03:27:00.1181439+05:30
  checked: Complete `mod.js` operations, Go facade/adapter, current unit tests/corpus, and Phase 4 research/validation.
  found: Source uses `amount === 0 ? 0 : amount || fallback`, `-Math.round(-delta)`, and `(value || default).toUpperCase/toLowerCase`; Go uses float64-only decoding, `mathRound(delta)`, and string-only WCAG fields. `MostReadable` currently returns no result immediately for every empty list.
  implication: All four reviewer areas have specific falsifiable divergence mechanisms; empty fallback must be probed with both readable-null and unreadable-null bases.
- timestamp: 2026-08-01T03:27:39.1157918+05:30
  checked: Twelve direct Node/Go requests covering all reported edges.
  found: Eleven mismatches reproduced. Null/false/numeric-string amounts diverged for modifiers and Mix; dark-base empty fallback diverged while white-base empty fallback matched null; both brighten half signs diverged; truthy numeric level and boolean size threw in Node but returned true in Go.
  implication: All four claims are valid with the MostReadable qualification that fallback occurs only when the provisional null/black candidate is not already readable.
- timestamp: 2026-08-01T03:28:28.5725482+05:30
  checked: Operations differential after adding six permanent amount cases.
  found: RED reproduced exactly six mismatches; all 58 pre-existing cases passed.
  implication: The failure is isolated to adapter amount defaulting/coercion, not typed modifier or Mix arithmetic.
- timestamp: 2026-08-01T03:29:26.9690590+05:30
  checked: Go suite and 64-row operations corpus after adapter fix.
  found: `go test ./...` passed with repository-local GOCACHE; operations passed 64/64 with zero mismatches; focused diff check passed.
  implication: Shared adapter coercion now reproduces modifier/Mix null, false, and numeric-string semantics without public API changes.
- timestamp: 2026-08-01T03:30:30.8620009+05:30
  checked: Atomic commit for amount fix.
  found: Commit `9e8155b` contains only the operations corpus and Go adapter changes.
  implication: Amount parity is independently recoverable and the next bug can be tested in isolation.
- timestamp: 2026-08-01T03:31:33.4612643+05:30
  checked: Focused `TestMostReadable` and 65-row differential after adding dark-base empty fallback.
  found: Both RED checks fail only because Go returns no result while Node returns white; the original white-base empty case still passes.
  implication: The early empty-list return is the confirmed root cause; fallback must depend on provisional null/black readability.
- timestamp: 2026-08-01T03:32:34.8788960+05:30
  checked: Focused MostReadable test, full Go suite, and 65-row operations differential after the fix.
  found: All checks passed; white-base empty fallback remains null and dark-base empty fallback returns white.
  implication: Selection now matches the source's null-as-black intermediate behavior without changing the nullable API.
- timestamp: 2026-08-01T03:33:05.1909523+05:30
  checked: Atomic commit for empty fallback fix.
  found: Commit `9d7e74e` contains only the paired regressions and shared MostReadable change.
  implication: Empty fallback parity is independently complete.
- timestamp: 2026-08-01T03:33:58.7789774+05:30
  checked: Focused modifier test and 67-row differential with exact positive/negative half ties.
  found: RED failed at positive half in the unit test and exactly both half cases in the corpus; 65 prior rows passed.
  implication: `mathRound(delta)` is the isolated root cause and must mirror the source's negated-round expression.
- timestamp: 2026-08-01T03:34:38.9954301+05:30
  checked: Focused modifier test, full Go suite, and 67-row operations differential after one-line rounding fix.
  found: All checks passed, including both exact half signs and the pre-existing `.2` non-tie case.
  implication: Brighten now matches `-Math.round(-delta)` without changing other modifiers.
- timestamp: 2026-08-01T03:35:20.2523946+05:30
  checked: Atomic commit for brighten fix.
  found: Commit `8d2cdf3` contains only half-boundary regressions and the one-line delta correction.
  implication: Brighten parity is independently complete.
- timestamp: 2026-08-01T03:36:05.3216422+05:30
  checked: 69-row differential after adding two truthy non-string WCAG cases.
  found: RED produced exactly two mismatches with Node throwing `.toUpperCase`/`.toLowerCase` errors and Go returning true; 67 prior cases passed, including false/zero defaults.
  implication: Dynamic type validation belongs only in the compatibility adapter before constructing typed WCAG options.
- timestamp: 2026-08-01T03:36:54.3807334+05:30
  checked: Full Go test/vet, adapter test, and 69-row operations differential after WCAG validation.
  found: All checks passed; exact error strings and blank ids match Node, while falsy non-string defaults remain green.
  implication: The adapter now preserves source throw behavior without weakening the typed Go WCAG API.
- timestamp: 2026-08-01T03:37:40.4754534+05:30
  checked: Atomic commit for WCAG fix and direct trailing-whitespace scan of `04-RESEARCH.md`.
  found: Commit `5e14c31` contains only corpus/adapter changes; research lines 3, 4, and 266 each end in two spaces.
  implication: The reviewer whitespace claim is confirmed and isolated to three documentation lines.
- timestamp: 2026-08-01T03:38:11.3678041+05:30
  checked: Direct whitespace scan and focused diff check after docs cleanup.
  found: No trailing whitespace remains; only three line endings and the previously missing final newline changed.
  implication: Documentation cleanup is ready for its independent commit.
- timestamp: 2026-08-01T03:38:43.7870812+05:30
  checked: Atomic commit for research cleanup.
  found: Commit `c022dfe` contains only `04-RESEARCH.md`.
  implication: All requested changes are independently committed and ready for final regression verification.
- timestamp: 2026-08-01T03:40:22.7203553+05:30
  checked: Complete Phase 1-4 gate.
  found: Go test/vet and adapter test passed; corpora passed 9/9, 26/26, 23/23, 35/35, and 69/69 with zero mismatches; `git diff --check` passed; immutable oracle diff was empty.
  implication: The fixes are regression-safe across all available phases; Deno remains unavailable and is not claimed.
- timestamp: 2026-08-01T03:40:58.9567769+05:30
  checked: Phase 4 evidence references and docs diff.
  found: All stale 58-row current evidence references were replaced with 69/69; diff check passed.
  implication: Evidence docs accurately describe the final verified gate.
- timestamp: 2026-08-01T03:41:28.3450918+05:30
  checked: Evidence-only commit and final worktree state.
  found: Commit `26c3e17` records 69/69 evidence; all requested code/test/docs changes are committed independently.
  implication: Automated verification is complete; only the GSD human-verify checkpoint remains before archival.
- timestamp: 2026-08-01T03:43:31.6647882+05:30
  checked: Human confirmation and independent primary-agent verification.
  found: Confirmed fixed; primary-agent checks independently passed Go test/vet, adapter, all corpora, diff check, clean oracle diff, and matching oracle hashes.
  implication: Resolution is confirmed end-to-end and the session can be archived.

## Resolution

root_cause: Adapter coercion, empty-list fallback selection, brighten tie rounding, and WCAG dynamic type handling each flattened a distinct JavaScript behavior.
fix: Amount coercion now follows strict-zero/truthiness and numeric conversion; empty MostReadable lists evaluate the source's null/black provisional candidate before fallback; Brighten uses `-mathRound(-delta)`; WCAG truthy non-strings return the oracle's exact errors; Phase 4 evidence and whitespace were refreshed.
verification: Full gate passed locally and independently under the primary agent: Go test/vet, adapter tests, corpora 9/9 + 26/26 + 23/23 + 35/35 + 69/69, diff check, empty immutable-oracle diff, and matching oracle hashes. Human confirmed fixed. Deno unavailable and not claimed.
files_changed: [compat/cases/operations.jsonl, src/cmd/tinycolor-compat/main.go, src/tinycolor/color.go, src/tinycolor/operations_test.go, COMPATIBILITY.md, .planning/phases/04-operations-and-palettes/04-02-SUMMARY.md, .planning/phases/04-operations-and-palettes/04-06-SUMMARY.md, .planning/phases/04-operations-and-palettes/04-RESEARCH.md]
