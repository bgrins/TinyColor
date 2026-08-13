import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { resolve, sep } from "node:path";

const digest = (file) => createHash("sha256").update(readFileSync(file)).digest("hex");

export function verifyManifest(manifestPath, root) {
  const resolvedRoot = resolve(root);
  return readFileSync(manifestPath, "utf8").split(/\r?\n/).filter(Boolean).flatMap((line) => {
    const match = line.match(/^(\S+)\s{2}(.+)$/);
    if (!match) return [`invalid: ${line}`];
    const [, expected, file] = match;
    const path = resolve(resolvedRoot, file);
    if (path !== resolvedRoot && !path.startsWith(resolvedRoot + sep)) return [`invalid: ${file}`];
    try {
      return digest(path) === expected ? [] : [`mismatch: ${file}`];
    } catch {
      return [`missing: ${file}`];
    }
  });
}

if (import.meta.main) {
  const manifest = resolve("tests/original/manifest.sha256");
  const failures = verifyManifest(manifest, process.cwd());
  if (failures.length) {
    console.error(failures.join("\n"));
    process.exitCode = 1;
  } else {
    console.log(`verified: ${readFileSync(manifest, "utf8").split(/\r?\n/).filter(Boolean).length}`);
  }
}
