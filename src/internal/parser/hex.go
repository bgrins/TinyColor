package parser

import (
	"strconv"

	"github.com/rajeet-04/tinycolor-go/internal/color"
)

func parseHex(text string, original any, format color.Format) (color.Model, bool) {
	if len(text) > 0 && text[0] == '#' {
		text = text[1:]
	}
	if len(text) != 3 && len(text) != 4 && len(text) != 6 && len(text) != 8 {
		return color.Model{}, false
	}
	for _, rune := range text {
		if !((rune >= '0' && rune <= '9') || (rune >= 'a' && rune <= 'f')) {
			return color.Model{}, false
		}
	}
	if len(text) == 3 || len(text) == 4 {
		text = string([]byte{text[0], text[0], text[1], text[1], text[2], text[2]}) + func() string {
			if len(text) == 4 {
				return string([]byte{text[3], text[3]})
			}
			return ""
		}()
	}
	channel := func(offset int) float64 {
		value, _ := strconv.ParseInt(text[offset:offset+2], 16, 64)
		return float64(value)
	}
	model := color.Model{R: channel(0), G: channel(2), B: channel(4), A: 1, Valid: true, Format: format, Original: original}
	if len(text) == 8 {
		model.A = channel(6) / 255
		if format == color.FormatHex {
			model.Format = color.FormatHex8
		}
	}
	return model, true
}
