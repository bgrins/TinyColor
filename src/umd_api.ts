import { names } from './css-color-names';
import { inputToRGB, isValidCSSUnit, stringInputToObject } from './format-input';
import { fromRatio, legacyRandom } from './from-ratio';
import { tinycolor, TinyColor } from './index';
import { random } from './random';
import { mostReadable, readability } from './readability';
import { toMsFilter } from './to-ms-filter';

export interface TinyColorUMD {
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

const tinycolorumd = tinycolor as TinyColorUMD;
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
