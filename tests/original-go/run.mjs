import { execFileSync, spawnSync } from "node:child_process";
import { copyFileSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, resolve } from "node:path";
import { pathToFileURL } from "node:url";

import { verifyManifest } from "../original/verify.mjs";

const root = resolve(import.meta.dirname, "../..");

export function prepareOverlay() {
  const failures = verifyManifest(resolve(root, "tests/original/manifest.sha256"), root);
  if (failures.length) throw new Error(failures.join("\n"));
  const directory = mkdtempSync(resolve(tmpdir(), "tinycolor-original-go-"));
  const testFile = resolve(directory, "test.js");
  copyFileSync(resolve(root, "test.js"), testFile);
  copyFileSync(resolve(import.meta.dirname, "mod.js"), resolve(directory, "mod.js"));
  if (!readFileSync(testFile).equals(readFileSync(resolve(root, "test.js")))) {
    rmSync(directory, { recursive: true, force: true });
    throw new Error("copied test.js differs from kickoff test.js");
  }
  return {
    directory,
    testFile,
    cleanup: () => rmSync(directory, { recursive: true, force: true }),
  };
}

function buildBinary() {
  mkdirSync(resolve(root, "bin"), { recursive: true });
  const suffix = execFileSync("go", ["env", "GOEXE"], { cwd: root, encoding: "utf8" }).trim();
  const binary = resolve(root, "bin", `tinycolor${suffix}`);
  execFileSync("go", ["-C", "src", "build", "-o", `../bin/tinycolor${suffix}`, "./cmd/tinycolor-compat"], {
    cwd: root,
    env: { ...process.env, GOCACHE: process.env.GOCACHE ?? resolve(root, ".cache/go-build") },
    stdio: "inherit",
  });
  return binary;
}

function main() {
  const binary = buildBinary();
  const overlay = prepareOverlay();
  try {
    const result = spawnSync("deno", [
      "test",
      `--allow-env=TINYCOLOR_GO_BINARY`,
      `--allow-run=${binary}`,
      overlay.testFile,
    ], {
      cwd: root,
      env: {
        ...process.env,
        DENO_DIR: process.env.DENO_DIR ?? resolve(root, ".cache/deno"),
        TINYCOLOR_GO_BINARY: binary,
      },
      stdio: "inherit",
    });
    if (result.error) throw result.error;
    process.exitCode = result.status ?? 1;
  } finally {
    overlay.cleanup();
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
