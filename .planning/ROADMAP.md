# Roadmap: TinyColor.js to Go

## Overview

Build a separate, evidence-backed Go port while preserving this checkout as an
immutable JavaScript behavioral oracle. Work moves from an executable oracle,
through parsing and observable output, to operations and delivery proof.

## Phases

- [x] **Phase 1: Foundation and Oracle** - Establish the Go module and a reproducible Node-to-Go differential baseline.
- [x] **Phase 2: Parsing and Color State** - Match accepted inputs and normalized TinyColor state.
- [x] **Phase 3: Conversion and Representation** - Match conversion, output, and analysis behavior.
- [x] **Phase 4: Operations and Palettes** - Match manipulation, readability, and color-combination behavior.
- [x] **Phase 5: Delivery Evidence** - Ship the CLI, CI, benchmarks, and submission documentation.

## Phase Details

### Phase 1: Foundation and Oracle
**Goal**: A contributor can run the same JSONL request against local `mod.js` and the Go runner, obtain a structured comparison report, and see the upstream files remain untouched.
**Depends on**: Nothing (first phase)
**Requirements**: [EQV-01, QLT-01, QLT-03]
**Success Criteria**:
  1. `src/` builds as an independent module without changing JavaScript source files.
  2. Node and Go runners accept and emit the documented JSONL request/response protocol.
  3. A differential command reports case count, mismatch count, and complete mismatch records.
**Plans**: 1 plan (complete 2026-08-01)

Plans:
- [x] 01-01: Create the Go module, JSONL runners, smoke corpus, and baseline report.

### Phase 2: Parsing and Color State
**Goal**: Go accepts the same supported TinyColor inputs and retains the same validity, format, alpha, and normalized color state.
**Depends on**: Phase 1
**Requirements**: [PAR-01, PAR-02, QLT-02]
**Success Criteria**:
  1. Hex, RGB(A), HSL(A), HSV(A), CSS names, transparent, and object inputs produce matching state.
  2. Permissive syntax, boundary values, invalid input, and alpha normalization match the oracle corpus.
  3. Every discovered parser mismatch has a deterministic regression record.
**Plans**: 2 plans (complete 2026-08-01)

Plans:
- [x] 02-01: Replace Phase 1 fixed inputs with normalized color/model and HEX/RGB/name parsing.
- [x] 02-02: Add HSL/HSV/object parsing and parser differential corpus.

### Phase 3: Conversion and Representation
**Goal**: Go exposes TinyColor-equivalent conversion, string formatting, format fallback, and color analysis.
**Depends on**: Phase 2
**Requirements**: [FMT-01, QLT-02]
**Success Criteria**:
  1. RGB, percentage RGB, HSL, HSV, hex, hex8, name, filter, and generic string outputs match exactly.
  2. Brightness, luminance, equality, cloning, and random behavior have documented parity cases.
  3. No undocumented floating-point tolerance masks an observable mismatch.
**Plans**: 2 plans (complete 2026-08-01)

Plans:
- [x] 03-01-PLAN.md — Implement B's source-equivalent conversion, representation, and analysis facade.
- [x] 03-02-PLAN.md — Add C's JSONL dispatch, differential corpus, and compatibility evidence.

### Phase 4: Operations and Palettes
**Goal**: Go matches TinyColor's stateful modifiers, static utilities, readability checks, and palette ordering.
**Depends on**: Phase 3
**Requirements**: [OPS-01, QLT-02]
**Success Criteria**:
  1. Modifiers preserve default, zero, clamping, wrapping, alpha, and mutation behavior.
  2. Readability and most-readable operations match WCAG option defaults.
  3. Every palette operation returns source-equivalent colors in source order.
**Plans**: 6 plans (complete 2026-08-01)

Plans:
- [x] 04-01 through 04-06: Typed operations, WCAG readability, palettes, compatibility dispatch, and differential evidence.

### Phase 5: Delivery Evidence
**Goal**: A judge can clone the project, verify parity evidence, use a Go CLI, and understand the migration and its limitations.
**Depends on**: Phase 4
**Requirements**: [DEL-01, QLT-03]
**Success Criteria**:
  1. CI runs format, vet, Go tests, and the differential smoke report.
  2. The CLI supports parse, convert, lighten, palette, and contrast, including JSON output.
  3. Benchmarks, documentation, license attribution, team work, and known differences are complete.
**Plans**: 3 plans (complete 2026-08-01)

Plans:
- [x] 05-01: Add the human CLI, reproducible build/verification gate, Docker artifact, and CI.
- [x] 05-02: Publish differential fuzz and shared-workload benchmark evidence.
- [x] 05-03: Publish judge-facing documentation and verify local/public delivery evidence.

## Progress

| Phase | Plans Complete | Status | Completed |
|---|---|---|---|
| 1. Foundation and Oracle | 1/1 | Complete | 2026-08-01 |
| 2. Parsing and Color State | 2/2 | Complete | 2026-08-01 |
| 3. Conversion and Representation | 2/2 | Complete | 2026-08-01 |
| 4. Operations and Palettes | 6/6 | Complete | 2026-08-01 |
| 5. Delivery Evidence | 3/3 | Complete | 2026-08-01 |
