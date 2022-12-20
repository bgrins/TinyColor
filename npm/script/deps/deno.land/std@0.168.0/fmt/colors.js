// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// A module to print ANSI terminal colors. Inspired by chalk, kleur, and colors
// on npm.
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "../../../../_dnt.test_shims.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.stripColor = exports.bgRgb24 = exports.rgb24 = exports.bgRgb8 = exports.rgb8 = exports.bgBrightWhite = exports.bgBrightCyan = exports.bgBrightMagenta = exports.bgBrightBlue = exports.bgBrightYellow = exports.bgBrightGreen = exports.bgBrightRed = exports.bgBrightBlack = exports.bgWhite = exports.bgCyan = exports.bgMagenta = exports.bgBlue = exports.bgYellow = exports.bgGreen = exports.bgRed = exports.bgBlack = exports.brightWhite = exports.brightCyan = exports.brightMagenta = exports.brightBlue = exports.brightYellow = exports.brightGreen = exports.brightRed = exports.brightBlack = exports.gray = exports.white = exports.cyan = exports.magenta = exports.blue = exports.yellow = exports.green = exports.red = exports.black = exports.strikethrough = exports.hidden = exports.inverse = exports.underline = exports.italic = exports.dim = exports.bold = exports.reset = exports.getColorEnabled = exports.setColorEnabled = void 0;
    /**
     * String formatters and utilities for dealing with ANSI color codes.
     *
     * This module is browser compatible.
     *
     * This module supports `NO_COLOR` environmental variable disabling any coloring
     * if `NO_COLOR` is set.
     *
     * @example
     * ```typescript
     * import {
     *   bgBlue,
     *   bgRgb24,
     *   bgRgb8,
     *   bold,
     *   italic,
     *   red,
     *   rgb24,
     *   rgb8,
     * } from "https://deno.land/std@$STD_VERSION/fmt/colors.ts";
     *
     * console.log(bgBlue(italic(red(bold("Hello, World!")))));
     *
     * // also supports 8bit colors
     *
     * console.log(rgb8("Hello, World!", 42));
     *
     * console.log(bgRgb8("Hello, World!", 42));
     *
     * // and 24bit rgb
     *
     * console.log(rgb24("Hello, World!", {
     *   r: 41,
     *   g: 42,
     *   b: 43,
     * }));
     *
     * console.log(bgRgb24("Hello, World!", {
     *   r: 41,
     *   g: 42,
     *   b: 43,
     * }));
     * ```
     *
     * @module
     */
    // deno-lint-ignore no-explicit-any
    const dntShim = require("../../../../_dnt.test_shims.js");
    const { Deno } = dntShim.dntGlobalThis;
    const noColor = typeof Deno?.noColor === "boolean"
        ? Deno.noColor
        : true;
    let enabled = !noColor;
    /**
     * Set changing text color to enabled or disabled
     * @param value
     */
    function setColorEnabled(value) {
        if (noColor) {
            return;
        }
        enabled = value;
    }
    exports.setColorEnabled = setColorEnabled;
    /** Get whether text color change is enabled or disabled. */
    function getColorEnabled() {
        return enabled;
    }
    exports.getColorEnabled = getColorEnabled;
    /**
     * Builds color code
     * @param open
     * @param close
     */
    function code(open, close) {
        return {
            open: `\x1b[${open.join(";")}m`,
            close: `\x1b[${close}m`,
            regexp: new RegExp(`\\x1b\\[${close}m`, "g"),
        };
    }
    /**
     * Applies color and background based on color code and its associated text
     * @param str text to apply color settings to
     * @param code color code to apply
     */
    function run(str, code) {
        return enabled
            ? `${code.open}${str.replace(code.regexp, code.open)}${code.close}`
            : str;
    }
    /**
     * Reset the text modified
     * @param str text to reset
     */
    function reset(str) {
        return run(str, code([0], 0));
    }
    exports.reset = reset;
    /**
     * Make the text bold.
     * @param str text to make bold
     */
    function bold(str) {
        return run(str, code([1], 22));
    }
    exports.bold = bold;
    /**
     * The text emits only a small amount of light.
     * @param str text to dim
     */
    function dim(str) {
        return run(str, code([2], 22));
    }
    exports.dim = dim;
    /**
     * Make the text italic.
     * @param str text to make italic
     */
    function italic(str) {
        return run(str, code([3], 23));
    }
    exports.italic = italic;
    /**
     * Make the text underline.
     * @param str text to underline
     */
    function underline(str) {
        return run(str, code([4], 24));
    }
    exports.underline = underline;
    /**
     * Invert background color and text color.
     * @param str text to invert its color
     */
    function inverse(str) {
        return run(str, code([7], 27));
    }
    exports.inverse = inverse;
    /**
     * Make the text hidden.
     * @param str text to hide
     */
    function hidden(str) {
        return run(str, code([8], 28));
    }
    exports.hidden = hidden;
    /**
     * Put horizontal line through the center of the text.
     * @param str text to strike through
     */
    function strikethrough(str) {
        return run(str, code([9], 29));
    }
    exports.strikethrough = strikethrough;
    /**
     * Set text color to black.
     * @param str text to make black
     */
    function black(str) {
        return run(str, code([30], 39));
    }
    exports.black = black;
    /**
     * Set text color to red.
     * @param str text to make red
     */
    function red(str) {
        return run(str, code([31], 39));
    }
    exports.red = red;
    /**
     * Set text color to green.
     * @param str text to make green
     */
    function green(str) {
        return run(str, code([32], 39));
    }
    exports.green = green;
    /**
     * Set text color to yellow.
     * @param str text to make yellow
     */
    function yellow(str) {
        return run(str, code([33], 39));
    }
    exports.yellow = yellow;
    /**
     * Set text color to blue.
     * @param str text to make blue
     */
    function blue(str) {
        return run(str, code([34], 39));
    }
    exports.blue = blue;
    /**
     * Set text color to magenta.
     * @param str text to make magenta
     */
    function magenta(str) {
        return run(str, code([35], 39));
    }
    exports.magenta = magenta;
    /**
     * Set text color to cyan.
     * @param str text to make cyan
     */
    function cyan(str) {
        return run(str, code([36], 39));
    }
    exports.cyan = cyan;
    /**
     * Set text color to white.
     * @param str text to make white
     */
    function white(str) {
        return run(str, code([37], 39));
    }
    exports.white = white;
    /**
     * Set text color to gray.
     * @param str text to make gray
     */
    function gray(str) {
        return brightBlack(str);
    }
    exports.gray = gray;
    /**
     * Set text color to bright black.
     * @param str text to make bright-black
     */
    function brightBlack(str) {
        return run(str, code([90], 39));
    }
    exports.brightBlack = brightBlack;
    /**
     * Set text color to bright red.
     * @param str text to make bright-red
     */
    function brightRed(str) {
        return run(str, code([91], 39));
    }
    exports.brightRed = brightRed;
    /**
     * Set text color to bright green.
     * @param str text to make bright-green
     */
    function brightGreen(str) {
        return run(str, code([92], 39));
    }
    exports.brightGreen = brightGreen;
    /**
     * Set text color to bright yellow.
     * @param str text to make bright-yellow
     */
    function brightYellow(str) {
        return run(str, code([93], 39));
    }
    exports.brightYellow = brightYellow;
    /**
     * Set text color to bright blue.
     * @param str text to make bright-blue
     */
    function brightBlue(str) {
        return run(str, code([94], 39));
    }
    exports.brightBlue = brightBlue;
    /**
     * Set text color to bright magenta.
     * @param str text to make bright-magenta
     */
    function brightMagenta(str) {
        return run(str, code([95], 39));
    }
    exports.brightMagenta = brightMagenta;
    /**
     * Set text color to bright cyan.
     * @param str text to make bright-cyan
     */
    function brightCyan(str) {
        return run(str, code([96], 39));
    }
    exports.brightCyan = brightCyan;
    /**
     * Set text color to bright white.
     * @param str text to make bright-white
     */
    function brightWhite(str) {
        return run(str, code([97], 39));
    }
    exports.brightWhite = brightWhite;
    /**
     * Set background color to black.
     * @param str text to make its background black
     */
    function bgBlack(str) {
        return run(str, code([40], 49));
    }
    exports.bgBlack = bgBlack;
    /**
     * Set background color to red.
     * @param str text to make its background red
     */
    function bgRed(str) {
        return run(str, code([41], 49));
    }
    exports.bgRed = bgRed;
    /**
     * Set background color to green.
     * @param str text to make its background green
     */
    function bgGreen(str) {
        return run(str, code([42], 49));
    }
    exports.bgGreen = bgGreen;
    /**
     * Set background color to yellow.
     * @param str text to make its background yellow
     */
    function bgYellow(str) {
        return run(str, code([43], 49));
    }
    exports.bgYellow = bgYellow;
    /**
     * Set background color to blue.
     * @param str text to make its background blue
     */
    function bgBlue(str) {
        return run(str, code([44], 49));
    }
    exports.bgBlue = bgBlue;
    /**
     *  Set background color to magenta.
     * @param str text to make its background magenta
     */
    function bgMagenta(str) {
        return run(str, code([45], 49));
    }
    exports.bgMagenta = bgMagenta;
    /**
     * Set background color to cyan.
     * @param str text to make its background cyan
     */
    function bgCyan(str) {
        return run(str, code([46], 49));
    }
    exports.bgCyan = bgCyan;
    /**
     * Set background color to white.
     * @param str text to make its background white
     */
    function bgWhite(str) {
        return run(str, code([47], 49));
    }
    exports.bgWhite = bgWhite;
    /**
     * Set background color to bright black.
     * @param str text to make its background bright-black
     */
    function bgBrightBlack(str) {
        return run(str, code([100], 49));
    }
    exports.bgBrightBlack = bgBrightBlack;
    /**
     * Set background color to bright red.
     * @param str text to make its background bright-red
     */
    function bgBrightRed(str) {
        return run(str, code([101], 49));
    }
    exports.bgBrightRed = bgBrightRed;
    /**
     * Set background color to bright green.
     * @param str text to make its background bright-green
     */
    function bgBrightGreen(str) {
        return run(str, code([102], 49));
    }
    exports.bgBrightGreen = bgBrightGreen;
    /**
     * Set background color to bright yellow.
     * @param str text to make its background bright-yellow
     */
    function bgBrightYellow(str) {
        return run(str, code([103], 49));
    }
    exports.bgBrightYellow = bgBrightYellow;
    /**
     * Set background color to bright blue.
     * @param str text to make its background bright-blue
     */
    function bgBrightBlue(str) {
        return run(str, code([104], 49));
    }
    exports.bgBrightBlue = bgBrightBlue;
    /**
     * Set background color to bright magenta.
     * @param str text to make its background bright-magenta
     */
    function bgBrightMagenta(str) {
        return run(str, code([105], 49));
    }
    exports.bgBrightMagenta = bgBrightMagenta;
    /**
     * Set background color to bright cyan.
     * @param str text to make its background bright-cyan
     */
    function bgBrightCyan(str) {
        return run(str, code([106], 49));
    }
    exports.bgBrightCyan = bgBrightCyan;
    /**
     * Set background color to bright white.
     * @param str text to make its background bright-white
     */
    function bgBrightWhite(str) {
        return run(str, code([107], 49));
    }
    exports.bgBrightWhite = bgBrightWhite;
    /* Special Color Sequences */
    /**
     * Clam and truncate color codes
     * @param n
     * @param max number to truncate to
     * @param min number to truncate from
     */
    function clampAndTruncate(n, max = 255, min = 0) {
        return Math.trunc(Math.max(Math.min(n, max), min));
    }
    /**
     * Set text color using paletted 8bit colors.
     * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit
     * @param str text color to apply paletted 8bit colors to
     * @param color code
     */
    function rgb8(str, color) {
        return run(str, code([38, 5, clampAndTruncate(color)], 39));
    }
    exports.rgb8 = rgb8;
    /**
     * Set background color using paletted 8bit colors.
     * https://en.wikipedia.org/wiki/ANSI_escape_code#8-bit
     * @param str text color to apply paletted 8bit background colors to
     * @param color code
     */
    function bgRgb8(str, color) {
        return run(str, code([48, 5, clampAndTruncate(color)], 49));
    }
    exports.bgRgb8 = bgRgb8;
    /**
     * Set text color using 24bit rgb.
     * `color` can be a number in range `0x000000` to `0xffffff` or
     * an `Rgb`.
     *
     * To produce the color magenta:
     *
     * ```ts
     *      import { rgb24 } from "https://deno.land/std@$STD_VERSION/fmt/colors.ts";
     *      rgb24("foo", 0xff00ff);
     *      rgb24("foo", {r: 255, g: 0, b: 255});
     * ```
     * @param str text color to apply 24bit rgb to
     * @param color code
     */
    function rgb24(str, color) {
        if (typeof color === "number") {
            return run(str, code([38, 2, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff], 39));
        }
        return run(str, code([
            38,
            2,
            clampAndTruncate(color.r),
            clampAndTruncate(color.g),
            clampAndTruncate(color.b),
        ], 39));
    }
    exports.rgb24 = rgb24;
    /**
     * Set background color using 24bit rgb.
     * `color` can be a number in range `0x000000` to `0xffffff` or
     * an `Rgb`.
     *
     * To produce the color magenta:
     *
     * ```ts
     *      import { bgRgb24 } from "https://deno.land/std@$STD_VERSION/fmt/colors.ts";
     *      bgRgb24("foo", 0xff00ff);
     *      bgRgb24("foo", {r: 255, g: 0, b: 255});
     * ```
     * @param str text color to apply 24bit rgb to
     * @param color code
     */
    function bgRgb24(str, color) {
        if (typeof color === "number") {
            return run(str, code([48, 2, (color >> 16) & 0xff, (color >> 8) & 0xff, color & 0xff], 49));
        }
        return run(str, code([
            48,
            2,
            clampAndTruncate(color.r),
            clampAndTruncate(color.g),
            clampAndTruncate(color.b),
        ], 49));
    }
    exports.bgRgb24 = bgRgb24;
    // https://github.com/chalk/ansi-regex/blob/02fa893d619d3da85411acc8fd4e2eea0e95a9d9/index.js
    const ANSI_PATTERN = new RegExp([
        "[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)",
        "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))",
    ].join("|"), "g");
    /**
     * Remove ANSI escape codes from the string.
     * @param string to remove ANSI escape codes from
     */
    function stripColor(string) {
        return string.replace(ANSI_PATTERN, "");
    }
    exports.stripColor = stripColor;
});
