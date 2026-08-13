package tinycolor

import "testing"

func TestOutputsAndAnalysis(t *testing.T) {
	c, _ := FromCompat("rgba(255, 0, 0, .5)", false)
	if c.ToHex8String() != "#ff000080" || c.ToRGBString() != "rgba(255, 0, 0, 0.5)" {
		t.Fatal(c.ToHex8String(), c.ToRGBString())
	}
	if c.ToFilter(nil, false) != "progid:DXImageTransform.Microsoft.gradient(startColorstr=#80ff0000,endColorstr=#80ff0000)" {
		t.Fatal(c.ToFilter(nil, false))
	}
	black, _ := FromCompat("#000", false)
	white, _ := FromCompat("#fff", false)
	if black.Brightness() != 0 || white.Luminance() != 1 || !black.IsDark() || !white.IsLight() {
		t.Fatal("analysis")
	}
	if !Equals("#ff000066", "rgba(255, 0, 0, .4)") {
		t.Fatal("equals")
	}
	if random := Random(); !random.Valid() || random.Format() != "prgb" {
		t.Fatalf("random = valid %t, format %q", random.Valid(), random.Format())
	}
}

func TestSetAlphaMatchesTinyColorBounds(t *testing.T) {
	color, _ := FromCompat("red", false)
	for _, test := range []struct {
		value any
		want  float64
	}{
		{0.9, 0.9},
		{-1.0, 1},
		{2.0, 1},
		{nil, 1},
		{"test", 1},
	} {
		if returned := color.SetAlpha(test.value); returned != &color || color.Alpha() != test.want {
			t.Fatalf("SetAlpha(%#v) returned %p, alpha %v", test.value, returned, color.Alpha())
		}
	}
}

func TestStringHexFilterAndConversion(t *testing.T) {
	c, _ := FromCompat("rgba(255, 0, 0, .5)", false)
	if c.ToPercentageRGBString() != "rgba(100%, 0%, 0%, 0.5)" || c.ToHSLString() != "hsla(0, 100%, 50%, 0.5)" || c.ToHSVString() != "hsva(0, 100%, 100%, 0.5)" {
		t.Fatal("strings")
	}
	if c.ToString("hex8") != "#ff000080" || c.ToString("name") != "#ff0000" {
		t.Fatal(c.ToString("hex8"), c.ToString("name"))
	}
	with, _ := FromCompatWithOptions("red", false, CompatOptions{GradientType: true})
	if with.ToFilter(nil, false) != "progid:DXImageTransform.Microsoft.gradient(GradientType = 1, startColorstr=#ffff0000,endColorstr=#ffff0000)" {
		t.Fatal(with.ToFilter(nil, false))
	}
}

func TestPercentageRGBUsesUnroundedChannels(t *testing.T) {
	c, _ := FromCompat(map[string]any{"h": float64(266), "s": float64(255), "v": float64(342), "a": float64(2.63)}, false)
	if got := c.ToPercentageRGBString(); got != "rgb(43%, 0%, 100%)" {
		t.Fatalf("ToPercentageRGBString() = %q", got)
	}
}

func TestOnePercentRGBMatchesJavaScriptHSLRounding(t *testing.T) {
	color, _ := FromCompat(map[string]any{"r": "1%", "g": "0%", "b": "0%", "a": float64(1)}, false)
	if got := color.ToHSLString(); got != "hsl(0, 100%, 0%)" {
		t.Fatalf("ToHSLString() = %q", got)
	}
}

func TestEqualsRejectsFalsyInput(t *testing.T) {
	if Equals("", map[string]any{"h": float64(529), "s": float64(15), "l": float64(-77), "a": float64(-1.132)}) {
		t.Fatal("empty input must not equal normalized black")
	}
}

func TestImplicitAlphaHexFallsBackToRGBA(t *testing.T) {
	for _, input := range []string{"#f008", "#ff000080"} {
		c, _ := FromCompat(input, false)
		if c.String() != c.ToRGBString() {
			t.Fatalf("%s: %s", input, c.String())
		}
		if c.ToString("hex8") != c.ToHex8String() {
			t.Fatal("explicit hex8")
		}
	}
}

func TestPhaseOneInputsMatchTinyColor(t *testing.T) {
	tests := []struct {
		name   string
		input  any
		ratio  bool
		valid  bool
		format string
		alpha  float64
		value  string
	}{
		{"name", "red", false, true, "name", 1, "red"},
		{"hex", "#000", false, true, "hex", 1, "#000000"},
		{"invalid", "not a color", false, false, "", 1, "#000000"},
		{"transparent", "transparent", false, true, "name", 0, "transparent"},
		{"rgba", "rgba(255, 0, 0, .5)", false, true, "rgb", .5, "rgba(255, 0, 0, 0.5)"},
		{"hsl", "hsl(0, 100%, 50%)", false, true, "hsl", 1, "hsl(0, 100%, 50%)"},
		{"hsv", "hsv(0, 100%, 100%)", false, true, "hsv", 1, "hsv(0, 100%, 100%)"},
		{"rgb object", map[string]any{"r": float64(255), "g": float64(0), "b": float64(0)}, false, true, "rgb", 1, "rgb(255, 0, 0)"},
		{"from ratio", map[string]any{"r": float64(1), "g": float64(0), "b": float64(0)}, true, true, "prgb", 1, "rgb(100%, 0%, 0%)"},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			color, err := FromCompat(tt.input, tt.ratio)
			if err != nil {
				t.Fatal(err)
			}
			if color.Valid() != tt.valid || color.Format() != tt.format || color.Alpha() != tt.alpha || color.String() != tt.value {
				t.Fatalf("got valid=%v format=%q alpha=%v string=%q", color.Valid(), color.Format(), color.Alpha(), color.String())
			}
		})
	}
}

func TestInvalidInputIsAColorState(t *testing.T) {
	color, err := FromCompat("this is not a color", false)
	if err != nil || color.Valid() || color.String() != "#000000" {
		t.Fatalf("invalid input = %#v, %v", color, err)
	}
}

func TestCompressibleSixDigitNameFallsBackToHex(t *testing.T) {
	color, _ := FromCompat("rebeccapurple", false)
	if name, ok := color.ToName(); ok || name != "" {
		t.Fatalf("ToName() = %q, %t", name, ok)
	}
	if color.String() != "#663399" || color.Clone().String() != "#663399" {
		t.Fatalf("color = %q, clone = %q", color.String(), color.Clone().String())
	}
}
