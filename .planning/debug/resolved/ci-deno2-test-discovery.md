---
status: resolved
trigger: "Deno 2 removed the files test config, so deno task test discovers generated npm and Node port tests and fails on undeclared @deno/shim-deno-test imports."
created: 2026-08-01T05:20:00+05:30
updated: 2026-08-01T05:23:00+05:30
---

## Current Focus

hypothesis: Confirmed: the workflow invoked broad task discovery, while the source contract is the root test.js suite only.
test: Completed workflow text audit and git diff --check.
expecting: All checks pass.
next_action: Archive the resolved record and commit only the workflow and this debug document.

## Symptoms

expected: CI runs only the immutable original root suite test.js.
actual: Deno 2 discovers npm/esm/test.js, npm/cjs/test.js, tests/original/verify.test.mjs, and tests/port/adapter.test.mjs.
errors: Deno warns that files test config was removed; type-check fails because @deno/shim-deno-test is not a declared Deno dependency in generated npm tests.
reproduction: GitHub Actions source-suite step runs deno task test under Deno 2.
started: Appeared in CI after the oracle hash checkout fix allowed verification to reach the Deno source-suite step.

## Eliminated

## Evidence

- timestamp: 2026-08-01T05:20:00+05:30
  checked: GitHub Actions failure report.
  found: Deno 2 ignores the removed files test config and broad task discovery reaches generated npm and Node-specific tests.
  implication: Test discovery scope, not missing npm-test dependencies, is the failure boundary.

- timestamp: 2026-08-01T05:21:00+05:30
  checked: Complete .github/workflows/port.yml.
  found: The source-suite step runs deno task test without a path, exactly matching the broad discovery trigger.
  implication: Scoping this existing CI invocation to test.js fixes the cause without modifying configs, dependencies, or generated tests.

- timestamp: 2026-08-01T05:23:00+05:30
  checked: Exact workflow command audit and git diff --check.
  found: deno test test.js is present; deno task test and --no-check are absent; git diff --check exited 0 with only line-ending conversion warnings.
  implication: The workflow is narrowly scoped to the immutable source suite and the change has no whitespace errors.

## Resolution

root_cause: Deno 2 removed the files test configuration, but CI still invoked deno task test without a path. That broad invocation recursively discovered generated npm and Node port tests outside the intended immutable root suite, then type-checking failed on their environment-specific imports.
fix: Change only the source-suite workflow command to deno test test.js.
verification: Text audit confirmed deno test test.js is present and deno task test/--no-check are absent; git diff --check exited 0.
files_changed: [.github/workflows/port.yml, .planning/debug/resolved/ci-deno2-test-discovery.md]
