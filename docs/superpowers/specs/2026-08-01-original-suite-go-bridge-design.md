# Original Suite Against Go Bridge Design

## Goal

Run the pinned, byte-identical `test.js` suite against the compiled Go port and
report its exact pass, fail, and ignored counts. The checked-in JavaScript oracle
files remain unchanged and continue to match `tests/original/manifest.sha256`.

## Hackathon interpretation

The original suite is the test specification, not part of the port. A thin
JavaScript test facade may preserve JavaScript-only object identity, constructor,
and chaining semantics, but every color calculation must be performed by the
submitted native Go artifact. The facade must never import or execute the
original `mod.js` or `tinycolor.js` implementation.

This is distinct from the prohibited pattern of a port shelling out to its source
implementation: the tests invoke the Go port. The shipped Go library and CLI do
not invoke JavaScript.

## Architecture

### Byte-identical test overlay

`tests/original-go/run.mjs` will:

1. Verify the existing kickoff manifest.
2. Build the native `tinycolor-compat` binary.
3. Create a temporary directory.
4. Copy root `test.js` into that directory without transforming it.
5. Verify the copied bytes have the same SHA-256 as root `test.js`.
6. Place the checked-in Go-backed facade beside it as `mod.js`.
7. run `deno test` on the copied `test.js` with permission to execute only the
   compiled Go binary.
8. Remove the temporary directory after the child process exits.

The suite therefore resolves its unchanged `import tinycolor from "./mod.js"`
to the test facade while the source test file itself stays byte-identical.

### One-request native bridge

The compatibility executable will gain a test-only one-request mode that accepts
one JSON request as a direct process argument and writes one JSON response to
stdout. The existing request decoder and `handle` path remain the single dispatch
implementation for persistent JSONL fuzzing and one-request suite calls.

The facade will use `Deno.Command(...).outputSync()` without a shell. Each call
starts the compiled Go executable directly, so JavaScript's synchronous TinyColor
API remains synchronous. Requests are small enough to remain below normal command
line limits; malformed responses or non-zero exits fail the suite immediately
with the Go stderr attached.

### JavaScript facade boundary

`tests/original-go/mod.js` will expose the function/constructor shape expected by
the source suite. A facade color stores:

- the original JavaScript input reference for `getOriginalInput()`;
- the current RGBA snapshot returned by Go;
- the source format and gradient option required for default string behavior.

The facade itself may implement only JavaScript runtime semantics:

- calling `tinycolor(existingFacade)` returns the same object;
- `new tinycolor(existingFacade)` returns the same object;
- instance modifiers mutate and return the same facade;
- `clone()` returns an independent facade;
- palette and static utility results are wrapped as facade instances.

Parsing, normalization, formatting, alpha bounds, conversion, modification,
mixing, readability, and palette generation must come from Go bridge responses.
No TinyColor color algorithm may be reimplemented in the facade.

## Go adapter coverage

The existing compatibility operations will be reused and minimally extended for
source-suite methods that currently lack a result shape:

- object outputs: RGB, percentage RGB, HSL, and HSV;
- alpha mutation;
- random-color snapshots;
- filter gradient options;
- any source-suite method discovered by the failing full-suite run.

Extensions belong in the existing compatibility dispatcher and public Go color
methods. They must be independently covered by focused Go or Node adapter tests
before the facade uses them.

## Test-driven delivery

Implementation proceeds in narrow red-green cycles:

1. A runner-integrity test fails until the copied `test.js` hash is proven equal.
2. A facade smoke test fails until a basic source assertion is served by Go.
3. The full source suite is run against the facade; each unsupported method or
   mismatch becomes one focused regression before the minimum adapter extension.
4. The source suite must finish with 45 passed, 0 failed, and 1 upstream-ignored
   `polyad` test.
5. `make verify` must also retain the existing oracle, Go, Node, fuzz-log,
   compatibility-corpus, and vet gates.

The root `test.js`, `mod.js`, and `tinycolor.js` hashes are checked before and
after the work. A changed oracle file is a hard failure.

## Commands and CI

`make test-original-go` will run the bridge-backed original suite. `make verify`
will include that target so GitHub Actions cannot pass while exercising only the
JavaScript oracle. The README and `COMPATIBILITY.md` will distinguish:

- the original suite against original JavaScript; and
- the same byte-identical suite against the Go-backed facade.

Both commands and exact counts will be published. GitHub Actions must pass at the
final pushed commit before the deliverable is marked complete.

## Error handling

- Missing Deno or Go exits with an actionable command failure.
- A binary exit, timeout, invalid JSON response, or response-ID mismatch fails the
  current assertion instead of falling back to JavaScript.
- The temporary overlay is deleted in a `finally` path.
- No mismatch is hidden with floating-point tolerance or rewritten expectations.

## Non-goals

- Do not edit, patch, transpile, or regenerate `test.js`.
- Do not replace the production `mod.js` oracle.
- Do not add WebAssembly, FFI, native addons, or third-party dependencies.
- Do not reproduce TinyColor algorithms in JavaScript.
- Do not claim coverage for future upstream TinyColor revisions.

## Acceptance criteria

- All three kickoff oracle hashes remain unchanged.
- The copied source test has the same SHA-256 as root `test.js`.
- The facade never imports the original TinyColor implementation.
- Every observable color result used by the suite is returned by the Go binary.
- The bridge-backed run reports 45 passed, 0 failed, and 1 ignored.
- Existing verification and differential checks remain green.
- README, compatibility evidence, Makefile, and CI contain the reproducible
  bridge-backed command.
- The final commit is pushed and its GitHub Actions run succeeds.
