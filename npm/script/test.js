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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
(function (factory) {
    if (typeof module === "object" && typeof module.exports === "object") {
        var v = factory(require, exports);
        if (v !== undefined) module.exports = v;
    }
    else if (typeof define === "function" && define.amd) {
        define(["require", "exports", "./_dnt.test_shims.js", "./deps/deno.land/std@0.168.0/testing/asserts.js", "./mod.js"], factory);
    }
})(function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    const dntShim = __importStar(require("./_dnt.test_shims.js"));
    const asserts_js_1 = require("./deps/deno.land/std@0.168.0/testing/asserts.js");
    const mod_js_1 = __importDefault(require("./mod.js"));
    dntShim.Deno.test("url test", () => {
        (0, asserts_js_1.assert)(typeof mod_js_1.default != "undefined", "tinycolor is initialized on the page");
        (0, asserts_js_1.assert)(typeof (0, mod_js_1.default)("red") == "object", "tinycolor is able to be instantiated");
        var r = (0, mod_js_1.default)("red");
        (0, asserts_js_1.assert)((0, mod_js_1.default)(r) === r, "when given a tinycolor instance, tinycolor() returns it");
        (0, asserts_js_1.assert)(new mod_js_1.default(r) === r, "when given a tinycolor instance, new tinycolor() returns it");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("red", { format: "hex" }).toString(), "#ff0000", "tinycolor options are being parsed");
        (0, asserts_js_1.assertEquals)(mod_js_1.default.fromRatio({ r: 1, g: 0, b: 0 }, { format: "hex" }).toString(), "#ff0000", "tinycolor options are being parsed");
        var obj = { h: 180, s: 0.5, l: 0.5 };
        var color = (0, mod_js_1.default)(obj);
        (0, asserts_js_1.assert)(obj.s === 0.5, "when given an object, the original object is not modified");
    });
    // Deno.test("TinyColor initialization", function() {
    //   assert(typeof tinycolor != "undefined", "tinycolor is initialized on the page");
    //   assert(typeof tinycolor("red") == "object", "tinycolor is able to be instantiated");
    //   var r = tinycolor("red");
    //   assert(tinycolor(r) === r, "when given a tinycolor instance, tinycolor() returns it");
    //   assert(new tinycolor(r) === r, "when given a tinycolor instance, new tinycolor() returns it");
    //   assertEquals(tinycolor("red", { format: "hex" }).toString(), "#ff0000", "tinycolor options are being parsed");
    //   assertEquals(tinycolor.fromRatio({r: 1, g: 0, b: 0 }, { format: "hex" }).toString(), "#ff0000", "tinycolor options are being parsed");
    //   var obj = {h: 180, s: 0.5, l: 0.5};
    //   var color = tinycolor(obj);
    //   assert(obj.s === 0.5, "when given an object, the original object is not modified");
    // });
    dntShim.Deno.test("Original input", function () {
        var colorRgbUp = "RGB(39, 39, 39)";
        var colorRgbLow = "rgb(39, 39, 39)";
        var colorRgbMix = "RgB(39, 39, 39)";
        var tinycolorObj = (0, mod_js_1.default)(colorRgbMix);
        var inputObj = { r: 100, g: 100, b: 100 };
        var r = (0, mod_js_1.default)("red");
        (0, asserts_js_1.assert)((0, mod_js_1.default)(colorRgbLow).getOriginalInput() === colorRgbLow, "original lowercase input is returned");
        (0, asserts_js_1.assert)((0, mod_js_1.default)(colorRgbUp).getOriginalInput() === colorRgbUp, "original uppercase input is returned");
        (0, asserts_js_1.assert)((0, mod_js_1.default)(colorRgbMix).getOriginalInput() === colorRgbMix, "original mixed input is returned");
        (0, asserts_js_1.assert)((0, mod_js_1.default)(tinycolorObj).getOriginalInput() === colorRgbMix, "when given a tinycolor instance, the color string is returned");
        (0, asserts_js_1.assert)((0, mod_js_1.default)(inputObj).getOriginalInput() === inputObj, "when given an object, the object is returned");
        (0, asserts_js_1.assert)(new mod_js_1.default("").getOriginalInput() === "", "when given an empty string, an empty string is returned");
        (0, asserts_js_1.assert)(new mod_js_1.default(null).getOriginalInput() === "", "when given a null value, an empty string is returned");
    });
    dntShim.Deno.test("Cloning color", function () {
        var originalColor = (0, mod_js_1.default)("red");
        var originalColorRgbString = originalColor.toRgbString();
        var clonedColor = originalColor.clone();
        (0, asserts_js_1.assert)(clonedColor.toRgbString() === originalColor.toRgbString(), "cloned color is identical");
        clonedColor.setAlpha(0.5);
        (0, asserts_js_1.assert)(clonedColor.toRgbString() !== originalColor.toRgbString(), "cloned color is changing independently from original color");
        (0, asserts_js_1.assert)(originalColorRgbString === originalColor.toRgbString(), "original color was not changed by cloned color change");
    });
    // Taken from convertWikipediaColors.html
    var conversions = [
        {
            hex: "#FFFFFF",
            hex8: "#FFFFFFFF",
            rgb: { r: "100.0%", g: "100.0%", b: "100.0%" },
            hsv: { h: "0", s: "0.000", v: "1.000" },
            hsl: { h: "0", s: "0.000", l: "1.000" },
        },
        {
            hex: "#808080",
            hex8: "#808080FF",
            rgb: { r: "050.0%", g: "050.0%", b: "050.0%" },
            hsv: { h: "0", s: "0.000", v: "0.500" },
            hsl: { h: "0", s: "0.000", l: "0.500" },
        },
        {
            hex: "#000000",
            hex8: "#000000FF",
            rgb: { r: "000.0%", g: "000.0%", b: "000.0%" },
            hsv: { h: "0", s: "0.000", v: "0.000" },
            hsl: { h: "0", s: "0.000", l: "0.000" },
        },
        {
            hex: "#FF0000",
            hex8: "#FF0000FF",
            rgb: { r: "100.0%", g: "000.0%", b: "000.0%" },
            hsv: { h: "0.0", s: "1.000", v: "1.000" },
            hsl: { h: "0.0", s: "1.000", l: "0.500" },
        },
        {
            hex: "#BFBF00",
            hex8: "#BFBF00FF",
            rgb: { r: "075.0%", g: "075.0%", b: "000.0%" },
            hsv: { h: "60.0", s: "1.000", v: "0.750" },
            hsl: { h: "60.0", s: "1.000", l: "0.375" },
        },
        {
            hex: "#008000",
            hex8: "#008000FF",
            rgb: { r: "000.0%", g: "050.0%", b: "000.0%" },
            hsv: { h: "120.0", s: "1.000", v: "0.500" },
            hsl: { h: "120.0", s: "1.000", l: "0.250" },
        },
        {
            hex: "#80FFFF",
            hex8: "#80FFFFFF",
            rgb: { r: "050.0%", g: "100.0%", b: "100.0%" },
            hsv: { h: "180.0", s: "0.500", v: "1.000" },
            hsl: { h: "180.0", s: "1.000", l: "0.750" },
        },
        {
            hex: "#8080FF",
            hex8: "#8080FFFF",
            rgb: { r: "050.0%", g: "050.0%", b: "100.0%" },
            hsv: { h: "240.0", s: "0.500", v: "1.000" },
            hsl: { h: "240.0", s: "1.000", l: "0.750" },
        },
        {
            hex: "#BF40BF",
            hex8: "#BF40BFFF",
            rgb: { r: "075.0%", g: "025.0%", b: "075.0%" },
            hsv: { h: "300.0", s: "0.667", v: "0.750" },
            hsl: { h: "300.0", s: "0.500", l: "0.500" },
        },
        {
            hex: "#A0A424",
            hex8: "#A0A424FF",
            rgb: { r: "062.8%", g: "064.3%", b: "014.2%" },
            hsv: { h: "61.8", s: "0.779", v: "0.643" },
            hsl: { h: "61.8", s: "0.638", l: "0.393" },
        },
        {
            hex: "#1EAC41",
            hex8: "#1EAC41FF",
            rgb: { r: "011.6%", g: "067.5%", b: "025.5%" },
            hsv: { h: "134.9", s: "0.828", v: "0.675" },
            hsl: { h: "134.9", s: "0.707", l: "0.396" },
        },
        {
            hex: "#B430E5",
            hex8: "#B430E5FF",
            rgb: { r: "070.4%", g: "018.7%", b: "089.7%" },
            hsv: { h: "283.7", s: "0.792", v: "0.897" },
            hsl: { h: "283.7", s: "0.775", l: "0.542" },
        },
        {
            hex: "#FEF888",
            hex8: "#FEF888FF",
            rgb: { r: "099.8%", g: "097.4%", b: "053.2%" },
            hsv: { h: "56.9", s: "0.467", v: "0.998" },
            hsl: { h: "56.9", s: "0.991", l: "0.765" },
        },
        {
            hex: "#19CB97",
            hex8: "#19CB97FF",
            rgb: { r: "009.9%", g: "079.5%", b: "059.1%" },
            hsv: { h: "162.4", s: "0.875", v: "0.795" },
            hsl: { h: "162.4", s: "0.779", l: "0.447" },
        },
        {
            hex: "#362698",
            hex8: "#362698FF",
            rgb: { r: "021.1%", g: "014.9%", b: "059.7%" },
            hsv: { h: "248.3", s: "0.750", v: "0.597" },
            hsl: { h: "248.3", s: "0.601", l: "0.373" },
        },
        {
            hex: "#7E7EB8",
            hex8: "#7E7EB8FF",
            rgb: { r: "049.5%", g: "049.3%", b: "072.1%" },
            hsv: { h: "240.5", s: "0.316", v: "0.721" },
            hsl: { h: "240.5", s: "0.290", l: "0.607" },
        },
    ];
    dntShim.Deno.test("Color Equality", function () {
        for (var i = 0; i < conversions.length; i++) {
            var c = conversions[i];
            var tiny = (0, mod_js_1.default)(c.hex);
            (0, asserts_js_1.assert)(true, tiny.isValid());
            (0, asserts_js_1.assert)(true, "Testing " +
                c.hex +
                ": " +
                tiny.toRgbString() +
                " " +
                tiny.toPercentageRgbString() +
                " " +
                tiny.toHsvString() +
                " " +
                tiny.toHslString() +
                " " +
                tiny.toHexString() +
                "Original: " +
                JSON.stringify(c.rgb) +
                " " +
                JSON.stringify(c.hsv) +
                " " +
                JSON.stringify(c.hsl));
            (0, asserts_js_1.assert)(mod_js_1.default.equals(c.rgb, c.hex), "RGB equals hex " + c.hex);
            (0, asserts_js_1.assert)(mod_js_1.default.equals(c.rgb, c.hex8), "RGB equals hex " + c.hex);
            (0, asserts_js_1.assert)(mod_js_1.default.equals(c.rgb, c.hsl), "RGB equals HSL " + c.hex);
            (0, asserts_js_1.assert)(mod_js_1.default.equals(c.rgb, c.hsv), "RGB equals HSV " + c.hex);
            (0, asserts_js_1.assert)(mod_js_1.default.equals(c.rgb, c.rgb), "RGB equals RGB " + c.hex);
            (0, asserts_js_1.assert)(mod_js_1.default.equals(c.hex, c.hex), "hex equals hex " + c.hex);
            (0, asserts_js_1.assert)(mod_js_1.default.equals(c.hex, c.hex8), "hex equals hex8 " + c.hex);
            (0, asserts_js_1.assert)(mod_js_1.default.equals(c.hex, c.hsl), "hex equals HSL " + c.hex);
            (0, asserts_js_1.assert)(mod_js_1.default.equals(c.hex, c.hsv), "hex equals HSV " + c.hex);
            (0, asserts_js_1.assert)(mod_js_1.default.equals(c.hsl, c.hsv), "HSL equals HSV " + c.hex);
        }
    });
    dntShim.Deno.test("With Ratio", function () {
        (0, asserts_js_1.assertEquals)(mod_js_1.default.fromRatio({ r: 1, g: 1, b: 1 }).toHexString(), "#ffffff", "white");
        (0, asserts_js_1.assertEquals)(mod_js_1.default.fromRatio({ r: 1, g: 0, b: 0, a: 0.5 }).toRgbString(), "rgba(255, 0, 0, 0.5)", "alpha works when ratio is parsed");
        (0, asserts_js_1.assertEquals)(mod_js_1.default.fromRatio({ r: 1, g: 0, b: 0, a: 1 }).toRgbString(), "rgb(255, 0, 0)", "alpha = 1 works when ratio is parsed");
        (0, asserts_js_1.assertEquals)(mod_js_1.default.fromRatio({ r: 1, g: 0, b: 0, a: 10 }).toRgbString(), "rgb(255, 0, 0)", "alpha > 1 works when ratio is parsed");
        (0, asserts_js_1.assertEquals)(mod_js_1.default.fromRatio({ r: 1, g: 0, b: 0, a: -1 }).toRgbString(), "rgb(255, 0, 0)", "alpha < 1 works when ratio is parsed");
    });
    dntShim.Deno.test("Without Ratio", function () {
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)({ r: 1, g: 1, b: 1 }).toHexString(), "#010101", "010101");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)({ r: 0.1, g: 0.1, b: 0.1 }).toHexString(), "#000000", "000000");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rgb .1 .1 .1").toHexString(), "#000000", "000000");
    });
    dntShim.Deno.test("RGB Text Parsing", function () {
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rgb 255 0 0").toHexString(), "#ff0000", "spaced input");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rgb(255, 0, 0)").toHexString(), "#ff0000", "parenthesized input");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rgb (255, 0, 0)").toHexString(), "#ff0000", "parenthesized spaced input");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)({ r: 255, g: 0, b: 0 }).toHexString(), "#ff0000", "object input");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)({ r: 255, g: 0, b: 0 }).toRgb(), { r: 255, g: 0, b: 0, a: 1 }, "object input and compare");
        (0, asserts_js_1.assert)(mod_js_1.default.equals({ r: 200, g: 100, b: 0 }, "rgb(200, 100, 0)"));
        (0, asserts_js_1.assert)(mod_js_1.default.equals({ r: 200, g: 100, b: 0 }, "rgb 200 100 0"));
        (0, asserts_js_1.assert)(mod_js_1.default.equals({ r: 200, g: 100, b: 0 }, "rgb 200 100 0"));
        (0, asserts_js_1.assert)(mod_js_1.default.equals({ r: 200, g: 100, b: 0, a: 0.4 }, "rgba 200 100 0 .4"));
        (0, asserts_js_1.assert)(!mod_js_1.default.equals({ r: 199, g: 100, b: 0 }, "rgba 200 100 0 1"));
        (0, asserts_js_1.assert)(!mod_js_1.default.equals({ r: 199, g: 100, b: 0 }, "rgb(200, 100, 0)"));
        (0, asserts_js_1.assert)(!mod_js_1.default.equals({ r: 199, g: 100, b: 0 }, "rgb 200 100 0"));
        (0, asserts_js_1.assert)(!mod_js_1.default.equals({ r: 199, g: 100, b: 0 }, "rgb 200 100 0"));
        (0, asserts_js_1.assert)(mod_js_1.default.equals((0, mod_js_1.default)({ r: 200, g: 100, b: 0 }), "rgb(200, 100, 0)"));
        (0, asserts_js_1.assert)(mod_js_1.default.equals((0, mod_js_1.default)({ r: 200, g: 100, b: 0 }), "rgb 200 100 0"));
        (0, asserts_js_1.assert)(mod_js_1.default.equals((0, mod_js_1.default)({ r: 200, g: 100, b: 0 }), "rgb 200 100 0"));
    });
    dntShim.Deno.test("Percentage RGB Text Parsing", function () {
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rgb 100% 0% 0%").toHexString(), "#ff0000", "spaced input");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rgb(100%, 0%, 0%)").toHexString(), "#ff0000", "parenthesized input");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rgb (100%, 0%, 0%)").toHexString(), "#ff0000", "parenthesized spaced input");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)({ r: "100%", g: "0%", b: "0%" }).toHexString(), "#ff0000", "object input");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)({ r: "100%", g: "0%", b: "0%" }).toRgb(), { r: 255, g: 0, b: 0, a: 1 }, "object input and compare");
        (0, asserts_js_1.assert)(mod_js_1.default.equals({ r: "90%", g: "45%", b: "0%" }, "rgb(90%, 45%, 0%)"));
        (0, asserts_js_1.assert)(mod_js_1.default.equals({ r: "90%", g: "45%", b: "0%" }, "rgb 90% 45% 0%"));
        (0, asserts_js_1.assert)(mod_js_1.default.equals({ r: "90%", g: "45%", b: "0%" }, "rgb 90% 45% 0%"));
        (0, asserts_js_1.assert)(mod_js_1.default.equals({ r: "90%", g: "45%", b: "0%", a: 0.4 }, "rgba 90% 45% 0% .4"));
        (0, asserts_js_1.assert)(!mod_js_1.default.equals({ r: "89%", g: "45%", b: "0%" }, "rgba 90% 45% 0% 1"));
        (0, asserts_js_1.assert)(!mod_js_1.default.equals({ r: "89%", g: "45%", b: "0%" }, "rgb(90%, 45%, 0%)"));
        (0, asserts_js_1.assert)(!mod_js_1.default.equals({ r: "89%", g: "45%", b: "0%" }, "rgb 90% 45% 0%"));
        (0, asserts_js_1.assert)(!mod_js_1.default.equals({ r: "89%", g: "45%", b: "0%" }, "rgb 90% 45% 0%"));
        (0, asserts_js_1.assert)(mod_js_1.default.equals((0, mod_js_1.default)({ r: "90%", g: "45%", b: "0%" }), "rgb(90%, 45%, 0%)"));
        (0, asserts_js_1.assert)(mod_js_1.default.equals((0, mod_js_1.default)({ r: "90%", g: "45%", b: "0%" }), "rgb 90% 45% 0%"));
        (0, asserts_js_1.assert)(mod_js_1.default.equals((0, mod_js_1.default)({ r: "90%", g: "45%", b: "0%" }), "rgb 90% 45% 0%"));
    });
    dntShim.Deno.test("HSL parsing", function () {
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)({ h: 251, s: 100, l: 0.38 }).toHexString(), "#2400c2", "to hex");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)({ h: 251, s: 100, l: 0.38 }).toRgbString(), "rgb(36, 0, 194)", "to rgb");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)({ h: 251, s: 100, l: 0.38 }).toHslString(), "hsl(251, 100%, 38%)", "to hsl");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("hsl(251, 100, 38)").toHexString(), "#2400c2", "to hex");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("hsl(251, 100%, 38%)").toRgbString(), "rgb(36, 0, 194)", "to rgb");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("hsl(251, 100%, 38%)").toHslString(), "hsl(251, 100%, 38%)", "to hsl");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("hsl 100 20 10").toHslString(), "hsl(100, 20%, 10%)", "problematic hsl");
    });
    dntShim.Deno.test("Hex Parsing", function () {
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rgb 255 0 0").toHexString(), "#ff0000");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rgb 255 0 0").toHexString(true), "#f00");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rgba 255 0 0 0.5").toHex8String(), "#ff000080");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rgba 255 0 0 0").toHex8String(), "#ff000000");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rgba 255 0 0 1").toHex8String(), "#ff0000ff");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rgba 255 0 0 1").toHex8String(true), "#f00f");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rgb 255 0 0").toHex(), "ff0000");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rgb 255 0 0").toHex(true), "f00");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rgba 255 0 0 0.5").toHex8(), "ff000080");
    });
    dntShim.Deno.test("HSV Parsing", function () {
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("hsv 251.1 0.887 .918").toHsvString(), "hsv(251, 89%, 92%)");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("hsv 251.1 0.887 0.918").toHsvString(), "hsv(251, 89%, 92%)");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("hsva 251.1 0.887 0.918 0.5").toHsvString(), "hsva(251, 89%, 92%, 0.5)");
    });
    dntShim.Deno.test("Invalid Parsing", function () {
        var invalidColor = (0, mod_js_1.default)("this is not a color");
        (0, asserts_js_1.assertEquals)(invalidColor.toHexString(), "#000000");
        (0, asserts_js_1.assertEquals)(false, invalidColor.isValid());
        invalidColor = (0, mod_js_1.default)("#red");
        (0, asserts_js_1.assertEquals)(invalidColor.toHexString(), "#000000");
        (0, asserts_js_1.assertEquals)(false, invalidColor.isValid());
        invalidColor = (0, mod_js_1.default)("  #red");
        (0, asserts_js_1.assertEquals)(invalidColor.toHexString(), "#000000");
        (0, asserts_js_1.assertEquals)(false, invalidColor.isValid());
        invalidColor = (0, mod_js_1.default)("##123456");
        (0, asserts_js_1.assertEquals)(invalidColor.toHexString(), "#000000");
        (0, asserts_js_1.assertEquals)(false, invalidColor.isValid());
        invalidColor = (0, mod_js_1.default)("  ##123456");
        (0, asserts_js_1.assertEquals)(invalidColor.toHexString(), "#000000");
        (0, asserts_js_1.assertEquals)(false, invalidColor.isValid());
        invalidColor = (0, mod_js_1.default)({ r: "invalid", g: "invalid", b: "invalid" });
        (0, asserts_js_1.assertEquals)(invalidColor.toHexString(), "#000000");
        (0, asserts_js_1.assertEquals)(false, invalidColor.isValid());
        invalidColor = (0, mod_js_1.default)({ h: "invalid", s: "invalid", l: "invalid" });
        (0, asserts_js_1.assertEquals)(invalidColor.toHexString(), "#000000");
        (0, asserts_js_1.assertEquals)(false, invalidColor.isValid());
        invalidColor = (0, mod_js_1.default)({ h: "invalid", s: "invalid", v: "invalid" });
        (0, asserts_js_1.assertEquals)(invalidColor.toHexString(), "#000000");
        (0, asserts_js_1.assertEquals)(false, invalidColor.isValid());
    });
    dntShim.Deno.test("Named colors", function () {
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("aliceblue").toHex(), "f0f8ff");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("antiquewhite").toHex(), "faebd7");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("aqua").toHex(), "00ffff");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("aquamarine").toHex(), "7fffd4");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("azure").toHex(), "f0ffff");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("beige").toHex(), "f5f5dc");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("bisque").toHex(), "ffe4c4");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("black").toHex(), "000000");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("blanchedalmond").toHex(), "ffebcd");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("blue").toHex(), "0000ff");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("blueviolet").toHex(), "8a2be2");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("brown").toHex(), "a52a2a");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("burlywood").toHex(), "deb887");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("cadetblue").toHex(), "5f9ea0");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("chartreuse").toHex(), "7fff00");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("chocolate").toHex(), "d2691e");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("coral").toHex(), "ff7f50");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("cornflowerblue").toHex(), "6495ed");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("cornsilk").toHex(), "fff8dc");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("crimson").toHex(), "dc143c");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("cyan").toHex(), "00ffff");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("darkblue").toHex(), "00008b");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("darkcyan").toHex(), "008b8b");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("darkgoldenrod").toHex(), "b8860b");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("darkgray").toHex(), "a9a9a9");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("darkgreen").toHex(), "006400");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("darkkhaki").toHex(), "bdb76b");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("darkmagenta").toHex(), "8b008b");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("darkolivegreen").toHex(), "556b2f");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("darkorange").toHex(), "ff8c00");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("darkorchid").toHex(), "9932cc");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("darkred").toHex(), "8b0000");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("darksalmon").toHex(), "e9967a");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("darkseagreen").toHex(), "8fbc8f");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("darkslateblue").toHex(), "483d8b");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("darkslategray").toHex(), "2f4f4f");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("darkturquoise").toHex(), "00ced1");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("darkviolet").toHex(), "9400d3");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("deeppink").toHex(), "ff1493");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("deepskyblue").toHex(), "00bfff");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("dimgray").toHex(), "696969");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("dodgerblue").toHex(), "1e90ff");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("firebrick").toHex(), "b22222");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("floralwhite").toHex(), "fffaf0");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("forestgreen").toHex(), "228b22");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("fuchsia").toHex(), "ff00ff");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("gainsboro").toHex(), "dcdcdc");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("ghostwhite").toHex(), "f8f8ff");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("gold").toHex(), "ffd700");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("goldenrod").toHex(), "daa520");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("gray").toHex(), "808080");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("grey").toHex(), "808080");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("green").toHex(), "008000");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("greenyellow").toHex(), "adff2f");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("honeydew").toHex(), "f0fff0");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("hotpink").toHex(), "ff69b4");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("indianred ").toHex(), "cd5c5c");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("indigo ").toHex(), "4b0082");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("ivory").toHex(), "fffff0");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("khaki").toHex(), "f0e68c");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("lavender").toHex(), "e6e6fa");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("lavenderblush").toHex(), "fff0f5");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("lawngreen").toHex(), "7cfc00");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("lemonchiffon").toHex(), "fffacd");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("lightblue").toHex(), "add8e6");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("lightcoral").toHex(), "f08080");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("lightcyan").toHex(), "e0ffff");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("lightgoldenrodyellow").toHex(), "fafad2");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("lightgrey").toHex(), "d3d3d3");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("lightgreen").toHex(), "90ee90");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("lightpink").toHex(), "ffb6c1");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("lightsalmon").toHex(), "ffa07a");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("lightseagreen").toHex(), "20b2aa");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("lightskyblue").toHex(), "87cefa");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("lightslategray").toHex(), "778899");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("lightsteelblue").toHex(), "b0c4de");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("lightyellow").toHex(), "ffffe0");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("lime").toHex(), "00ff00");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("limegreen").toHex(), "32cd32");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("linen").toHex(), "faf0e6");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("magenta").toHex(), "ff00ff");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("maroon").toHex(), "800000");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("mediumaquamarine").toHex(), "66cdaa");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("mediumblue").toHex(), "0000cd");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("mediumorchid").toHex(), "ba55d3");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("mediumpurple").toHex(), "9370db");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("mediumseagreen").toHex(), "3cb371");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("mediumslateblue").toHex(), "7b68ee");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("mediumspringgreen").toHex(), "00fa9a");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("mediumturquoise").toHex(), "48d1cc");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("mediumvioletred").toHex(), "c71585");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("midnightblue").toHex(), "191970");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("mintcream").toHex(), "f5fffa");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("mistyrose").toHex(), "ffe4e1");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("moccasin").toHex(), "ffe4b5");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("navajowhite").toHex(), "ffdead");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("navy").toHex(), "000080");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("oldlace").toHex(), "fdf5e6");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("olive").toHex(), "808000");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("olivedrab").toHex(), "6b8e23");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("orange").toHex(), "ffa500");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("orangered").toHex(), "ff4500");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("orchid").toHex(), "da70d6");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("palegoldenrod").toHex(), "eee8aa");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("palegreen").toHex(), "98fb98");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("paleturquoise").toHex(), "afeeee");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("palevioletred").toHex(), "db7093");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("papayawhip").toHex(), "ffefd5");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("peachpuff").toHex(), "ffdab9");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("peru").toHex(), "cd853f");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("pink").toHex(), "ffc0cb");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("plum").toHex(), "dda0dd");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("powderblue").toHex(), "b0e0e6");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("purple").toHex(), "800080");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rebeccapurple").toHex(), "663399");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("red").toHex(), "ff0000");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rosybrown").toHex(), "bc8f8f");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("royalblue").toHex(), "4169e1");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("saddlebrown").toHex(), "8b4513");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("salmon").toHex(), "fa8072");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("sandybrown").toHex(), "f4a460");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("seagreen").toHex(), "2e8b57");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("seashell").toHex(), "fff5ee");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("sienna").toHex(), "a0522d");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("silver").toHex(), "c0c0c0");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("skyblue").toHex(), "87ceeb");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("slateblue").toHex(), "6a5acd");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("slategray").toHex(), "708090");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("snow").toHex(), "fffafa");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("springgreen").toHex(), "00ff7f");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("steelblue").toHex(), "4682b4");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("tan").toHex(), "d2b48c");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("teal").toHex(), "008080");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("thistle").toHex(), "d8bfd8");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("tomato").toHex(), "ff6347");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("turquoise").toHex(), "40e0d0");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("violet").toHex(), "ee82ee");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("wheat").toHex(), "f5deb3");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("white").toHex(), "ffffff");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("whitesmoke").toHex(), "f5f5f5");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("yellow").toHex(), "ffff00");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("yellowgreen").toHex(), "9acd32");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#f00").toName(), "red");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#fa0a0a").toName(), false);
    });
    dntShim.Deno.test("Invalid alpha should normalize to 1", function () {
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)({ r: 255, g: 20, b: 10, a: -1 }).toRgbString(), "rgb(255, 20, 10)", "Negative value");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)({ r: 255, g: 20, b: 10, a: -0 }).toRgbString(), "rgba(255, 20, 10, 0)", "Negative 0");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)({ r: 255, g: 20, b: 10, a: 0 }).toRgbString(), "rgba(255, 20, 10, 0)", "0");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)({ r: 255, g: 20, b: 10, a: 0.5 }).toRgbString(), "rgba(255, 20, 10, 0.5)", ".5");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)({ r: 255, g: 20, b: 10, a: 1 }).toRgbString(), "rgb(255, 20, 10)", "1");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)({ r: 255, g: 20, b: 10, a: 100 }).toRgbString(), "rgb(255, 20, 10)", "Greater than 1");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)({ r: 255, g: 20, b: 10, a: "asdfasd" }).toRgbString(), "rgb(255, 20, 10)", "Non Numeric");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#fff").toRgbString(), "rgb(255, 255, 255)", "Hex should be 1");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rgba 255 0 0 100").toRgbString(), "rgb(255, 0, 0)", "Greater than 1 in string parsing");
    });
    dntShim.Deno.test("toString() with alpha set", function () {
        var redNamed = mod_js_1.default.fromRatio({ r: 255, g: 0, b: 0, a: 0.6 }, { format: "name" });
        var transparentNamed = mod_js_1.default.fromRatio({ r: 255, g: 0, b: 0, a: 0 }, { format: "name" });
        var redHex = mod_js_1.default.fromRatio({ r: 255, g: 0, b: 0, a: 0.4 }, { format: "hex" });
        (0, asserts_js_1.assertEquals)(redNamed.getFormat(), "name", "getFormat() is correct");
        (0, asserts_js_1.assertEquals)(redHex.getFormat(), "hex", "getFormat() is correct");
        (0, asserts_js_1.assertEquals)(redNamed.toString(), "rgba(255, 0, 0, 0.6)", "Names should default to rgba if alpha is < 1");
        (0, asserts_js_1.assertEquals)(redHex.toString(), "rgba(255, 0, 0, 0.4)", "Hex should default to rgba if alpha is < 1");
        (0, asserts_js_1.assertEquals)(redNamed.toString("hex"), "#ff0000", "Names should not be returned as rgba if format is specified");
        (0, asserts_js_1.assertEquals)(redNamed.toString("hex6"), "#ff0000", "Names should not be returned as rgba if format is specified");
        (0, asserts_js_1.assertEquals)(redNamed.toString("hex3"), "#f00", "Names should not be returned as rgba if format is specified");
        (0, asserts_js_1.assertEquals)(redNamed.toString("hex8"), "#ff000099", "Names should not be returned as rgba if format is specified");
        (0, asserts_js_1.assertEquals)(redNamed.toString("hex4"), "#f009", "Names should not be returned as rgba if format is specified");
        (0, asserts_js_1.assertEquals)(redNamed.toString("name"), "#ff0000", "Semi transparent names should return hex in toString() if name format is specified");
        (0, asserts_js_1.assertEquals)(redNamed.toName(), false, "Semi transparent names should be false in toName()");
        (0, asserts_js_1.assertEquals)(redHex.toString(), "rgba(255, 0, 0, 0.4)", "Hex should default to rgba if alpha is < 1");
        (0, asserts_js_1.assertEquals)(transparentNamed.toString(), "transparent", "Named color should equal transparent if alpha == 0");
        redHex.setAlpha(0);
        (0, asserts_js_1.assertEquals)(redHex.toString(), "rgba(255, 0, 0, 0)", "Hex should default to rgba if alpha is = 0");
    });
    dntShim.Deno.test("setting alpha", function () {
        var hexSetter = (0, mod_js_1.default)("rgba(255, 0, 0, 1)");
        (0, asserts_js_1.assertEquals)(hexSetter.getAlpha(), 1, "Alpha should start as 1");
        var returnedFromSetAlpha = hexSetter.setAlpha(0.9);
        (0, asserts_js_1.assertEquals)(returnedFromSetAlpha, hexSetter, "setAlpha return value should be the color.");
        (0, asserts_js_1.assertEquals)(hexSetter.getAlpha(), 0.9, "setAlpha should change alpha value");
        hexSetter.setAlpha(0.5);
        (0, asserts_js_1.assertEquals)(hexSetter.getAlpha(), 0.5, "setAlpha should change alpha value");
        hexSetter.setAlpha(0);
        (0, asserts_js_1.assertEquals)(hexSetter.getAlpha(), 0, "setAlpha should change alpha value");
        hexSetter.setAlpha(-1);
        (0, asserts_js_1.assertEquals)(hexSetter.getAlpha(), 1, "setAlpha with value < 0 should be bound to 1");
        hexSetter.setAlpha(2);
        (0, asserts_js_1.assertEquals)(hexSetter.getAlpha(), 1, "setAlpha with value > 1 should be bound to 1");
        hexSetter.setAlpha();
        (0, asserts_js_1.assertEquals)(hexSetter.getAlpha(), 1, "setAlpha with invalid value should be bound to 1");
        hexSetter.setAlpha(null);
        (0, asserts_js_1.assertEquals)(hexSetter.getAlpha(), 1, "setAlpha with invalid value should be bound to 1");
        hexSetter.setAlpha("test");
        (0, asserts_js_1.assertEquals)(hexSetter.getAlpha(), 1, "setAlpha with invalid value should be bound to 1");
    });
    dntShim.Deno.test("Alpha = 0 should act differently on toName()", function () {
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)({ r: 255, g: 20, b: 10, a: 0 }).toName(), "transparent", "0");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("transparent").toString(), "transparent", "toString when passed");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("transparent").toHex(), "000000", "toHex");
    });
    dntShim.Deno.test("getBrightness", function () {
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#000").getBrightness(), 0, "returns 0 for #000");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#fff").getBrightness(), 255, "returns 255 for #fff");
    });
    dntShim.Deno.test("getLuminance", function () {
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#000").getLuminance(), 0, "returns 0 for #000");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#fff").getLuminance(), 1, "returns 1 for #fff");
    });
    dntShim.Deno.test("isDark returns true/false for dark/light colors", function () {
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#000").isDark(), true, "#000 is dark");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#111").isDark(), true, "#111 is dark");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#222").isDark(), true, "#222 is dark");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#333").isDark(), true, "#333 is dark");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#444").isDark(), true, "#444 is dark");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#555").isDark(), true, "#555 is dark");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#666").isDark(), true, "#666 is dark");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#777").isDark(), true, "#777 is dark");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#888").isDark(), false, "#888 is not dark");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#999").isDark(), false, "#999 is not dark");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#aaa").isDark(), false, "#aaa is not dark");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#bbb").isDark(), false, "#bbb is not dark");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#ccc").isDark(), false, "#ccc is not dark");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#ddd").isDark(), false, "#ddd is not dark");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#eee").isDark(), false, "#eee is not dark");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#fff").isDark(), false, "#fff is not dark");
    });
    dntShim.Deno.test("isLight returns true/false for light/dark colors", function () {
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#000").isLight(), false, "#000 is not light");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#111").isLight(), false, "#111 is not light");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#222").isLight(), false, "#222 is not light");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#333").isLight(), false, "#333 is not light");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#444").isLight(), false, "#444 is not light");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#555").isLight(), false, "#555 is not light");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#666").isLight(), false, "#666 is not light");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#777").isLight(), false, "#777 is not light");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#888").isLight(), true, "#888 is light");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#999").isLight(), true, "#999 is light");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#aaa").isLight(), true, "#aaa is light");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#bbb").isLight(), true, "#bbb is light");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#ccc").isLight(), true, "#ccc is light");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#ddd").isLight(), true, "#ddd is light");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#eee").isLight(), true, "#eee is light");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#fff").isLight(), true, "#fff is light");
    });
    dntShim.Deno.test("HSL Object", function () {
        for (var i = 0; i < conversions.length; i++) {
            var c = conversions[i];
            var tiny = (0, mod_js_1.default)(c.hex);
            (0, asserts_js_1.assertEquals)(tiny.toHexString(), (0, mod_js_1.default)(tiny.toHsl()).toHexString(), "HSL Object");
        }
    });
    dntShim.Deno.test("HSL String", function () {
        for (var i = 0; i < conversions.length; i++) {
            var c = conversions[i];
            var tiny = (0, mod_js_1.default)(c.hex);
            var input = tiny.toRgb();
            var output = (0, mod_js_1.default)(tiny.toHslString()).toRgb();
            var maxDiff = 2;
            (0, asserts_js_1.assertEquals)(Math.abs(input.r - output.r) <= maxDiff, true, "toHslString red value difference <= " + maxDiff);
            (0, asserts_js_1.assertEquals)(Math.abs(input.g - output.g) <= maxDiff, true, "toHslString green value difference <= " + maxDiff);
            (0, asserts_js_1.assertEquals)(Math.abs(input.b - output.b) <= maxDiff, true, "toHslString blue value difference <= " + maxDiff);
        }
    });
    dntShim.Deno.test("HSV String", function () {
        for (var i = 0; i < conversions.length; i++) {
            var c = conversions[i];
            var tiny = (0, mod_js_1.default)(c.hex);
            var input = tiny.toRgb();
            var output = (0, mod_js_1.default)(tiny.toHsvString()).toRgb();
            var maxDiff = 2;
            (0, asserts_js_1.assertEquals)(Math.abs(input.r - output.r) <= maxDiff, true, "toHsvString red value difference <= " + maxDiff);
            (0, asserts_js_1.assertEquals)(Math.abs(input.g - output.g) <= maxDiff, true, "toHsvString green value difference <= " + maxDiff);
            (0, asserts_js_1.assertEquals)(Math.abs(input.b - output.b) <= maxDiff, true, "toHsvString blue value difference <= " + maxDiff);
        }
    });
    dntShim.Deno.test("HSV Object", function () {
        for (var i = 0; i < conversions.length; i++) {
            var c = conversions[i];
            var tiny = (0, mod_js_1.default)(c.hex);
            (0, asserts_js_1.assertEquals)(tiny.toHexString(), (0, mod_js_1.default)(tiny.toHsv()).toHexString(), "HSV Object");
        }
    });
    dntShim.Deno.test("RGB Object", function () {
        for (var i = 0; i < conversions.length; i++) {
            var c = conversions[i];
            var tiny = (0, mod_js_1.default)(c.hex);
            (0, asserts_js_1.assertEquals)(tiny.toHexString(), (0, mod_js_1.default)(tiny.toRgb()).toHexString(), "RGB Object");
        }
    });
    dntShim.Deno.test("RGB String", function () {
        for (var i = 0; i < conversions.length; i++) {
            var c = conversions[i];
            var tiny = (0, mod_js_1.default)(c.hex);
            (0, asserts_js_1.assertEquals)(tiny.toHexString(), (0, mod_js_1.default)(tiny.toRgbString()).toHexString(), "RGB String");
        }
    });
    dntShim.Deno.test("PRGB Object", function () {
        for (var i = 0; i < conversions.length; i++) {
            var c = conversions[i];
            var tiny = (0, mod_js_1.default)(c.hex);
            var input = tiny.toRgb();
            var output = (0, mod_js_1.default)(tiny.toPercentageRgb()).toRgb();
            var maxDiff = 2;
            (0, asserts_js_1.assertEquals)(Math.abs(input.r - output.r) <= maxDiff, true, "Red value difference <= " + maxDiff);
            (0, asserts_js_1.assertEquals)(Math.abs(input.g - output.g) <= maxDiff, true, "Green value difference <= " + maxDiff);
            (0, asserts_js_1.assertEquals)(Math.abs(input.b - output.b) <= maxDiff, true, "Blue value difference <= " + maxDiff);
        }
    });
    dntShim.Deno.test("PRGB String", function () {
        for (var i = 0; i < conversions.length; i++) {
            var c = conversions[i];
            var tiny = (0, mod_js_1.default)(c.hex);
            var input = tiny.toRgb();
            var output = (0, mod_js_1.default)(tiny.toPercentageRgbString()).toRgb();
            var maxDiff = 2;
            (0, asserts_js_1.assertEquals)(Math.abs(input.r - output.r) <= maxDiff, true, "Red value difference <= " + maxDiff);
            (0, asserts_js_1.assertEquals)(Math.abs(input.g - output.g) <= maxDiff, true, "Green value difference <= " + maxDiff);
            (0, asserts_js_1.assertEquals)(Math.abs(input.b - output.b) <= maxDiff, true, "Blue value difference <= " + maxDiff);
        }
    });
    dntShim.Deno.test("Object", function () {
        for (var i = 0; i < conversions.length; i++) {
            var c = conversions[i];
            var tiny = (0, mod_js_1.default)(c.hex);
            (0, asserts_js_1.assertEquals)(tiny.toHexString(), (0, mod_js_1.default)(tiny).toHexString(), "Object");
        }
    });
    dntShim.Deno.test("Color equality", function () {
        (0, asserts_js_1.assert)(mod_js_1.default.equals("#ff0000", "#ff0000"), "Same hex");
        (0, asserts_js_1.assert)(mod_js_1.default.equals("#ff0000", "rgb(255, 0, 0)"), "Same alphas");
        (0, asserts_js_1.assert)(!mod_js_1.default.equals("#ff0000", "rgba(255, 0, 0, .1)"), "Different alphas");
        (0, asserts_js_1.assert)(mod_js_1.default.equals("#ff000066", "rgba(255, 0, 0, .4)"), "Same alphas");
        (0, asserts_js_1.assert)(mod_js_1.default.equals("#f009", "rgba(255, 0, 0, .6)"), "Same alphas");
        (0, asserts_js_1.assert)(mod_js_1.default.equals("#336699CC", "369C"), "Same hex");
        (0, asserts_js_1.assert)(mod_js_1.default.equals("ff0000", "#ff0000"), "Same hex");
        (0, asserts_js_1.assert)(mod_js_1.default.equals("#f00", "#ff0000"), "Same hex");
        (0, asserts_js_1.assert)(mod_js_1.default.equals("#f00", "#ff0000"), "Same hex");
        (0, asserts_js_1.assert)(mod_js_1.default.equals("f00", "#ff0000"), "Same hex");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("010101").toHexString(), "#010101");
        (0, asserts_js_1.assert)(!mod_js_1.default.equals("#ff0000", "#00ff00"), "Different hex");
        (0, asserts_js_1.assert)(mod_js_1.default.equals("#ff8000", "rgb(100%, 50%, 0%)"), "Percentage bounds checking");
    });
    dntShim.Deno.test("isReadable", function () {
        // "#ff0088", "#8822aa" (values used in old WCAG1 tests)
        (0, asserts_js_1.assert)(mod_js_1.default.isReadable("#000000", "#ffffff", { level: "AA", size: "small" }), "white/black is readable");
        (0, asserts_js_1.assert)(!mod_js_1.default.isReadable("#ff0088", "#5c1a72", {}), "not readable - empty wcag2 object");
        (0, asserts_js_1.assert)(!mod_js_1.default.isReadable("#ff0088", "#8822aa", { level: "AA", size: "small" }), "not readable - AA small");
        (0, asserts_js_1.assert)(!mod_js_1.default.isReadable("#ff0088", "#8822aa", { level: "AA", size: "large" }), "not  readable - AA large");
        (0, asserts_js_1.assert)(!mod_js_1.default.isReadable("#ff0088", "#8822aa", {
            level: "AAA",
            size: "small",
        }), "not readable - AAA small");
        (0, asserts_js_1.assert)(!mod_js_1.default.isReadable("#ff0088", "#8822aa", {
            level: "AAA",
            size: "large",
        }), "not readable - AAA large");
        // values derived from and validated using the calculators at http://www.dasplankton.de/ContrastA/
        // and http://webaim.org/resources/contrastchecker/
        // "#ff0088", "#5c1a72": contrast ratio 3.04
        (0, asserts_js_1.assert)(!mod_js_1.default.isReadable("#ff0088", "#5c1a72", { level: "AA", size: "small" }), "not readable - AA small");
        (0, asserts_js_1.assert)(mod_js_1.default.isReadable("#ff0088", "#5c1a72", { level: "AA", size: "large" }), "readable - AA large");
        (0, asserts_js_1.assert)(!mod_js_1.default.isReadable("#ff0088", "#5c1a72", {
            level: "AAA",
            size: "small",
        }), "not readable - AAA small");
        (0, asserts_js_1.assert)(!mod_js_1.default.isReadable("#ff0088", "#5c1a72", {
            level: "AAA",
            size: "large",
        }), "not readable - AAA large");
        // "#ff0088", "#2e0c3a": contrast ratio 4.56
        (0, asserts_js_1.assert)(mod_js_1.default.isReadable("#ff0088", "#2e0c3a", { level: "AA", size: "small" }), "readable - AA small");
        (0, asserts_js_1.assert)(mod_js_1.default.isReadable("#ff0088", "#2e0c3a", { level: "AA", size: "large" }), "readable - AA large");
        (0, asserts_js_1.assert)(!mod_js_1.default.isReadable("#ff0088", "#2e0c3a", {
            level: "AAA",
            size: "small",
        }), "not readable - AAA small");
        (0, asserts_js_1.assert)(mod_js_1.default.isReadable("#ff0088", "#2e0c3a", { level: "AAA", size: "large" }), "readable - AAA large");
        // "#db91b8", "#2e0c3a":  contrast ratio 7.12
        (0, asserts_js_1.assert)(mod_js_1.default.isReadable("#db91b8", "#2e0c3a", { level: "AA", size: "small" }), "readable - AA small");
        (0, asserts_js_1.assert)(mod_js_1.default.isReadable("#db91b8", "#2e0c3a", { level: "AA", size: "large" }), "readable - AA large");
        (0, asserts_js_1.assert)(mod_js_1.default.isReadable("#db91b8", "#2e0c3a", { level: "AAA", size: "small" }), "readable - AAA small");
        (0, asserts_js_1.assert)(mod_js_1.default.isReadable("#db91b8", "#2e0c3a", { level: "AAA", size: "large" }), "readable - AAA large");
    });
    dntShim.Deno.test("readability", function () {
        // check return values from readability function. See isReadable above for standards tests.
        (0, asserts_js_1.assertEquals)(mod_js_1.default.readability("#000", "#000"), 1, "Readability function test 0");
        (0, asserts_js_1.assertEquals)(mod_js_1.default.readability("#000", "#111"), 1.1121078324840545, "Readability function test 1");
        (0, asserts_js_1.assertEquals)(mod_js_1.default.readability("#000", "#fff"), 21, "Readability function test 2");
    });
    dntShim.Deno.test("mostReadable", function () {
        (0, asserts_js_1.assertEquals)(mod_js_1.default
            .mostReadable("#000", ["#111", "#222", { wcag2: {} }])
            .toHexString(), "#222222", "readable color present");
        (0, asserts_js_1.assertEquals)(mod_js_1.default
            .mostReadable("#f00", ["#d00", "#0d0"], { wcag2: {} })
            .toHexString(), "#00dd00", "readable color present");
        (0, asserts_js_1.assertEquals)(mod_js_1.default
            .mostReadable("#fff", ["#fff", "#fff"], { wcag2: {} })
            .toHexString(), "#ffffff", "no different color in list");
        //includeFallbackColors
        (0, asserts_js_1.assertEquals)(mod_js_1.default
            .mostReadable("#fff", ["#fff", "#fff"], { includeFallbackColors: true })
            .toHexString(), "#000000", "no different color in list");
        (0, asserts_js_1.assertEquals)(mod_js_1.default
            .mostReadable("#123", ["#124", "#125"], { includeFallbackColors: false })
            .toHexString(), "#112255", "no readable color in list");
        (0, asserts_js_1.assertEquals)(mod_js_1.default
            .mostReadable("#123", ["#000", "#fff"], { includeFallbackColors: false })
            .toHexString(), "#ffffff", "verify assumption");
        (0, asserts_js_1.assertEquals)(mod_js_1.default
            .mostReadable("#123", ["#124", "#125"], { includeFallbackColors: true })
            .toHexString(), "#ffffff", "no readable color in list");
        (0, asserts_js_1.assertEquals)(mod_js_1.default
            .mostReadable("#ff0088", ["#000", "#fff"], {
            includeFallbackColors: false,
        })
            .toHexString(), "#000000", "verify assumption");
        (0, asserts_js_1.assertEquals)(mod_js_1.default
            .mostReadable("#ff0088", ["#2e0c3a"], {
            includeFallbackColors: true,
            level: "AAA",
            size: "large",
        })
            .toHexString(), "#2e0c3a", "readable color present");
        (0, asserts_js_1.assertEquals)(mod_js_1.default
            .mostReadable("#ff0088", ["#2e0c3a"], {
            includeFallbackColors: true,
            level: "AAA",
            size: "small",
        })
            .toHexString(), "#000000", "no readable color in list");
        (0, asserts_js_1.assertEquals)(mod_js_1.default
            .mostReadable("#371b2c", ["#000", "#fff"], {
            includeFallbackColors: false,
        })
            .toHexString(), "#ffffff", "verify assumption");
        (0, asserts_js_1.assertEquals)(mod_js_1.default
            .mostReadable("#371b2c", ["#a9acb6"], {
            includeFallbackColors: true,
            level: "AAA",
            size: "large",
        })
            .toHexString(), "#a9acb6", "readable color present");
        (0, asserts_js_1.assertEquals)(mod_js_1.default
            .mostReadable("#371b2c", ["#a9acb6"], {
            includeFallbackColors: true,
            level: "AAA",
            size: "small",
        })
            .toHexString(), "#ffffff", "no readable color in list");
    });
    dntShim.Deno.test("Filters", function () {
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("red").toFilter(), "progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffff0000,endColorstr=#ffff0000)");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("red").toFilter("blue"), "progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffff0000,endColorstr=#ff0000ff)");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("transparent").toFilter(), "progid:DXImageTransform.Microsoft.gradient(startColorstr=#00000000,endColorstr=#00000000)");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("transparent").toFilter("red"), "progid:DXImageTransform.Microsoft.gradient(startColorstr=#00000000,endColorstr=#ffff0000)");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("#f0f0f0dd").toFilter(), "progid:DXImageTransform.Microsoft.gradient(startColorstr=#ddf0f0f0,endColorstr=#ddf0f0f0)");
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("rgba(0, 0, 255, .5").toFilter(), "progid:DXImageTransform.Microsoft.gradient(startColorstr=#800000ff,endColorstr=#800000ff)");
    });
    /* Originally generated with:
    var results = [];
    for (var i = 0; i <= 100; i++) results.push( tinycolor.saturate("red", i).toHex() )
    console.log(JSON.stringify(results))
    */
    var DESATURATIONS = [
        "ff0000",
        "fe0101",
        "fc0303",
        "fb0404",
        "fa0505",
        "f90606",
        "f70808",
        "f60909",
        "f50a0a",
        "f40b0b",
        "f20d0d",
        "f10e0e",
        "f00f0f",
        "ee1111",
        "ed1212",
        "ec1313",
        "eb1414",
        "e91616",
        "e81717",
        "e71818",
        "e61919",
        "e41b1b",
        "e31c1c",
        "e21d1d",
        "e01f1f",
        "df2020",
        "de2121",
        "dd2222",
        "db2424",
        "da2525",
        "d92626",
        "d72828",
        "d62929",
        "d52a2a",
        "d42b2b",
        "d22d2d",
        "d12e2e",
        "d02f2f",
        "cf3030",
        "cd3232",
        "cc3333",
        "cb3434",
        "c93636",
        "c83737",
        "c73838",
        "c63939",
        "c43b3b",
        "c33c3c",
        "c23d3d",
        "c13e3e",
        "bf4040",
        "be4141",
        "bd4242",
        "bb4444",
        "ba4545",
        "b94646",
        "b84747",
        "b64949",
        "b54a4a",
        "b44b4b",
        "b34d4d",
        "b14e4e",
        "b04f4f",
        "af5050",
        "ad5252",
        "ac5353",
        "ab5454",
        "aa5555",
        "a85757",
        "a75858",
        "a65959",
        "a45b5b",
        "a35c5c",
        "a25d5d",
        "a15e5e",
        "9f6060",
        "9e6161",
        "9d6262",
        "9c6363",
        "9a6565",
        "996666",
        "986767",
        "966969",
        "956a6a",
        "946b6b",
        "936c6c",
        "916e6e",
        "906f6f",
        "8f7070",
        "8e7171",
        "8c7373",
        "8b7474",
        "8a7575",
        "887777",
        "877878",
        "867979",
        "857a7a",
        "837c7c",
        "827d7d",
        "817e7e",
        "808080",
    ];
    var SATURATIONS = [
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
        "ff0000",
    ];
    var LIGHTENS = [
        "ff0000",
        "ff0505",
        "ff0a0a",
        "ff0f0f",
        "ff1414",
        "ff1a1a",
        "ff1f1f",
        "ff2424",
        "ff2929",
        "ff2e2e",
        "ff3333",
        "ff3838",
        "ff3d3d",
        "ff4242",
        "ff4747",
        "ff4d4d",
        "ff5252",
        "ff5757",
        "ff5c5c",
        "ff6161",
        "ff6666",
        "ff6b6b",
        "ff7070",
        "ff7575",
        "ff7a7a",
        "ff8080",
        "ff8585",
        "ff8a8a",
        "ff8f8f",
        "ff9494",
        "ff9999",
        "ff9e9e",
        "ffa3a3",
        "ffa8a8",
        "ffadad",
        "ffb3b3",
        "ffb8b8",
        "ffbdbd",
        "ffc2c2",
        "ffc7c7",
        "ffcccc",
        "ffd1d1",
        "ffd6d6",
        "ffdbdb",
        "ffe0e0",
        "ffe5e5",
        "ffebeb",
        "fff0f0",
        "fff5f5",
        "fffafa",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
        "ffffff",
    ];
    var BRIGHTENS = [
        "ff0000",
        "ff0303",
        "ff0505",
        "ff0808",
        "ff0a0a",
        "ff0d0d",
        "ff0f0f",
        "ff1212",
        "ff1414",
        "ff1717",
        "ff1919",
        "ff1c1c",
        "ff1f1f",
        "ff2121",
        "ff2424",
        "ff2626",
        "ff2929",
        "ff2b2b",
        "ff2e2e",
        "ff3030",
        "ff3333",
        "ff3636",
        "ff3838",
        "ff3b3b",
        "ff3d3d",
        "ff4040",
        "ff4242",
        "ff4545",
        "ff4747",
        "ff4a4a",
        "ff4c4c",
        "ff4f4f",
        "ff5252",
        "ff5454",
        "ff5757",
        "ff5959",
        "ff5c5c",
        "ff5e5e",
        "ff6161",
        "ff6363",
        "ff6666",
        "ff6969",
        "ff6b6b",
        "ff6e6e",
        "ff7070",
        "ff7373",
        "ff7575",
        "ff7878",
        "ff7a7a",
        "ff7d7d",
        "ff7f7f",
        "ff8282",
        "ff8585",
        "ff8787",
        "ff8a8a",
        "ff8c8c",
        "ff8f8f",
        "ff9191",
        "ff9494",
        "ff9696",
        "ff9999",
        "ff9c9c",
        "ff9e9e",
        "ffa1a1",
        "ffa3a3",
        "ffa6a6",
        "ffa8a8",
        "ffabab",
        "ffadad",
        "ffb0b0",
        "ffb2b2",
        "ffb5b5",
        "ffb8b8",
        "ffbaba",
        "ffbdbd",
        "ffbfbf",
        "ffc2c2",
        "ffc4c4",
        "ffc7c7",
        "ffc9c9",
        "ffcccc",
        "ffcfcf",
        "ffd1d1",
        "ffd4d4",
        "ffd6d6",
        "ffd9d9",
        "ffdbdb",
        "ffdede",
        "ffe0e0",
        "ffe3e3",
        "ffe5e5",
        "ffe8e8",
        "ffebeb",
        "ffeded",
        "fff0f0",
        "fff2f2",
        "fff5f5",
        "fff7f7",
        "fffafa",
        "fffcfc",
        "ffffff",
    ];
    var DARKENS = [
        "ff0000",
        "fa0000",
        "f50000",
        "f00000",
        "eb0000",
        "e60000",
        "e00000",
        "db0000",
        "d60000",
        "d10000",
        "cc0000",
        "c70000",
        "c20000",
        "bd0000",
        "b80000",
        "b30000",
        "ad0000",
        "a80000",
        "a30000",
        "9e0000",
        "990000",
        "940000",
        "8f0000",
        "8a0000",
        "850000",
        "800000",
        "7a0000",
        "750000",
        "700000",
        "6b0000",
        "660000",
        "610000",
        "5c0000",
        "570000",
        "520000",
        "4d0000",
        "470000",
        "420000",
        "3d0000",
        "380000",
        "330000",
        "2e0000",
        "290000",
        "240000",
        "1f0000",
        "190000",
        "140000",
        "0f0000",
        "0a0000",
        "050000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
        "000000",
    ];
    dntShim.Deno.test("Modifications", function () {
        for (var i = 0; i <= 100; i++) {
            (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("red").desaturate(i).toHex(), DESATURATIONS[i], "Desaturation " + i + " works");
        }
        for (var i = 0; i <= 100; i++) {
            (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("red").saturate(i).toHex(), SATURATIONS[i], "Saturation " + i + " works");
        }
        for (var i = 0; i <= 100; i++) {
            (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("red").lighten(i).toHex(), LIGHTENS[i], "Lighten " + i + " works");
        }
        for (var i = 0; i <= 100; i++) {
            (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("red").brighten(i).toHex(), BRIGHTENS[i], "Brighter " + i + " works");
        }
        for (var i = 0; i <= 100; i++) {
            (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("red").darken(i).toHex(), DARKENS[i], "Darken " + i + " works");
        }
        (0, asserts_js_1.assertEquals)((0, mod_js_1.default)("red").greyscale().toHex(), "808080", "Greyscale works");
    });
    dntShim.Deno.test("Spin", function () {
        (0, asserts_js_1.assertEquals)(Math.round((0, mod_js_1.default)("#f00").spin(-1234).toHsl().h), 206, "Spinning -1234 works");
        (0, asserts_js_1.assertEquals)(Math.round((0, mod_js_1.default)("#f00").spin(-360).toHsl().h), 0, "Spinning -360 works");
        (0, asserts_js_1.assertEquals)(Math.round((0, mod_js_1.default)("#f00").spin(-120).toHsl().h), 240, "Spinning -120 works");
        (0, asserts_js_1.assertEquals)(Math.round((0, mod_js_1.default)("#f00").spin(0).toHsl().h), 0, "Spinning 0 works");
        (0, asserts_js_1.assertEquals)(Math.round((0, mod_js_1.default)("#f00").spin(10).toHsl().h), 10, "Spinning 10 works");
        (0, asserts_js_1.assertEquals)(Math.round((0, mod_js_1.default)("#f00").spin(360).toHsl().h), 0, "Spinning 360 works");
        (0, asserts_js_1.assertEquals)(Math.round((0, mod_js_1.default)("#f00").spin(2345).toHsl().h), 185, "Spinning 2345 works");
        [-360, 0, 360].forEach(function (delta) {
            Object.keys(mod_js_1.default.names).forEach(function (name) {
                (0, asserts_js_1.assertEquals)((0, mod_js_1.default)(name).toHex(), (0, mod_js_1.default)(name).spin(delta).toHex(), "Spinning " + delta.toString() + " has no effect");
            });
        });
    });
    dntShim.Deno.test("Mix", function () {
        // amount 0 or none
        (0, asserts_js_1.assertEquals)(mod_js_1.default.mix("#000", "#fff").toHsl().l, 0.5, "Mixing without amount works");
        (0, asserts_js_1.assertEquals)(mod_js_1.default.mix("#f00", "#000", 0).toHex(), "ff0000", "Mixing with 0 amount works");
        // This case checks the the problem with floating point numbers (eg 255/90)
        (0, asserts_js_1.assertEquals)(mod_js_1.default.mix("#fff", "#000", 90).toHex(), "1a1a1a", "Mixing with 90 amount works correctly");
        // black and white
        for (var i = 0; i < 100; i++) {
            (0, asserts_js_1.assertEquals)(Math.round(mod_js_1.default.mix("#000", "#fff", i).toHsl().l * 100) / 100, i / 100, "Mixing black and white with " + i + " amount works");
        }
        // with colors
        for (var i = 0; i < 100; i++) {
            var new_hex = Math.round((255 * (100 - i)) / 100).toString(16);
            if (new_hex.length === 1) {
                new_hex = "0" + new_hex;
            }
            (0, asserts_js_1.assertEquals)(mod_js_1.default.mix("#f00", "#000", i).toHex(), new_hex + "0000", "Mixing " + i + " (red channel)");
            (0, asserts_js_1.assertEquals)(mod_js_1.default.mix("#0f0", "#000", i).toHex(), "00" + new_hex + "00", "Mixing " + i + " (green channel)");
            (0, asserts_js_1.assertEquals)(mod_js_1.default.mix("#00f", "#000", i).toHex(), "0000" + new_hex, "Mixing " + i + " (blue channel)");
            (0, asserts_js_1.assertEquals)(mod_js_1.default.mix((0, mod_js_1.default)("transparent"), "#000", i).toRgb().a, i / 100, "Mixing " + i + " (alpha channel)");
        }
    });
    function colorsToHexString(colors) {
        return colors
            .map(function (c) {
            return c.toHex();
        })
            .join(",");
    }
    dntShim.Deno.test("complement", function () {
        var complementDoesntModifyInstance = (0, mod_js_1.default)("red");
        (0, asserts_js_1.assertEquals)(complementDoesntModifyInstance.complement().toHex(), "00ffff", "Complement works");
        (0, asserts_js_1.assertEquals)(complementDoesntModifyInstance.toHex(), "ff0000", "Complement did not modify this color");
    });
    dntShim.Deno.test("analogous", function () {
        var combination = (0, mod_js_1.default)("red").analogous();
        (0, asserts_js_1.assertEquals)(colorsToHexString(combination), "ff0000,ff0066,ff0033,ff0000,ff3300,ff6600", "Correct Combination");
    });
    dntShim.Deno.test("monochromatic", function () {
        var combination = (0, mod_js_1.default)("red").monochromatic();
        (0, asserts_js_1.assertEquals)(colorsToHexString(combination), "ff0000,2a0000,550000,800000,aa0000,d40000", "Correct Combination");
    });
    dntShim.Deno.test("splitcomplement", function () {
        var combination = (0, mod_js_1.default)("red").splitcomplement();
        (0, asserts_js_1.assertEquals)(colorsToHexString(combination), "ff0000,ccff00,0066ff", "Correct Combination");
    });
    dntShim.Deno.test("triad", function () {
        var combination = (0, mod_js_1.default)("red").triad();
        (0, asserts_js_1.assertEquals)(colorsToHexString(combination), "ff0000,00ff00,0000ff", "Correct Combination");
    });
    dntShim.Deno.test("tetrad", function () {
        var combination = (0, mod_js_1.default)("red").tetrad();
        (0, asserts_js_1.assertEquals)(colorsToHexString(combination), "ff0000,80ff00,00ffff,7f00ff", "Correct Combination");
    });
});
