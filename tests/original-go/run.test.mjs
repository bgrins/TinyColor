import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import test from "node:test";

import { prepareOverlay } from "./run.mjs";

const digest = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");

test("overlay preserves the original test bytes", () => {
  const overlay = prepareOverlay();
  try {
    assert.equal(digest(overlay.testFile), digest("test.js"));
    assert.equal(readFileSync(overlay.testFile).equals(readFileSync("test.js")), true);
  } finally {
    overlay.cleanup();
  }
});
