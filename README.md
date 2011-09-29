# TinyColor
## JavaScript color parsing

### Usage
    var t = tinycolor("red");
	t.toHex() // "ff0000"
	t.toHexString() // "#ff0000"
	t.toRgb() // {"r":255,"g":0,"b":0}
	t.toRgbString() // "rgb(255, 0, 0)"
    t.toHsv() // {"h":0,"s":1,"v":1}
	t.toHsvString() // "hsv(0, 100%, 100%)"
	t.toHsl() // {"h":0,"s":1,"l":0.5}
	t.toHslString() // "hsl(0, 100%, 50%)"
	t.toName() // "red"
	
### Accepted Input
Any of the following string inputs are recognized:

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
    
Any of the following object inputs are recognized:

    { r: 255, g: 0, b: 0 }
    { r: 1, g: 0, b: 0 }
    { h: 0, s: 100, l: 50 }
    etc...

See index.html in the project for a demo.
