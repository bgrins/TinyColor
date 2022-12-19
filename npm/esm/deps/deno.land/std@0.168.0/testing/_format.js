// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
/**
 * Converts the input into a string. Objects, Sets and Maps are sorted so as to
 * make tests less flaky
 * @param v Value to be formatted
 */
import * as dntShim from "../../../../_dnt.test_shims.js";
export function format(v) {
    // deno-lint-ignore no-explicit-any
    const { Deno } = dntShim.dntGlobalThis;
    return typeof Deno?.inspect === "function"
        ? Deno.inspect(v, {
            depth: Infinity,
            sorted: true,
            trailingComma: true,
            compact: false,
            iterableLimit: Infinity,
            // getters should be true in assertEquals.
            getters: true,
        })
        : `"${String(v).replace(/(?=["\\])/g, "\\")}"`;
}
