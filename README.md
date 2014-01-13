# TinyColor

## JavaScript color parsing

### Features

* Color Types Supported
    * Hex, 8-digit (ARGB) Hex

      ```js
      tinycolor("#000");
      tinycolor("000");
      tinycolor("#f0f0f6");
      tinycolor("f0f0f6");
      tinycolor("#88f0f0f6");
      tinycolor("88f0f0f6");
      ```

    * RGB, RGBA

      ```js
      tinycolor("rgb (255, 0, 0)");
      tinycolor("rgb 255 0 0");
      tinycolor("rgba (255, 0, 0, .5)");
      tinycolor({ r: 255, g: 0, b: 0 });
      ```

    * HSL, HSLA

      ```js
      tinycolor("hsl(0, 100%, 50%)");
      tinycolor("hsla(0, 100%, 50%, .5)");
      tinycolor("hsl(0, 100%, 50%)");
      tinycolor("hsl 0 1.0 0.5");
      tinycolor({ h: 0, s: 1, l: .5 });
      ```

    * HSV, HSVA

      ```js
      tinycolor("hsv(0, 100%, 100%)");
      tinycolor("hsva(0, 100%, 100%, .5)");
      tinycolor("hsv (0 100% 100%)");
      tinycolor("hsv 0 1 1");
      tinycolor({ h: 0, s: 100, v: 100 });
      ```

    * Named

      ```js
      tinycolor("RED");
      tinycolor("blanchedalmond");
      tinycolor("darkblue");
      ```

### Usage

```js
var t = tinycolor("red");

t.toHex() // "ff0000"
t.toHexString() // "#ff0000"
t.toHex8() // "ffff0000"
t.toHex8String() // "#ffff0000"
t.toRgb() // {"r":255,"g":0,"b":0} or {"r":255,"g":0,"b":0,"a":0.5}
t.toRgbString() // "rgb(255, 0, 0)" or "rgba(255, 0, 0, 0.5)"
t.toPercentageRgb() // {"r":100,"g":0,"b":0} or {"r":100,"g":0,"b":0,"a":0.5}
t.toPercentageRgbString() // "rgb(100%, 0%, 0%)" or "rgba(100%, 0%, 0%, 0.5)"
t.toHsv() // {"h":0,"s":1,"v":1}
t.toHsvString() // "hsv(0, 100%, 100%)"
t.toHsl() // {"h":0,"s":1,"l":0.5}
t.toHslString() // "hsl(0, 100%, 50%)"
t.toName() // "red"
```

`tinycolor` may also be included as a [node](http://nodejs.org/) module like so:

```
npm install tinycolor2
```

Then it can be used:

```js
var tinycolor = require("./tinycolor");
```

### Accepted String Input

The string parsing is very permissive.  It is meant to make typing a color as input as easy as possible.  All commas, percentages, parenthesis are optional, and most input allow either 0-1, 0%-100%, or 0-n (where n is either 100, 255, or 360 depending on the value).

HSL and HSV both require either 0%-100% or 0-1.  RGB requires either 0-255 or 0%-100%.  If you call tinycolor.fromRatio, any input can also accept 0-1
Here are some examples of string input:

```
red
#fff
fff
#ffffff
ffffff
#ffffffff
ffffffff
rgb(255, 0, 0)
rgb 255 0 0
hsl(0, 100, 50)
hsl(0, 100%, 50%)
hsl 0 100 50
hsl 0 100% 50%
hsv(0, 100%, 100%)
hsv(0, 100, 100)
hsv 0 100% 100%
hsv 0 100 100
```

### Accepted Object Input

If you are calling this from code, you may want to use object input.  Here are examples of the different types of accepted object inputs:

```js
{ r: 255, g: 0, b: 0 }
{ r: 255, g: 0, b: 0, a: .5 }
{ r: 1, g: 0, b: 0 }
{ h: 0, s: 100, l: 50 }
{ h: 0, s: 100, v: 100 }
// etc...
```

## Color Utilities

    tinycolor.equals(color1, color2)

### Color Modification

Modification functions may take an `amount` variable from 0 - 100, indicating how much the effect should be applied.

    tinycolor.lighten(color, amount = 10)
    tinycolor.darken(color, amount = 10)
    tinycolor.desaturate(color, amount = 10)
    tinycolor.saturate(color, amount = 10)
    tinycolor.greyscale(color)

### Color Combinations

Combination functions return an Array of TinyColor objects.

    tinycolor.analogous(color, results = 6, slices = 30)
    tinycolor.complement(color)
    tinycolor.monochromatic(color, results = 6)
    tinycolor.splitcomplements(color)
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
