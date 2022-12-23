import tinycolor from "./mod.js";

const color = new tinycolor("red");
Deno.bench("constructing", () => {
  new tinycolor("red");
  new tinycolor({ r: 255, g: 0, b: 0 });
  new tinycolor("#FFFFFF");
  new tinycolor("#FFFFFFFF");
  new tinycolor({ r: "100.0%", g: "100.0%", b: "100.0%" });
  new tinycolor({ h: "0", s: "0.000", v: "1.000" });
  new tinycolor({ h: "0", s: "0.000", l: "1.000" });
});

// Function calls from `tinycolor.prototype`:
Deno.bench("isDark", () => {
  color.isDark();
});
Deno.bench("isLight", () => {
  color.isLight();
});
Deno.bench("isValid", () => {
  color.isValid();
});
Deno.bench("getOriginalInput", () => {
  color.getOriginalInput();
});
Deno.bench("getFormat", () => {
  color.getFormat();
});
Deno.bench("getAlpha", () => {
  color.getAlpha();
});
Deno.bench("getBrightness", () => {
  color.getBrightness();
});
Deno.bench("getLuminance", () => {
  color.getLuminance();
});
Deno.bench("setAlpha", () => {
  color.setAlpha();
});
Deno.bench("toHsv", () => {
  color.toHsv();
});
Deno.bench("toHsvString", () => {
  color.toHsvString();
});
Deno.bench("toHsl", () => {
  color.toHsl();
});
Deno.bench("toHslString", () => {
  color.toHslString();
});
Deno.bench("toHex", () => {
  color.toHex();
});
Deno.bench("toHexString", () => {
  color.toHexString();
});
Deno.bench("toHex8", () => {
  color.toHex8();
});
Deno.bench("toHex8String", () => {
  color.toHex8String();
});
Deno.bench("toRgb", () => {
  color.toRgb();
});
Deno.bench("toRgbString", () => {
  color.toRgbString();
});
Deno.bench("toPercentageRgb", () => {
  color.toPercentageRgb();
});
Deno.bench("toPercentageRgbString", () => {
  color.toPercentageRgbString();
});
Deno.bench("toName", () => {
  color.toName();
});
Deno.bench("toFilter", () => {
  color.toFilter();
});
Deno.bench("toString", () => {
  color.toString();
});
Deno.bench("clone", () => {
  color.clone();
});
Deno.bench("lighten", () => {
  color.lighten();
});
Deno.bench("brighten", () => {
  color.brighten();
});
Deno.bench("darken", () => {
  color.darken();
});
Deno.bench("desaturate", () => {
  color.desaturate();
});
Deno.bench("saturate", () => {
  color.saturate();
});
Deno.bench("greyscale", () => {
  color.greyscale();
});
Deno.bench("spin", () => {
  color.spin();
});
Deno.bench("analogous", () => {
  color.analogous();
});
Deno.bench("complement", () => {
  color.complement();
});
Deno.bench("monochromatic", () => {
  color.monochromatic();
});
Deno.bench("splitcomplement", () => {
  color.splitcomplement();
});
Deno.bench("triad", () => {
  color.triad();
});
Deno.bench("tetrad", () => {
  color.tetrad();
});

// Function calls from `tinycolor`:
Deno.bench("fromRatio", () => {
  tinycolor.fromRatio({ r: 0.5, g: 0.5, b: 0.5 });
});
Deno.bench("equals", () => {
  tinycolor.equals("red", "orangered");
});
Deno.bench("random", () => {
  tinycolor.random();
});
Deno.bench("mix", () => {
  tinycolor.mix("red", "blue", 50);
});
Deno.bench("readability", () => {
  tinycolor.readability("red", "blue");
});
Deno.bench("isReadable", () => {
  tinycolor.isReadable("red", "blue");
});
Deno.bench("mostReadable", () => {
  tinycolor.mostReadable("red", ["blue", "green", "yellow"]);
});
