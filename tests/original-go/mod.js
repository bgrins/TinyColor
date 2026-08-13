const binary = Deno.env.get("TINYCOLOR_GO_BINARY");
if (!binary) throw new Error("TINYCOLOR_GO_BINARY is required");

const decoder = new TextDecoder();
let nextID = 0;

function invoke(operation, input, args = {}) {
  const id = `suite-${nextID++}`;
  const request = { id, operation, input: unwrap(input), args: unwrap(args) };
  const output = new Deno.Command(binary, {
    args: ["bridge", JSON.stringify(request)],
    stdout: "piped",
    stderr: "piped",
  }).outputSync();
  const stderr = decoder.decode(output.stderr).trim();
  if (!output.success) throw new Error(stderr || `Go bridge exited ${output.code}`);
  const response = JSON.parse(decoder.decode(output.stdout));
  if (response.id !== id) throw new Error(`Go bridge response ID mismatch: ${response.id}`);
  if (Object.hasOwn(response, "error")) throw new Error(response.error);
  return response.result;
}

function unwrap(value) {
  if (value instanceof TinyColorFacade) return value._input;
  if (Array.isArray(value)) return value.map(unwrap);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.entries(value).map(([key, entry]) => [key, unwrap(entry)]));
  }
  return value;
}

class TinyColorFacade {
  constructor(input, options = {}, ratio = false) {
    this._original = input || "";
    this._options = options;
    const inspection = invoke(ratio ? "fromRatio" : "inspect", input, ratio ? options : {});
    this._apply(inspection, inspection.original ?? inspection.rgb);
    if (options.format) this._format = options.format;
  }

  static fromInspection(inspection, original = inspection.original, options = {}, input = inspection.original ?? inspection.rgb) {
    const color = Object.create(TinyColorFacade.prototype);
    color._original = original;
    color._options = options;
    return color._apply(inspection, input);
  }

  _apply(inspection, input = inspection.rgb) {
    this._input = input;
    this._rgba = inspection.rgb;
    this._format = inspection.format || "";
    this._valid = inspection.valid;
    return this;
  }

  _args(args = {}) {
    return { ...args, options: { format: this._format, gradientType: !!this._options.gradientType } };
  }

  _output(method, args = {}) {
    return invoke("output", this._input, this._args({ method, ...args }));
  }

  _modify(method, amount) {
    return this._apply(invoke("modify", this._input, this._args({ method, amount })).after);
  }

  _palette(method, args = {}) {
    return invoke("palette", this._input, this._args({ method, ...args }))
      .map((inspection) => TinyColorFacade.fromInspection(inspection, inspection.original, {}, inspection.rgb));
  }

  getOriginalInput() { return this._original; }
  getFormat() { return this._format || false; }
  getAlpha() { return this._rgba.a; }
  isValid() { return this._valid; }

  setAlpha(value) {
    return this._apply(invoke("setAlpha", this._input, this._args({ value })));
  }

  clone() {
    return TinyColorFacade.fromInspection(invoke("clone", this._input, this._args()), this.toString());
  }

  toRgb() { return this._output("toRgb"); }
  toPercentageRgb() { return this._output("toPercentageRgb"); }
  toHsl() { return this._output("toHsl"); }
  toHsv() { return this._output("toHsv"); }
  toRgbString() { return this._output("toRgbString"); }
  toPercentageRgbString() { return this._output("toPercentageRgbString"); }
  toHslString() { return this._output("toHslString"); }
  toHsvString() { return this._output("toHsvString"); }
  toHex(compact = false) { return this._output("toHex", { compact }); }

  toHexString(compact = false) {
    return this._output("toHexString", { compact });
  }

  toHex8(compact = false) { return this._output("toHex8", { compact }); }
  toHex8String(compact = false) { return this._output("toHex8String", { compact }); }
  toName() { return this._output("toName"); }
  toFilter(secondColor) { return this._output("toFilter", { secondColor }); }
  toString(format) { return this._output("toString", { format }); }

  getBrightness() { return invoke("analysis", this._input, { method: "brightness" }); }
  getLuminance() { return invoke("analysis", this._input, { method: "luminance" }); }
  isDark() { return invoke("analysis", this._input, { method: "isDark" }); }
  isLight() { return invoke("analysis", this._input, { method: "isLight" }); }

  lighten(amount) { return this._modify("lighten", amount); }
  brighten(amount) { return this._modify("brighten", amount); }
  darken(amount) { return this._modify("darken", amount); }
  saturate(amount) { return this._modify("saturate", amount); }
  desaturate(amount) { return this._modify("desaturate", amount); }
  greyscale() { return this._modify("greyscale"); }
  spin(amount) { return this._modify("spin", amount); }

  complement() { return this._palette("complement")[0]; }
  analogous(results, slices) { return this._palette("analogous", { results, slices }); }
  monochromatic(results) { return this._palette("monochromatic", { results }); }
  splitcomplement() { return this._palette("splitcomplement"); }
  triad() { return this._palette("triad"); }
  tetrad() { return this._palette("tetrad"); }
}

function tinycolor(input, options = {}) {
  if (input instanceof TinyColorFacade) return input;
  return new TinyColorFacade(input, options);
}

tinycolor.fromRatio = (input, options = {}) => new TinyColorFacade(input, options, true);
tinycolor.random = () => TinyColorFacade.fromInspection(invoke("random"));
tinycolor.equals = (first, second) => invoke("equals", first, { other: second });
tinycolor.mix = (first, second, amount) => TinyColorFacade.fromInspection(invoke("mix", first, { other: second, amount }));
tinycolor.readability = (first, second) => invoke("readability", first, { other: second });
tinycolor.isReadable = (first, second, options) => invoke("isReadable", first, { other: second, options });
tinycolor.mostReadable = (base, candidates, options) => {
  const inspection = invoke("mostReadable", base, { candidates, options });
  return inspection ? TinyColorFacade.fromInspection(inspection) : null;
};
tinycolor.names = invoke("names");

export default tinycolor;
