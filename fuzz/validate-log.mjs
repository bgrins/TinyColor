import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";

export function validateLog(text) {
  const read = (name) => {
    const matches = [...text.matchAll(new RegExp(`^${name}: (.+)$`, "gm"))];
    if (matches.length !== 1) throw new Error(`${name} must appear exactly once`);
    const value = Number(matches[0][1]);
    if (!Number.isFinite(value)) throw new Error(`${name} must be numeric`);
    return value;
  };
  const result = {
    duration_seconds: read("duration_seconds"),
    seed: read("seed"),
    cases: read("cases"),
    divergences: read("divergences"),
  };
  if (result.duration_seconds < 60) throw new Error("duration_seconds must be at least 60");
  if (!Number.isSafeInteger(result.seed) || result.seed !== 20260801) throw new Error("seed must be 20260801");
  if (!Number.isSafeInteger(result.cases) || result.cases <= 0) throw new Error("cases must be a positive integer");
  if (!Number.isSafeInteger(result.divergences) || result.divergences !== 0) throw new Error("divergences must be zero");
  return result;
}

function main() {
  try {
    const path = process.argv[2];
    if (!path) throw new Error("usage: node fuzz/validate-log.mjs <log-path>");
    validateLog(readFileSync(path, "utf8"));
    console.log("fuzz log verified");
  } catch (error) {
    console.error(error.message);
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) main();
