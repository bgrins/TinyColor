# Differential fuzzing

`harness.mjs` sends one deterministic JSONL request stream to persistent
JavaScript and Go adapters and compares every parsed response exactly.

One-second smoke:

```text
node fuzz/harness.mjs --duration 1 --seed 1
```

Full evidence run:

```text
node fuzz/harness.mjs --duration 60 --seed 20260801
```

Validate the checked-in evidence:

```text
node fuzz/validate-log.mjs fuzz/log.txt
```

Rerun a failure with the logged seed and duration. Each divergence is a JSON
object containing the request and both responses; the four final lines report
duration, seed, case count, and divergence count.

Claim zero divergences only from a real saved run whose reported duration meets
the claim. A deterministic seed reproduces the request prefix, while case count
can vary with machine speed.
