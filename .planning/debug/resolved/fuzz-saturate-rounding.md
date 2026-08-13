---
status: resolved
trigger: "Find and fix the first deterministic Phase 5 fuzz parity mismatch: saturate(-100) on #400140 returns #212121 in Go but #202020 in JavaScript."
created: 2026-08-01T05:19:38.0748150+05:30
updated: 2026-08-01T05:44:00+05:30
---

## Current Focus

hypothesis: confirmed — Go setHSL bypasses TinyColor's object-input percentage conversion and Bound01 truncation, retaining 32.5 instead of the oracle's 32.487 before identical half-up output rounding
test: completed
expecting: all requested checks pass
next_action: archived; commit remains for a caller with writable Git metadata

## Symptoms

expected: JavaScript oracle and Go response match exactly for request {id:fuzz-2, operation:modify, input:#400140, args:{method:saturate, amount:-100}}; JS after is #202020 with RGB 32,32,32.
actual: Go after is #212121 with RGB 33,33,33.
errors: seed-1 one-second fuzz run found 338 divergences; first mismatch is deterministic and full request/outputs are in .superpowers/sdd/05-02-PLAN/task-1-report.md.
reproduction: send the exact JSONL request to persistent or one-shot compat/js-runner.mjs and the Go CLI; also call typed Color.Saturate(-100) on #400140.
started: uncovered by the new broad Phase 5 fuzz generator; fixed Phase 4 corpus did not include this input.

## Eliminated

## Evidence

- timestamp: 2026-08-01T05:23:00+05:30
  checked: prior Phase 5 task report and repository status
  found: exact request deterministically differs (#202020 JS vs #212121 Go); only concurrent fuzz harness files are dirty
  implication: preserve fuzz files and isolate the fix to shared Go conversion behavior plus regressions

- timestamp: 2026-08-01T05:23:00+05:30
  checked: repository knowledge base and user memory registry
  found: no matching prior TinyColor/HSL rounding diagnosis
  implication: investigate from source behavior rather than reuse a known pattern

- timestamp: 2026-08-01T05:25:00+05:30
  checked: first adapter reproduction attempt
  found: setup was invalid because Node ran from src and Go's default cache was sandbox-denied
  implication: no behavioral conclusion; rerun from root and set GOCACHE inside the workspace

- timestamp: 2026-08-01T05:30:00+05:30
  checked: exact request through root compat/js-runner.mjs and src/cmd/tinycolor-compat
  found: reproduced #202020 in JavaScript and #212121 in Go with otherwise identical responses
  implication: mismatch is in shared typed color behavior, not fuzz harness or adapter serialization

- timestamp: 2026-08-01T05:30:00+05:30
  checked: source rgbToHsl/saturate/tinycolor(hsl)/hslToRgb path and all Go setHSL callers
  found: JavaScript converts l=0.12745098039215685 to "12.745098039215685%" then Bound01 truncates to 12.74%, yielding 32.487; Go setHSL directly multiplies unquantized l by 255, yielding exactly 32.5
  implication: identical half-up rounding then produces 32 versus 33; source-compatible percentage quantization is missing in the shared Go modifier conversion path used by Lighten, Darken, Saturate, Desaturate, Greyscale, and Spin

- timestamp: 2026-08-01T05:36:00+05:30
  checked: typed regression and full operations JSONL corpus before production change
  found: typed test failed with #212121; corpus passed 69/70 and only the new exact regression mismatched
  implication: regression isolates the defect and provides both API-level and adapter-level RED evidence

- timestamp: 2026-08-01T05:40:00+05:30
  checked: typed regression, 70-case operations corpus, and exact request through both adapters after fix
  found: typed test passed; corpus passed 70/70 with zero mismatches; both adapters returned #202020 and RGB 32,32,32
  implication: minimal shared-path fix resolves the original issue and adapter parity

- timestamp: 2026-08-01T05:44:00+05:30
  checked: go test ./..., go vet ./..., git diff --check, scoped diff, and commit attempt
  found: all tests, vet, and diff check passed; scoped diff contains only the shared fix and two regressions; commit failed because .git/index.lock could not be created
  implication: code is verified and ready to commit, but repository metadata permissions prevent this agent from creating the requested commit

## Resolution

root_cause: setHSL calls hslToRGB directly with normalized HSL values, while the JavaScript modifier reconstructs through tinycolor(hsl), whose object parser converts s/l to percentage strings and Bound01 truncates them to four decimal ratio precision before RGB conversion. At the 32.5 boundary this changes the rounded channel.
fix: setHSL now reuses hslColor and the existing parser conversion, removing the duplicate direct hslToRGB implementation that skipped TinyColor percentage quantization.
verification: focused typed test passed; operations corpus 70/70 with zero mismatches; exact JS and Go outputs both #202020/RGB 32; go test ./... passed; go vet ./... passed; git diff --check passed.
files_changed: [src/tinycolor/color.go, src/tinycolor/operations_test.go, compat/cases/operations.jsonl]
