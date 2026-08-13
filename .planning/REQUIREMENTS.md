# Requirements

## Functional

- **PAR-01:** Parse all string formats and object forms accepted by local TinyColor.
- **PAR-02:** Preserve validation, format, original-input, clamping, wrapping, and alpha behavior.
- **FMT-01:** Reproduce color conversion and every documented output representation.
- **OPS-01:** Reproduce mutation, utilities, readability, and palette operations.
- **EQV-01:** Compare Go and local JavaScript behavior through a reusable differential harness.
- **DEL-01:** Provide Go API, CLI, CI, benchmarks, documentation, and attribution.

## Quality

- **QLT-01:** Do not edit the JavaScript source or source tests to achieve parity.
- **QLT-02:** Record every mismatch with complete reproducer and owner.
- **QLT-03:** Keep checks reproducible from a clean checkout.

## Out of scope

New CSS color syntaxes, a web UI, package publication, and compatibility with a
different TinyColor version.

