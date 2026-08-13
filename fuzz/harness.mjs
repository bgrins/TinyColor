import { execFileSync, spawn } from "node:child_process";
import { mkdirSync } from "node:fs";
import { resolve } from "node:path";
import { createInterface } from "node:readline";
import { pathToFileURL } from "node:url";
import { isDeepStrictEqual } from "node:util";

const root = resolve(import.meta.dirname, "..");
const defaults = { duration: 60, seed: 20260801 };
const operations = ["inspect", "output", "modify", "mix", "readability", "isReadable", "palette"];
const outputMethods = [
  "toHex", "toHex8", "toHexString", "toHex8String", "toRgbString",
  "toPercentageRgbString", "toHslString", "toHsvString", "toString",
  "toName", "toFilter",
];
const modifyMethods = ["lighten", "brighten", "darken", "saturate", "desaturate", "greyscale", "spin"];
const paletteMethods = ["complement", "splitcomplement", "triad", "tetrad", "analogous", "monochromatic"];
const components = [0, 1, 15, 32, 64, 127, 128, 192, 254, 255];
const alphas = [0, 0.25, 0.5, 0.75, 1];

export function createPrng(seed) {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) >>> 0;
    let value = state;
    value = Math.imul(value ^ value >>> 15, value | 1);
    value ^= value + Math.imul(value ^ value >>> 7, value | 61);
    return ((value ^ value >>> 14) >>> 0) / 0x100000000;
  };
}

const pick = (random, values) => values[Math.floor(random() * values.length)];

function colorInput(random) {
  const r = pick(random, components);
  const g = pick(random, components);
  const b = pick(random, components);
  const a = pick(random, alphas);
  switch (Math.floor(random() * 4)) {
    case 0: return `#${[r, g, b].map((value) => value.toString(16).padStart(2, "0")).join("")}`;
    case 1: return `rgb(${r}, ${g}, ${b})`;
    case 2: return `rgba(${r}, ${g}, ${b}, ${a})`;
    default: return { r, g, b, a };
  }
}

export function generateRequest(random, index) {
  const operation = operations[index % operations.length];
  const input = colorInput(random);
  const request = { id: `fuzz-${index}`, operation, input, args: {} };
  switch (operation) {
    case "output": {
      const method = pick(random, outputMethods);
      request.args.method = method;
      if (method === "toString") request.args.format = pick(random, ["hex", "hex8", "rgb", "prgb", "hsl", "hsv", "name"]);
      if (method === "toFilter") request.args.secondColor = colorInput(random);
      break;
    }
    case "modify": {
      const method = pick(random, modifyMethods);
      request.args.method = method;
      if (method !== "greyscale") request.args.amount = method === "spin"
        ? pick(random, [-360, -180, -120, 0, 120, 180, 360])
        : pick(random, [-100, -50, 0, 10, 20, 50, 100]);
      break;
    }
    case "mix":
      request.args = { other: colorInput(random), amount: pick(random, [-50, 0, 25, 50, 75, 100, 150]) };
      break;
    case "readability":
      request.args.other = colorInput(random);
      break;
    case "isReadable":
      request.args = {
        other: colorInput(random),
        options: { level: pick(random, ["AA", "AAA"]), size: pick(random, ["small", "large"]) },
      };
      break;
    case "palette": {
      const method = pick(random, paletteMethods);
      request.args.method = method;
      if (method === "analogous") Object.assign(request.args, { results: pick(random, [1, 3, 6]), slices: pick(random, [6, 12, 30]) });
      if (method === "monochromatic") request.args.results = pick(random, [1, 3, 6]);
      break;
    }
  }
  return request;
}

function validateOptions(options) {
  if (!Number.isFinite(options.duration) || options.duration <= 0) throw new Error("--duration must be a positive number");
  if (!Number.isSafeInteger(options.seed)) throw new Error("--seed must be an integer");
  return options;
}

export function parseOptions(args) {
  const options = { ...defaults };
  for (let index = 0; index < args.length; index += 2) {
    const flag = args[index];
    const value = args[index + 1];
    if (value === undefined) throw new Error(`${flag} requires a value`);
    if (flag === "--duration") options.duration = Number(value);
    else if (flag === "--seed") options.seed = Number(value);
    else throw new Error(`unknown option: ${flag}`);
  }
  return validateOptions(options);
}

function startRunner(command, args, env) {
  const child = spawn(command, args, { cwd: root, env, stdio: ["pipe", "pipe", "pipe"] });
  child.stdout.setEncoding("utf8");
  child.stderr.setEncoding("utf8");
  let stderr = "";
  let spawnError;
  child.stderr.on("data", (chunk) => { stderr += chunk; });
  child.on("error", (error) => { spawnError = error; });
  const closed = new Promise((resolveClose) => child.once("close", (code, signal) => resolveClose({ code, signal })));
  return {
    child,
    closed,
    get failure() { return spawnError; },
    get stderr() { return stderr.trim(); },
    lines: createInterface({ input: child.stdout, crlfDelay: Infinity })[Symbol.asyncIterator](),
  };
}

function withTimeout(promise, milliseconds, message) {
  let timer;
  return Promise.race([
    promise,
    new Promise((_, reject) => { timer = setTimeout(() => reject(new Error(message)), milliseconds); }),
  ]).finally(() => clearTimeout(timer));
}

function writeLine(runner, line) {
  return new Promise((resolveWrite, reject) => {
    const fail = (error) => reject(new Error(`write failure: ${error.message}`));
    runner.child.stdin.once("error", fail);
    runner.child.stdin.write(`${line}\n`, (error) => {
      runner.child.stdin.off("error", fail);
      if (error) fail(error);
      else resolveWrite();
    });
  });
}

async function exchange(runner, request) {
  await writeLine(runner, JSON.stringify(request));
  const { value, done } = await runner.lines.next();
  if (done) {
    const detail = runner.failure?.message || runner.stderr || "child exited before responding";
    throw new Error(detail);
  }
  let response;
  try {
    response = JSON.parse(value);
  } catch {
    throw new Error(`invalid JSON response: ${value}`);
  }
  if (response.id !== request.id) throw new Error(`response ID mismatch: expected ${request.id}, got ${response.id}`);
  return response;
}

async function stopRunner(runner) {
  if (!runner) return;
  if (!runner.child.stdin.destroyed) runner.child.stdin.end();
  let result;
  try {
    result = await withTimeout(runner.closed, 1_000, "child shutdown timeout");
  } catch (error) {
    runner.child.kill();
    await runner.closed;
    throw error;
  }
  if (runner.failure) throw runner.failure;
  if (result.code !== 0) throw new Error(runner.stderr || `child exited ${result.code ?? result.signal}`);
}

function buildBinary(env) {
  mkdirSync(resolve(root, "bin"), { recursive: true });
  const suffix = execFileSync("go", ["env", "GOEXE"], { cwd: root, env, encoding: "utf8" }).trim();
  execFileSync("go", ["-C", "src", "build", "-o", `../bin/tinycolor${suffix}`, "./cmd/tinycolor-compat"], {
    cwd: root,
    env,
    stdio: ["ignore", "ignore", "inherit"],
  });
  return resolve(root, "bin", `tinycolor${suffix}`);
}

export async function runHarness({ duration = defaults.duration, seed = defaults.seed, onDivergence = console.log } = {}) {
  validateOptions({ duration, seed });
  const env = { ...process.env, GOCACHE: process.env.GOCACHE ?? resolve(root, ".cache", "go-build") };
  const binary = buildBinary(env);
  const javascript = startRunner(process.execPath, ["compat/js-runner.mjs"], env);
  const go = startRunner(binary, [], env);
  const random = createPrng(seed);
  let cases = 0;
  let divergences = 0;
  let start;
  let failure;

  try {
    start = process.hrtime.bigint();
    const durationNanoseconds = BigInt(Math.ceil(duration * 1e9));
    do {
      const request = generateRequest(random, cases);
      const [javascriptResponse, goResponse] = await withTimeout(
        Promise.all([exchange(javascript, request), exchange(go, request)]),
        5_000,
        `timeout waiting for ${request.id}`,
      );
      cases++;
      if (!isDeepStrictEqual(javascriptResponse, goResponse)) {
        divergences++;
        onDivergence(JSON.stringify({ request, javascript: javascriptResponse, go: goResponse }));
      }
    } while (process.hrtime.bigint() - start < durationNanoseconds);
  } catch (error) {
    failure = error;
  }

  const stopped = await Promise.allSettled([stopRunner(javascript), stopRunner(go)]);
  if (!failure) failure = stopped.find(({ status }) => status === "rejected")?.reason;
  const elapsedSeconds = start ? Number(process.hrtime.bigint() - start) / 1e9 : 0;
  const summary = { elapsedSeconds, seed, cases, divergences };
  if (failure) {
    failure.summary = summary;
    throw failure;
  }
  return summary;
}

function printSummary(summary) {
  console.log(`duration_seconds: ${summary.elapsedSeconds.toFixed(3)}`);
  console.log(`seed: ${summary.seed}`);
  console.log(`cases: ${summary.cases}`);
  console.log(`divergences: ${summary.divergences}`);
}

async function main() {
  let options = defaults;
  try {
    options = parseOptions(process.argv.slice(2));
    const summary = await runHarness({ ...options, onDivergence: console.log });
    printSummary(summary);
    if (summary.divergences) process.exitCode = 1;
  } catch (error) {
    console.error(error.message);
    printSummary(error.summary ?? { elapsedSeconds: 0, seed: options.seed, cases: 0, divergences: 0 });
    process.exitCode = 1;
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) await main();
