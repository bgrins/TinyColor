---
status: resolved
trigger: "Fix GitHub Actions make verify where tests/original/verify.mjs reports mismatch for mod.js, test.js, tinycolor.js."
created: 2026-08-01T05:09:56.9355940+05:30
updated: 2026-08-01T05:16:00+05:30
---

## Current Focus

hypothesis: Confirmed: the oracle manifest describes CRLF working-tree bytes, but Git had no checkout eol attribute for the three LF blobs.
test: Completed focused regression, production verifier, and whitespace validation.
expecting: All checks pass.
next_action: Archive this resolved record and commit only the assigned files.

## Symptoms

expected: Ubuntu checkout bytes match kickoff manifest and verifier prints verified: 3.
actual: All three oracle text files mismatch in CI; local Windows passes.
errors: mismatch: mod.js / test.js / tinycolor.js; Make hashes target exits 1.
reproduction: Local SHA-256 hashes equal manifest, while raw Git blob SHA-256 values are different LF bytes. Local core.autocrlf=true; no .gitattributes exists; oracle git diff is empty.
started: Introduced when CI started running the existing Windows-derived kickoff manifest.

## Eliminated

## Evidence

- timestamp: 2026-08-01T05:09:56.9355940+05:30
  checked: Prefilled symptom evidence.
  found: Windows working-tree hashes match the manifest, but raw Git blob hashes do not; the repository lacks .gitattributes and local core.autocrlf=true.
  implication: Checkout line-ending conversion, rather than oracle content drift, is the leading mechanism.

- timestamp: 2026-08-01T05:11:00+05:30
  checked: Assigned verifier files and root attributes file.
  found: tests/original/verify.test.mjs already exists; .gitattributes and the debug knowledge base do not. verify.mjs hashes raw file bytes and does no line-ending normalization.
  implication: The repository checkout must supply the manifest's CRLF bytes; verifier behavior should remain unchanged.

- timestamp: 2026-08-01T05:13:00+05:30
  checked: New focused Node test before adding attributes.
  found: The test failed exactly as predicted; git check-attr returned eol: unspecified for mod.js, test.js, and tinycolor.js while the other three verifier tests passed.
  implication: The missing checkout policy is directly reproduced and the hypothesis is confirmed.

- timestamp: 2026-08-01T05:15:00+05:30
  checked: Focused Node suite after adding .gitattributes.
  found: All four tests passed, including the check that all three oracle paths resolve to eol: crlf.
  implication: The repository now declares the required checkout bytes independently of platform defaults.

- timestamp: 2026-08-01T05:16:00+05:30
  checked: Production verifier and git diff --check.
  found: verify.mjs printed verified: 3; git diff --check exited 0 with only line-ending conversion warnings, including one for a concurrent fuzz file that was not touched.
  implication: The original hash verification succeeds and the assigned diff contains no whitespace errors.

## Resolution

root_cause: The kickoff manifest hashes CRLF working-tree bytes, but the repository stores LF blobs and had no .gitattributes policy. Windows core.autocrlf=true masked this locally; Ubuntu checked out LF bytes and all three raw-byte hashes mismatched.
fix: Pin mod.js, test.js, and tinycolor.js to text eol=crlf at the repository root; retain a focused git check-attr regression test.
verification: RED confirmed eol unspecified; GREEN confirmed 4/4 focused tests pass; production verifier printed verified: 3; git diff --check exited 0.
files_changed: [.gitattributes, tests/original/verify.test.mjs, .planning/debug/resolved/ci-oracle-hash-line-endings.md]
