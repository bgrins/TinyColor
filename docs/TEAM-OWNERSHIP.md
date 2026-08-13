# Team Ownership and Handoffs

## A — Model and parser lead @rajeet-04

Owns normalized color data, inputs, low-level bounds, format metadata, named
colors, and string/object parsing. Delivers parser fixtures and a documented
package contract before B depends on it.

## B — Conversion and behavior lead @xthxr

Owns conversion, formatting, instance/static operations, readability, and
palettes. Consumes A's parsed color contract; does not change it unilaterally.

## C — Equivalence and quality lead @mrashis

Owns the Node and Go adapters, case schema, differential driver, seeded corpus,
regressions, and compatibility matrix. C can block a merge on unexplained
behavioral divergence.

## D — Integration and delivery lead @deepali

Owns module setup, CLI, CI, benchmarks, README integration, demo instructions,
and release hygiene. D does not declare parity from a benchmark or unit test;
the differential report is required.

## Handoff format

Every handoff includes the commit, public contract or command added, passing
checks, corpus coverage, and known gaps. Do not hand off an uncommitted shared
working tree as the only artifact.

## Phase 5 integration handoff

- @rajeet-04 integrated exact fuzz parity, the validated 60-second log, and the
  shared benchmark evidence on branch `rajeet`.
- @mrashis owns any new differential mismatch reproduction.
- @deepali owns final submission presentation and the manual demo-video URL.
- @xthxr remains the review lead for conversion, readability, and palette
  behavior; Phase 1–4 ownership is unchanged.

