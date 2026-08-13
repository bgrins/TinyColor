import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { spawnSync } from "node:child_process";
import { isDeepStrictEqual } from "node:util";

const root = process.cwd();
const corpus = process.argv[2];
if (!corpus) throw new Error("usage: node compat/run.mjs <cases.jsonl>");

const cases = readFileSync(corpus, "utf8").split(/\r?\n/).filter(Boolean).map(JSON.parse);
const goEnv = { ...process.env, GOCACHE: process.env.GOCACHE ?? resolve(root, ".cache", "go-build") };

function run(command, args, cwd, request) {
  const output = spawnSync(command, args, { cwd, input: `${JSON.stringify(request)}\n`, encoding: "utf8", env: goEnv });
  if (output.status !== 0) return { id: request.id, error: output.stderr.trim() || `${command} exited ${output.status}` };
  return JSON.parse(output.stdout.trim());
}

function same(left, right) {
  return isDeepStrictEqual(left, right);
}

let passed = 0;
let mismatches = 0;
for (const row of cases) {
  const { owner, suspectedPackage, ...request } = row;
  const js = run(process.execPath, ["compat/js-runner.mjs"], root, request);
  const go = run("go", ["run", "./cmd/tinycolor-compat"], resolve(root, "src"), request);
  if (same(js, go)) {
    passed++;
    continue;
  }
  mismatches++;
  const protocol = Object.hasOwn(js, "result") !== Object.hasOwn(go, "result");
  console.log(JSON.stringify({ case: request.id, operation: request.operation, request, javascript: js, go, owner: owner ?? (protocol ? "compat" : "rajeet-04"), suspectedPackage: suspectedPackage ?? (protocol ? "compat" : "src/tinycolor") }));
}

console.log(`cases: ${cases.length}`);
console.log(`passed: ${passed}`);
console.log(`mismatches: ${mismatches}`);
process.exitCode = mismatches === 0 ? 0 : 1;
