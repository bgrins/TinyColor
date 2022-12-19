// Copyright 2018-2022 the Deno authors. All rights reserved. MIT license.
// This module is browser compatible.
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
    const dntShim = __importStar(require("../../../../_dnt.test_shims.js"));
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
