import {
  fromLegacyRandom,
  fromRatio,
  isReadable,
  mostReadable,
  names,
  readability,
  toMsFilter,
  TinyColor,
} from '../src/public_api';
import conversions from './conversions';
import {
  BRIGHTENS,
  DARKENS,
  DESATURATIONS,
  LIGHTENS,
  SATURATIONS,
  SHADES,
  TINTS,
} from './modifications';

describe('TinyColor', () => {
  it('should init', () => {
    const r = new TinyColor('red');
    expect(r.toName()).toBe('red');
    expect(r).toBeTruthy();
  });
  it('should clone', () => {
    const color1 = new TinyColor('red');
    const color2 = new TinyColor('red').clone();
    color2.setAlpha(0.5);
    expect(color2.isValid).toBeTruthy();
    expect(color2.toString()).toBe('rgba(255, 0, 0, 0.5)');
    expect(color1.toString()).toBe('red');
  });
  it('should parse options', () => {
    expect(new TinyColor('red', { format: 'hex' }).toString()).toEqual('#ff0000');
    expect(fromRatio({ r: 1, g: 0, b: 0 }, { format: 'hex' }).toString()).toEqual('#ff0000');
  });
  it('should get original input', () => {
    const colorRgbUp = 'RGB(39, 39, 39)';
    const colorRgbLow = 'rgb(39, 39, 39)';
    const colorRgbMix = 'RgB(39, 39, 39)';
    const tinycolorObj = new TinyColor(colorRgbMix);
    const inputObj = { r: 100, g: 100, b: 100 };
    const r = new TinyColor('red');
    // original lowercase input is returned
    expect(new TinyColor(colorRgbLow).originalInput).toBe(colorRgbLow);
    //  original uppercase input is returned
    expect(new TinyColor(colorRgbUp).originalInput).toBe(colorRgbUp);
    // original mixed input is returned
    expect(new TinyColor(colorRgbMix).originalInput).toBe(colorRgbMix);
    // when given a tinycolor instance, the color string is returned
    expect(new TinyColor(tinycolorObj).originalInput).toBe(colorRgbMix);
    // when given an object, the object is returned
    expect(new TinyColor(inputObj).originalInput).toBe(inputObj);
    //  when given an empty string, an empty string is returned
    expect(new TinyColor('').originalInput).toBe('');
    //  when given an undefined value, an empty string is returned
    expect(new TinyColor().originalInput).toBe('');
  });
  it('should have color equality', () => {
    expect(conversions.length).toBe(16);
    for (const c of conversions) {
      const tiny = new TinyColor(c.hex);
      expect(tiny.isValid).toBe(true);
      expect(new TinyColor(c.rgb).equals(c.hex)).toBe(true);
      expect(new TinyColor(c.rgb).equals(c.hex8)).toBe(true);
      expect(new TinyColor(c.rgb).equals(c.hsl)).toBe(true);
      expect(new TinyColor(c.rgb).equals(c.hsv)).toBe(true);
      expect(new TinyColor(c.rgb).equals(c.rgb)).toBe(true);
      expect(new TinyColor(c.hex).equals(c.hex)).toBe(true);
      expect(new TinyColor(c.hex).equals(c.hex8)).toBe(true);
      expect(new TinyColor(c.hex).equals(c.hsl)).toBe(true);
      expect(new TinyColor(c.hex).equals(c.hsv)).toBe(true);
      expect(new TinyColor(c.hsl).equals(c.hsv)).toBe(true);
    }
  });
  it('should parse ratio', () => {
    // with ratio
    // white
    expect(fromRatio({ r: 1, g: 1, b: 1 }).toHexString()).toBe('#ffffff');
    // alpha works when ratio is parsed
    expect(fromRatio({ r: 1, g: 0, b: 0, a: 0.5 }).toRgbString()).toBe('rgba(255, 0, 0, 0.5)');
    // alpha = 1 works when ratio is parsed
    expect(fromRatio({ r: 1, g: 0, b: 0, a: 1 }).toRgbString()).toBe('rgb(255, 0, 0)');
    // alpha > 1 works when ratio is parsed
    expect(fromRatio({ r: 1, g: 0, b: 0, a: 10 }).toRgbString()).toBe('rgb(255, 0, 0)');
    // alpha < 1 works when ratio is parsed
    expect(fromRatio({ r: 1, g: 0, b: 0, a: -1 }).toRgbString()).toBe('rgb(255, 0, 0)');

    // without ratio
    expect(new TinyColor({ r: 1, g: 1, b: 1 }).toHexString()).toBe('#010101');
    expect(new TinyColor({ r: 0.1, g: 0.1, b: 0.1 }).toHexString()).toBe('#000000');
    expect(new TinyColor('rgb .1 .1 .1').toHexString()).toBe('#000000');
  });
  it('should parse rgb text', () => {
    // spaced input
    expect(new TinyColor('rgb 255 0 0').toHexString()).toBe('#ff0000');
    // parenthesized input
    expect(new TinyColor('rgb(255, 0, 0)').toHexString()).toBe('#ff0000');
    // parenthesized spaced input
    expect(new TinyColor('rgb (255, 0, 0)').toHexString()).toBe('#ff0000');
    // object input
    expect(new TinyColor({ r: 255, g: 0, b: 0 }).toHexString()).toBe('#ff0000');
    // object input and compare
    expect(new TinyColor({ r: 255, g: 0, b: 0 }).toRgb()).toEqual({ r: 255, g: 0, b: 0, a: 1 });

    expect(new TinyColor({ r: 200, g: 100, b: 0 }).equals('rgb(200, 100, 0)')).toBe(true);
    expect(new TinyColor({ r: 200, g: 100, b: 0 }).equals('rgb 200 100 0')).toBe(true);
    expect(new TinyColor({ r: 200, g: 100, b: 0 }).equals('rgb 200 100 0')).toBe(true);
    expect(new TinyColor({ r: 200, g: 100, b: 0, a: 0.4 }).equals('rgba 200 100 0 .4')).toBe(true);
    expect(new TinyColor({ r: 199, g: 100, b: 0 }).equals()).toBe(false);

    expect(new TinyColor().equals(new TinyColor({ r: 200, g: 100, b: 0 }))).toBe(false);
    expect(new TinyColor().equals(new TinyColor({ r: 200, g: 100, b: 0 }))).toBe(false);
    expect(new TinyColor().equals(new TinyColor({ r: 200, g: 100, b: 0 }))).toBe(false);
  });
  it('should parse percentage rgb text', () => {
    // spaced input
    expect(new TinyColor('rgb 100% 0% 0%').toHexString()).toBe('#ff0000');
    // parenthesized input
    expect(new TinyColor('rgb(100%, 0%, 0%)').toHexString()).toBe('#ff0000');
    // parenthesized spaced input
    expect(new TinyColor('rgb (100%, 0%, 0%)').toHexString()).toBe('#ff0000');
    // object input
    expect(new TinyColor({ r: '100%', g: '0%', b: '0%' }).toHexString()).toBe('#ff0000');
    // object input and compare
    expect(new TinyColor({ r: '100%', g: '0%', b: '0%' }).toRgb()).toEqual({
      r: 255,
      g: 0,
      b: 0,
      a: 1,
    });

    expect(new TinyColor({ r: '90%', g: '45%', b: '0%' }).equals('rgb(90%, 45%, 0%)')).toBe(true);
    expect(new TinyColor({ r: '90%', g: '45%', b: '0%' }).equals('rgb 90% 45% 0%')).toBe(true);
    expect(new TinyColor({ r: '90%', g: '45%', b: '0%' }).equals('rgb 90% 45% 0%')).toBe(true);
    expect(
      new TinyColor({ r: '90%', g: '45%', b: '0%', a: 0.4 }).equals('rgba 90% 45% 0% .4'),
    ).toBe(true);
    expect(new TinyColor({ r: '89%', g: '45%', b: '0%' }).equals('rgba 90% 45% 0% 1')).toBe(false);

    expect(new TinyColor({ r: '89%', g: '45%', b: '0%' }).equals('rgb(90%, 45%, 0%)')).toBe(false);
    expect(new TinyColor({ r: '89%', g: '45%', b: '0%' }).equals('rgb 90% 45% 0%')).toBe(false);
    expect(new TinyColor({ r: '89%', g: '45%', b: '0%' }).equals('rgb 90% 45% 0%')).toBe(false);

    expect(
      new TinyColor({ r: '90%', g: '45%', b: '0%' }).equals(new TinyColor('rgb 90% 45% 0%')),
    ).toBe(true);
    expect(
      new TinyColor({ r: '90%', g: '45%', b: '0%' }).equals(new TinyColor('rgb 90% 45% 0%')),
    ).toBe(true);
    expect(
      new TinyColor({ r: '90%', g: '45%', b: '0%' }).equals(new TinyColor('rgb(90%, 45%, 0%)')),
    ).toBe(true);
  });
  it('should parse HSL', () => {
    // to hex
    expect(new TinyColor({ h: 251, s: 100, l: 0.38 }).toHexString()).toBe('#2400c2');
    // to rgb
    expect(new TinyColor({ h: 251, s: 100, l: 0.38 }).toRgbString()).toBe('rgb(36, 0, 194)');
    // to hsl
    expect(new TinyColor({ h: 251, s: 100, l: 0.38 }).toHslString()).toBe('hsl(251, 100%, 38%)');
    expect(new TinyColor({ h: 251, s: 100, l: 0.38, a: 0.38 }).toHslString()).toBe(
      'hsla(251, 100%, 38%, 0.38)',
    );
    // to hex
    expect(new TinyColor('hsl(251, 100, 38)').toHexString()).toBe('#2400c2');
    // to rgb
    expect(new TinyColor('hsl(251, 100%, 38%)').toRgbString()).toBe('rgb(36, 0, 194)');
    // to hsl
    expect(new TinyColor('hsl(251, 100%, 38%)').toHslString()).toBe('hsl(251, 100%, 38%)');
    // problematic hsl
    expect(new TinyColor('hsl 100 20 10').toHslString()).toBe('hsl(100, 20%, 10%)');
    expect(new TinyColor('hsla 100 20 10 0.38').toHslString()).toBe('hsla(100, 20%, 10%, 0.38)');
    // wrap out of bounds hue
    expect(new TinyColor('hsl -700 20 10').toHslString()).toBe('hsl(20, 20%, 10%)');
    expect(new TinyColor('hsl -490 100% 50%').toHslString()).toBe('hsl(230, 100%, 50%)');
  });
  it('should parse Hex', () => {
    expect(new TinyColor('rgb 255 0 0').toHexString()).toBe('#ff0000');
    expect(new TinyColor('rgb 255 0 0').toHexString(true)).toBe('#f00');
    expect(new TinyColor('rgba 255 0 0 0.5').toHex8String()).toBe('#ff000080');
    expect(new TinyColor('rgba 255 0 0 0').toHex8String()).toBe('#ff000000');
    expect(new TinyColor('rgba 255 0 0 1').toHex8String()).toBe('#ff0000ff');
    expect(new TinyColor('rgba 255 0 0 1').toHex8String(true)).toBe('#f00f');
    expect(new TinyColor('rgb 255 0 0').toHex()).toBe('ff0000');
    expect(new TinyColor('rgb 255 0 0').toHex(true)).toBe('f00');
    expect(new TinyColor('rgba 255 0 0 0.5').toHex8()).toBe('ff000080');
  });
  it('should parse hsv', () => {
    expect(new TinyColor('hsv 251.1 0.887 .918').toHsvString()).toBe('hsv(251, 89%, 92%)');
    expect(new TinyColor('hsv 251.1 0.887 0.918').toHsvString()).toBe('hsv(251, 89%, 92%)');
    expect(new TinyColor('hsva 251.1 0.887 0.918 0.5').toHsvString()).toBe(
      'hsva(251, 89%, 92%, 0.5)',
    );
  });
  it('should parse invalid input', () => {
    let invalidColor = new TinyColor('not a color');
    expect(invalidColor.toHexString()).toBe('#000000');
    expect(invalidColor.isValid).toBe(false);

    invalidColor = new TinyColor('#red');
    expect(invalidColor.toHexString()).toBe('#000000');
    expect(invalidColor.isValid).toBe(false);

    invalidColor = new TinyColor('  #red');
    expect(invalidColor.toHexString()).toBe('#000000');
    expect(invalidColor.isValid).toBe(false);

    invalidColor = new TinyColor('##123456');
    expect(invalidColor.toHexString()).toBe('#000000');
    expect(invalidColor.isValid).toBe(false);

    invalidColor = new TinyColor('  ##123456');
    expect(invalidColor.toHexString()).toBe('#000000');
    expect(invalidColor.isValid).toBe(false);

    invalidColor = new TinyColor({ r: 'invalid', g: 'invalid', b: 'invalid' });
    expect(invalidColor.toHexString()).toBe('#000000');
    expect(invalidColor.isValid).toBe(false);

    invalidColor = new TinyColor({ h: 'invalid', s: 'invalid', l: 'invalid' } as any);
    expect(invalidColor.toHexString()).toBe('#000000');
    expect(invalidColor.isValid).toBe(false);

    invalidColor = new TinyColor({ h: 'invalid', s: 'invalid', v: 'invalid' } as any);
    expect(invalidColor.toHexString()).toBe('#000000');
    expect(invalidColor.isValid).toBe(false);

    invalidColor = new TinyColor();
    expect(invalidColor.toHexString()).toBe('#000000');
    expect(invalidColor.isValid).toBe(false);
  });
  it('should parse named colors', () => {
    expect(new TinyColor('aliceblue').toHex()).toBe('f0f8ff');
    expect(new TinyColor('antiquewhite').toHex()).toBe('faebd7');
    expect(new TinyColor('aqua').toHex()).toBe('00ffff');
    expect(new TinyColor('aquamarine').toHex()).toBe('7fffd4');
    expect(new TinyColor('azure').toHex()).toBe('f0ffff');
    expect(new TinyColor('beige').toHex()).toBe('f5f5dc');
    expect(new TinyColor('bisque').toHex()).toBe('ffe4c4');
    expect(new TinyColor('black').toHex()).toBe('000000');
    expect(new TinyColor('blanchedalmond').toHex()).toBe('ffebcd');
    expect(new TinyColor('blue').toHex()).toBe('0000ff');
    expect(new TinyColor('blueviolet').toHex()).toBe('8a2be2');
    expect(new TinyColor('brown').toHex()).toBe('a52a2a');
    expect(new TinyColor('burlywood').toHex()).toBe('deb887');
    expect(new TinyColor('cadetblue').toHex()).toBe('5f9ea0');
    expect(new TinyColor('chartreuse').toHex()).toBe('7fff00');
    expect(new TinyColor('chocolate').toHex()).toBe('d2691e');
    expect(new TinyColor('coral').toHex()).toBe('ff7f50');
    expect(new TinyColor('cornflowerblue').toHex()).toBe('6495ed');
    expect(new TinyColor('cornsilk').toHex()).toBe('fff8dc');
    expect(new TinyColor('crimson').toHex()).toBe('dc143c');
    expect(new TinyColor('cyan').toHex()).toBe('00ffff');
    expect(new TinyColor('darkblue').toHex()).toBe('00008b');
    expect(new TinyColor('darkcyan').toHex()).toBe('008b8b');
    expect(new TinyColor('darkgoldenrod').toHex()).toBe('b8860b');
    expect(new TinyColor('darkgray').toHex()).toBe('a9a9a9');
    expect(new TinyColor('darkgreen').toHex()).toBe('006400');
    expect(new TinyColor('darkkhaki').toHex()).toBe('bdb76b');
    expect(new TinyColor('darkmagenta').toHex()).toBe('8b008b');
    expect(new TinyColor('darkolivegreen').toHex()).toBe('556b2f');
    expect(new TinyColor('darkorange').toHex()).toBe('ff8c00');
    expect(new TinyColor('darkorchid').toHex()).toBe('9932cc');
    expect(new TinyColor('darkred').toHex()).toBe('8b0000');
    expect(new TinyColor('darksalmon').toHex()).toBe('e9967a');
    expect(new TinyColor('darkseagreen').toHex()).toBe('8fbc8f');
    expect(new TinyColor('darkslateblue').toHex()).toBe('483d8b');
    expect(new TinyColor('darkslategray').toHex()).toBe('2f4f4f');
    expect(new TinyColor('darkturquoise').toHex()).toBe('00ced1');
    expect(new TinyColor('darkviolet').toHex()).toBe('9400d3');
    expect(new TinyColor('deeppink').toHex()).toBe('ff1493');
    expect(new TinyColor('deepskyblue').toHex()).toBe('00bfff');
    expect(new TinyColor('dimgray').toHex()).toBe('696969');
    expect(new TinyColor('dodgerblue').toHex()).toBe('1e90ff');
    expect(new TinyColor('firebrick').toHex()).toBe('b22222');
    expect(new TinyColor('floralwhite').toHex()).toBe('fffaf0');
    expect(new TinyColor('forestgreen').toHex()).toBe('228b22');
    expect(new TinyColor('fuchsia').toHex()).toBe('ff00ff');
    expect(new TinyColor('gainsboro').toHex()).toBe('dcdcdc');
    expect(new TinyColor('ghostwhite').toHex()).toBe('f8f8ff');
    expect(new TinyColor('gold').toHex()).toBe('ffd700');
    expect(new TinyColor('goldenrod').toHex()).toBe('daa520');
    expect(new TinyColor('gray').toHex()).toBe('808080');
    expect(new TinyColor('grey').toHex()).toBe('808080');
    expect(new TinyColor('green').toHex()).toBe('008000');
    expect(new TinyColor('greenyellow').toHex()).toBe('adff2f');
    expect(new TinyColor('honeydew').toHex()).toBe('f0fff0');
    expect(new TinyColor('hotpink').toHex()).toBe('ff69b4');
    expect(new TinyColor('indianred ').toHex()).toBe('cd5c5c');
    expect(new TinyColor('indigo ').toHex()).toBe('4b0082');
    expect(new TinyColor('ivory').toHex()).toBe('fffff0');
    expect(new TinyColor('khaki').toHex()).toBe('f0e68c');
    expect(new TinyColor('lavender').toHex()).toBe('e6e6fa');
    expect(new TinyColor('lavenderblush').toHex()).toBe('fff0f5');
    expect(new TinyColor('lawngreen').toHex()).toBe('7cfc00');
    expect(new TinyColor('lemonchiffon').toHex()).toBe('fffacd');
    expect(new TinyColor('lightblue').toHex()).toBe('add8e6');
    expect(new TinyColor('lightcoral').toHex()).toBe('f08080');
    expect(new TinyColor('lightcyan').toHex()).toBe('e0ffff');
    expect(new TinyColor('lightgoldenrodyellow').toHex()).toBe('fafad2');
    expect(new TinyColor('lightgrey').toHex()).toBe('d3d3d3');
    expect(new TinyColor('lightgreen').toHex()).toBe('90ee90');
    expect(new TinyColor('lightpink').toHex()).toBe('ffb6c1');
    expect(new TinyColor('lightsalmon').toHex()).toBe('ffa07a');
    expect(new TinyColor('lightseagreen').toHex()).toBe('20b2aa');
    expect(new TinyColor('lightskyblue').toHex()).toBe('87cefa');
    expect(new TinyColor('lightslategray').toHex()).toBe('778899');
    expect(new TinyColor('lightsteelblue').toHex()).toBe('b0c4de');
    expect(new TinyColor('lightyellow').toHex()).toBe('ffffe0');
    expect(new TinyColor('lime').toHex()).toBe('00ff00');
    expect(new TinyColor('limegreen').toHex()).toBe('32cd32');
    expect(new TinyColor('linen').toHex()).toBe('faf0e6');
    expect(new TinyColor('magenta').toHex()).toBe('ff00ff');
    expect(new TinyColor('maroon').toHex()).toBe('800000');
    expect(new TinyColor('mediumaquamarine').toHex()).toBe('66cdaa');
    expect(new TinyColor('mediumblue').toHex()).toBe('0000cd');
    expect(new TinyColor('mediumorchid').toHex()).toBe('ba55d3');
    expect(new TinyColor('mediumpurple').toHex()).toBe('9370db');
    expect(new TinyColor('mediumseagreen').toHex()).toBe('3cb371');
    expect(new TinyColor('mediumslateblue').toHex()).toBe('7b68ee');
    expect(new TinyColor('mediumspringgreen').toHex()).toBe('00fa9a');
    expect(new TinyColor('mediumturquoise').toHex()).toBe('48d1cc');
    expect(new TinyColor('mediumvioletred').toHex()).toBe('c71585');
    expect(new TinyColor('midnightblue').toHex()).toBe('191970');
    expect(new TinyColor('mintcream').toHex()).toBe('f5fffa');
    expect(new TinyColor('mistyrose').toHex()).toBe('ffe4e1');
    expect(new TinyColor('moccasin').toHex()).toBe('ffe4b5');
    expect(new TinyColor('navajowhite').toHex()).toBe('ffdead');
    expect(new TinyColor('navy').toHex()).toBe('000080');
    expect(new TinyColor('oldlace').toHex()).toBe('fdf5e6');
    expect(new TinyColor('olive').toHex()).toBe('808000');
    expect(new TinyColor('olivedrab').toHex()).toBe('6b8e23');
    expect(new TinyColor('orange').toHex()).toBe('ffa500');
    expect(new TinyColor('orangered').toHex()).toBe('ff4500');
    expect(new TinyColor('orchid').toHex()).toBe('da70d6');
    expect(new TinyColor('palegoldenrod').toHex()).toBe('eee8aa');
    expect(new TinyColor('palegreen').toHex()).toBe('98fb98');
    expect(new TinyColor('paleturquoise').toHex()).toBe('afeeee');
    expect(new TinyColor('palevioletred').toHex()).toBe('db7093');
    expect(new TinyColor('papayawhip').toHex()).toBe('ffefd5');
    expect(new TinyColor('peachpuff').toHex()).toBe('ffdab9');
    expect(new TinyColor('peru').toHex()).toBe('cd853f');
    expect(new TinyColor('pink').toHex()).toBe('ffc0cb');
    expect(new TinyColor('plum').toHex()).toBe('dda0dd');
    expect(new TinyColor('powderblue').toHex()).toBe('b0e0e6');
    expect(new TinyColor('purple').toHex()).toBe('800080');
    expect(new TinyColor('rebeccapurple').toHex()).toBe('663399');
    expect(new TinyColor('red').toHex()).toBe('ff0000');
    expect(new TinyColor('rosybrown').toHex()).toBe('bc8f8f');
    expect(new TinyColor('royalblue').toHex()).toBe('4169e1');
    expect(new TinyColor('saddlebrown').toHex()).toBe('8b4513');
    expect(new TinyColor('salmon').toHex()).toBe('fa8072');
    expect(new TinyColor('sandybrown').toHex()).toBe('f4a460');
    expect(new TinyColor('seagreen').toHex()).toBe('2e8b57');
    expect(new TinyColor('seashell').toHex()).toBe('fff5ee');
    expect(new TinyColor('sienna').toHex()).toBe('a0522d');
    expect(new TinyColor('silver').toHex()).toBe('c0c0c0');
    expect(new TinyColor('skyblue').toHex()).toBe('87ceeb');
    expect(new TinyColor('slateblue').toHex()).toBe('6a5acd');
    expect(new TinyColor('slategray').toHex()).toBe('708090');
    expect(new TinyColor('snow').toHex()).toBe('fffafa');
    expect(new TinyColor('springgreen').toHex()).toBe('00ff7f');
    expect(new TinyColor('steelblue').toHex()).toBe('4682b4');
    expect(new TinyColor('tan').toHex()).toBe('d2b48c');
    expect(new TinyColor('teal').toHex()).toBe('008080');
    expect(new TinyColor('thistle').toHex()).toBe('d8bfd8');
    expect(new TinyColor('tomato').toHex()).toBe('ff6347');
    expect(new TinyColor('turquoise').toHex()).toBe('40e0d0');
    expect(new TinyColor('violet').toHex()).toBe('ee82ee');
    expect(new TinyColor('wheat').toHex()).toBe('f5deb3');
    expect(new TinyColor('white').toHex()).toBe('ffffff');
    expect(new TinyColor('whitesmoke').toHex()).toBe('f5f5f5');
    expect(new TinyColor('yellow').toHex()).toBe('ffff00');
    expect(new TinyColor('yellowgreen').toHex()).toBe('9acd32');

    expect(new TinyColor('#f00').toName()).toBe('red');
    expect(new TinyColor('#fa0a0a').toName()).toBe(false);
  });
  it('Invalid alpha should normalize to 1', () => {
    // Negative value
    expect(new TinyColor({ r: 255, g: 20, b: 10, a: -1 }).toRgbString()).toBe('rgb(255, 20, 10)');
    // Negative 0
    expect(new TinyColor({ r: 255, g: 20, b: 10, a: -0 }).toRgbString()).toBe(
      'rgba(255, 20, 10, 0)',
    );
    expect(new TinyColor({ r: 255, g: 20, b: 10, a: 0 }).toRgbString()).toBe(
      'rgba(255, 20, 10, 0)',
    );
    expect(new TinyColor({ r: 255, g: 20, b: 10, a: 0.5 }).toRgbString()).toBe(
      'rgba(255, 20, 10, 0.5)',
    );
    expect(new TinyColor({ r: 255, g: 20, b: 10, a: 1 }).toRgbString()).toBe('rgb(255, 20, 10)');
    // Greater than 1
    expect(new TinyColor({ r: 255, g: 20, b: 10, a: 100 }).toRgbString()).toBe('rgb(255, 20, 10)');
    // Non Numeric
    expect(new TinyColor({ r: 255, g: 20, b: 10, a: 'asdfasd' }).toRgbString()).toBe(
      'rgb(255, 20, 10)',
    );

    expect(new TinyColor('#fff').toRgbString()).toBe('rgb(255, 255, 255)');
    // Greater than 1 in string parsing
    expect(new TinyColor('rgba 255 0 0 100').toRgbString()).toBe('rgb(255, 0, 0)');
  });
  it('should translate toString with alpha set', () => {
    const redNamed = fromRatio({ r: 255, g: 0, b: 0, a: 0.6 }, { format: 'name' });
    const redHex = fromRatio({ r: 255, g: 0, b: 0, a: 0.4 }, { format: 'hex' });

    expect(redNamed.format).toBe('name');
    expect(redHex.format).toBe('hex');

    // Names should default to rgba if alpha is < 1
    expect(redNamed.toString()).toBe('rgba(255, 0, 0, 0.6)');
    // Hex should default to rgba if alpha is < 1
    expect(redHex.toString()).toBe('rgba(255, 0, 0, 0.4)');

    // Names should not be returned as rgba if format is specified
    expect(redNamed.toString('hex')).toBe('#ff0000');
    // Names should not be returned as rgba if format is specified
    expect(redNamed.toString('hex6')).toBe('#ff0000');
    // Names should not be returned as rgba if format is specified
    expect(redNamed.toString('hex3')).toBe('#f00');
    // Names should not be returned as rgba if format is specified
    expect(redNamed.toString('hex8')).toBe('#ff000099');
    // Names should not be returned as rgba if format is specified
    expect(redNamed.toString('hex4')).toBe('#f009');
    // Semi transparent names should return hex in toString() if name format is specified
    expect(redNamed.toString('name')).toBe('#ff0000');
    // Semi transparent names should be false in toName()
    expect(redNamed.toName()).toBe(false);
    // Hex should default to rgba if alpha is < 1
    expect(redHex.toString()).toBe('rgba(255, 0, 0, 0.4)');
    // Named color should equal transparent if alpha == 0
    const transparentNamed = fromRatio({ r: 255, g: 0, b: 0, a: 0 }, { format: 'name' });
    expect(transparentNamed.toString()).toBe('transparent');

    redHex.setAlpha(0);
    // Hex should default to rgba if alpha is = 0
    expect(redHex.toString()).toBe('rgba(255, 0, 0, 0)');
    redHex.setAlpha(0.38);
    expect(redHex.toString()).toBe('rgba(255, 0, 0, 0.38)');
  });
  it('should set alpha', () => {
    const hexSetter = new TinyColor('rgba(255, 0, 0, 1)');
    // Alpha should start as 1
    expect(hexSetter.a).toBe(1);
    const returnedFromSetAlpha = hexSetter.setAlpha(0.9);
    // setAlpha return value should be the color
    expect(returnedFromSetAlpha).toBe(hexSetter);
    // setAlpha should change alpha value
    expect(hexSetter.a).toBe(0.9);
    hexSetter.setAlpha(0.5);
    // setAlpha should change alpha value
    expect(hexSetter.a).toBe(0.5);
    hexSetter.setAlpha(0);
    // setAlpha should change alpha value
    expect(hexSetter.a).toBe(0);
    hexSetter.setAlpha(-1);
    // setAlpha with value < 0 should be bound to 1
    expect(hexSetter.a).toBe(1);
    hexSetter.setAlpha(2);
    // setAlpha with value > 1 should be bound to 1
    expect(hexSetter.a).toBe(1);
    hexSetter.setAlpha();
    // setAlpha with invalid value should be bound to 1
    expect(hexSetter.a).toBe(1);
    hexSetter.setAlpha(null);
    // setAlpha with invalid value should be bound to 1
    expect(hexSetter.a).toBe(1);
    hexSetter.setAlpha('test');
    // setAlpha with invalid value should be bound to 1
    expect(hexSetter.a).toBe(1);
  });
  it('Alpha = 0 should act differently on toName()', () => {
    expect(new TinyColor({ r: 255, g: 20, b: 10, a: 0 }).toName()).toBe('transparent');
    expect(new TinyColor('transparent').toString()).toBe('transparent');
    expect(new TinyColor('transparent').toHex()).toBe('000000');
  });
  it('should getBrightness', () => {
    expect(new TinyColor('#000').getBrightness()).toBe(0);
    expect(new TinyColor('#fff').getBrightness()).toBe(255);
  });

  it('should getLuminance', () => {
    expect(new TinyColor('#000').getLuminance()).toBe(0);
    expect(new TinyColor('#fff').getLuminance()).toBe(1);
  });

  it('isDark returns true/false for dark/light colors', () => {
    expect(new TinyColor('#000').isDark()).toBe(true);
    expect(new TinyColor('#111').isDark()).toBe(true);
    expect(new TinyColor('#222').isDark()).toBe(true);
    expect(new TinyColor('#333').isDark()).toBe(true);
    expect(new TinyColor('#444').isDark()).toBe(true);
    expect(new TinyColor('#555').isDark()).toBe(true);
    expect(new TinyColor('#666').isDark()).toBe(true);
    expect(new TinyColor('#777').isDark()).toBe(true);
    expect(new TinyColor('#888').isDark()).toBe(false);
    expect(new TinyColor('#999').isDark()).toBe(false);
    expect(new TinyColor('#aaa').isDark()).toBe(false);
    expect(new TinyColor('#bbb').isDark()).toBe(false);
    expect(new TinyColor('#ccc').isDark()).toBe(false);
    expect(new TinyColor('#ddd').isDark()).toBe(false);
    expect(new TinyColor('#eee').isDark()).toBe(false);
    expect(new TinyColor('#fff').isDark()).toBe(false);
  });
  it('isLight returns true/false for light/dark colors', () => {
    expect(new TinyColor('#000').isLight()).toBe(false);
    expect(new TinyColor('#111').isLight()).toBe(false);
    expect(new TinyColor('#222').isLight()).toBe(false);
    expect(new TinyColor('#333').isLight()).toBe(false);
    expect(new TinyColor('#444').isLight()).toBe(false);
    expect(new TinyColor('#555').isLight()).toBe(false);
    expect(new TinyColor('#666').isLight()).toBe(false);
    expect(new TinyColor('#777').isLight()).toBe(false);
    expect(new TinyColor('#888').isLight()).toBe(true);
    expect(new TinyColor('#999').isLight()).toBe(true);
    expect(new TinyColor('#aaa').isLight()).toBe(true);
    expect(new TinyColor('#bbb').isLight()).toBe(true);
    expect(new TinyColor('#ccc').isLight()).toBe(true);
    expect(new TinyColor('#ddd').isLight()).toBe(true);
    expect(new TinyColor('#eee').isLight()).toBe(true);
    expect(new TinyColor('#fff').isLight()).toBe(true);
  });
  it('HSL Object', () => {
    for (const c of conversions) {
      const tiny = new TinyColor(c.hex);
      expect(tiny.toHexString()).toBe(new TinyColor(tiny.toHsl()).toHexString());
    }
  });
  it('HSL String', () => {
    for (const c of conversions) {
      const tiny = new TinyColor(c.hex);
      const input = tiny.toRgb();
      const output = new TinyColor(tiny.toHslString()).toRgb();
      const maxDiff = 2;

      // toHslString red value difference <= ' + maxDiff
      expect(Math.abs(input.r - output.r) <= maxDiff).toBe(true);
      // toHslString green value difference <= ' + maxDiff
      expect(Math.abs(input.g - output.g) <= maxDiff).toBe(true);
      // toHslString blue value difference <= ' + maxDiff
      expect(Math.abs(input.b - output.b) <= maxDiff).toBe(true);
    }
  });
  it('HSV String', () => {
    for (const c of conversions) {
      const tiny = new TinyColor(c.hex);
      const input = tiny.toRgb();
      const output = new TinyColor(tiny.toHsvString()).toRgb();
      const maxDiff = 2;

      // toHsvString red value difference <= ' + maxDiff
      expect(Math.abs(input.r - output.r) <= maxDiff).toBe(true);
      // toHsvString green value difference <= ' + maxDiff
      expect(Math.abs(input.g - output.g) <= maxDiff).toBe(true);
      // toHsvString blue value difference <= ' + maxDiff
      expect(Math.abs(input.b - output.b) <= maxDiff).toBe(true);
    }
  });

  it('HSV Object', () => {
    for (const c of conversions) {
      const tiny = new TinyColor(c.hex);
      expect(tiny.toHexString()).toBe(new TinyColor(tiny.toHsv()).toHexString());
    }
  });

  it('RGB Object', () => {
    for (const c of conversions) {
      const tiny = new TinyColor(c.hex);
      expect(tiny.toHexString()).toBe(new TinyColor(tiny.toRgb()).toHexString());
    }
  });

  it('RGB String', () => {
    for (const c of conversions) {
      const tiny = new TinyColor(c.hex);
      expect(tiny.toHexString()).toBe(new TinyColor(tiny.toRgbString()).toHexString());
    }
  });

  it('PRGB Object', () => {
    for (const c of conversions) {
      const tiny = new TinyColor(c.hex);
      const input = tiny.toRgb();
      const output = new TinyColor(tiny.toPercentageRgb()).toRgb();
      const maxDiff = 2;

      expect(Math.abs(input.r - output.r)).toBeLessThanOrEqual(maxDiff);
      expect(Math.abs(input.g - output.g)).toBeLessThanOrEqual(maxDiff);
      expect(Math.abs(input.b - output.b)).toBeLessThanOrEqual(maxDiff);
    }
  });

  it('PRGB String', () => {
    for (const c of conversions) {
      const tiny = new TinyColor(c.hex);
      const input = tiny.toRgb();
      const output = new TinyColor(tiny.toPercentageRgbString()).toRgb();
      const maxDiff = 2;

      expect(Math.abs(input.r - output.r)).toBeLessThanOrEqual(maxDiff);
      expect(Math.abs(input.g - output.g)).toBeLessThanOrEqual(maxDiff);
      expect(Math.abs(input.b - output.b)).toBeLessThanOrEqual(maxDiff);
    }
  });
  it('Object', () => {
    for (const c of conversions) {
      const tiny = new TinyColor(c.hex);
      expect(tiny.toHexString()).toBe(new TinyColor(tiny).toHexString());
    }
  });
  it('Color equality', () => {
    expect(new TinyColor('#ff0000').equals('#ff0000')).toBe(true);
    expect(new TinyColor('#ff0000').equals('rgb(255, 0, 0)')).toBe(true);
    expect(new TinyColor('#ff0000').equals('rgba(255, 0, 0, .1)')).toBe(false);
    expect(new TinyColor('#ff000066').equals('rgba(255, 0, 0, .4)')).toBe(true);
    expect(new TinyColor('#f009').equals('rgba(255, 0, 0, .6)')).toBe(true);
    expect(new TinyColor('#336699CC').equals('369C')).toBe(true);
    expect(new TinyColor('ff0000').equals('#ff0000')).toBe(true);
    expect(new TinyColor('#f00').equals('#ff0000')).toBe(true);
    expect(new TinyColor('#f00').equals('#ff0000')).toBe(true);
    expect(new TinyColor('f00').equals('#ff0000')).toBe(true);
    expect(new TinyColor('010101').toHexString()).toBe('#010101');
    expect(new TinyColor('#ff0000').equals('#00ff00')).toBe(false);
    expect(new TinyColor('#ff8000').equals('rgb(100%, 50%, 0%)')).toBe(true);
  });
  it('isReadable', () => {
    // "#ff0088", "#8822aa" (values used in old WCAG1 tests)
    expect(isReadable('#000000', '#ffffff', { level: 'AA', size: 'small' })).toBe(true);
    expect(isReadable('#ff0088', '#5c1a72', {})).toBe(false);
    expect(isReadable('#ff0088', '#8822aa', { level: 'AA', size: 'small' })).toBe(false);
    expect(isReadable('#ff0088', '#8822aa', { level: 'AA', size: 'large' })).toBe(false);
    expect(isReadable('#ff0088', '#8822aa', { level: 'AAA', size: 'small' })).toBe(false);
    expect(isReadable('#ff0088', '#8822aa', { level: 'AAA', size: 'large' })).toBe(false);

    // values derived from and validated using the calculators at http://www.dasplankton.de/ContrastA/
    // and http://webaim.org/resources/contrastchecker/

    // "#ff0088", "#5c1a72": contrast ratio 3.04
    expect(isReadable('#ff0088', '#5c1a72', { level: 'AA', size: 'small' })).toBe(false);
    expect(isReadable('#ff0088', '#5c1a72', { level: 'AA', size: 'large' })).toBe(true);
    expect(isReadable('#ff0088', '#5c1a72', { level: 'AAA', size: 'small' })).toBe(false);
    expect(isReadable('#ff0088', '#5c1a72', { level: 'AAA', size: 'large' })).toBe(false);

    // "#ff0088", "#2e0c3a": contrast ratio 4.56
    expect(isReadable('#ff0088', '#2e0c3a', { level: 'AA', size: 'small' })).toBe(true);
    expect(isReadable('#ff0088', '#2e0c3a', { level: 'AA', size: 'large' })).toBe(true);
    expect(isReadable('#ff0088', '#2e0c3a', { level: 'AAA', size: 'small' })).toBe(false);
    expect(isReadable('#ff0088', '#2e0c3a', { level: 'AAA', size: 'large' })).toBe(true);

    // "#db91b8", "#2e0c3a":  contrast ratio 7.12
    expect(isReadable('#db91b8', '#2e0c3a', { level: 'AA', size: 'small' })).toBe(true);
    expect(isReadable('#db91b8', '#2e0c3a', { level: 'AA', size: 'large' })).toBe(true);
    expect(isReadable('#db91b8', '#2e0c3a', { level: 'AAA', size: 'small' })).toBe(true);
    expect(isReadable('#db91b8', '#2e0c3a', { level: 'AAA', size: 'large' })).toBe(true);
    expect(isReadable('#db91b8', '#2e0c3a', { level: 'ZZZ', size: 'large' } as any)).toBe(false);
  });
  it('readability', () => {
    // check return values from readability function. See isReadable above for standards tests.
    const tinycolor = new TinyColor();
    expect(readability('#000', '#000')).toBe(1);
    expect(readability('#000', '#111')).toBe(1.1121078324840545);
    expect(readability('#000', '#fff')).toBe(21);
  });

  it('mostReadable', () => {
    const tinycolor = new TinyColor();
    expect(mostReadable('#000', ['#111', '#222']).toHexString()).toBe('#222222');
    expect(mostReadable('#f00', ['#d00', '#0d0']).toHexString()).toBe('#00dd00');
    expect(mostReadable('#fff', ['#fff', '#fff']).toHexString()).toBe('#ffffff');
    // includeFallbackColors
    expect(
      mostReadable('#fff', ['#fff', '#fff'], { includeFallbackColors: true }).toHexString(),
    ).toBe('#000000');
    // no readable color in list
    expect(
      mostReadable('#123', ['#124', '#125'], { includeFallbackColors: false }).toHexString(),
    ).toBe('#112255');
    expect(
      mostReadable('#123', ['#000', '#fff'], { includeFallbackColors: false }).toHexString(),
    ).toBe('#ffffff');
    // no readable color in list
    expect(
      mostReadable('#123', ['#124', '#125'], { includeFallbackColors: true }).toHexString(),
    ).toBe('#ffffff');

    expect(
      mostReadable('#ff0088', ['#000', '#fff'], { includeFallbackColors: false }).toHexString(),
    ).toBe('#000000');
    expect(
      mostReadable('#ff0088', ['#2e0c3a'], {
        includeFallbackColors: true,
        level: 'AAA',
        size: 'large',
      }).toHexString(),
    ).toBe('#2e0c3a');
    expect(
      mostReadable('#ff0088', ['#2e0c3a'], {
        includeFallbackColors: true,
        level: 'AAA',
        size: 'small',
      }).toHexString(),
    ).toBe('#000000');

    expect(
      mostReadable('#371b2c', ['#000', '#fff'], { includeFallbackColors: false }).toHexString(),
    ).toBe('#ffffff');
    expect(
      mostReadable('#371b2c', ['#a9acb6'], {
        includeFallbackColors: true,
        level: 'AAA',
        size: 'large',
      }).toHexString(),
    ).toBe('#a9acb6');
    expect(
      mostReadable('#371b2c', ['#a9acb6'], {
        includeFallbackColors: true,
        level: 'AAA',
        size: 'small',
      }).toHexString(),
    ).toBe('#ffffff');
  });

  it('should create microsoft filter', () => {
    expect(toMsFilter('red')).toBe(
      'progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffff0000,endColorstr=#ffff0000)',
    );
    expect(toMsFilter('red', 'blue')).toBe(
      'progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffff0000,endColorstr=#ff0000ff)',
    );

    expect(toMsFilter('transparent')).toBe(
      'progid:DXImageTransform.Microsoft.gradient(startColorstr=#00000000,endColorstr=#00000000)',
    );
    expect(toMsFilter('transparent', 'red')).toBe(
      'progid:DXImageTransform.Microsoft.gradient(startColorstr=#00000000,endColorstr=#ffff0000)',
    );

    expect(toMsFilter('#f0f0f0dd')).toBe(
      'progid:DXImageTransform.Microsoft.gradient(startColorstr=#ddf0f0f0,endColorstr=#ddf0f0f0)',
    );
    expect(toMsFilter('rgba(0, 0, 255, .5')).toBe(
      'progid:DXImageTransform.Microsoft.gradient(startColorstr=#800000ff,endColorstr=#800000ff)',
    );
  });
  it('Modifications', () => {
    for (let i = 0; i <= 100; i++) {
      expect(new TinyColor('red').desaturate(i).toHex()).toBe(DESATURATIONS[i]);
    }
    for (let i = 0; i <= 100; i++) {
      expect(new TinyColor('red').saturate(i).toHex()).toBe(SATURATIONS[i]);
    }
    for (let i = 0; i <= 100; i++) {
      expect(new TinyColor('red').lighten(i).toHex()).toBe(LIGHTENS[i]);
    }
    for (let i = 0; i <= 100; i++) {
      expect(new TinyColor('red').brighten(i).toHex()).toBe(BRIGHTENS[i]);
    }
    for (let i = 0; i <= 100; i++) {
      expect(new TinyColor('red').darken(i).toHex()).toBe(DARKENS[i]);
    }
    for (let i = 0; i <= 100; i++) {
      expect(new TinyColor('red').tint(i).toHex()).toBe(TINTS[i]);
    }
    for (let i = 0; i <= 100; i++) {
      expect(new TinyColor('red').shade(i).toHex()).toBe(SHADES[i]);
    }
    expect(new TinyColor('red').greyscale().toHex()).toBe('808080');
  });
  it('Spin', () => {
    expect(Math.round(new TinyColor('#f00').spin(-1234).toHsl().h)).toBe(206);
    expect(Math.round(new TinyColor('#f00').spin(-360).toHsl().h)).toBe(0);
    expect(Math.round(new TinyColor('#f00').spin(-120).toHsl().h)).toBe(240);
    expect(Math.round(new TinyColor('#f00').spin(0).toHsl().h)).toBe(0);
    expect(Math.round(new TinyColor('#f00').spin(10).toHsl().h)).toBe(10);
    expect(Math.round(new TinyColor('#f00').spin(360).toHsl().h)).toBe(0);
    expect(Math.round(new TinyColor('#f00').spin(2345).toHsl().h)).toBe(185);

    [-360, 0, 360].forEach(function(delta) {
      Object.keys(names).forEach(function(name) {
        expect(new TinyColor(name).toHex()).toBe(new TinyColor(name).spin(delta).toHex());
      });
    });
  });
  it('Mix', () => {
    // amount 0 or none
    expect(new TinyColor('#000').mix('#fff').toHsl().l).toBe(0.5);
    expect(new TinyColor('#f00').mix('#000', 0).toHex()).toBe('ff0000');
    // This case checks the the problem with floating point numbers (eg 255/90)
    expect(new TinyColor('#fff').mix('#000', 90).toHex()).toBe('1a1a1a');

    // black and white
    for (let i = 0; i < 100; i++) {
      expect(Math.round(new TinyColor('#000').mix('#fff', i).toHsl().l * 100) / 100).toBe(i / 100);
    }

    // with colors
    for (let i = 0; i < 100; i++) {
      let newHex = Math.round(255 * (100 - i) / 100).toString(16);

      if (newHex.length === 1) {
        newHex = '0' + newHex;
      }

      expect(new TinyColor('#f00').mix('#000', i).toHex()).toBe(newHex + '0000');
      expect(new TinyColor('#0f0').mix('#000', i).toHex()).toBe(`00${newHex}00`);
      expect(new TinyColor('#00f').mix('#000', i).toHex()).toBe('0000' + newHex);
      expect(new TinyColor('transparent').mix('#000', i).toRgb().a).toBe(i / 100);
    }
  });
  it('complement', () => {
    const complementDoesntModifyInstance = new TinyColor('red');
    expect(complementDoesntModifyInstance.complement().toHex()).toBe('00ffff');
    expect(complementDoesntModifyInstance.toHex()).toBe('ff0000');
  });

  it('analogous', () => {
    const combination = new TinyColor('red').analogous();
    expect(colorsToHexString(combination)).toBe('ff0000,ff0066,ff0033,ff0000,ff3300,ff6600');
  });

  it('monochromatic', () => {
    const combination = new TinyColor('red').monochromatic();
    expect(colorsToHexString(combination)).toBe('ff0000,2a0000,550000,800000,aa0000,d40000');
  });

  it('splitcomplement', () => {
    const combination = new TinyColor('red').splitcomplement();
    expect(colorsToHexString(combination)).toBe('ff0000,ccff00,0066ff');
  });

  it('triad', () => {
    const combination = new TinyColor('red').triad();
    expect(colorsToHexString(combination)).toBe('ff0000,00ff00,0000ff');
  });

  it('tetrad', () => {
    const combination = new TinyColor('red').tetrad();
    expect(colorsToHexString(combination)).toBe('ff0000,80ff00,00ffff,7f00ff');
  });

  it('legacy random', () => {
    expect(fromLegacyRandom().isValid).toBeTruthy();
  });
});

function colorsToHexString(colors) {
  return colors
    .map(function(c) {
      return c.toHex();
    })
    .join(',');
}
