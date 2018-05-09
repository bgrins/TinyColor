import { ColorInput, TinyColor } from './index';

// Readability Functions
// ---------------------
// <http://www.w3.org/TR/2008/REC-WCAG20-20081211/#contrast-ratiodef (WCAG Version 2)

/**
 * AKA `contrast`
 *
 * Analyze the 2 colors and returns the color contrast defined by (WCAG Version 2)
 */
export function readability(color1: ColorInput, color2: ColorInput) {
  const c1 = new TinyColor(color1);
  const c2 = new TinyColor(color2);
  return (
    (Math.max(c1.getLuminance(), c2.getLuminance()) + 0.05) /
    (Math.min(c1.getLuminance(), c2.getLuminance()) + 0.05)
  );
}

export interface WCAG2Parms {
  level?: 'AA' | 'AAA';
  size?: 'large' | 'small';
}

/**
 * Ensure that foreground and background color combinations meet WCAG2 guidelines.
 * The third argument is an object.
 *      the 'level' property states 'AA' or 'AAA' - if missing or invalid, it defaults to 'AA';
 *      the 'size' property states 'large' or 'small' - if missing or invalid, it defaults to 'small'.
 * If the entire object is absent, isReadable defaults to {level:"AA",size:"small"}.
 *
 * Example
 * ```ts
 * new TinyColor().isReadable('#000', '#111') => false
 * new TinyColor().isReadable('#000', '#111', { level: 'AA', size: 'large' }) => false
 * ```
 */
export function isReadable(
  color1: ColorInput,
  color2: ColorInput,
  wcag2: WCAG2Parms = { level: 'AA', size: 'small' },
) {
  const readabilityLevel = readability(color1, color2);
  switch ((wcag2.level || 'AA') + (wcag2.size || 'small')) {
    case 'AAsmall':
    case 'AAAlarge':
      return readabilityLevel >= 4.5;
    case 'AAlarge':
      return readabilityLevel >= 3;
    case 'AAAsmall':
      return readabilityLevel >= 7;
  }
  return false;
}

export interface WCAG2FallbackParms extends WCAG2Parms {
  includeFallbackColors?: boolean;
}

/**
 * Given a base color and a list of possible foreground or background
 * colors for that base, returns the most readable color.
 * Optionally returns Black or White if the most readable color is unreadable.
 *
 * @param baseColor - the base color.
 * @param colorList - array of colors to pick the most readable one from.
 * @param args - and object with extra arguments
 *
 * Example
 * ```ts
 * new TinyColor().mostReadable('#123', ['#124", "#125'], { includeFallbackColors: false }).toHexString(); // "#112255"
 * new TinyColor().mostReadable('#123', ['#124", "#125'],{ includeFallbackColors: true }).toHexString();  // "#ffffff"
 * new TinyColor().mostReadable('#a8015a', ["#faf3f3"], { includeFallbackColors:true, level: 'AAA', size: 'large' }).toHexString(); // "#faf3f3"
 * new TinyColor().mostReadable('#a8015a', ["#faf3f3"], { includeFallbackColors:true, level: 'AAA', size: 'small' }).toHexString(); // "#ffffff"
 * ```
 */
export function mostReadable(
  baseColor: ColorInput,
  colorList: string[],
  args: WCAG2FallbackParms = { includeFallbackColors: false, level: 'AA', size: 'small' },
): TinyColor | null {
  let bestColor: TinyColor | null = null;
  let bestScore = 0;
  const includeFallbackColors = args.includeFallbackColors;
  const level = args.level;
  const size = args.size;

  for (const color of colorList) {
    const score = readability(baseColor, color);
    if (score > bestScore) {
      bestScore = score;
      bestColor = new TinyColor(color);
    }
  }

  if (isReadable(baseColor, bestColor as TinyColor, { level, size }) || !includeFallbackColors) {
    return bestColor;
  } else {
    args.includeFallbackColors = false;
    return mostReadable(baseColor, ['#fff', '#000'], args);
  }
}
