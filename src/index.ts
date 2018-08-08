import { rgbaToHex, rgbToHex, rgbToHsl, rgbToHsv } from './conversion';
import { names } from './css-color-names';
import { inputToRGB } from './format-input';
import { HSL, HSLA, HSV, HSVA, RGB, RGBA } from './interfaces';
import { bound01, boundAlpha, clamp01 } from './util';

export interface TinyColorOptions {
  format: string;
  gradientType: string;
}

export type ColorInput = string | RGB | RGBA | HSL | HSLA | HSV | HSVA | TinyColor;

export type ColorFormats =
  | 'rgb'
  | 'prgb'
  | 'hex'
  | 'hex3'
  | 'hex4'
  | 'hex6'
  | 'hex8'
  | 'name'
  | 'hsl'
  | 'hsv';

export class TinyColor {
  /** red */
  r!: number;
  /** green */
  g!: number;
  /** blue */
  b!: number;
  /** alpha */
  a!: number;
  /** the format used to create the tinycolor instance */
  format!: ColorFormats;
  /** input passed into the constructer used to create the tinycolor instance */
  originalInput!: ColorInput;
  /** the color was successfully parsed */
  isValid!: boolean;
  gradientType?: string;
  /** rounded alpha */
  roundA!: number;

  constructor(color: ColorInput = '', opts: Partial<TinyColorOptions> = {}) {
    // If input is already a tinycolor, return itself
    if (color instanceof TinyColor) {
      return color;
    }
    this.originalInput = color;
    const rgb = inputToRGB(color);
    this.originalInput = color;
    this.r = rgb.r;
    this.g = rgb.g;
    this.b = rgb.b;
    this.a = rgb.a;
    this.roundA = Math.round(100 * this.a) / 100;
    this.format = opts.format || rgb.format;
    this.gradientType = opts.gradientType;

    // Don't let the range of [0,255] come back in [0,1].
    // Potentially lose a little bit of precision here, but will fix issues where
    // .5 gets interpreted as half of the total, instead of half of 1
    // If it was supposed to be 128, this was already taken care of by `inputToRgb`
    if (this.r < 1) {
      this.r = Math.round(this.r);
    }
    if (this.g < 1) {
      this.g = Math.round(this.g);
    }
    if (this.b < 1) {
      this.b = Math.round(this.b);
    }

    this.isValid = rgb.ok;
  }
  isDark() {
    return this.getBrightness() < 128;
  }
  isLight() {
    return !this.isDark();
  }
  /**
   * Returns the perceived brightness of the color, from 0-255.
   */
  getBrightness(): number {
    // http://www.w3.org/TR/AERT#color-contrast
    const rgb = this.toRgb();
    return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000;
  }
  /**
   * Returns the perceived luminance of a color, from 0-1.
   */
  getLuminance(): number {
    // http://www.w3.org/TR/2008/REC-WCAG20-20081211/#relativeluminancedef
    const rgb = this.toRgb();
    let R;
    let G;
    let B;
    const RsRGB = rgb.r / 255;
    const GsRGB = rgb.g / 255;
    const BsRGB = rgb.b / 255;

    if (RsRGB <= 0.03928) {
      R = RsRGB / 12.92;
    } else {
      R = Math.pow((RsRGB + 0.055) / 1.055, 2.4);
    }
    if (GsRGB <= 0.03928) {
      G = GsRGB / 12.92;
    } else {
      G = Math.pow((GsRGB + 0.055) / 1.055, 2.4);
    }
    if (BsRGB <= 0.03928) {
      B = BsRGB / 12.92;
    } else {
      B = Math.pow((BsRGB + 0.055) / 1.055, 2.4);
    }
    return 0.2126 * R + 0.7152 * G + 0.0722 * B;
  }
  /**
   * Sets the alpha value on the current color.
   *
   * @param alpha - The new alpha value. The accepted range is 0-1.
   */
  setAlpha(alpha?: string | number): TinyColor {
    this.a = boundAlpha(alpha);
    this.roundA = Math.round(100 * this.a) / 100;
    return this;
  }
  /**
   * Returns the object as a HSVA object.
   */
  toHsv() {
    const hsv = rgbToHsv(this.r, this.g, this.b);
    return { h: hsv.h * 360, s: hsv.s, v: hsv.v, a: this.a };
  }
  /**
   * Returns the hsva values interpolated into a string with the following format:
   * "hsva(xxx, xxx, xxx, xx)".
   */
  toHsvString(): string {
    const hsv = rgbToHsv(this.r, this.g, this.b);
    const h = Math.round(hsv.h * 360);
    const s = Math.round(hsv.s * 100);
    const v = Math.round(hsv.v * 100);
    return this.a === 1 ? `hsv(${h}, ${s}%, ${v}%)` : `hsva(${h}, ${s}%, ${v}%, ${this.roundA})`;
  }
  /**
   * Returns the object as a HSLA object.
   */
  toHsl() {
    const hsl = rgbToHsl(this.r, this.g, this.b);
    return { h: hsl.h * 360, s: hsl.s, l: hsl.l, a: this.a };
  }
  /**
   * Returns the hsla values interpolated into a string with the following format:
   * "hsla(xxx, xxx, xxx, xx)".
   */
  toHslString(): string {
    const hsl = rgbToHsl(this.r, this.g, this.b);
    const h = Math.round(hsl.h * 360);
    const s = Math.round(hsl.s * 100);
    const l = Math.round(hsl.l * 100);
    return this.a === 1 ? `hsl(${h}, ${s}%, ${l}%)` : `hsla(${h}, ${s}%, ${l}%, ${this.roundA})`;
  }
  /**
   * Returns the hex value of the color.
   * @param allow3Char will shorten hex value to 3 char if possible
   */
  toHex(allow3Char = false): string {
    return rgbToHex(this.r, this.g, this.b, allow3Char);
  }
  /**
   * Returns the hex value of the color -with a # appened.
   * @param allow3Char will shorten hex value to 3 char if possible
   */
  toHexString(allow3Char = false): string {
    return '#' + this.toHex(allow3Char);
  }
  /**
   * Returns the hex 8 value of the color.
   * @param allow4Char will shorten hex value to 4 char if possible
   */
  toHex8(allow4Char = false): string {
    return rgbaToHex(this.r, this.g, this.b, this.a, allow4Char);
  }
  /**
   * Returns the hex 8 value of the color -with a # appened.
   * @param allow4Char will shorten hex value to 4 char if possible
   */
  toHex8String(allow4Char = false): string {
    return '#' + this.toHex8(allow4Char);
  }
  /**
   * Returns the object as a RGBA object.
   */
  toRgb() {
    return {
      r: Math.round(this.r),
      g: Math.round(this.g),
      b: Math.round(this.b),
      a: this.a,
    };
  }
  /**
   * Returns the RGBA values interpolated into a string with the following format:
   * "RGBA(xxx, xxx, xxx, xx)".
   */
  toRgbString() {
    const r = Math.round(this.r);
    const g = Math.round(this.g);
    const b = Math.round(this.b);
    return this.a === 1 ? `rgb(${r}, ${g}, ${b})` : `rgba(${r}, ${g}, ${b}, ${this.roundA})`;
  }
  /**
   * Returns the object as a RGBA object.
   */
  toPercentageRgb() {
    const fmt = (x: number) => Math.round(bound01(x, 255) * 100) + '%';
    return {
      r: fmt(this.r),
      g: fmt(this.g),
      b: fmt(this.b),
      a: this.a,
    };
  }
  /**
   * Returns the RGBA relative values interpolated into a string
   */
  toPercentageRgbString() {
    const rnd = (x: number) => Math.round(bound01(x, 255) * 100);
    return this.a === 1
      ? `rgb(${rnd(this.r)}%, ${rnd(this.g)}%, ${rnd(this.b)}%)`
      : `rgba(${rnd(this.r)}%, ${rnd(this.g)}%, ${rnd(this.b)}%, ${this.roundA})`;
  }
  /**
   * The 'real' name of the color -if there is one.
   */
  toName(): string | false {
    if (this.a === 0) {
      return 'transparent';
    }

    if (this.a < 1) {
      return false;
    }
    const hex = '#' + rgbToHex(this.r, this.g, this.b, false);
    for (const key of Object.keys(names)) {
      if (names[key] === hex) {
        return key;
      }
    }
    return false;
  }
  /**
   * String representation of the color.
   *
   * @param format - The format to be used when displaying the string representation.
   */
  toString(format?: ColorFormats) {
    const formatSet = !!format;
    format = format || this.format;

    let formattedString: string | false = false;
    const hasAlpha = this.a < 1 && this.a >= 0;
    const needsAlphaFormat =
      !formatSet && hasAlpha && (format.startsWith('hex') || format === 'name');

    if (needsAlphaFormat) {
      // Special case for "transparent", all other non-alpha formats
      // will return rgba when there is transparency.
      if (format === 'name' && this.a === 0) {
        return this.toName();
      }
      return this.toRgbString();
    }
    if (format === 'rgb') {
      formattedString = this.toRgbString();
    }
    if (format === 'prgb') {
      formattedString = this.toPercentageRgbString();
    }
    if (format === 'hex' || format === 'hex6') {
      formattedString = this.toHexString();
    }
    if (format === 'hex3') {
      formattedString = this.toHexString(true);
    }
    if (format === 'hex4') {
      formattedString = this.toHex8String(true);
    }
    if (format === 'hex8') {
      formattedString = this.toHex8String();
    }
    if (format === 'name') {
      formattedString = this.toName();
    }
    if (format === 'hsl') {
      formattedString = this.toHslString();
    }
    if (format === 'hsv') {
      formattedString = this.toHsvString();
    }

    return formattedString || this.toHexString();
  }
  clone() {
    return new TinyColor(this.toString() as string);
  }
  /**
   * Lighten the color a given amount. Providing 100 will always return white.
   * @param amount - valid between 1-100
   */
  lighten(amount = 10) {
    const hsl = this.toHsl();
    hsl.l += amount / 100;
    hsl.l = clamp01(hsl.l);
    return new TinyColor(hsl);
  }
  /**
   * Brighten the color a given amount, from 0 to 100.
   * @param amount - valid between 1-100
   */
  brighten(amount = 10) {
    const rgb = this.toRgb();
    rgb.r = Math.max(0, Math.min(255, rgb.r - Math.round(255 * -(amount / 100))));
    rgb.g = Math.max(0, Math.min(255, rgb.g - Math.round(255 * -(amount / 100))));
    rgb.b = Math.max(0, Math.min(255, rgb.b - Math.round(255 * -(amount / 100))));
    return new TinyColor(rgb);
  }
  /**
   * Darken the color a given amount, from 0 to 100.
   * Providing 100 will always return black.
   * @param amount - valid between 1-100
   */
  darken(amount = 10) {
    const hsl = this.toHsl();
    hsl.l -= amount / 100;
    hsl.l = clamp01(hsl.l);
    return new TinyColor(hsl);
  }
  /**
   * Mix the color with pure white, from 0 to 100.
   * Providing 0 will do nothing, providing 100 will always return white.
   * @param amount - valid between 1-100
   */
  tint(amount = 10) {
    return this.mix('white', amount);
  }
  /**
   * Mix the color with pure black, from 0 to 100.
   * Providing 0 will do nothing, providing 100 will always return black.
   * @param amount - valid between 1-100
   */
  shade(amount = 10) {
    return this.mix('black', amount);
  }
  /**
   * Desaturate the color a given amount, from 0 to 100.
   * Providing 100 will is the same as calling greyscale
   * @param amount - valid between 1-100
   */
  desaturate(amount = 10) {
    const hsl = this.toHsl();
    hsl.s -= amount / 100;
    hsl.s = clamp01(hsl.s);
    return new TinyColor(hsl);
  }
  /**
   * Saturate the color a given amount, from 0 to 100.
   * @param amount - valid between 1-100
   */
  saturate(amount = 10) {
    const hsl = this.toHsl();
    hsl.s += amount / 100;
    hsl.s = clamp01(hsl.s);
    return new TinyColor(hsl);
  }
  /**
   * Completely desaturates a color into greyscale.
   * Same as calling `desaturate(100)`
   */
  greyscale() {
    return this.desaturate(100);
  }
  /**
   * Spin takes a positive or negative amount within [-360, 360] indicating the change of hue.
   * Values outside of this range will be wrapped into this range.
   */
  spin(amount: number) {
    const hsl = this.toHsl();
    const hue = (hsl.h + amount) % 360;
    hsl.h = hue < 0 ? 360 + hue : hue;
    return new TinyColor(hsl);
  }
  mix(color: ColorInput, amount = 50) {
    const rgb1 = this.toRgb();
    const rgb2 = new TinyColor(color).toRgb();

    const p = amount / 100;
    const rgba = {
      r: (rgb2.r - rgb1.r) * p + rgb1.r,
      g: (rgb2.g - rgb1.g) * p + rgb1.g,
      b: (rgb2.b - rgb1.b) * p + rgb1.b,
      a: (rgb2.a - rgb1.a) * p + rgb1.a,
    };

    return new TinyColor(rgba);
  }
  analogous(results = 6, slices = 30) {
    const hsl = this.toHsl();
    const part = 360 / slices;
    const ret: TinyColor[] = [this];

    for (hsl.h = (hsl.h - ((part * results) >> 1) + 720) % 360; --results; ) {
      hsl.h = (hsl.h + part) % 360;
      ret.push(new TinyColor(hsl));
    }
    return ret;
  }
  /**
   * taken from https://github.com/infusion/jQuery-xcolor/blob/master/jquery.xcolor.js
   */
  complement() {
    const hsl = this.toHsl();
    hsl.h = (hsl.h + 180) % 360;
    return new TinyColor(hsl);
  }
  monochromatic(results = 6) {
    const hsv = this.toHsv();
    const h = hsv.h;
    const s = hsv.s;
    let v = hsv.v;
    const res: TinyColor[] = [];
    const modification = 1 / results;

    while (results--) {
      res.push(new TinyColor({ h, s, v }));
      v = (v + modification) % 1;
    }

    return res;
  }
  splitcomplement() {
    const hsl = this.toHsl();
    const h = hsl.h;
    return [
      this,
      new TinyColor({ h: (h + 72) % 360, s: hsl.s, l: hsl.l }),
      new TinyColor({ h: (h + 216) % 360, s: hsl.s, l: hsl.l }),
    ];
  }
  triad() {
    return this.polyad(3);
  }
  tetrad() {
    return this.polyad(4);
  }
  /**
   * Get polyad colors, like (for 1, 2, 3, 4, 5, 6, 7, 8, etc...)
   * monad, dyad, triad, tetrad, pentad, hexad, heptad, octad, etc...
   */
  polyad(n: number) {
    const hsl = this.toHsl();
    const h = hsl.h;

    const result: TinyColor[] = [this];
    const increment = 360 / n;
    for (let i = 1; i < n; i++) {
      result.push(new TinyColor({ h: (h + i * increment) % 360, s: hsl.s, l: hsl.l }));
    }
    return result;
  }
  /**
   * compare color vs current color
   */
  equals(color?: ColorInput): boolean {
    return this.toRgbString() === new TinyColor(color).toRgbString();
  }
}

// kept for backwards compatability with v1
export function tinycolor(color: ColorInput = '', opts: Partial<TinyColorOptions> = {}) {
  return new TinyColor(color, opts);
}
