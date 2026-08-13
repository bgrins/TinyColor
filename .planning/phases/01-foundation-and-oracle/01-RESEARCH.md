# Phase 1 Research — Foundation and Oracle

## Findings

- This checkout's executable ESM source is `mod.js`; it exports TinyColor as a
  default function and contains both methods and static helpers.
- `test.js` is a Deno test file that imports `./mod.js`; it has groups for
  initialization, input, conversion, output, readability, modifications, and
  palettes. It should be read as behavior evidence, not altered.
- Node 24.18.0 can execute an ESM adapter locally. Go 1.26.1 is installed.
- Deno is not installed, so `deno task test` cannot currently validate the
  upstream suite. Node import of `mod.js` is the available local oracle path.
- JSON Lines is sufficient for requests because all phase-one inputs and
  outputs can be JSON-safe. Do not attempt to transfer JavaScript functions or
  original object identity through this adapter.

## Recommended implementation shape

Use one short-lived command invocation per runner during Phase 1 for simpler
failure attribution. If benchmark evidence later shows process startup dominates
the suite, upgrade the same protocol to persistent child processes without
changing case files or response schema.

## Pitfalls

- JavaScript's `undefined`, `NaN`, and signed-zero behavior needs explicit
  serialization rules before later corpus expansion.
- A Go error is not automatically source-equivalent: source invalid color input
  frequently creates an invalid value that renders as black.
- JSON field ordering is not behavior; values, operation results, and error
  classification are.

## Validation Architecture

Phase 1 can validate all of its new behavior with Go tests plus one Node-driven
smoke report. The original Deno test suite remains a manual/CI follow-up until
the runtime is installed.

