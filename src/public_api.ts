import { names } from './css-color-names';
import { inputToRGB, isValidCSSUnit, stringInputToObject } from './format-input';
import { fromRatio, legacyRandom } from './from-ratio';
import { ColorInput, TinyColor, TinyColorOptions } from './index';
import { random } from './random';
import { mostReadable, readability } from './readability';
import { toMsFilter } from './to-ms-filter';

export interface TinyColorDefaultExport {
  (): TinyColor;
  TinyColor: typeof TinyColor;
  readability: typeof readability;
  random: typeof random;
  names: typeof names;
  fromRatio: typeof fromRatio;
  legacyRandom: typeof legacyRandom;
  toMsFilter: typeof toMsFilter;
  inputToRGB: typeof inputToRGB;
  stringInputToObject: typeof stringInputToObject;
  isValidCSSUnit: typeof isValidCSSUnit;
  mostReadable: typeof mostReadable;
}

// kept for backwards compatability with v1
function tinycolor(color: ColorInput = '', opts: Partial<TinyColorOptions> = {}) {
  return new TinyColor(color, opts);
}
const tinycolorumd = tinycolor as TinyColorDefaultExport;
tinycolorumd.TinyColor = TinyColor;
tinycolorumd.readability = readability;
tinycolorumd.mostReadable = mostReadable;
tinycolorumd.random = random;
tinycolorumd.names = names;
tinycolorumd.fromRatio = fromRatio;
tinycolorumd.legacyRandom = legacyRandom;
tinycolorumd.toMsFilter = toMsFilter;
tinycolorumd.inputToRGB = inputToRGB;
tinycolorumd.stringInputToObject = stringInputToObject;
tinycolorumd.isValidCSSUnit = isValidCSSUnit;

export default tinycolorumd;
