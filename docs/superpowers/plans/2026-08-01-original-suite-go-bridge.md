# Original Suite Against Go Bridge Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Run the byte-identical original `test.js` suite against the native Go port with 45 passed, 0 failed, and 1 ignored.

**Architecture:** A temporary overlay pairs an unchanged copy of `test.js` with a test-only synchronous JavaScript facade. The facade invokes a one-request mode of the existing Go compatibility binary directly through `Deno.Command`; it preserves JavaScript object identity while all color behavior comes from Go.

**Tech Stack:** Go 1.26 standard library, Deno 2 standard APIs, Node.js test runner, GNU Make, GitHub Actions.

## Global Constraints

- Do not modify root `test.js`, `mod.js`, or `tinycolor.js`.
- Do not import or execute the original TinyColor implementation from the facade.
- Do not add dependencies, WebAssembly, FFI, native addons, or JavaScript color algorithms.
- Reuse the existing compatibility request decoder and dispatcher.
- Add one focused failing check before each production behavior change.
- Keep commits small and single-purpose.

---

### Task 1: One-request Go process mode

**Files:**
- Modify: `src/cmd/tinycolor-compat/main_test.go`
- Modify: `src/cmd/tinycolor-compat/main.go`

**Interfaces:**
- Consumes: existing `compat.Decode`, `handle`, and `write` functions.
- Produces: `tinycolor bridge <json-request>`, which writes exactly one encoded compatibility response.

- [ ] **Step 1: Write the failing command test**

Add a table row to `TestRunJSONLAndUsageErrors`:

```go
{
    name:       "one-request bridge",
    args:       []string{"bridge", `{"id":"bridge-red","operation":"output","input":"red","args":{"method":"toHexString"}}`},
    wantStdout: "{\"id\":\"bridge-red\",\"result\":\"#ff0000\"}\n",
},
```

Add rows proving a missing request returns status 2 and malformed JSON returns a structured error without a panic.

- [ ] **Step 2: Run the focused test and verify RED**

Run:

```powershell
$env:GOCACHE='R:\Code\TinyColor\.cache\go-build'
go -C src test ./cmd/tinycolor-compat -run TestRunJSONLAndUsageErrors -count=1
```

Expected: FAIL because `bridge` is treated as an unknown command.

- [ ] **Step 3: Add the minimum one-request path**

Route `bridge` in `run` and decode its single argument through the existing protocol:

```go
case "bridge":
    if len(args) != 2 {
        usage(stderr, "bridge <json-request>")
        return 2
    }
    request, err := compat.Decode([]byte(args[1]))
    if err != nil {
        response, _ := compat.Failure("", err.Error())
        write(response, stdout, stderr)
        return 1
    }
    write(handle(request), stdout, stderr)
    return 0
```

- [ ] **Step 4: Run focused and package tests and verify GREEN**

```powershell
go -C src test ./cmd/tinycolor-compat -count=1
```

Expected: PASS.

- [ ] **Step 5: Commit**

```powershell
git add src/cmd/tinycolor-compat/main.go src/cmd/tinycolor-compat/main_test.go
git commit -m "feat(compat): add one-request bridge mode"
```

---

### Task 2: Source-suite adapter operations

**Files:**
- Modify: `src/tinycolor/color.go`
- Modify: `src/tinycolor/color_test.go`
- Modify: `src/internal/parser/names.go`
- Modify: `src/internal/parser/parser_test.go`
- Modify: `src/cmd/tinycolor-compat/main.go`
- Modify: `src/cmd/tinycolor-compat/main_test.go`

**Interfaces:**
- Consumes: existing `Color` conversion, formatting, mutation, palette, and readability methods.
- Produces: bridge results for object conversions, compact hex, alpha mutation, random snapshots, gradient filters, and the Go-owned color-name map.

- [ ] **Step 1: Write failing Go API tests for alpha and names**

Add `TestSetAlphaMatchesTinyColorBounds` to `src/tinycolor/color_test.go`, asserting that `0.9` is retained and `-1`, `2`, `nil`, and `"test"` normalize to `1` while returning the same receiver.

Add `TestNamesReturnsIndependentCopy` to `src/internal/parser/parser_test.go`, asserting `Names()["red"] == "ff0000"` and that mutating the returned map does not alter a second call.

- [ ] **Step 2: Run focused tests and verify RED**

```powershell
go -C src test ./tinycolor ./internal/parser -run 'Test(SetAlphaMatchesTinyColorBounds|NamesReturnsIndependentCopy)' -count=1
```

Expected: build failure because `SetAlpha` and `Names` do not exist.

- [ ] **Step 3: Implement the two minimal Go APIs**

Add:

```go
func (c *Color) SetAlpha(value any) *Color {
    c.model.A = color.BoundAlpha(value)
    return c
}
```

and an exported `parser.Names()` that returns a copied map using the standard `maps.Clone` function.

- [ ] **Step 4: Add failing bridge result cases**

Extend the command test table with exact requests for:

- `output/toRgb`, `output/toPercentageRgb`, `output/toHsl`, and `output/toHsv`;
- compact `toHex`, `toHexString`, `toHex8`, `toHex8String`, `toString("hex3")`, and `toString("hex4")`;
- `setAlpha` returning the updated inspection;
- `random` returning a valid `prgb` inspection;
- `names` containing `red` and `rebeccapurple`;
- `toFilter` with `gradientType: true`.

Run the focused command tests. Expected: FAIL with unsupported operation or method.

- [ ] **Step 5: Extend the existing dispatcher only**

Add `setAlpha`, `random`, and `names` cases to `handle`. Extend `output` with lowercase-keyed object maps and a boolean `compact` argument. Use one helper that compresses `rrggbb` or `rrggbbaa` only when every pair has equal digits. Pass `gradientType` to `ToFilter` rather than duplicating filter generation.

The object shapes must be:

```go
map[string]any{"r": rgb.R, "g": rgb.G, "b": rgb.B, "a": rgb.A}
map[string]any{"r": fmt.Sprintf("%d%%", rgb.R), "g": fmt.Sprintf("%d%%", rgb.G), "b": fmt.Sprintf("%d%%", rgb.B), "a": rgb.A}
map[string]any{"h": hsl.H, "s": hsl.S, "l": hsl.L, "a": hsl.A}
map[string]any{"h": hsv.H, "s": hsv.S, "v": hsv.V, "a": hsv.A}
```

- [ ] **Step 6: Run all Go and fixed compatibility tests**

```powershell
gofmt -w src/tinycolor/color.go src/tinycolor/color_test.go src/internal/parser/names.go src/internal/parser/parser_test.go src/cmd/tinycolor-compat/main.go src/cmd/tinycolor-compat/main_test.go
go -C src test ./... -count=1
node compat/run.mjs compat/cases/smoke.jsonl
node compat/run.mjs compat/cases/parser-hex-rgb.jsonl
node compat/run.mjs compat/cases/parser.jsonl
node compat/run.mjs compat/cases/conversion.jsonl
node compat/run.mjs compat/cases/operations.jsonl
```

Expected: all pass with zero mismatches.

- [ ] **Step 7: Commit**

```powershell
git add src
git commit -m "feat(compat): expose original-suite operations"
```

---

### Task 3: Byte-identical overlay and synchronous facade

**Files:**
- Create: `tests/original-go/mod.js`
- Create: `tests/original-go/facade.test.mjs`
- Create: `tests/original-go/run.mjs`
- Create: `tests/original-go/run.test.mjs`

**Interfaces:**
- Consumes: `TINYCOLOR_GO_BINARY`, `tinycolor bridge <json-request>`, root `test.js`, and `tests/original/manifest.sha256`.
- Produces: a default-exported TinyColor-compatible facade and a runner that exits with Deno's source-suite status.

- [ ] **Step 1: Write the failing runner integrity test**

In `run.test.mjs`, import a planned `prepareOverlay()` and assert:

```js
const overlay = await prepareOverlay();
try {
  assert.equal(
    createHash("sha256").update(readFileSync(overlay.testFile)).digest("hex"),
    createHash("sha256").update(readFileSync("test.js")).digest("hex"),
  );
  assert.equal(readFileSync(overlay.testFile).equals(readFileSync("test.js")), true);
} finally {
  overlay.cleanup();
}
```

Run `node --test tests/original-go/run.test.mjs`. Expected: FAIL because the module does not exist.

- [ ] **Step 2: Implement overlay preparation**

Use `mkdtempSync`, `copyFileSync`, `copyFileSync` for the facade as `mod.js`, byte comparison, and `rmSync(..., { recursive: true, force: true })`. Call the existing hash verifier before copying. Export `prepareOverlay()` for the Node test.

- [ ] **Step 3: Write the failing Deno facade smoke test**

Build the binary, set `TINYCOLOR_GO_BINARY`, then assert through the facade:

```js
assertEquals(tinycolor("red").toHexString(), "#ff0000");
const color = tinycolor("red");
assert(color.lighten(10) === color);
assertEquals(color.toHexString(), "#ff3333");
assertEquals(tinycolor.fromRatio({ r: 1, g: 0, b: 0 }).toRgb(), { r: 255, g: 0, b: 0, a: 1 });
```

Run the Deno smoke test. Expected: FAIL because the facade does not exist.

- [ ] **Step 4: Implement the minimal facade transport and state wrapper**

Implement `invoke(operation, input, args)` with direct `Deno.Command` execution, response-ID validation, and no shell. Implement input unwrapping and a facade constructor that stores original input, current RGBA, format, and gradient type from Go inspection responses.

Provide all instance APIs exercised by `test.js`:

```text
getOriginalInput getFormat getAlpha setAlpha isValid clone
toRgb toPercentageRgb toHsl toHsv
toRgbString toPercentageRgbString toHslString toHsvString
toHex toHexString toHex8 toHex8String toName toFilter toString
getBrightness getLuminance isDark isLight
lighten brighten darken saturate desaturate greyscale spin
complement analogous monochromatic splitcomplement triad tetrad
```

Provide static APIs:

```text
fromRatio random equals mix readability isReadable mostReadable names
```

Modifiers replace the facade's current Go snapshot and return the same facade. Static and palette results wrap returned Go inspections. `names` comes from the Go `names` operation at module initialization.

- [ ] **Step 5: Run the smoke test and verify GREEN**

```powershell
$env:TINYCOLOR_GO_BINARY='R:\Code\TinyColor\bin\tinycolor.exe'
deno test --allow-run=$env:TINYCOLOR_GO_BINARY tests/original-go/facade.test.mjs
```

Expected: PASS.

- [ ] **Step 6: Commit**

```powershell
git add tests/original-go
git commit -m "test(original): add Go-backed TinyColor facade"
```

---

### Task 4: Full original-suite parity gate

**Files:**
- Modify: `tests/original-go/mod.js`
- Modify: `src/cmd/tinycolor-compat/main.go`
- Modify: `src/cmd/tinycolor-compat/main_test.go`
- Modify: `Makefile`
- Modify: `.github/workflows/port.yml`

**Interfaces:**
- Consumes: the complete original `test.js` API inventory and overlay runner.
- Produces: `make test-original-go` and a required CI gate.

- [ ] **Step 1: Run the full overlay suite and verify integration RED**

```powershell
node tests/original-go/run.mjs
```

Expected: the runner reaches the original suite but reports unsupported facade behavior or assertion mismatches until every mapped method is correct.

- [ ] **Step 2: Close failures one behavior at a time**

For each failure, first add the smallest focused case to `main_test.go` or `facade.test.mjs`, run it to observe the same failure, then change only the implicated dispatcher or facade method. The complete mapped scope is the instance and static API list in Task 3; `polyad` remains the one ignored upstream test and must not be implemented for this deliverable.

- [ ] **Step 3: Verify the exact full-suite result**

Run `node tests/original-go/run.mjs`. Expected final Deno summary:

```text
45 passed | 0 failed | 1 ignored
```

Then run `node tests/original/verify.mjs`. Expected: `verified: 3`.

- [ ] **Step 4: Add Make and CI gates**

Add:

```make
test-original-go: build
	node tests/original-go/run.mjs
```

Include `test-original-go` in `verify` or `test`, and keep the separate `deno test test.js` oracle check in CI. GitHub Actions must therefore run both the source implementation suite and the byte-identical Go-backed suite.

- [ ] **Step 5: Run the complete local gate**

On Windows, run the Makefile commands directly with repository-local `GOCACHE`; on CI-compatible shells run `make verify` and `deno test test.js`. Expected: all gates pass.

- [ ] **Step 6: Commit**

```powershell
git add tests/original-go src Makefile .github/workflows/port.yml
git commit -m "test(original): run unchanged suite against Go"
```

---

### Task 5: Publish honest completion evidence

**Files:**
- Modify: `DECISIONS.md`
- Modify: `README.md`
- Modify: `COMPATIBILITY.md`
- Modify: `docs/TESTING.md`
- Modify: `.planning/STATE.md`

**Interfaces:**
- Consumes: exact local command output and final CI URL.
- Produces: reproducible submission evidence that distinguishes source-oracle and Go-backed suite runs.

- [ ] **Step 1: Record the architectural decision**

Add D-017: use a byte-identical temporary source-test overlay and synchronous test-only facade invoking the native Go binary. Rationale: this runs original assertions against the port without changing kickoff files, copying algorithms into JavaScript, or introducing a second WASM implementation.

- [ ] **Step 2: Update evidence documents**

Document both exact results:

```text
deno test test.js                         45 passed, 0 failed, 1 ignored against source oracle
node tests/original-go/run.mjs           45 passed, 0 failed, 1 ignored against native Go port
```

Update the submission checklist item for original-suite-against-port from partial to complete. Keep the demo video unchecked.

- [ ] **Step 3: Run final verification**

Run all of the following fresh:

```powershell
node tests/original/verify.mjs
node tests/original-go/run.mjs
node tests/port/adapter.test.mjs
node --test tests/original/verify.test.mjs tests/original-go/run.test.mjs
node --test fuzz/harness.test.mjs fuzz/validate-log.test.mjs bench/run.test.mjs
node fuzz/validate-log.mjs fuzz/log.txt
go -C src test ./... -count=1
go -C src vet ./...
git diff --check
```

Expected: zero failures, three verified oracle hashes, a validated fuzz log, and a clean diff check.

- [ ] **Step 4: Commit documentation**

```powershell
git add DECISIONS.md README.md COMPATIBILITY.md docs/TESTING.md .planning/STATE.md
git commit -m "docs: publish original-suite Go evidence"
```

- [ ] **Step 5: Push and verify GitHub Actions**

Push `rajeet`, query the exact HEAD run, and confirm `status=completed` and `conclusion=success`. Add the successful exact-commit URL only if documentation does not already point to the final run; otherwise report it in the handoff.
