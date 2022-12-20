// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
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
    exports.format = void 0;
    /**
     * Converts the input into a string. Objects, Sets and Maps are sorted so as to
     * make tests less flaky
     * @param v Value to be formatted
     */
    const dntShim = require("../../../../_dnt.test_shims.js");
    function format(v) {
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
    exports.format = format;
});
