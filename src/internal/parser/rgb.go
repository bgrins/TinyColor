package parser

import (
	"regexp"

	"github.com/rajeet-04/tinycolor-go/internal/color"
)

const cssUnit = `(?:[-+]?\d*\.\d+%?)|(?:[-+]?\d+%?)`

var (
	rgbMatcher  = regexp.MustCompile(`(?i)rgb[\s|(]+(` + cssUnit + `)[,|\s]+(` + cssUnit + `)[,|\s]+(` + cssUnit + `)\s*\)?`)
	rgbaMatcher = regexp.MustCompile(`(?i)rgba[\s|(]+(` + cssUnit + `)[,|\s]+(` + cssUnit + `)[,|\s]+(` + cssUnit + `)[,|\s]+(` + cssUnit + `)\s*\)?`)
	cssMatcher  = regexp.MustCompile(cssUnit)
)

func validCSSUnit(value any) bool {
	switch value := value.(type) {
	case string:
		return cssMatcher.FindStringIndex(value) != nil
	case float64:
		return true
	default:
		return false
	}
}

func rgbModel(r, g, b, alpha any, hasAlpha bool, original any, format color.Format) color.Model {
	model := color.Model{
		R: color.Bound01(r, 255) * 255,
		G: color.Bound01(g, 255) * 255,
		B: color.Bound01(b, 255) * 255,
		A: color.BoundAlpha(alpha), Valid: true, Format: format, Original: original,
	}
	if !hasAlpha {
		model.A = 1
	}
	return model
}

func parseRGBString(text string, original any) (color.Model, bool) {
	if match := rgbaMatcher.FindStringSubmatch(text); match != nil {
		return rgbModel(match[1], match[2], match[3], match[4], true, original, formatForRGB(match[1])), true
	}
	if match := rgbMatcher.FindStringSubmatch(text); match != nil {
		return rgbModel(match[1], match[2], match[3], nil, false, original, formatForRGB(match[1])), true
	}
	return color.Model{}, false
}

func formatForRGB(red any) color.Format {
	if color.IsPercentage(red) {
		return color.FormatPRGB
	}
	return color.FormatRGB
}
