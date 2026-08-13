# Phase 1: Foundation and Oracle - Context

**Gathered:** 2026-08-01
**Status:** Ready for planning

<domain>
## Phase Boundary

Create the independent Go module and a local, executable Node-to-Go comparison
path. This phase proves the test architecture; it does not implement full color
parsing, conversions, or the public CLI.
</domain>

<decisions>
## Implementation Decisions

### Source integrity
- The local `mod.js`, `test.js`, generated npm files, and demo are immutable
  reference files.
- The Node runner imports `./mod.js` directly; it must not compare against a
  registry package.

### Module and protocol
- New implementation files live below `go/`, with a separate `go/go.mod`.
- Both runners use one JSON object per stdin line and one JSON object per stdout
  line. Diagnostics go to stderr.
- The request has `id`, `operation`, `input`, and optional `args`; a response
  echoes `id` and contains one of `result` or `error`.

### Evidence
- The initial corpus is a deliberately small smoke suite sourced from `test.js`
  and README examples; it must include a valid value, invalid value, alpha, a
  named color, and one HSL/HSV/object form.
- The report must include total cases, pass count, mismatch count, and for each
  mismatch the request plus JavaScript and Go results.

### the agent's Discretion
- Package names, JSON implementation details, and exact process-launch strategy,
  provided they maintain the protocol and use standard library dependencies.
</decisions>

<canonical_refs>
## Canonical References

### Source behavior
- `mod.js` — local reference implementation the Node runner imports.
- `test.js` — existing behavioral cases used to seed the corpus.
- `README.md` — accepted input and documented operation surface.

### Project decisions
- `AGENT.md` — repository boundaries, ownership, and required checks.
- `PLAN.md` — all-wave plan and Phase 1 gate.
- `DECISIONS.md` — accepted architecture decisions.
- `docs/ARCHITECTURE.md` — layer and protocol constraints.
- `docs/TESTING.md` — comparison rules and test layers.
</canonical_refs>

<code_context>
## Existing Code Insights

### Reusable Assets
- `mod.js`: ESM default export, directly importable by Node.
- `test.js`: categorized upstream behavior, including invalid colors and alpha.

### Established Patterns
- Source calls return objects and strings; source tests use Deno but local Node
  can import `mod.js` for an adapter.

### Integration Points
- Future Go parser/API code consumes the protocol designed here; the smoke
  runner must allow unsupported operations while the implementation is staged.
</code_context>

<deferred>
## Deferred Ideas

Full parser/conversion implementation (Phase 2/3), CLI and CI (Phase 5), and
Deno suite setup once the runtime is available.
</deferred>

---

*Phase: 01-foundation-and-oracle*
*Context gathered: 2026-08-01*

