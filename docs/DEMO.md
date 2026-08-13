# Five-minute demo script

The recording and upload remain manual and unverified until a public URL is
added to `README.md`.

| Time | Demonstration |
|---|---|
| 0:00–0:30 | Show `git status --short`, the source URL/commit in `.port-mortem.toml`, and run `node tests/original/verify.mjs`. |
| 0:30–1:00 | Run `make build`, then show the single artifact under `bin/`. |
| 1:00–2:10 | Run JSON examples for `parse`, `convert`, `lighten`, `palette`, and `contrast` from `README.md`. |
| 2:10–2:50 | Run `make verify` and point out all five exact corpus totals. |
| 2:50–3:30 | Open `fuzz/log.txt`, validate it, then run the one-second seeded fuzz smoke. |
| 3:30–4:10 | Open `bench/results.json` and explain the shared workload, p99 formula, throughput, RSS, and same-host limitation. |
| 4:10–4:40 | Show `DECISIONS.md`, zero-unsafe command, coverage table, and known limits in `COMPATIBILITY.md`. |
| 4:40–5:00 | Show the public repository and successful exact-commit Actions run, then close on the runnable binary path. |

Before submission, verify repository visibility while logged out, record one
continuous take, publish it, and add the video URL. Those account actions are
not claimed by this script.
