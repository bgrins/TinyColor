# TinyColor
## JavaScript color parsing

### Features
* Color Types Supported
    * Hex

            tinycolor("#000");
            tinycolor("000");
            tinycolor("#f0f0f6");
            tinycolor("f0f0f6");
    * RGB, RGBA

            tinycolor("rgb (255, 0, 0)");
            tinycolor("rgb 255 0 0");
            tinycolor("rgba (255, 0, 0, .5)");
            tinycolor({ r: 255, g: 0, b: 0 });
    * HSL, HSLA

            tinycolor("hsl(0, 100%, 50%)");
            tinycolor("hsla(0, 100%, 50%, .5)");
            tinycolor("hsl(0, 100%, 50%)");
            tinycolor("hsl 0 1.0 0.5");
            tinycolor({ h: 0, s: 1, l: .5 }");
    * HSV, HSVA

            tinycolor("hsv(0, 100%, 100%)");
            tinycolor("hsva(0, 100%, 100%, .5)");
            tinycolor("hsv (0 100% 100%)");
            tinycolor("hsv 0 1 1");
            tinycolor({ h: 0, s: 100, v: 100 }");
    * Named

            tinycolor("RED");
            tinycolor("blanchedalmond");
            tinycolor("darkblue");
* File Size:

        The minified size is:
        The uncompressed size is:

### Usage
    var t = tinycolor("red");

    t.toHex() // "ff0000"
    t.toHexString() // "#ff0000"
    t.toRgb() // {"r":255,"g":0,"b":0} or {"r":255,"g":0,"b":0,"a":0.5}
    t.toRgbString() // "rgb(255, 0, 0)" or "rgba(255, 0, 0, 0.5)"
    t.toPercentageRgb() // {"r":100,"g":0,"b":0} or {"r":100,"g":0,"b":0,"a":0.5}
    t.toPercentageRgbString() // "rgb(100%, 0%, 0%)" or "rgba(100%, 0%, 0%, 0.5)"
    t.toHsv() // {"h":0,"s":1,"v":1}
    t.toHsvString() // "hsv(0, 100%, 100%)"
    t.toHsl() // {"h":0,"s":1,"l":0.5}
    t.toHslString() // "hsl(0, 100%, 50%)"
    t.toName() // "red"

`tinycolor` may also be included as a [node](http://nodejs.org/) module like so:

    npm install tinycolor2

Then it can be used:

    var tinycolor = require("./tinycolor");

### Accepted String Input
The string parsing is very permissive.  It is meant to make typing a color as input as easy as possible.  All commas, percentages, parenthesis are optional, and most input allow either 0-1, 0%-100%, or 0-n (where n is either 100, 255, or 360 depending on the value).

HSL and HSV both require either 0%-100% or 0-1.  RGB requires either 0-255 or 0%-100%.  If you call tinycolor.fromRatio, any input can also accept 0-1
Here are some examples of string input:

    red
    #fff
    fff
    #ffffff
    ffffff
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

### Accepted Object Input
If you are calling this from code, you may want to use object input.  Here are examples of the different types of accepted object inputs:

    { r: 255, g: 0, b: 0 }
    { r: 255, g: 0, b: 0, a: .5 }
    { r: 1, g: 0, b: 0 }
    { h: 0, s: 100, l: 50 }
    { h: 0, s: 100, v: 100 }
    etc...

See index.html in the project for a demo.