# TinyColor
## JavaScript color parsing

### Permissive Input
Any of the following string inputs are recognized:

    red
    #fff
    fff
    #ffffff
    ffffff
    hsl(0, 100, 50)
    hsl 0 100 50
    rgb(255, 0, 0)
    rgb 255 0 0
    rgb 1 0 0
    rgb(1, 0, 0)
    
Any of the following object inputs are recognized:

    { r: 255, g: 0, b: 0 }
    { r: 1, g: 0, b: 0 }
    { h: 0, s: 100, l: 50 }
    etc...

### Usage
    tinycolor(input)