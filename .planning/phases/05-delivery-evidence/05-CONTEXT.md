# Phase 5: Delivery Evidence - Context

**Gathered:** 2026-08-01
**Status:** Ready for planning
**Source:** Approved Phase 5 delivery design

<domain>
## Phase Boundary

Ship the completed Go port as a reproducible Track H submission. This phase
adds the human CLI, clean-checkout verification, CI, differential fuzz evidence,
honest benchmark evidence, and judge-facing documentation. It does not add new
TinyColor behavior or change the immutable JavaScript oracle.

</domain>

<decisions>
## Implementation Decisions

### Submission layout
- Keep `README.md`, `DECISIONS.md`, `Dockerfile`, `src/`, `tests/original/`,
  `tests/port/`, `fuzz/`, `bench/`, and `.port-mortem.toml` in their current
  top-level locations.
- Do not create a parallel submission tree.
- Preserve `mod.js`, `tinycolor.js`, `test.js`, `npm/`, `dist/`, and `demo/` as
  immutable oracle material.

### CLI and build
- Reuse the existing Go compatibility binary and `tinycolor` package.
- Provide `parse`, `convert`, `lighten`, `palette`, and `contrast` commands.
- Every human command supports deterministic `--json` output.
- Preserve JSONL compatibility mode for `compat/run.mjs`.
- `make build` produces `bin/tinycolor`; Docker builds the same executable.

### Verification and CI
- `make verify` checks Go formatting, tests, vet, immutable oracle hashes,
  adapter tests, and every fixed differential corpus.
- GitHub Actions calls the documented repository commands instead of duplicating
  a separate CI-only procedure.
- Do not claim the untouched Deno suite passed unless Deno is installed and
  `deno task test` actually succeeds.

### Differential fuzzing
- Use Node and Go standard libraries only.
- Run identical generated public-API requests through the checked-in JavaScript
  oracle and Go port.
- Publish a real `fuzz/log.txt` from at least 60 continuous seconds, including
  duration, seed, case count, and divergence count.
- Claim Differential Fuzz Survivor only if the recorded run has zero divergences.

### Benchmarks
- Use a shared workload for JavaScript and Go on the same machine.
- Report cold startup, latency p99, throughput, and peak RSS with sample counts,
  tool versions, commands, and limitations.
- Store machine-readable values in `bench/results.json` and methodology in
  `bench/methodology.md`; do not generalize one machine's result.

### Documentation
- Make the root README describe the Go port, migration rationale, one-command
  build, CLI examples, verification, evidence, known limitations, and upstream
  attribution.
- Record at least ten substantive decisions in `DECISIONS.md`.
- Report corpus pass rates, oracle hash status, unsafe count, coverage where
  measured, and all known limitations in `COMPATIBILITY.md`.
- Keep team ownership and MIT attribution explicit.
- Add a five-minute demo script. Do not claim a recorded or published video
  without an actual video artifact or URL.

### the agent's Discretion
- Exact CLI flag spelling and JSON field arrangement, provided outputs are stable
  and tests demonstrate all five required commands.
- Exact deterministic fuzz input distribution and benchmark sample sizes.
- CI runner versions and artifact naming, provided clean-checkout commands match
  local documentation.

</decisions>

<canonical_refs>
## Canonical References

**Downstream agents MUST read these before planning or implementing.**

### Approved delivery contract
- `docs/superpowers/specs/2026-08-01-phase-5-delivery-evidence-design.md` — locked
  Phase 5 structure, evidence, and honest-claim rules.
- `.planning/ROADMAP.md` — Phase 5 goal and success criteria.
- `.planning/REQUIREMENTS.md` — DEL-01 and QLT-03 requirements.

### Project behavior and boundaries
- `AGENT.md` — immutable oracle, ownership, checks, and definition of done.
- `PLAN.md` — Wave 4 delivery scope and gate.
- `src/cmd/tinycolor-compat/main.go` — existing JSONL command boundary to reuse.
- `compat/run.mjs` — existing differential execution path.
- `tests/original/manifest.sha256` — pinned oracle hashes.

### Existing delivery files
- `Makefile` — current build and test entry points.
- `Dockerfile` — current one-command artifact build.
- `DECISIONS.md` — accepted architectural decisions.
- `COMPATIBILITY.md` — current evidence and honest limitations.
- `docs/TEAM-OWNERSHIP.md` — contributor responsibilities.

</canonical_refs>

<specifics>
## Specific Ideas

- Favor the attainable Differential Fuzz Survivor, Zero Unsafe, and Decision Log
  bonus evidence.
- Keep every implementation slice in a separate micro-commit so one feature can
  be reverted without undoing unrelated Phase 5 work.

</specifics>

<deferred>
## Deferred Ideas

- A GUI, web service, package publication, transpiler, FFI, and JavaScript
  runtime embedding remain out of scope.
- Bug Catcher is not a planned claim; add it only if differential testing finds
  a reproducible upstream defect.

</deferred>

---

*Phase: 05-delivery-evidence*
*Context gathered: 2026-08-01 from approved delivery design*
