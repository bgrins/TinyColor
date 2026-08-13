# Phase 4 Validation

## Constraints

- Run commands from `R:\Code\TinyColor` unless the command changes directory.
- The JavaScript oracle, parser, and color model are not Phase 4 edit targets.
- Treat every differential mismatch as a QLT-02 record; do not add float tolerance.
- Deno is unavailable. Do not claim `deno task test` passed.

## Focused Tasks

| Plan/task | RED/GREEN command | Differential or adapter command |
|---|---|---|
| 04-01 modifiers/Mix library | `Set-Location src; go test ./tinycolor -run 'Test(Modifiers|Mix)' -count=1` | Not applicable until 04-02 |
| 04-02 modifiers/Mix adapter/corpus | `node tests/port/adapter.test.mjs` | `node compat/run.mjs compat/cases/operations.jsonl` |
| 04-03 readability library | `Set-Location src; go test ./tinycolor -run 'Test(Readability|IsReadable|MostReadable)' -count=1` | Not applicable until 04-04 |
| 04-04 readability adapter/corpus | `node tests/port/adapter.test.mjs` | `node compat/run.mjs compat/cases/operations.jsonl` |
| 04-05 palettes library | `Set-Location src; go test ./tinycolor -run 'Test(Palette|Complement|Analogous|Monochromatic|Triad|Tetrad)' -count=1` | Not applicable until 04-06 |
| 04-06 palettes adapter/corpus | `node tests/port/adapter.test.mjs` | `node compat/run.mjs compat/cases/operations.jsonl` |

For every TDD library task, first run its focused Go command after adding the
test and confirm the feature is absent or behaviorally wrong. After the minimal
implementation, rerun it, then run `Set-Location src; go test ./...; go vet
./...` before the task's micro-commit.

## Final Phase Gate

```powershell
Set-Location src
go test ./...
go vet ./...
Set-Location ..
node tests/port/adapter.test.mjs
node compat/run.mjs compat/cases/smoke.jsonl
node compat/run.mjs compat/cases/parser-hex-rgb.jsonl
node compat/run.mjs compat/cases/parser.jsonl
node compat/run.mjs compat/cases/conversion.jsonl
node compat/run.mjs compat/cases/operations.jsonl
git diff --check
git diff -- mod.js test.js tinycolor.js
```

Pass criteria: all Go, adapter, and corpus commands exit zero; the operations
corpus has zero mismatches; `git diff --check` is clean; and the final oracle
diff is empty. If any differential check fails, preserve the exact JSONL row
and harness record (request, JavaScript result, Go result, operation, owner,
and suspected package) rather than changing the oracle or hiding the result.

## Planned Execution Summaries

- `04-01-SUMMARY.md`: modifier/Mix typed contracts, direct tests, focused and full Go evidence.
- `04-02-SUMMARY.md`: adapter coercion rules, modifier/Mix corpus count, differential evidence.
- `04-03-SUMMARY.md`: WCAG public contracts, threshold/selection tests, Go evidence.
- `04-04-SUMMARY.md`: options/null adapter behavior, readability corpus count, differential evidence.
- `04-05-SUMMARY.md`: palette contracts/order tests and Go evidence.
- `04-06-SUMMARY.md`: palette adapter/corpus completion and final Phase 4 gate evidence.