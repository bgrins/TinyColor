// TinyColor.js - https://github.com/bgrins/TinyColor - 2011 Brian Grinstead - v0.2

var tinycolor = (function() {

var tc = _tinycolor;
tc.version = "0.2";
tc.equals = function(color1, color2) {
	return tc(color1).toHex() == tc(color2).toHex();
}

var trimLeft = /^[\s,#]+/, 
	trimRight = /\s+$/,
	tinyCounter = 0;

function _tinycolor (color) {
	
	// If input is already a tinycolor, return itself
	if (typeof color == "object" && color.hasOwnProperty("_tc_id")) {
		return color;
	}
	
	var rgb = inputToRGB(color);
	var r = rgb.r, g = rgb.g, b = rgb.b;
	
	return {
		ok: rgb.ok,
		_tc_id: tinyCounter++,
		toHsv: function() {
			return rgbToHsv(r, g, b);
		},
		toHsl: function() {
			return rgbToHsl(r, g, b);
		},
		toHslCss: function() {
			var hsl = rgbToHsl(r, g, b);
			var h = Math.round(hsl.h * 360);
			var s = Math.round(hsl.s * 100);
			var l = Math.round(hsl.l * 100);
			return "hsl(" + h + ", " + s + "%, " + l + "%)";
		},
		toHex: function() {
			return rgbToHex(r, g, b);
		},
		toHexCss: function() {
			return '#' + rgbToHex(r, g, b);
		},
		toRgb: function() {
			return { r: r, g: g, b: b };
		},
		toRgbCss: function() {
			return "rgb(" + r + ", " + g + ", " + b + ")";
		},
		toName: function() {
			var hex = rgbToHex(r, g, b);
			for (var i in names) {
				if (names[i] == hex) {
					return i;
				}
			}
			return false;
		}
	};
}

function inputToRGB(color) {

	var r = g = b = 255;
	var ok = false;
	
	if (typeof color == "string") {
		color = stringInputToObject(color);
	}
	
	if (typeof color == "object") {
		if (color.hasOwnProperty("r")) {
	
			// Handle case where r, g, b is within [0, 1] instead of [0, 255].
			r = bound01(color.r, 255) * 255;
			g = bound01(color.g, 255) * 255;
			b = bound01(color.b, 255) * 255;
			
			ok = true;
		}
		if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("v")) {
		
			var h = bound01(color.h, 360);
			var s = bound01(color.s, 100);
			var v = bound01(color.v, 100);
			
			var rgb = hsvToRgb(h, s, v);
			
			r = rgb.r;
			g = rgb.g;
			b = rgb.b;
			
			ok = true;
		}
		if (color.hasOwnProperty("h") && color.hasOwnProperty("s") && color.hasOwnProperty("l")) {
		
			var h = bound01(color.h, 360);
			var s = bound01(color.s, 100);
			var l = bound01(color.l, 100);
			
			var rgb = hslToRgb(h, s, l);
			r = rgb.r;
			g = rgb.g;
			b = rgb.b;
			
			ok = true;
		}
	}
	
	return {
		ok: ok,
		r: Math.min(255, Math.max(Math.round(r), 0)),
		g: Math.min(255, Math.max(Math.round(g), 0)),
		b: Math.min(255, Math.max(Math.round(b), 0))
	};
}

// hsv and hsl to and from rgb modified from: http://mjijackson.com/2008/02/rgb-to-hsl-and-rgb-to-hsv-color-model-conversion-algorithms-in-javascript
/** 
 * Converts an RGB color value to HSL. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] or [0, 1] and
 * returns h, s, and l in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSL representation
 */
function rgbToHsl(r, g, b){
	
	r = bound01(r, 255);
	g = bound01(g, 255);
	b = bound01(b, 255);
	
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, l = (max + min) / 2;

    if(max == min){
        h = s = 0; // achromatic
    }else{
        var d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h, s: s, l: l };
}

/**
 * Converts an HSL color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSL_color_space.
 * Assumes h, s, and l are contained in the set [0, 1] or [0, 360] and [0, 100] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  l       The lightness
 * @return  Array           The RGB representation
 */
function hslToRgb(h, s, l){
    var r, g, b;

	h = bound01(h, 360);
	s = bound01(s, 100);
	l = bound01(l, 100);
	
    function hue2rgb(p, q, t){
        if(t < 0) t += 1;
        if(t > 1) t -= 1;
        if(t < 1/6) return p + (q - p) * 6 * t;
        if(t < 1/2) return q;
        if(t < 2/3) return p + (q - p) * (2/3 - t) * 6;
        return p;
    }
    
    if(s == 0){
        r = g = b = l; // achromatic
    }else{

        var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
        var p = 2 * l - q;
        r = hue2rgb(p, q, h + 1/3);
        g = hue2rgb(p, q, h);
        b = hue2rgb(p, q, h - 1/3);
    }

    return { r: r * 255, g: g * 255, b: b * 255 };
}

/**
 * Converts an RGB color value to HSV. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes r, g, and b are contained in the set [0, 255] or [0, 1] and
 * returns h, s, and v in the set [0, 1].
 *
 * @param   Number  r       The red color value
 * @param   Number  g       The green color value
 * @param   Number  b       The blue color value
 * @return  Array           The HSV representation
 */
function rgbToHsv(r, g, b){

	r = bound01(r, 255);
	g = bound01(g, 255);
	b = bound01(b, 255);
	
    var max = Math.max(r, g, b), min = Math.min(r, g, b);
    var h, s, v = max;

    var d = max - min;
    s = max == 0 ? 0 : d / max;

    if(max == min){
        h = 0; // achromatic
    }else{
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return { h: h, s: s, v: v };
}


/**
 * Converts an HSV color value to RGB. Conversion formula
 * adapted from http://en.wikipedia.org/wiki/HSV_color_space.
 * Assumes h, s, and v are contained in the set [0, 1] or [0, 360] and [0, 100] and
 * returns r, g, and b in the set [0, 255].
 *
 * @param   Number  h       The hue
 * @param   Number  s       The saturation
 * @param   Number  v       The value
 * @return  Array           The RGB representation
 */
function hsvToRgb(h, s, v){
    var r, g, b;
    
	h = bound01(h, 360);
	s = bound01(s, 100);
	v = bound01(v, 100);
	
    var i = Math.floor(h * 6);
    var f = h * 6 - i;
    var p = v * (1 - s);
    var q = v * (1 - f * s);
    var t = v * (1 - (1 - f) * s);
    
    switch(i % 6){
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }
    
    return {r: r * 255, g: g * 255, b: b * 255};
}

function rgbToHex(r, g, b) {
	function pad(c) {
		return c.length == 1 ? '0' + c : c;
	}	
	return [ 
		pad(r.toString(16)),
		pad(g.toString(16)),
		pad(b.toString(16))
	].join("");
}

var names = tc.names = {
	aliceblue: 'f0f8ff',
	antiquewhite: 'faebd7',
	aqua: '00ffff',
	aquamarine: '7fffd4',
	azure: 'f0ffff',
	beige: 'f5f5dc',
	bisque: 'ffe4c4',
	black: '000000',
	blanchedalmond: 'ffebcd',
	blue: '0000ff',
	blueviolet: '8a2be2',
	brown: 'a52a2a',
	burlywood: 'deb887',
	cadetblue: '5f9ea0',
	chartreuse: '7fff00',
	chocolate: 'd2691e',
	coral: 'ff7f50',
	cornflowerblue: '6495ed',
	cornsilk: 'fff8dc',
	crimson: 'dc143c',
	cyan: '00ffff',
	darkblue: '00008b',
	darkcyan: '008b8b',
	darkgoldenrod: 'b8860b',
	darkgray: 'a9a9a9',
	darkgreen: '006400',
	darkkhaki: 'bdb76b',
	darkmagenta: '8b008b',
	darkolivegreen: '556b2f',
	darkorange: 'ff8c00',
	darkorchid: '9932cc',
	darkred: '8b0000',
	darksalmon: 'e9967a',
	darkseagreen: '8fbc8f',
	darkslateblue: '483d8b',
	darkslategray: '2f4f4f',
	darkturquoise: '00ced1',
	darkviolet: '9400d3',
	deeppink: 'ff1493',
	deepskyblue: '00bfff',
	dimgray: '696969',
	dodgerblue: '1e90ff',
	feldspar: 'd19275',
	firebrick: 'b22222',
	floralwhite: 'fffaf0',
	forestgreen: '228b22',
	fuchsia: 'ff00ff',
	gainsboro: 'dcdcdc',
	ghostwhite: 'f8f8ff',
	gold: 'ffd700',
	goldenrod: 'daa520',
	gray: '808080',
	grey: '808080',
	green: '00ff00',
	greenyellow: 'adff2f',
	honeydew: 'f0fff0',
	hotpink: 'ff69b4',
	indianred : 'cd5c5c',
	indigo : '4b0082',
	ivory: 'fffff0',
	khaki: 'f0e68c',
	lavender: 'e6e6fa',
	lavenderblush: 'fff0f5',
	lawngreen: '7cfc00',
	lemonchiffon: 'fffacd',
	lightblue: 'add8e6',
	lightcoral: 'f08080',
	lightcyan: 'e0ffff',
	lightgoldenrodyellow: 'fafad2',
	lightgrey: 'd3d3d3',
	lightgreen: '90ee90',
	lightpink: 'ffb6c1',
	lightsalmon: 'ffa07a',
	lightseagreen: '20b2aa',
	lightskyblue: '87cefa',
	lightslateblue: '8470ff',
	lightslategray: '778899',
	lightsteelblue: 'b0c4de',
	lightyellow: 'ffffe0',
	lime: '00ff00',
	limegreen: '32cd32',
	linen: 'faf0e6',
	magenta: 'ff00ff',
	maroon: '800000',
	mediumaquamarine: '66cdaa',
	mediumblue: '0000cd',
	mediumorchid: 'ba55d3',
	mediumpurple: '9370d8',
	mediumseagreen: '3cb371',
	mediumslateblue: '7b68ee',
	mediumspringgreen: '00fa9a',
	mediumturquoise: '48d1cc',
	mediumvioletred: 'c71585',
	midnightblue: '191970',
	mintcream: 'f5fffa',
	mistyrose: 'ffe4e1',
	moccasin: 'ffe4b5',
	navajowhite: 'ffdead',
	navy: '000080',
	oldlace: 'fdf5e6',
	olive: '808000',
	olivedrab: '6b8e23',
	orange: 'ffa500',
	orangered: 'ff4500',
	orchid: 'da70d6',
	palegoldenrod: 'eee8aa',
	palegreen: '98fb98',
	paleturquoise: 'afeeee',
	palevioletred: 'd87093',
	papayawhip: 'ffefd5',
	peachpuff: 'ffdab9',
	peru: 'cd853f',
	pink: 'ffc0cb',
	plum: 'dda0dd',
	powderblue: 'b0e0e6',
	purple: '800080',
	red: 'ff0000',
	rosybrown: 'bc8f8f',
	royalblue: '4169e1',
	saddlebrown: '8b4513',
	salmon: 'fa8072',
	sandybrown: 'f4a460',
	seagreen: '2e8b57',
	seashell: 'fff5ee',
	sienna: 'a0522d',
	silver: 'c0c0c0',
	skyblue: '87ceeb',
	slateblue: '6a5acd',
	slategray: '708090',
	snow: 'fffafa',
	springgreen: '00ff7f',
	steelblue: '4682b4',
	tan: 'd2b48c',
	teal: '008080',
	thistle: 'd8bfd8',
	tomato: 'ff6347',
	turquoise: '40e0d0',
	violet: 'ee82ee',
	violetred: 'd02090',
	wheat: 'f5deb3',
	white: 'ffffff',
	whitesmoke: 'f5f5f5',
	yellow: 'ffff00',
	yellowgreen: '9acd32'
};


var colorparsers = [
	{
	    re: /^([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})$/,
	    process: function (bits) {
	        return {
	            r: parseInt(bits[1], 16),
	            g: parseInt(bits[2], 16),
	            b: parseInt(bits[3], 16)
	        };
	    }
	},
	{
	    re: /^([0-9a-fA-F]{1})([0-9a-fA-F]{1})([0-9a-fA-F]{1})$/,
	    process: function (bits) {
	        return {
	            r: parseInt(bits[1] + bits[1], 16),
	            g: parseInt(bits[2] + bits[2], 16),
	            b: parseInt(bits[3] + bits[3], 16)
	        };
	    }
	},
	{
	    re: /rgb[\s|\(]+(\d{1,3})[,|\s]+(\d{1,3})[,|\s]+(\d{1,3})\s*\)?/,
	    process: function (bits) {
	    	
	    	return {
	    		r: bits[1],
	    		g: bits[2],
	    		b: bits[3]
	    	};
	    }
	},
	{
	    re: /hsl[\s|\(]+(\d{1,3})[,|\s]+(\d{1,3}%?)[,|\s]+(\d{1,3}%?)\s*\)?/,
	    process: function (bits) {
	    	
	    	return {
	    		h: bits[1],
	    		s: bits[2],
	    		l: bits[3]
	    	};
	    }
	},
	{
	    re: /hsv[\s|\(]+(\d{1,3})[,|\s]+(\d{1,3}%?)[,|\s]+(\d{1,3}%?)\s*\)?/,
	    process: function (bits) {
	    	
	    	return {
	    		h: bits[1],
	    		s: bits[2],
	    		v: bits[3]
	    	};
	    }
	}
];

function bound01(n, max) {
	n = parseFloat(n);
	if (n == max) {
		return 1;
	}
	else if (n > 1) {
		return (n % max) / parseFloat(max);
	}
	return n;
}

function stringInputToObject(color) {

    color = color.replace(trimLeft,'').replace(trimRight, '').toLowerCase();
    if (names[color]) {
        color = names[color];
    }
    
	var parsedInput = false;
    for (var i = 0; i < colorparsers.length; i++) {
    
        var matched = colorparsers[i].re.exec(color);
        if (matched) {
        	parsedInput = colorparsers[i].process(matched);
            break;
        }
    }
    
    return parsedInput;
}

return tc;

})();
