import assert from "node:assert/strict";
import test from "node:test";

import { validateLog } from "./validate-log.mjs";

const valid = `duration_seconds: 60.001
seed: 20260801
cases: 1
divergences: 0
`;

test("accepts a complete zero-divergence 60-second log", () => {
  assert.deepEqual(validateLog(valid), {
    duration_seconds: 60.001,
    seed: 20260801,
    cases: 1,
    divergences: 0,
  });
});

test("rejects invalid evidence fields", () => {
  for (const [name, value] of [
    ["duration_seconds", "59.999"],
    ["duration_seconds", "nope"],
    ["seed", "1"],
    ["seed", "1.5"],
    ["cases", "0"],
    ["cases", "1.5"],
    ["divergences", "1"],
    ["divergences", "nope"],
  ]) {
    assert.throws(() => validateLog(valid.replace(new RegExp(`^${name}: .+$`, "m"), `${name}: ${value}`)), name);
  }
});

test("rejects every missing evidence field", () => {
  for (const name of ["duration_seconds", "seed", "cases", "divergences"]) {
    assert.throws(() => validateLog(valid.replace(new RegExp(`^${name}: .+\\n`, "m"), "")), name);
  }
});
