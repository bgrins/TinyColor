package parser

import (
	"reflect"
	"testing"

	"github.com/rajeet-04/tinycolor-go/internal/color"
)

func TestHexRGBNamesAndObjects(t *testing.T) {
	tests := []struct {
		input   any
		valid   bool
		format  color.Format
		r, g, b float64
		alpha   float64
	}{
		{"#f00", true, color.FormatHex, 255, 0, 0, 1},
		{"ff000080", true, color.FormatHex8, 255, 0, 0, 128.0 / 255},
		{"  InDiAnReD ", true, color.FormatName, 205, 92, 92, 1},
		{"transparent", true, color.FormatName, 0, 0, 0, 0},
		{"rgb (100%, 0%, 0%)", true, color.FormatPRGB, 255, 0, 0, 1},
		{"rgba 255 0 0 .5", true, color.FormatRGB, 255, 0, 0, .5},
		{map[string]any{"r": "90%", "g": "45%", "b": "0%", "a": .4}, true, color.FormatPRGB, 229.5, 114.75, 0, .4},
		{"##123456", false, color.FormatUnknown, 0, 0, 0, 1},
		{map[string]any{"r": "invalid", "g": "invalid", "b": "invalid"}, false, color.FormatUnknown, 0, 0, 0, 1},
	}
	for _, tt := range tests {
		model := Parse(tt.input)
		if model.Valid != tt.valid || model.Format != tt.format || model.R != tt.r || model.G != tt.g || model.B != tt.b || model.A != tt.alpha {
			t.Errorf("Parse(%#v) = %#v", tt.input, model)
		}
	}
}

func TestAllSourceNamesParse(t *testing.T) {
	for name := range names {
		model := Parse(name)
		if !model.Valid || model.Format != color.FormatName {
			t.Errorf("%s = %#v", name, model)
		}
	}
}

func TestNamesReturnsIndependentCopy(t *testing.T) {
	first := Names()
	if first["red"] != "f00" {
		t.Fatalf("red = %q", first["red"])
	}
	first["red"] = "broken"
	if second := Names(); second["red"] != "f00" {
		t.Fatalf("mutated red = %q", second["red"])
	}
}

func TestOriginalAndFromRatio(t *testing.T) {
	object := map[string]any{"r": float64(1), "g": float64(0), "b": float64(0), "a": float64(.5)}
	ratio := ParseFromRatio(object)
	if !ratio.Valid || ratio.Format != color.FormatPRGB || ratio.A != .5 {
		t.Fatalf("ratio = %#v", ratio)
	}
	want := map[string]any{"r": "100%", "g": "0%", "b": "0%", "a": float64(.5)}
	if !reflect.DeepEqual(ratio.Original, want) {
		t.Fatalf("ratio original = %#v, want %#v", ratio.Original, want)
	}
	if original := Parse(nil).Original; original != "" {
		t.Fatalf("null original = %#v", original)
	}
}

func TestHSLHSVObjectsAndWrappedHue(t *testing.T) {
	for _, input := range []any{
		"hsl(251, 100%, 38%)",
		"hsva 251.1 .887 .918 .5",
		map[string]any{"h": float64(251), "s": float64(100), "l": float64(.38)},
		map[string]any{"h": float64(720), "s": float64(100), "v": float64(100)},
	} {
		model := Parse(input)
		if !model.Valid || (model.Format != color.FormatHSL && model.Format != color.FormatHSV) {
			t.Errorf("Parse(%#v) = %#v", input, model)
		}
	}
	if model := Parse(map[string]any{"h": "invalid", "s": "invalid", "v": "invalid"}); model.Valid {
		t.Fatalf("invalid HSV object = %#v", model)
	}
}
