.PHONY: build test test-original-go verify fmt-check hashes fuzz bench clean

GOCACHE ?= $(CURDIR)/.cache/go-build
export GOCACHE
GOEXE := $(shell go env GOEXE)
BINARY := bin/tinycolor$(GOEXE)

build:
	node -e "require('node:fs').mkdirSync('bin', { recursive: true })"
	go -C src build -o ../$(BINARY) ./cmd/tinycolor-compat

test:
	node tests/port/adapter.test.mjs
	node --test tests/original/verify.test.mjs tests/original-go/run.test.mjs
	node --test fuzz/harness.test.mjs fuzz/validate-log.test.mjs
	node fuzz/validate-log.mjs fuzz/log.txt
	go -C src test ./...
	node compat/run.mjs compat/cases/smoke.jsonl
	node compat/run.mjs compat/cases/parser-hex-rgb.jsonl
	node compat/run.mjs compat/cases/parser.jsonl
	node compat/run.mjs compat/cases/conversion.jsonl
	node compat/run.mjs compat/cases/operations.jsonl

test-original-go:
	node tests/original-go/run.mjs

verify: fmt-check hashes test test-original-go
	go -C src vet ./...

fmt-check:
	node -e "const { readdirSync } = require('node:fs'); const { join } = require('node:path'); const { execFileSync } = require('node:child_process'); const files = []; const walk = (dir) => readdirSync(dir, { withFileTypes: true }).forEach((entry) => entry.isDirectory() ? walk(join(dir, entry.name)) : entry.name.endsWith('.go') && files.push(join(dir, entry.name))); walk('src'); const output = execFileSync('gofmt', ['-l', ...files], { encoding: 'utf8' }).trim(); if (output) { console.error(output); process.exit(1); }"

hashes:
	node tests/original/verify.mjs

fuzz:
	node fuzz/harness.mjs --duration 60 --seed 20260801

bench:
	node bench/run.mjs --output bench/results.json

clean:
	node -e "const fs = require('node:fs'); for (const file of ['bin/tinycolor', 'bin/tinycolor.exe']) fs.rmSync(file, { force: true });"
