// randomColor by David Merfield under the CC0 license
// https://github.com/davidmerfield/randomColor/
import { TinyColor } from './index';
import { HSVA } from './interfaces';

export interface RandomOptions {
  seed?: number;
  hue?:
    | number
    | string
    | 'red'
    | 'orange'
    | 'yellow'
    | 'green'
    | 'blue'
    | 'purple'
    | 'pink'
    | 'monochrome';
  luminosity?: 'random' | 'bright' | 'dark' | 'light';
  alpha?: number;
}

export interface RandomCountOptions extends RandomOptions {
  count?: number | null;
}

export function random(options?: RandomOptions): TinyColor;
export function random(options?: RandomCountOptions): TinyColor[];
export function random(options: RandomOptions | RandomCountOptions = {}) {
  // Check if we need to generate multiple colors
  if ((options as RandomCountOptions).count !== undefined && (options as RandomCountOptions).count !== null) {
    const totalColors: number = (options as RandomCountOptions).count as number;
    const colors: TinyColor[] = [];

    (options as RandomCountOptions).count = undefined;

    while (totalColors > colors.length) {
      // Since we're generating multiple colors,
      // incremement the seed. Otherwise we'd just
      // generate the same color each time...
      (options as RandomCountOptions).count = null;
      if (options.seed) {
        options.seed += 1;
      }
      colors.push(random(options as RandomOptions));
    }

    (options as RandomCountOptions).count = totalColors;
    return colors;
  }

  // First we pick a hue (H)
  const h = pickHue(options.hue, options.seed);

  // Then use H to determine saturation (S)
  const s = pickSaturation(h, options);

  // Then use S and H to determine brightness (B).
  const v = pickBrightness(h, s, options);
  const res: Partial<HSVA> = { h, s, v };
  if (options.alpha !== undefined) {
    res.a = options.alpha;
  }

  // Then we return the HSB color in the desired format
  return new TinyColor(res as HSVA);
}

function pickHue(hue: number | string | undefined, seed?: number) {
  const hueRange = getHueRange(hue);
  let res = randomWithin(hueRange, seed);

  // Instead of storing red as two seperate ranges,
  // we group them, using negative numbers
  if (res < 0) {
    res = 360 + res;
  }

  return res;
}

function pickSaturation(hue: number, options: RandomOptions) {
  if (options.hue === 'monochrome') {
    return 0;
  }

  if (options.luminosity === 'random') {
    return randomWithin([0, 100], options.seed);
  }

  const saturationRange = getColorInfo(hue).saturationRange;

  let sMin = saturationRange[0];
  let sMax = saturationRange[1];

  switch (options.luminosity) {
    case 'bright':
      sMin = 55;
      break;

    case 'dark':
      sMin = sMax - 10;
      break;

    case 'light':
      sMax = 55;
      break;
  }

  return randomWithin([sMin, sMax], options.seed);
}

function pickBrightness(H: number, S: number, options: RandomOptions) {
  let bMin = getMinimumBrightness(H, S);
  let bMax = 100;

  switch (options.luminosity) {
    case 'dark':
      bMax = bMin + 20;
      break;

    case 'light':
      bMin = (bMax + bMin) / 2;
      break;

    case 'random':
      bMin = 0;
      bMax = 100;
      break;
  }

  return randomWithin([bMin, bMax], options.seed);
}

function getMinimumBrightness(H: number, S: number) {
  const lowerBounds = getColorInfo(H).lowerBounds;

  for (let i = 0; i < lowerBounds.length - 1; i++) {
    const s1 = lowerBounds[i][0];
    const v1 = lowerBounds[i][1];

    const s2 = lowerBounds[i + 1][0];
    const v2 = lowerBounds[i + 1][1];

    if (S >= s1 && S <= s2) {
      const m = (v2 - v1) / (s2 - s1);
      const b = v1 - m * s1;

      return m * S + b;
    }
  }

  return 0;
}

function getHueRange(colorInput?: number | string): [number, number] {
  const num = parseInt(colorInput as string, 10);
  if (!Number.isNaN(num) && num < 360 && num > 0) {
    return [num, num];
  }

  if (typeof colorInput === 'string') {
    const namedColor = bounds.find(n => n.name === colorInput);
    if (namedColor) {
      const color = defineColor(namedColor);
      if (color.hueRange) {
        return color.hueRange;
      }
    }
    const parsed = new TinyColor(colorInput);
    if (parsed.isValid) {
      const hue = parsed.toHsv().h;
      return [hue, hue];
    }
  }

  return [0, 360];
}

function getColorInfo(hue: number) {
  // Maps red colors to make picking hue easier
  if (hue >= 334 && hue <= 360) {
    hue -= 360;
  }
  for (const bound of bounds) {
    const color = defineColor(bound);
    if (color.hueRange && hue >= color.hueRange[0] && hue <= color.hueRange[1]) {
      return color;
    }
  }
  throw Error('Color not found');
}

function randomWithin(range: [number, number], seed?: number) {
  if (seed === undefined) {
    return Math.floor(range[0] + Math.random() * (range[1] + 1 - range[0]));
  } else {
    // Seeded random algorithm from http://indiegamr.com/generate-repeatable-random-numbers-in-js/
    const max = range[1] || 1;
    const min = range[0] || 0;
    seed = (seed * 9301 + 49297) % 233280;
    const rnd = seed / 233280.0;
    return Math.floor(min + rnd * (max - min));
  }
}

function defineColor(bound: ColorBound) {
  const sMin = bound.lowerBounds[0][0];
  const sMax = bound.lowerBounds[bound.lowerBounds.length - 1][0];
  const bMin = bound.lowerBounds[bound.lowerBounds.length - 1][1];
  const bMax = bound.lowerBounds[0][1];

  return {
    name: bound.name,
    hueRange: bound.hueRange,
    lowerBounds: bound.lowerBounds,
    saturationRange: [sMin, sMax],
    brightnessRange: [bMin, bMax],
  };
}


/**
 * @hidden
 */
export interface ColorBound {
  name: string;
  hueRange: [number, number] | null;
  lowerBounds: [number, number][];
}

/**
 * @hidden
 */
export const bounds: ColorBound[] = [
  {
    name: 'monochrome',
    hueRange: null,
    lowerBounds: [[0, 0], [100, 0]],
  },
  {
    name: 'red',
    hueRange: [-26, 18],
    lowerBounds: [
      [20, 100],
      [30, 92],
      [40, 89],
      [50, 85],
      [60, 78],
      [70, 70],
      [80, 60],
      [90, 55],
      [100, 50],
    ],
  },
  {
    name: 'orange',
    hueRange: [19, 46],
    lowerBounds: [[20, 100], [30, 93], [40, 88], [50, 86], [60, 85], [70, 70], [100, 70]],
  },
  {
    name: 'yellow',
    hueRange: [47, 62],
    lowerBounds: [[25, 100], [40, 94], [50, 89], [60, 86], [70, 84], [80, 82], [90, 80], [100, 75]],
  },
  {
    name: 'green',
    hueRange: [63, 178],
    lowerBounds: [[30, 100], [40, 90], [50, 85], [60, 81], [70, 74], [80, 64], [90, 50], [100, 40]],
  },
  {
    name: 'blue',
    hueRange: [179, 257],
    lowerBounds: [
      [20, 100],
      [30, 86],
      [40, 80],
      [50, 74],
      [60, 60],
      [70, 52],
      [80, 44],
      [90, 39],
      [100, 35],
    ],
  },
  {
    name: 'purple',
    hueRange: [258, 282],
    lowerBounds: [
      [20, 100],
      [30, 87],
      [40, 79],
      [50, 70],
      [60, 65],
      [70, 59],
      [80, 52],
      [90, 45],
      [100, 42],
    ],
  },
  {
    name: 'pink',
    hueRange: [283, 334],
    lowerBounds: [[20, 100], [30, 90], [40, 86], [60, 84], [80, 80], [90, 75], [100, 73]],
  },
];
