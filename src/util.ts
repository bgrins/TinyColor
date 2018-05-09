/**
 * Take input from [0, n] and return it as [0, 1]
 * @hidden
 */
export function bound01(n: any, max: number) {
  if (isOnePointZero(n)) {
    n = '100%';
  }

  const processPercent = isPercentage(n);
  n = max === 360 ? n : Math.min(max, Math.max(0, parseFloat(n)));

  // Automatically convert percentage into number
  if (processPercent) {
    n = parseInt(String(n * max), 10) / 100;
  }

  // Handle floating point rounding errors
  if (Math.abs(n - max) < 0.000001) {
    return 1;
  }

  // Convert into [0, 1] range if it isn't already
  if (max === 360) {
    // If n is a hue given in degrees,
    // wrap around out-of-range values into [0, 360] range
    // then convert into [0, 1].
    n = (n < 0 ? n % max + max : n % max) / parseFloat(String(max));
  } else {
    // If n not a hue given in degrees
    // Convert into [0, 1] range if it isn't already.
    n = (n % max) / parseFloat(String(max));
  }
  return n;
}

/**
 * Force a number between 0 and 1
 * @hidden
 */
export function clamp01(val: number) {
  return Math.min(1, Math.max(0, val));
}

/**
 * Need to handle 1.0 as 100%, since once it is a number, there is no difference between it and 1
 * <http://stackoverflow.com/questions/7422072/javascript-how-to-detect-number-as-a-decimal-including-1-0>
 * @hidden
 */
export function isOnePointZero(n: string | number) {
  return typeof n === 'string' && n.indexOf('.') !== -1 && parseFloat(n) === 1;
}

/**
 * Check to see if string passed in is a percentage
 * @hidden
 */
export function isPercentage(n: string | number) {
  return typeof n === 'string' && n.indexOf('%') !== -1;
}

/**
 * Return a valid alpha value [0,1] with all invalid values being set to 1
 * @hidden
 */
export function boundAlpha(a?: number | string) {
  a = parseFloat(a as string);

  if (isNaN(a) || a < 0 || a > 1) {
    a = 1;
  }

  return a;
}

/**
 * Replace a decimal with it's percentage value
 * @hidden
 */
export function convertToPercentage(n: number | string) {
  if (n <= 1) {
    return +n * 100 + '%';
  }
  return n;
}

/**
 * Force a hex value to have 2 characters
 * @hidden
 */
export function pad2(c: string) {
  return c.length === 1 ? '0' + c : '' + c;
}
