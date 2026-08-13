package color

import (
	"math"
	"reflect"
	"testing"
)

func TestBound01MatchesTinyColorEdges(t *testing.T) {
	tests := []struct {
		input any
		max   float64
		want  float64
	}{
		{-1, 255, 0},
		{300, 255, 1},
		{"1", 255, 1.0 / 255},
		{"1.0", 255, 1},
		{"100%", 255, 1},
		{"50%", 255, 0.5},
		{"255.0000001", 255, 1},
	}
	for _, tt := range tests {
		if got := Bound01(tt.input, tt.max); got != tt.want {
			t.Errorf("Bound01(%#v, %v) = %v, want %v", tt.input, tt.max, got, tt.want)
		}
	}
	if !math.IsNaN(Bound01("not a number", 255)) {
		t.Fatal("invalid input should stay NaN until the parser rejects it")
	}
}

func TestBoundAlphaMatchesTinyColor(t *testing.T) {
	tests := []struct {
		input any
		want  float64
	}{
		{-1, 1}, {0, 0}, {0.5, 0.5}, {1, 1}, {100, 1}, {"asdf", 1},
	}
	for _, tt := range tests {
		if got := BoundAlpha(tt.input); got != tt.want {
			t.Errorf("BoundAlpha(%#v) = %v, want %v", tt.input, got, tt.want)
		}
	}
}

func TestOriginalInputAndInvalidState(t *testing.T) {
	object := map[string]any{"r": float64(255)}
	for _, tt := range []struct {
		input any
		want  any
	}{
		{nil, ""}, {"", ""}, {"Red", "Red"}, {false, ""}, {float64(0), ""}, {object, object},
	} {
		if got := OriginalInput(tt.input); !reflect.DeepEqual(got, tt.want) {
			t.Errorf("OriginalInput(%#v) = %#v, want %#v", tt.input, got, tt.want)
		}
	}
	invalid := Invalid("bad")
	if invalid.Valid || invalid.R != 0 || invalid.G != 0 || invalid.B != 0 || invalid.A != 1 || invalid.Format != FormatUnknown {
		t.Fatalf("invalid state = %#v", invalid)
	}
}
