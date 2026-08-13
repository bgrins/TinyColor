# Decisions

| ID | Decision | Why | Status |
|---|---|---|---|
| D-001 | Port the checked-out `mod.js` behavior to Go. | It is the exact source and test target selected at kickoff. | Accepted |
| D-002 | Keep JavaScript oracle files immutable. | Differential evidence is credible only when the reference cannot move with the port. | Accepted |
| D-003 | Put the independent Go module in `src/`. | It follows the submission layout while keeping the JavaScript oracle at the root. | Accepted |
| D-004 | Use JSON Lines adapters over stdin/stdout. | Both runtimes can compare dynamic inputs and operations without editing source tests. | Accepted |
| D-005 | Prefer the Go and Node standard libraries. | TinyColor's algorithms and evidence runners need no third-party dependency or supply-chain surface. | Accepted |
| D-006 | Preserve JavaScript quirks at the adapter boundary while exposing typed Go values. | Compatibility semantics should not force dynamic JavaScript shapes onto every Go caller. | Accepted |
| D-007 | Run the pinned source suite explicitly as `deno test test.js`. | Broad Deno discovery includes generated npm and port-owned tests outside the original suite. | Accepted |
| D-008 | Use a finite V8-derived luminance transfer table. | Go `math.Pow` differs by one ULP for some rounded channels; the finite table preserves exact parity without tolerance. | Accepted |
| D-009 | Keep human CLI commands and zero-argument JSONL mode in one executable. | One artifact serves judges and automated differential tools without duplicate color logic. | Accepted |
| D-010 | Verify kickoff files with a cross-platform SHA-256 manifest parser. | Hash checks must behave consistently with pinned CRLF oracle files and reject path traversal. | Accepted |
| D-011 | Seed the differential fuzzer and use persistent child processes. | A reproducible request prefix plus one process per runtime gives sustained public-API coverage without startup noise. | Accepted |
| D-012 | Compare fuzz responses exactly. | Broad floating-point tolerances would hide observable compatibility defects. | Accepted |
| D-013 | Benchmark both adapters with the same fixed JSONL workload and lifecycle. | Shared inputs and same-host cold/persistent runs make the measurements directly reproducible. | Accepted |
| D-014 | Normalize benchmark workload newlines before hashing. | Evidence hashes remain stable across Windows and Unix checkouts without changing request content. | Accepted |
| D-015 | Publish unsupported or external deliverables as unverified. | Honest missing evidence is preferable to unreproducible CI, public-access, or video claims. | Accepted |
| D-016 | Return an empty typed Go palette for non-positive counts instead of reproducing TinyColor's non-terminating negative `analogous` loop. | Compatibility must not make a public Go call hang indefinitely; adapter zero values still retain TinyColor's documented defaults. | Accepted |
| D-017 | Run a byte-identical copy of `test.js` through a test-only synchronous facade that invokes the native Go binary. | This executes the original assertions against the port without editing kickoff files, copying color algorithms into JavaScript, or adding a second WebAssembly implementation. | Accepted |
