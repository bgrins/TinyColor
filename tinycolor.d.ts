
interface Rgb {
    r: number|string;
    g: number|string;
    b: number|string;
}

interface Rgba extends Rgb {
    a: number;
}

interface Hsv {
    h: number;
    s: number;
    v: number;
}

interface Hsl {
    h: number;
    s: number;
    l: number;
}

interface WCAG2 {
    level: string;
    size: string;
}

declare module "tinycolor" {

    function tinycolor(value: tinycolor | string| Rgb | Rgba | Hsv | Hsl): tinycolor;

    interface tinycolor {
        fromRatio(value: string| Rgb | Rgba | Hsv | Hsl): void;

        getFormat(): string;
        getOriginalInput(): string;

        getBrightness(): number;
        getLuminance(): number;
        getAlpha(): number;

        setAlpha(alpha: number): void;

        isLight(): boolean;
        isDark(): boolean;
        isValid(): boolean;

        toString(): string;

        toHex(): string;
        toHexString(): string;

        toHex8(): string;
        toHex8String(): string;

        toHsv(): Hsv;
        toHsvString(): string;

        toHsl(): Hsl;
        toHslString(): string;

        toRgb(): Rgb|Rgba;
        toRgbString(): string;

        toPercentageRgb(): Rgb|Rgba;
        toPercentageRgbString(): string;

        toName(): string;

        toFilter(): string;

        lighten(value?: number): tinycolor;
        brighten(value?: number): tinycolor;
        darken(value?: number): tinycolor;
        desaturate(value?: number): tinycolor;
        saturate(value?: number): tinycolor;
        greyscale(): tinycolor;
        spin(value: number): tinycolor;

        analogous(results?: number, slices?: number): tinycolor[];
        monochromatic(results?: number): tinycolor[];
        splitcomplement(): tinycolor[];
        triad(): tinycolor[];
        tetrad(): tinycolor[];
        complement(): tinycolor;

        equals(color1: tinycolor | string | Rgb | Rgba | Hsv | Hsl, color2: tinycolor | string | Rgb | Rgba | Hsv | Hsl): boolean;
        mix(color1: tinycolor | string | Rgb | Rgba | Hsv | Hsl, color2: tinycolor | string | Rgb | Rgba | Hsv | Hsl, amount: number): tinycolor;
        random(): tinycolor;

        readability(color1: tinycolor | string | Rgb | Rgba | Hsv | Hsl, color2: tinycolor | string | Rgb | Rgba | Hsv | Hsl): number;
        isReadable(color1: tinycolor | string | Rgb | Rgba | Hsv | Hsl, color2: tinycolor | string | Rgb | Rgba | Hsv | Hsl, wcag2?: WCAG2): boolean;
        mostReadable(color1: tinycolor | string | Rgb | Rgba | Hsv | Hsl, color2: tinycolor[]| string[]| Rgb[]| Rgba[]| Hsv[]| Hsl[], wcag2?: WCAG2): boolean|tinycolor;
    }

    function lighten(color: tinycolor | string | Rgb | Rgba | Hsv | Hsl, value?: number): tinycolor;
    function brighten(color: tinycolor | string | Rgb | Rgba | Hsv | Hsl, value?: number): tinycolor;
    function darken(color: tinycolor | string | Rgb | Rgba | Hsv | Hsl, value?: number): tinycolor;
    function desaturate(color: tinycolor | string | Rgb | Rgba | Hsv | Hsl, value?: number): tinycolor;
    function saturate(color: tinycolor | string | Rgb | Rgba | Hsv | Hsl, value?: number): tinycolor;
    function greyscale(color: tinycolor | string | Rgb | Rgba | Hsv | Hsl): tinycolor;
    function spin(color: tinycolor | string | Rgb | Rgba | Hsv | Hsl, value: number): tinycolor;

    function analogous(color: tinycolor | string | Rgb | Rgba | Hsv | Hsl, results?: number, slices?: number): tinycolor[];
    function monochromatic(color: tinycolor | string | Rgb | Rgba | Hsv | Hsl, results?: number): tinycolor[];
    function splitcomplement(color: tinycolor | string | Rgb | Rgba | Hsv | Hsl): tinycolor[];
    function triad(color: tinycolor | string | Rgb | Rgba | Hsv | Hsl): tinycolor[];
    function tetrad(color: tinycolor | string | Rgb | Rgba | Hsv | Hsl): tinycolor[];
    function complement(color: tinycolor | string | Rgb | Rgba | Hsv | Hsl): tinycolor;

    export = tinycolor;
}