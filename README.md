# TinyColor

## JavaScript color parsing

Fast, small color manipulation and conversion for JavaScript.  TinyColor is allows many forms of input, while providing color conversions and other color utility functions.  It has no dependencies.

[![Build Status](https://travis-ci.org/bgrins/TinyColor.png?branch=master)](https://travis-ci.org/bgrins/TinyColor)

## Including in a browser

    <script type='text/javascript' src='tinycolor.js'></script>
    <script type='text/javascript'>
    var color = tinycolor("red");
    </script>

## Including in node

`tinycolor` may also be included as a [node](http://nodejs.org/) module like so:

    npm install tinycolor2

Then it can be used in your script like so:

    var tinycolor = require("./tinycolor");
    var color = tinycolor("red");

## Usage

Call `tinycolor(input)` or `new tinycolor(input)`, and you will have an object with the following properties.  See Accepted String Input and Accepted Object Input below for more information about what is accepted.

## Accepted String Input

The string parsing is very permissive.  It is meant to make typing a color as input as easy as possible.  All commas, percentages, parenthesis are optional, and most input allow either 0-1, 0%-100%, or 0-n (where n is either 100, 255, or 360 depending on the value).

HSL and HSV both require either 0%-100% or 0-1.

RGB input requires either 0-255 or 0%-100%.

If you call `tinycolor.fromRatio`, RGB input can also accept 0-1
Here are some examples of string input:

### Hex, 8-digit (ARGB) Hex

    tinycolor("#000");
    tinycolor("000");
    tinycolor("#f0f0f6");
    tinycolor("f0f0f6");
    tinycolor("#88f0f0f6");
    tinycolor("88f0f0f6");

### RGB, RGBA

    tinycolor("rgb (255, 0, 0)");
    tinycolor("rgb 255 0 0");
    tinycolor("rgba (255, 0, 0, .5)");
    tinycolor({ r: 255, g: 0, b: 0 });
    tinycolor.fromRatio({ r: 1, g: 0, b: 0 });
    tinycolor.fromRatio({ r: .5, g: .5, b: .5 });

### HSL, HSLA

    tinycolor("hsl(0, 100%, 50%)");
    tinycolor("hsla(0, 100%, 50%, .5)");
    tinycolor("hsl(0, 100%, 50%)");
    tinycolor("hsl 0 1.0 0.5");
    tinycolor({ h: 0, s: 1, l: .5 });

### HSV, HSVA

    tinycolor("hsv(0, 100%, 100%)");
    tinycolor("hsva(0, 100%, 100%, .5)");
    tinycolor("hsv (0 100% 100%)");
    tinycolor("hsv 0 1 1");
    tinycolor({ h: 0, s: 100, v: 100 });

### Named

    tinycolor("RED");
    tinycolor("blanchedalmond");
    tinycolor("darkblue");

### Accepted Object Input

If you are calling this from code, you may want to use object input.  Here are some examples of the different types of accepted object inputs:

    { r: 255, g: 0, b: 0 }
    { r: 255, g: 0, b: 0, a: .5 }
    { h: 0, s: 100, l: 50 }
    { h: 0, s: 100, v: 100 }

## Methods

### isValid

Return a boolean indicating whether the color was successfully parsed.  Note: if the color is not valid then it will act like `black` when being used with other methods.

    var color1 = tinycolor("red");
    color1.isValid(); // true
    color1.toHexString(); // "#ff0000"

    var color2 = tinycolor("not a color");
    color2.isValid(); // false
    color2.toString(); // "#000000"

### isLight

Return a boolean indicating whether the color's perceived brightness is light.

    var color1 = tinycolor("#fff");
    color1.isLight(); // true

    var color2 = tinycolor("#000");
    color2.isLight(); // false

### isDark

Return a boolean indicating whether the color's perceived brightness is dark.

    var color1 = tinycolor("#fff");
    color1.isDark(); // false

    var color2 = tinycolor("#000");
    color2.isDark(); // true

### getAlpha

Returns the alpha value of a color, from `0-1`.

    var color1 = tinycolor("rgba(255, 0, 0, .5)");
    color1.getAlpha(); // 0.5

    var color2 = tinycolor("rgb(255, 0, 0)");
    color2.getAlpha(); // 1

    var color3 = tinycolor("transparent");
    color3.getAlpha(); // 0

### getBrightness

Returns the perceived brightness of a color, from `0-255`.

    var color1 = tinycolor("#fff");
    color1.getBrightness(); // 255

    var color2 = tinycolor("#000");
    color2.getBrightness(); // 0

### setAlpha

Sets the alpha value on a current color.  Accepted range is in between `0-1`.

    var color = tinycolor("red");
    color.getAlpha(); // 1
    color.setAlpha(.5);
    color.getAlpha(); // .5
    color.toRgbString(); // "rgba(255, 0, 0, .5)"

### toHsv

    var color = tinycolor("red");
    color.toHsv(); // { h: 0, s: 1, v: 1, a: 1 }

### toHsvString

    var color = tinycolor("red");
    color.toHsvString(); // "hsv(0, 100%, 100%)"

### toHsl

    var color = tinycolor("red");
    color.toHsl(); // { h: 0, s: 1, l: 0.5, a: 1 }

### toHslString

    var color = tinycolor("red");
    color.toHslString(); // "hsl(0, 100%, 50%)"

### toHex

    var color = tinycolor("red");
    color.toHex(); // "ff0000"

### toHexString

    var color = tinycolor("red");
    color.toHexString(); // "#ff0000"

### toHex8

    var color = tinycolor("red");
    color.toHex8(); // "ffff0000"

### toHex8String

    var color = tinycolor("red");
    color.toHex8String(); // "#ffff0000"

### toRgb

    var color = tinycolor("red");
    color.toRgb(); // { r: 255, g: 0, b: 0, a: 1 }

### toRgbString

    var color = tinycolor("red");
    color.toRgbString(); // "rgb(255, 0, 0)"

### toPercentageRgb

    var color = tinycolor("red");
    color.toPercentageRgb() // { r: "100%", g: "0%", b: "0%", a: 1 }

### toPercentageRgbString

    var color = tinycolor("red");
    color.toPercentageRgbString(); // "rgb(100%, 0%, 0%)"

### toName

    var color = tinycolor("red");
    color.toName(); // "red"

### toFilter

    var color = tinycolor("red");
    color.toFilter(); // "progid:DXImageTransform.Microsoft.gradient(startColorstr=#ffff0000,endColorstr=#ffff0000)"

### toString

Print to a string, depending on the input format.  You can also override this by passing one of `"rgb", "prgb", "hex6", "hex3", "hex8", "name", "hsl", "hsv"` into the function.

    var color1 = tinycolor("red");
    color1.toString(); // "red"
    color1.toString("hsv"); // ""hsv(0, 100%, 100%)"

    var color2 = tinycolor("rgb(255, 0, 0)");
    color2.toString(); // "rgb(255, 0, 0)"
    color2.setAlpha(.5);
    color2.toString(); // "rgba(255, 0, 0, 0.5)"

## Color Utilities

    tinycolor.equals(color1, color2)

### Color Modification

Modification functions may take an `amount` variable from 0 - 100, indicating how much the effect should be applied.

    tinycolor.lighten(color, amount = 10)
    tinycolor.brighten(color, amount = 10)
    tinycolor.darken(color, amount = 10)
    tinycolor.desaturate(color, amount = 10)
    tinycolor.saturate(color, amount = 10)
    tinycolor.greyscale(color)
    tinycolor.spin(color, amount)
    tinycolor.mix(color1, color2, amount = 50)

### Color Combinations

Combination functions return an Array of TinyColor objects.

    tinycolor.analogous(color, results = 6, slices = 30)
    tinycolor.complement(color)
    tinycolor.monochromatic(color, results = 6)
    tinycolor.splitcomplement(color)
    tinycolor.triad(color)
    tinycolor.tetrad(color)

### Readability

Analyze 2 colors and returns an object with the following properties.  `brightness` is difference in brightness between the two colors.  `color`: difference in color/hue between the two colors.

    tinycolor.readability(color1, color2);

Ensure that foreground and background color combinations provide sufficient contrast.

    tinycolor.readable(color1, color2);

Given a base color and a list of possible foreground or background colors for that base, returns the most readable color.

    tinycolor.mostReadable(baseColor, colorList);

See [index.html](https://github.com/bgrins/TinyColor/blob/master/index.html) in the project for a demo.
