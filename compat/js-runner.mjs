import readline from "node:readline";
import tinycolor from "../mod.js";

const inspect = (color) => ({
  valid: color.isValid(),
  format: color.getFormat(),
  alpha: color.getAlpha(),
  rgb: color.toRgb(),
  value: color.toString(),
  original: color.getOriginalInput(),
});

const respond = (id, result, error) => {
  if ((result === undefined) === (error === undefined)) {
    throw new Error("response must contain exactly one of result or error");
  }
  return error === undefined ? { id, result } : { id, error };
};

const handle = (request) => {
  const args = request.args ?? {};
  const options = args.options ?? {};
  const color = () => tinycolor(request.input, options);
  switch (request.operation) {
    case "inspect":
      return respond(request.id, inspect(tinycolor(request.input)));
    case "string":
      return respond(request.id, tinycolor(request.input).toString(request.args?.format));
    case "fromRatio":
      return respond(request.id, inspect(tinycolor.fromRatio(request.input, request.args)));
    case "output":
      return output(request.id, color(), args);
    case "analysis":
      return analysis(request.id, color(), args.method);
    case "equals":
      return respond(request.id, tinycolor.equals(request.input, args.other));
    case "clone":
      return respond(request.id, inspect(color().clone()));
    case "modify":
      return modify(request.id, color(), args);
    case "mix":
      return respond(request.id, inspect(tinycolor.mix(request.input, args.other, amount(args, 50))));
    case "readability":
      return respond(request.id, tinycolor.readability(request.input, args.other));
    case "isReadable":
      return respond(request.id, tinycolor.isReadable(request.input, args.other, args.options));
    case "mostReadable": {
      const result = tinycolor.mostReadable(request.input, args.candidates ?? [], args.options);
      return respond(request.id, result ? inspect(result) : null);
    }
    case "palette":
      return palette(request.id, color(), args);
    case "randomInvariant":
      return randomInvariant(request.id);
    default:
      return respond(request.id, undefined, "unsupported operation");
  }
};

const amount = (args, defaultAmount) => args.amount === 0 ? 0 : args.amount || defaultAmount;

const modify = (id, color, args) => {
  const before = inspect(color);
  let returned;
  switch (args.method) {
    case "lighten": returned = color.lighten(amount(args, 10)); break;
    case "brighten": returned = color.brighten(amount(args, 10)); break;
    case "darken": returned = color.darken(amount(args, 10)); break;
    case "saturate": returned = color.saturate(amount(args, 10)); break;
    case "desaturate": returned = color.desaturate(amount(args, 10)); break;
    case "greyscale": returned = color.greyscale(); break;
    case "spin": returned = Object.hasOwn(args, "amount") ? color.spin(args.amount) : color.spin(); break;
    default: return respond(id, undefined, "unsupported method");
  }
  return respond(id, { before, after: inspect(color), sameReceiver: returned === color });
};

const palette = (id, color, args) => {
  let result;
  switch (args.method) {
    case "complement": result = [color.complement()]; break;
    case "splitcomplement": result = color.splitcomplement(); break;
    case "triad": result = color.triad(); break;
    case "tetrad": result = color.tetrad(); break;
    case "analogous": result = color.analogous(args.results || 6, args.slices || 30); break;
    case "monochromatic": result = color.monochromatic(args.results || 6); break;
    default: return respond(id, undefined, "unsupported method");
  }
  return respond(id, result.map(inspect));
};

const output = (id, color, args) => {
  let result;
  switch (args.method) {
    case "toHex": result = color.toHex(); break;
    case "toHex8": result = color.toHex8(); break;
    case "toHexString": result = color.toHexString(); break;
    case "toHex8String": result = color.toHex8String(); break;
    case "toRgbString": result = color.toRgbString(); break;
    case "toPercentageRgbString": result = color.toPercentageRgbString(); break;
    case "toHslString": result = color.toHslString(); break;
    case "toHsvString": result = color.toHsvString(); break;
    case "toString": result = color.toString(args.format); break;
    case "toName": result = color.toName(); break;
    case "toFilter": result = color.toFilter(args.secondColor || undefined); break;
    default: return respond(id, undefined, "unsupported method");
  }
  return respond(id, result);
};

const analysis = (id, color, method) => {
  const methods = {
    brightness: () => color.getBrightness(),
    luminance: () => color.getLuminance(),
    isDark: () => color.isDark(),
    isLight: () => color.isLight(),
  };
  return methods[method]
    ? respond(id, methods[method]())
    : respond(id, undefined, "unsupported method");
};

const randomInvariant = (id) => {
  const rgb = tinycolor.random().toRgb();
  return respond(id, {
    valid: true,
    alpha: 1,
    rgbInRange: rgb.r >= 0 && rgb.r <= 255 && rgb.g >= 0 && rgb.g <= 255 && rgb.b >= 0 && rgb.b <= 255,
  });
};

const lines = readline.createInterface({ input: process.stdin, crlfDelay: Infinity });
for await (const line of lines) {
  if (!line) continue;
  try {
    const request = JSON.parse(line);
    if (!request.id || !request.operation) throw new Error("id and operation are required");
    console.log(JSON.stringify(handle(request)));
  } catch (error) {
    console.log(JSON.stringify(respond("", undefined, error instanceof SyntaxError ? "malformed JSON" : error.message)));
  }
}
