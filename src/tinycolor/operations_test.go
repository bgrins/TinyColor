package tinycolor

import (
	"math"
	"strings"
	"testing"
)

func TestModifiers(t *testing.T) {
	red, _ := FromCompat("red", false)
	if returned := red.Lighten(10); returned != &red {
		t.Fatal("Lighten must return its receiver")
	}
	if got := red.ToHexString(); got != "#ff3333" {
		t.Fatalf("Lighten(10) = %s", got)
	}

	for _, modifier := range []struct {
		name  string
		apply func(*Color) *Color
	}{
		{"lighten", func(c *Color) *Color { return c.Lighten(0) }},
		{"darken", func(c *Color) *Color { return c.Darken(0) }},
		{"saturate", func(c *Color) *Color { return c.Saturate(0) }},
		{"desaturate", func(c *Color) *Color { return c.Desaturate(0) }},
		{"brighten", func(c *Color) *Color { return c.Brighten(0) }},
		{"spin", func(c *Color) *Color { return c.Spin(0) }},
	} {
		t.Run(modifier.name+" zero", func(t *testing.T) {
			color, _ := FromCompat("#336699", false)
			if modifier.apply(&color) != &color || color.ToHexString() != "#336699" {
				t.Fatalf("%s(0) changed %#v", modifier.name, color)
			}
		})
	}

	white, _ := FromCompat("#fff", false)
	white.Lighten(100)
	if got := white.ToHexString(); got != "#ffffff" {
		t.Fatalf("Lighten clamp = %s", got)
	}
	black, _ := FromCompat("#000", false)
	black.Darken(100)
	if got := black.ToHexString(); got != "#000000" {
		t.Fatalf("Darken clamp = %s", got)
	}
	red, _ = FromCompat("red", false)
	red.Desaturate(200)
	if got := red.ToHexString(); got != "#808080" {
		t.Fatalf("Desaturate clamp = %s", got)
	}

	black, _ = FromCompat("#000", false)
	black.Brighten(.2)
	if got := black.ToHexString(); got != "#010101" {
		t.Fatalf("Brighten pre-clamp rounding = %s", got)
	}
	halfAmount := 50.0 / 255
	black, _ = FromCompat("#000", false)
	if got := black.Brighten(halfAmount).ToHexString(); got != "#000000" {
		t.Fatalf("Brighten positive half tie = %s", got)
	}
	one, _ := FromCompat("#010101", false)
	if got := one.Brighten(-halfAmount).ToHexString(); got != "#000000" {
		t.Fatalf("Brighten negative half tie = %s", got)
	}

	red, _ = FromCompat("red", false)
	red.Spin(-120)
	if got := red.ToHexString(); got != "#0000ff" {
		t.Fatalf("Spin(-120) = %s", got)
	}
	red, _ = FromCompat("red", false)
	red.Spin(480)
	if got := red.ToHexString(); got != "#00ff00" {
		t.Fatalf("Spin(480) = %s", got)
	}

	color, _ := FromCompatWithOptions("rgba(255, 0, 0, .4)", false, CompatOptions{GradientType: true})
	original, format, alpha := color.Original(), color.Format(), color.Alpha()
	if color.Spin(math.NaN()) != &color {
		t.Fatal("Spin must return its receiver")
	}
	if color.ToHexString() != "#000000" || !color.Valid() || color.Format() != format || color.Original() != original || color.Alpha() != alpha {
		t.Fatalf("Spin(NaN) did not retain metadata: %#v", color)
	}
	if got := color.ToFilter(nil, false); got != "progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr=#66000000,endColorstr=#66000000)" {
		t.Fatalf("Spin(NaN) gradient metadata = %s", got)
	}

	alphaColor, _ := FromCompat("rgba(255, 0, 0, .4)", false)
	alphaColor.Greyscale()
	if alphaColor.ToHexString() != "#808080" || alphaColor.Alpha() != .4 {
		t.Fatalf("Greyscale() = %#v", alphaColor)
	}
}

func TestSaturateMatchesObjectConversionRounding(t *testing.T) {
	color, _ := FromCompat("#400140", false)
	if got := color.Saturate(-100).ToHexString(); got != "#202020" {
		t.Fatalf("Saturate(-100) = %s", got)
	}
}

func TestBrightenUsesRoundedRGBSnapshot(t *testing.T) {
	color, _ := FromCompat("rgb(423.5294117647059%, 78.03921568627452%, -0.3921568627450981%)", false)
	if got := color.Brighten(12.7).ToPercentageRGBString(); got != "rgb(67%, 91%, 13%)" {
		t.Fatalf("Brighten(12.7) = %s", got)
	}
}

func TestMix(t *testing.T) {
	black, _ := FromCompat("#000", false)
	white, _ := FromCompat("#fff", false)
	mixedHalf := Mix(black, white, 50)
	if got := mixedHalf.ToHexString(); got != "#808080" {
		t.Fatalf("Mix(50) = %s", got)
	}
	if got, ok := mixedHalf.Original().(map[string]float64); !ok || got["r"] != 127.5 || got["g"] != 127.5 || got["b"] != 127.5 || got["a"] != 1 {
		t.Fatalf("Mix(50) original = %#v", mixedHalf.Original())
	}
	if got := Mix(black, white, 0).ToHexString(); got != "#000000" {
		t.Fatalf("Mix(0) = %s", got)
	}
	if got := Mix(white, black, 90).ToHexString(); got != "#1a1a1a" {
		t.Fatalf("Mix(90) = %s", got)
	}

	transparent, _ := FromCompat("transparent", false)
	mixed := Mix(transparent, black, 25)
	if mixed.ToHexString() != "#000000" || mixed.Alpha() != .25 {
		t.Fatalf("transparent Mix = %#v", mixed)
	}
	if transparent.Alpha() != 0 || black.ToHexString() != "#000000" {
		t.Fatal("Mix mutated an input")
	}

	if got := Mix(black, white, 200).ToHexString(); got != "#ffffff" {
		t.Fatalf("out-of-range Mix = %s", got)
	}
}

func TestReadability(t *testing.T) {
	black, _ := FromCompat("#000", false)
	white, _ := FromCompat("#fff", false)
	if got := Readability(black, black); got != 1 {
		t.Fatalf("same-color readability = %v", got)
	}
	if got := Readability(black, white); got != 21 {
		t.Fatalf("black-on-white readability = %v", got)
	}
}

func TestReadabilityMatchesJavaScriptPrecision(t *testing.T) {
	first, _ := FromCompat(map[string]any{"r": 127.0, "g": 64.0, "b": 15.0, "a": 0.0}, false)
	second, _ := FromCompat("#80007f", false)
	if got := Readability(first, second); got != 1.188086751976723 {
		t.Fatalf("Readability precision = %.17g", got)
	}
}

func TestIsReadable(t *testing.T) {
	for _, test := range []struct {
		name     string
		ratio    float64
		options  WCAG2Options
		expected bool
	}{
		{"AA small threshold", 4.5, WCAG2Options{Level: "AA", Size: "small"}, true},
		{"AA large threshold", 3, WCAG2Options{Level: "AA", Size: "large"}, true},
		{"AAA small threshold", 7, WCAG2Options{Level: "AAA", Size: "small"}, true},
		{"AAA large threshold", 4.5, WCAG2Options{Level: "AAA", Size: "large"}, true},
		{"below threshold", 4.499999999999999, WCAG2Options{Level: "AA", Size: "small"}, false},
		{"mixed case", 7, WCAG2Options{Level: "aaa", Size: "LARGE"}, true},
		{"invalid values default", 4.5, WCAG2Options{Level: "invalid", Size: "invalid"}, true},
	} {
		t.Run(test.name, func(t *testing.T) {
			if got := isReadableRatio(test.ratio, test.options); got != test.expected {
				t.Fatalf("isReadableRatio(%v, %#v) = %t", test.ratio, test.options, got)
			}
		})
	}
}

func TestMostReadable(t *testing.T) {
	base, _ := FromCompat("#000", false)
	first, _ := FromCompat("white", false)
	second, _ := FromCompat("#fff", false)
	if got, ok := MostReadable(base, []Color{first, second}, WCAG2Options{}); !ok || got.Original() != "white" {
		t.Fatalf("first tied candidate = %#v, %t", got, ok)
	}

	gray, _ := FromCompat("#777", false)
	matchingGray, _ := FromCompat("#777", false)
	if got, ok := MostReadable(gray, []Color{matchingGray}, WCAG2Options{IncludeFallbackColors: true}); !ok || got.ToHexString() != "#000000" {
		t.Fatalf("fallback candidate = %#v, %t", got, ok)
	}
	if got, ok := MostReadable(gray, []Color{matchingGray}, WCAG2Options{}); !ok || got.ToHexString() != "#777777" {
		t.Fatalf("fallback-disabled candidate = %#v, %t", got, ok)
	}
	if _, ok := MostReadable(base, nil, WCAG2Options{}); ok {
		t.Fatal("empty candidates without fallback must have no result")
	}
	whiteBase, _ := FromCompat("#fff", false)
	if _, ok := MostReadable(whiteBase, nil, WCAG2Options{IncludeFallbackColors: true}); ok {
		t.Fatal("readable null candidate must remain no result")
	}
	darkBase, _ := FromCompat("#123", false)
	if got, ok := MostReadable(darkBase, nil, WCAG2Options{IncludeFallbackColors: true}); !ok || got.ToHexString() != "#ffffff" {
		t.Fatalf("empty candidates fallback = %#v, %t", got, ok)
	}
}

func TestComplement(t *testing.T) {
	red, _ := FromCompat("red", false)
	if got := red.Complement().ToHex(); got != "00ffff" {
		t.Fatalf("Complement() = %s", got)
	}
	if got := red.ToHex(); got != "ff0000" {
		t.Fatalf("Complement() mutated input to %s", got)
	}
	transparent, _ := FromCompat("rgba(255, 0, 0, .5)", false)
	if got := transparent.Complement().Alpha(); got != .5 {
		t.Fatalf("Complement alpha = %v", got)
	}
}

func TestPaletteOrders(t *testing.T) {
	red, _ := FromCompat("red", false)
	for _, test := range []struct {
		name     string
		palette  []Color
		expected string
	}{
		{"split complement", red.SplitComplement(), "ff0000,ccff00,0066ff"},
		{"triad", red.Triad(), "ff0000,00ff00,0000ff"},
		{"tetrad", red.Tetrad(), "ff0000,80ff00,00ffff,7f00ff"},
		{"analogous", red.Analogous(6, 30), "ff0000,ff0066,ff0033,ff0000,ff3300,ff6600"},
		{"monochromatic", red.Monochromatic(6), "ff0000,2a0000,550000,800000,aa0000,d40000"},
	} {
		t.Run(test.name, func(t *testing.T) {
			if got := paletteHex(test.palette); got != test.expected {
				t.Fatalf("%s = %s", test.name, got)
			}
		})
	}
}

func TestPaletteCustomizationsAndIndependence(t *testing.T) {
	blue, _ := FromCompat("#336699", false)
	if got := paletteHex(blue.Analogous(4, 12)); got != "336699,339999,336699,333399" {
		t.Fatalf("custom analogous = %s", got)
	}
	wrapped, _ := FromCompat("#ff0066", false)
	if got := paletteHex(wrapped.SplitComplement()); got != "ff0066,ffcc00,00ccff" {
		t.Fatalf("wrapped split complement = %s", got)
	}
	if got := blue.Analogous(0, 12); len(got) != 0 {
		t.Fatalf("typed analogous zero length = %d", len(got))
	}
	if got := blue.Monochromatic(0); len(got) != 0 {
		t.Fatalf("typed monochromatic zero length = %d", len(got))
	}

	transparent, _ := FromCompat("rgba(255, 0, 0, .5)", false)
	analogous := transparent.Analogous(3, 30)
	for index, color := range analogous {
		if color.Alpha() != .5 {
			t.Fatalf("analogous alpha at %d = %v", index, color.Alpha())
		}
	}
	for index, color := range analogous[1:] {
		original, ok := color.Original().(map[string]any)
		if !ok || original["h"] != float64(6) {
			t.Fatalf("analogous original at %d = %#v", index+1, color.Original())
		}
	}
	triad := transparent.Triad()
	if triad[0].Alpha() != .5 || triad[1].Alpha() != 1 || triad[2].Alpha() != 1 {
		t.Fatalf("triad alpha = %#v", triad)
	}
	triad[1].Spin(30)
	if transparent.ToHexString() != "#ff0000" || triad[2].ToHexString() != "#0000ff" {
		t.Fatal("palette result mutation changed the source or another result")
	}
}

func TestPaletteConversionUsesTinyColorChannelBounds(t *testing.T) {
	color, _ := FromCompat("rgb(127, 0, 255)", false)
	converted := color.Tetrad()[1]
	if got := converted.ToHSLString(); got != "hsl(0, 100%, 50%)" {
		t.Fatalf("tetrad wrapped hue = %s", got)
	}
}

func TestPaletteHSLMetadataMatchesJavaScriptPrecision(t *testing.T) {
	color, _ := FromCompat("#967a", false)
	original, ok := color.Complement().Original().(map[string]any)
	if !ok || original["s"] != 0.19999999999999996 {
		t.Fatalf("complement original = %#v", original)
	}
}

func paletteHex(colors []Color) string {
	values := make([]string, len(colors))
	for index, color := range colors {
		values[index] = color.ToHex()
	}
	return strings.Join(values, ",")
}
