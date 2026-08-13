import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { execFileSync, spawn } from "node:child_process";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { cpus } from "node:os";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import readline from "node:readline";

const root = resolve(import.meta.dirname, "..");
const committedOutput = resolve(root, "bench/results.json");
const runnerEnv = { ...process.env, GOCACHE: process.env.GOCACHE ?? resolve(root, ".cache", "go-build") };

export const percentile99 = (values) => {
  assert.ok(values.length > 0, "percentile requires at least one sample");
  const sorted = [...values].sort((a, b) => a - b);
  return sorted[Math.ceil(sorted.length * 0.99) - 1];
};

export const parseWorkload = (text) => text.split(/\r?\n/).filter(Boolean).map((line, index) => {
  const request = JSON.parse(line);
  if (!request.id || !request.operation) throw new Error(`workload line ${index + 1} requires id and operation`);
  return request;
});

export const validateResults = (results) => {
  assert.equal(typeof results.generatedAt, "string");
  assert.ok(results.samples.coldStarts >= 20);
  assert.ok(results.samples.requests >= 1000);
  for (const name of ["javascript", "go"]) {
    const metrics = results.implementations?.[name];
    assert.ok(metrics, `missing ${name} metrics`);
    for (const key of ["startupP99Ms", "latencyP99Ms", "throughputOpsPerSecond"]) {
      assert.ok(Number.isFinite(metrics[key]) && metrics[key] >= 0, `${name}.${key} must be nonnegative`);
    }
    assert.ok(metrics.peakRssBytes === null || (Number.isFinite(metrics.peakRssBytes) && metrics.peakRssBytes >= 0));
  }
  return true;
};

const nsToMs = (nanoseconds) => Number(nanoseconds) / 1e6;
const version = (command, args) => execFileSync(command, args, { cwd: root, encoding: "utf8" }).trim();
const commands = () => ({
  javascript: [process.execPath, ["compat/js-runner.mjs"]],
  go: [resolve(root, "bin", process.platform === "win32" ? "tinycolor.exe" : "tinycolor"), []],
});

class Runner {
  constructor(command, args) {
    this.child = spawn(command, args, { cwd: root, env: runnerEnv, stdio: ["pipe", "pipe", "pipe"] });
    this.pending = [];
    this.stderr = "";
    readline.createInterface({ input: this.child.stdout, crlfDelay: Infinity }).on("line", (line) => {
      this.pending.shift()?.resolve(JSON.parse(line));
    });
    this.child.stderr.on("data", (chunk) => { this.stderr += chunk; });
    this.child.on("exit", (code) => {
      const error = new Error(`runner exited with ${code}: ${this.stderr}`);
      for (const pending of this.pending.splice(0)) pending.reject(error);
    });
  }

  request(value) {
    return new Promise((resolveRequest, reject) => {
      if (this.child.exitCode !== null) return reject(new Error(`runner exited: ${this.stderr}`));
      this.pending.push({ resolve: resolveRequest, reject });
      this.child.stdin.write(`${JSON.stringify(value)}\n`, (error) => {
        if (error) reject(error);
      });
    });
  }

  close() {
    if (this.child.exitCode === null) this.child.kill();
  }
}

const readRss = (pid) => {
  try {
    if (process.platform === "linux") {
      const match = /^VmRSS:\s+(\d+)\s+kB$/m.exec(readFileSync(`/proc/${pid}/status`, "utf8"));
      return match ? Number(match[1]) * 1024 : null;
    }
    if (process.platform === "win32") {
      const value = execFileSync("powershell.exe", ["-NoProfile", "-NonInteractive", "-Command", `(Get-Process -Id ${pid}).WorkingSet64`], { encoding: "utf8" }).trim();
      return Number(value);
    }
  } catch {
    // The child can exit between the response and RSS sample.
  }
  return null;
};

const measure = async (command, args, workload, coldStarts, requests) => {
  const startup = [];
  let peakRss = 0;
  let rssSupported = false;
  for (let index = 0; index < coldStarts; index++) {
    const started = process.hrtime.bigint();
    const runner = new Runner(command, args);
    await runner.request(workload[index % workload.length]);
    startup.push(nsToMs(process.hrtime.bigint() - started));
    const rss = readRss(runner.child.pid);
    if (rss !== null) {
      rssSupported = true;
      peakRss = Math.max(peakRss, rss);
    }
    runner.close();
  }

  const runner = new Runner(command, args);
  const latencies = [];
  const throughputStarted = process.hrtime.bigint();
  for (let index = 0; index < requests; index++) {
    const started = process.hrtime.bigint();
    await runner.request(workload[index % workload.length]);
    latencies.push(nsToMs(process.hrtime.bigint() - started));
  }
  const totalSeconds = Number(process.hrtime.bigint() - throughputStarted) / 1e9;
  for (let index = 0; index < 10; index++) {
    const rss = readRss(runner.child.pid);
    if (rss !== null) {
      rssSupported = true;
      peakRss = Math.max(peakRss, rss);
    }
    await new Promise((resolveTick) => setImmediate(resolveTick));
  }
  runner.close();

  return {
    startupP99Ms: percentile99(startup),
    latencyP99Ms: percentile99(latencies),
    throughputOpsPerSecond: requests / totalSeconds,
    peakRssBytes: rssSupported ? peakRss : null,
    ...(rssSupported ? {} : { rssLimitation: `RSS sampling is unsupported on ${process.platform}` }),
  };
};

const main = async () => {
  const args = process.argv.slice(2);
  const quick = args.includes("--quick");
  const outputIndex = args.indexOf("--output");
  if (outputIndex !== -1 && !args[outputIndex + 1]) throw new Error("usage: node bench/run.mjs [--quick] [--output <path>]");
  const output = outputIndex === -1 ? committedOutput : resolve(root, args[outputIndex + 1]);
  if (quick && output === committedOutput) throw new Error("--quick must not write bench/results.json");

  const coldStarts = quick ? 3 : 20;
  const requests = quick ? 30 : 1000;
  const workloadText = readFileSync(resolve(root, "bench/workload.jsonl"), "utf8").replace(/\r\n/g, "\n");
  const workload = parseWorkload(workloadText);
  execFileSync("go", ["-C", "src", "build", "-o", `../bin/${process.platform === "win32" ? "tinycolor.exe" : "tinycolor"}`, "./cmd/tinycolor-compat"], { cwd: root, env: runnerEnv, stdio: "inherit" });

  const implementations = {};
  for (const [name, [command, commandArgs]] of Object.entries(commands())) {
    implementations[name] = await measure(command, commandArgs, workload, coldStarts, requests);
  }
  const results = {
    generatedAt: new Date().toISOString(),
    os: process.platform,
    architecture: process.arch,
    cpu: cpus()[0]?.model ?? "unknown",
    nodeVersion: process.version,
    goVersion: version("go", ["version"]),
    workloadSha256: createHash("sha256").update(workloadText).digest("hex"),
    samples: { coldStarts, requests },
    implementations,
  };
  if (!quick) validateResults(results);
  mkdirSync(dirname(output), { recursive: true });
  writeFileSync(output, `${JSON.stringify(results, null, 2)}\n`);
  console.log(`wrote ${output}`);
};

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}
