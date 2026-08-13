# Architecture

```text
immutable JS source (mod.js, test.js)
             │
      Node JSONL oracle
             │
cases ── differential driver ── Go JSONL runner
                                     │
                              src/tinycolor public API
                                │              │
                     internal/color        internal/parser
                                │              │
                           conversion, formatting, utilities
```

## Layers

1. **Compatibility boundary (`compat/` and runner):** accepts JSON-safe dynamic
   input, dispatches named operations, and returns a stable record. It owns no
   color math.
2. **Parsing/model (`src/internal/...`):** turns strings and typed Go inputs into
   normalized RGBA plus validity and source-format metadata.
3. **Public library (`src/tinycolor`):** exposes explicit Go values and methods.
   It owns conversions, formatting, mutation, utilities, readability, and
   palettes.
4. **CLI (`src/cmd/tinycolor-compat`):** a thin user-facing wrapper; it calls the same
   library and does not reimplement parsing or conversion.

The same zero-argument executable is used by `compat/run.mjs`, the fuzz harness,
and the benchmark runner. Human subcommands select the judge-facing CLI instead.

## Compatibility protocol

Each line is a single JSON request with `id`, `operation`, `input`, and optional
`args`. Each response echoes `id` and contains exactly one of `result` or
`error`. The runner must write protocol traffic only to stdout and diagnostics
only to stderr. This makes streamed comparison reliable and keeps CLI output
separate from harness output.

## Data rules

Internal color channels retain floating precision until an observable TinyColor
method rounds them. Alpha is stored in `[0,1]`; detected format and validity are
separate from RGB channels because invalid TinyColor values still render as
black. Original input is adapter metadata: typed Go callers should not need to
recover JavaScript object identity.
