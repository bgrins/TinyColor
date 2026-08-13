# Benchmark methodology

Run `node bench/run.mjs --output bench/results.json` from the repository root.
It builds the Go compatibility CLI once, then sends the same fixed requests in
`bench/workload.jsonl` to the original JavaScript adapter and the Go adapter on
the same host. The workload covers parsing, conversion, mutation, mixing,
readability, and palettes.

Normal mode takes 20 cold starts and 1,000 persistent requests per
implementation. Cold-start time is process launch through receipt of the first
JSONL response. Persistent latency is one sequential JSONL request/response;
throughput is all persistent requests divided by their total elapsed time. p99
is the sorted sample at `ceil(0.99 * n) - 1`.

Peak RSS is sampled after each cold-start response and ten times after the
persistent workload from `/proc/<pid>/status` on Linux and `Get-Process ...
WorkingSet64` on Windows. Sampling is outside latency and throughput timing.
Platforms without either mechanism record `null` and an `rssLimitation` instead
of estimating a value.

These are same-host observations, not universal speedup claims. Use
`node bench/run.mjs --quick --output <temporary-path>` only as a smoke check;
quick mode uses 3 cold starts and 30 requests and refuses to overwrite the
committed evidence file.
