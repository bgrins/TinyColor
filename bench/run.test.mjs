import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { parseWorkload, percentile99, validateResults } from "./run.mjs";

test("percentile99 selects the nearest-rank p99 sample", () => {
  assert.equal(percentile99([1, 2, 3, 4]), 4);
});

test("workload parser accepts a representative public request", () => {
  assert.deepEqual(parseWorkload('{"id":"x","operation":"inspect","input":"red"}\n'), [
    { id: "x", operation: "inspect", input: "red" },
  ]);
});

test("results schema rejects a missing implementation", () => {
  assert.throws(() => validateResults({ samples: { coldStarts: 20, requests: 1000 } }));
});

test("quick benchmark writes complete measurements to a temporary output", () => {
  const output = join(mkdtempSync(join(tmpdir(), "tinycolor-bench-")), "results.json");
  execFileSync(process.execPath, ["bench/run.mjs", "--quick", "--output", output], { stdio: "inherit" });
  const results = JSON.parse(readFileSync(output, "utf8"));
  for (const name of ["javascript", "go"]) {
    const metrics = results.implementations[name];
    assert.ok(metrics.startupP99Ms >= 0);
    assert.ok(metrics.latencyP99Ms >= 0);
    assert.ok(metrics.throughputOpsPerSecond > 0);
    assert.ok(metrics.peakRssBytes === null || metrics.peakRssBytes >= 0);
  }
});
