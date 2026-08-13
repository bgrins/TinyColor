import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import test from "node:test";
import { verifyManifest } from "./verify.mjs";

const sha256 = (value) => createHash("sha256").update(value).digest("hex");

test("oracle files are checked out with CRLF line endings", () => {
  const files = ["mod.js", "test.js", "tinycolor.js"];
  const attributes = execFileSync("git", ["check-attr", "eol", "--", ...files], {
    encoding: "utf8",
  });

  assert.deepEqual(attributes.trim().split(/\r?\n/), files.map((file) => `${file}: eol: crlf`));
});

test("verifyManifest accepts matching files and reports a changed path", () => {
  const root = mkdtempSync(join(tmpdir(), "tinycolor-verify-"));
  try {
    writeFileSync(join(root, "first.txt"), "first");
    writeFileSync(join(root, "second.txt"), "second");
    const manifest = join(root, "manifest.sha256");
    writeFileSync(manifest, `${sha256("first")}  first.txt\n${sha256("second")}  second.txt\n`);

    assert.deepEqual(verifyManifest(manifest, root), []);

    writeFileSync(join(root, "second.txt"), "changed");
    assert.deepEqual(verifyManifest(manifest, root), ["mismatch: second.txt"]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("verifyManifest reports a malformed manifest line", () => {
  const root = mkdtempSync(join(tmpdir(), "tinycolor-verify-"));
  try {
    const manifest = join(root, "manifest.sha256");
    writeFileSync(manifest, "not a manifest entry\n");

    assert.deepEqual(verifyManifest(manifest, root), ["invalid: not a manifest entry"]);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test("verifyManifest rejects entries outside the manifest root", () => {
  const parent = mkdtempSync(join(tmpdir(), "tinycolor-verify-"));
  const root = join(parent, "root");
  const outside = join(parent, "outside.txt");
  try {
    mkdirSync(root);
    writeFileSync(outside, "outside");
    const manifest = join(root, "manifest.sha256");
    writeFileSync(manifest, `${sha256("outside")}  ${outside}\n${sha256("outside")}  ../outside.txt\n`);

    assert.deepEqual(verifyManifest(manifest, root), [
      `invalid: ${outside}`,
      "invalid: ../outside.txt",
    ]);
  } finally {
    rmSync(parent, { recursive: true, force: true });
  }
});
