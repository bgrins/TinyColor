import assert from "node:assert/strict";

import tinycolor from "./mod.js";

Deno.test("facade serves TinyColor behavior from Go", () => {
  assert.equal(tinycolor("red").toHexString(), "#ff0000");
  const color = tinycolor("red");
  assert.equal(color.lighten(10), color);
  assert.equal(color.toHexString(), "#ff3333");
  assert.deepEqual(tinycolor.fromRatio({ r: 1, g: 0, b: 0 }).toRgb(), { r: 255, g: 0, b: 0, a: 1 });
  assert.equal(tinycolor("hsl 100 20 10").toHslString(), "hsl(100, 20%, 10%)");
  assert.equal(tinycolor.mix("#000", "#fff").toHsl().l, 0.5);
  assert.equal(tinycolor("red").analogous().map((entry) => entry.toHex()).join(","), "ff0000,ff0066,ff0033,ff0000,ff3300,ff6600");
});
