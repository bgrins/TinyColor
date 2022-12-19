"use strict";
// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMessage = exports.diffstr = exports.diff = exports.DiffType = void 0;
const colors_js_1 = require("../fmt/colors.js");
var DiffType;
(function (DiffType) {
    DiffType["removed"] = "removed";
    DiffType["common"] = "common";
    DiffType["added"] = "added";
})(DiffType = exports.DiffType || (exports.DiffType = {}));
const REMOVED = 1;
const COMMON = 2;
const ADDED = 3;
function createCommon(A, B, reverse) {
    const common = [];
    if (A.length === 0 || B.length === 0)
        return [];
    for (let i = 0; i < Math.min(A.length, B.length); i += 1) {
        if (A[reverse ? A.length - i - 1 : i] === B[reverse ? B.length - i - 1 : i]) {
            common.push(A[reverse ? A.length - i - 1 : i]);
        }
        else {
            return common;
        }
    }
    return common;
}
/**
 * Renders the differences between the actual and expected values
 * @param A Actual value
 * @param B Expected value
 */
function diff(A, B) {
    const prefixCommon = createCommon(A, B);
    const suffixCommon = createCommon(A.slice(prefixCommon.length), B.slice(prefixCommon.length), true).reverse();
    A = suffixCommon.length
        ? A.slice(prefixCommon.length, -suffixCommon.length)
        : A.slice(prefixCommon.length);
    B = suffixCommon.length
        ? B.slice(prefixCommon.length, -suffixCommon.length)
        : B.slice(prefixCommon.length);
    const swapped = B.length > A.length;
    [A, B] = swapped ? [B, A] : [A, B];
    const M = A.length;
    const N = B.length;
    if (!M && !N && !suffixCommon.length && !prefixCommon.length)
        return [];
    if (!N) {
        return [
            ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
            ...A.map((a) => ({
                type: swapped ? DiffType.added : DiffType.removed,
                value: a,
            })),
            ...suffixCommon.map((c) => ({ type: DiffType.common, value: c })),
        ];
    }
    const offset = N;
    const delta = M - N;
    const size = M + N + 1;
    const fp = Array.from({ length: size }, () => ({ y: -1, id: -1 }));
    /**
     * INFO:
     * This buffer is used to save memory and improve performance.
     * The first half is used to save route and last half is used to save diff
     * type.
     * This is because, when I kept new uint8array area to save type,performance
     * worsened.
     */
    const routes = new Uint32Array((M * N + size + 1) * 2);
    const diffTypesPtrOffset = routes.length / 2;
    let ptr = 0;
    let p = -1;
    function backTrace(A, B, current, swapped) {
        const M = A.length;
        const N = B.length;
        const result = [];
        let a = M - 1;
        let b = N - 1;
        let j = routes[current.id];
        let type = routes[current.id + diffTypesPtrOffset];
        while (true) {
            if (!j && !type)
                break;
            const prev = j;
            if (type === REMOVED) {
                result.unshift({
                    type: swapped ? DiffType.removed : DiffType.added,
                    value: B[b],
                });
                b -= 1;
            }
            else if (type === ADDED) {
                result.unshift({
                    type: swapped ? DiffType.added : DiffType.removed,
                    value: A[a],
                });
                a -= 1;
            }
            else {
                result.unshift({ type: DiffType.common, value: A[a] });
                a -= 1;
                b -= 1;
            }
            j = routes[prev];
            type = routes[prev + diffTypesPtrOffset];
        }
        return result;
    }
    function createFP(slide, down, k, M) {
        if (slide && slide.y === -1 && down && down.y === -1) {
            return { y: 0, id: 0 };
        }
        if ((down && down.y === -1) ||
            k === M ||
            (slide && slide.y) > (down && down.y) + 1) {
            const prev = slide.id;
            ptr++;
            routes[ptr] = prev;
            routes[ptr + diffTypesPtrOffset] = ADDED;
            return { y: slide.y, id: ptr };
        }
        else {
            const prev = down.id;
            ptr++;
            routes[ptr] = prev;
            routes[ptr + diffTypesPtrOffset] = REMOVED;
            return { y: down.y + 1, id: ptr };
        }
    }
    function snake(k, slide, down, _offset, A, B) {
        const M = A.length;
        const N = B.length;
        if (k < -N || M < k)
            return { y: -1, id: -1 };
        const fp = createFP(slide, down, k, M);
        while (fp.y + k < M && fp.y < N && A[fp.y + k] === B[fp.y]) {
            const prev = fp.id;
            ptr++;
            fp.id = ptr;
            fp.y += 1;
            routes[ptr] = prev;
            routes[ptr + diffTypesPtrOffset] = COMMON;
        }
        return fp;
    }
    while (fp[delta + offset].y < N) {
        p = p + 1;
        for (let k = -p; k < delta; ++k) {
            fp[k + offset] = snake(k, fp[k - 1 + offset], fp[k + 1 + offset], offset, A, B);
        }
        for (let k = delta + p; k > delta; --k) {
            fp[k + offset] = snake(k, fp[k - 1 + offset], fp[k + 1 + offset], offset, A, B);
        }
        fp[delta + offset] = snake(delta, fp[delta - 1 + offset], fp[delta + 1 + offset], offset, A, B);
    }
    return [
        ...prefixCommon.map((c) => ({ type: DiffType.common, value: c })),
        ...backTrace(A, B, fp[delta + offset], swapped),
        ...suffixCommon.map((c) => ({ type: DiffType.common, value: c })),
    ];
}
exports.diff = diff;
/**
 * Renders the differences between the actual and expected strings
 * Partially inspired from https://github.com/kpdecker/jsdiff
 * @param A Actual string
 * @param B Expected string
 */
function diffstr(A, B) {
    function unescape(string) {
        // unescape invisible characters.
        // ref: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/String#escape_sequences
        return string
            .replaceAll("\b", "\\b")
            .replaceAll("\f", "\\f")
            .replaceAll("\t", "\\t")
            .replaceAll("\v", "\\v")
            .replaceAll(// does not remove line breaks
        /\r\n|\r|\n/g, (str) => str === "\r" ? "\\r" : str === "\n" ? "\\n\n" : "\\r\\n\r\n");
    }
    function tokenize(string, { wordDiff = false } = {}) {
        if (wordDiff) {
            // Split string on whitespace symbols
            const tokens = string.split(/([^\S\r\n]+|[()[\]{}'"\r\n]|\b)/);
            // Extended Latin character set
            const words = /^[a-zA-Z\u{C0}-\u{FF}\u{D8}-\u{F6}\u{F8}-\u{2C6}\u{2C8}-\u{2D7}\u{2DE}-\u{2FF}\u{1E00}-\u{1EFF}]+$/u;
            // Join boundary splits that we do not consider to be boundaries and merge empty strings surrounded by word chars
            for (let i = 0; i < tokens.length - 1; i++) {
                if (!tokens[i + 1] && tokens[i + 2] && words.test(tokens[i]) &&
                    words.test(tokens[i + 2])) {
                    tokens[i] += tokens[i + 2];
                    tokens.splice(i + 1, 2);
                    i--;
                }
            }
            return tokens.filter((token) => token);
        }
        else {
            // Split string on new lines symbols
            const tokens = [], lines = string.split(/(\n|\r\n)/);
            // Ignore final empty token when text ends with a newline
            if (!lines[lines.length - 1]) {
                lines.pop();
            }
            // Merge the content and line separators into single tokens
            for (let i = 0; i < lines.length; i++) {
                if (i % 2) {
                    tokens[tokens.length - 1] += lines[i];
                }
                else {
                    tokens.push(lines[i]);
                }
            }
            return tokens;
        }
    }
    // Create details by filtering relevant word-diff for current line
    // and merge "space-diff" if surrounded by word-diff for cleaner displays
    function createDetails(line, tokens) {
        return tokens.filter(({ type }) => type === line.type || type === DiffType.common).map((result, i, t) => {
            if ((result.type === DiffType.common) && (t[i - 1]) &&
                (t[i - 1]?.type === t[i + 1]?.type) && /\s+/.test(result.value)) {
                result.type = t[i - 1].type;
            }
            return result;
        });
    }
    // Compute multi-line diff
    const diffResult = diff(tokenize(`${unescape(A)}\n`), tokenize(`${unescape(B)}\n`));
    const added = [], removed = [];
    for (const result of diffResult) {
        if (result.type === DiffType.added) {
            added.push(result);
        }
        if (result.type === DiffType.removed) {
            removed.push(result);
        }
    }
    // Compute word-diff
    const aLines = added.length < removed.length ? added : removed;
    const bLines = aLines === removed ? added : removed;
    for (const a of aLines) {
        let tokens = [], b;
        // Search another diff line with at least one common token
        while (bLines.length) {
            b = bLines.shift();
            tokens = diff(tokenize(a.value, { wordDiff: true }), tokenize(b?.value ?? "", { wordDiff: true }));
            if (tokens.some(({ type, value }) => type === DiffType.common && value.trim().length)) {
                break;
            }
        }
        // Register word-diff details
        a.details = createDetails(a, tokens);
        if (b) {
            b.details = createDetails(b, tokens);
        }
    }
    return diffResult;
}
exports.diffstr = diffstr;
/**
 * Colors the output of assertion diffs
 * @param diffType Difference type, either added or removed
 */
function createColor(diffType, { background = false } = {}) {
    // TODO(@littledivy): Remove this when we can detect
    // true color terminals.
    // https://github.com/denoland/deno_std/issues/2575
    background = false;
    switch (diffType) {
        case DiffType.added:
            return (s) => background ? (0, colors_js_1.bgGreen)((0, colors_js_1.white)(s)) : (0, colors_js_1.green)((0, colors_js_1.bold)(s));
        case DiffType.removed:
            return (s) => background ? (0, colors_js_1.bgRed)((0, colors_js_1.white)(s)) : (0, colors_js_1.red)((0, colors_js_1.bold)(s));
        default:
            return colors_js_1.white;
    }
}
/**
 * Prefixes `+` or `-` in diff output
 * @param diffType Difference type, either added or removed
 */
function createSign(diffType) {
    switch (diffType) {
        case DiffType.added:
            return "+   ";
        case DiffType.removed:
            return "-   ";
        default:
            return "    ";
    }
}
function buildMessage(diffResult, { stringDiff = false } = {}) {
    const messages = [], diffMessages = [];
    messages.push("");
    messages.push("");
    messages.push(`    ${(0, colors_js_1.gray)((0, colors_js_1.bold)("[Diff]"))} ${(0, colors_js_1.red)((0, colors_js_1.bold)("Actual"))} / ${(0, colors_js_1.green)((0, colors_js_1.bold)("Expected"))}`);
    messages.push("");
    messages.push("");
    diffResult.forEach((result) => {
        const c = createColor(result.type);
        const line = result.details?.map((detail) => detail.type !== DiffType.common
            ? createColor(detail.type, { background: true })(detail.value)
            : detail.value).join("") ?? result.value;
        diffMessages.push(c(`${createSign(result.type)}${line}`));
    });
    messages.push(...(stringDiff ? [diffMessages.join("")] : diffMessages));
    messages.push("");
    return messages;
}
exports.buildMessage = buildMessage;
