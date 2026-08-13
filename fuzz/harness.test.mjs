import assert from "node:assert/strict";
import test from "node:test";

import { createPrng, generateRequest, parseOptions, runHarness } from "./harness.mjs";

const methods = {
  output: new Set([
    "toHex", "toHex8", "toHexString", "toHex8String", "toRgbString",
    "toPercentageRgbString", "toHslString", "toHsvString", "toString",
    "toName", "toFilter",
  ]),
  modify: new Set(["lighten", "brighten", "darken", "saturate", "desaturate", "greyscale", "spin"]),
  palette: new Set(["complement", "splitcomplement", "triad", "tetrad", "analogous", "monochromatic"]),
};
const operations = new Set(["inspect", "output", "modify", "mix", "readability", "isReadable", "palette"]);

test("seed 1 repeats the same PRNG sequence", () => {
  const first = createPrng(1);
  const second = createPrng(1);
  assert.deepEqual(Array.from({ length: 8 }, first), Array.from({ length: 8 }, second));
});

test("request generation is deterministic and adapter-supported", () => {
  const first = createPrng(20260801);
  const second = createPrng(20260801);
  const requests = Array.from({ length: 70 }, (_, index) => generateRequest(first, index));

  assert.deepEqual(requests, Array.from({ length: 70 }, (_, index) => generateRequest(second, index)));
  for (const [index, request] of requests.entries()) {
    assert.equal(request.id, `fuzz-${index}`);
    assert.ok(operations.has(request.operation), request.operation);
    if (methods[request.operation]) assert.ok(methods[request.operation].has(request.args.method), request.args.method);
  }
  assert.deepEqual(new Set(requests.map(({ operation }) => operation)), operations);
});

test("option parsing validates duration and seed", () => {
  assert.deepEqual(parseOptions([]), { duration: 60, seed: 20260801 });
  assert.deepEqual(parseOptions(["--duration", "0.25", "--seed", "1"]), { duration: 0.25, seed: 1 });
  for (const args of [
    ["--duration", "0"],
    ["--duration", "-1"],
    ["--duration", "nope"],
    ["--seed", "1.5"],
    ["--seed", "nope"],
  ]) assert.throws(() => parseOptions(args));
});

test("one-second differential run uses persistent adapters", { timeout: 30_000 }, async () => {
  const summary = await runHarness({ duration: 1, seed: 1, onDivergence() {} });
  assert.ok(summary.elapsedSeconds >= 1, summary.elapsedSeconds);
  assert.ok(summary.cases > 0, summary.cases);
  assert.equal(summary.divergences, 0);
});
