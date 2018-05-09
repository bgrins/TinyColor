import { rgbaToArgbHex } from './conversion';
import { ColorInput, TinyColor } from './index';
/**
 * Returns the color represented as a Microsoft filter for use in old versions of IE.
 */
export function toMsFilter(firstColor: ColorInput, secondColor?: ColorInput) {
  const color = new TinyColor(firstColor);
  const hex8String = '#' + rgbaToArgbHex(color.r, color.g, color.b, color.a);
  let secondHex8String = hex8String;
  const gradientType: string = color.gradientType ? 'GradientType = 1, ' : '';

  if (secondColor) {
    const s = new TinyColor(secondColor);
    secondHex8String = '#' + rgbaToArgbHex(s.r, s.g, s.b, s.a);
  }

  return `progid:DXImageTransform.Microsoft.gradient(${gradientType}startColorstr=${hex8String},endColorstr=${secondHex8String})`;
}
