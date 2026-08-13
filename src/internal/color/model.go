// Package color holds the normalized state shared by all parser paths.
package color

// Format is TinyColor's detected input format. An empty Format represents the
// source's false format value for invalid input.
type Format string

const (
	FormatUnknown Format = ""
	FormatRGB     Format = "rgb"
	FormatPRGB    Format = "prgb"
	FormatHSL     Format = "hsl"
	FormatHSV     Format = "hsv"
	FormatHex     Format = "hex"
	FormatHex8    Format = "hex8"
	FormatName    Format = "name"
)

// Model is TinyColor's normalized constructor state. It is internal to this
// module so the public facade cannot bypass source-compatible parsing.
type Model struct {
	R, G, B  float64
	A        float64
	Valid    bool
	Format   Format
	Original any
}

// Invalid returns the source invalid-color state: opaque black, no format,
// and a retained original input.
func Invalid(original any) Model {
	return Model{A: 1, Original: original}
}

// OriginalInput applies TinyColor's constructor normalization to the JSON-safe
// inputs used by the compatibility adapter.
func OriginalInput(input any) any {
	switch value := input.(type) {
	case nil:
		return ""
	case string:
		return value
	case bool:
		if !value {
			return ""
		}
	case float64:
		if value == 0 {
			return ""
		}
	}
	return input
}
