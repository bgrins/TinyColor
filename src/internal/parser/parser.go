// Package parser converts JSON-safe compatibility inputs into normalized state.
package parser

import (
	"math"
	"regexp"
	"strconv"
	"strings"

	"github.com/rajeet-04/tinycolor-go/internal/color"
)

// Parse accepts the local TinyColor input forms implemented in this phase.
func Parse(input any) color.Model {
	original := color.OriginalInput(input)
	switch value := original.(type) {
	case string:
		return parseString(value, original)
	case map[string]any:
		return parseObjectFull(value, original)
	default:
		return color.Invalid(original)
	}
}

// ParseFromRatio applies TinyColor.fromRatio's object transformation before
// parsing; the transformed object is also TinyColor's original input.
func ParseFromRatio(input any) color.Model {
	object, ok := input.(map[string]any)
	if !ok {
		return Parse(input)
	}
	transformed := make(map[string]any, len(object))
	for key, value := range object {
		if key == "a" {
			transformed[key] = value
			continue
		}
		if number := color.ParseFloat(value); !math.IsNaN(number) && number <= 1 {
			transformed[key] = formatPercent(number*100) + "%"
		} else {
			transformed[key] = value
		}
	}
	return parseObjectFull(transformed, transformed)
}

func formatPercent(number float64) string {
	return strconv.FormatFloat(number, 'f', -1, 64)
}

var (
	hslMatcher  = regexp.MustCompile(`(?i)hsl[\s|(]+(` + cssUnit + `)[,|\s]+(` + cssUnit + `)[,|\s]+(` + cssUnit + `)\s*\)?`)
	hsvMatcher  = regexp.MustCompile(`(?i)hsv[\s|(]+(` + cssUnit + `)[,|\s]+(` + cssUnit + `)[,|\s]+(` + cssUnit + `)\s*\)?`)
	hslaMatcher = regexp.MustCompile(`(?i)hsla[\s|(]+(` + cssUnit + `)[,|\s]+(` + cssUnit + `)[,|\s]+(` + cssUnit + `)[,|\s]+(` + cssUnit + `)\s*\)?`)
	hsvaMatcher = regexp.MustCompile(`(?i)hsva[\s|(]+(` + cssUnit + `)[,|\s]+(` + cssUnit + `)[,|\s]+(` + cssUnit + `)[,|\s]+(` + cssUnit + `)\s*\)?`)
)

func parseString(value string, original any) color.Model {
	text := strings.ToLower(strings.TrimSpace(value))
	if text == "transparent" {
		return color.Model{A: 0, Valid: true, Format: color.FormatName, Original: original}
	}
	if hex, named := names[text]; named {
		model, _ := parseHex(hex, original, color.FormatName)
		return model
	}
	if model, ok := parseRGBString(text, original); ok {
		return model
	}
	if model, ok := parseHex(text, original, color.FormatHex); ok {
		return model
	}
	// Phase 1 smoke must remain executable while Plan 02-02 moves these paths
	// into dedicated files. This is generic grammar, not a fixed input switch.
	if model, ok := parseHSL(text, original); ok {
		return model
	}
	if model, ok := parseHSV(text, original); ok {
		return model
	}
	return color.Invalid(original)
}

func parseObject(object map[string]any, original any) color.Model {
	r, hasR := object["r"]
	g, hasG := object["g"]
	b, hasB := object["b"]
	if !hasR || !hasG || !hasB || !validCSSUnit(r) || !validCSSUnit(g) || !validCSSUnit(b) {
		return color.Invalid(original)
	}
	alpha, hasAlpha := object["a"]
	format := formatForRGB(r)
	if explicit, ok := object["format"].(string); ok && explicit != "" {
		format = color.Format(explicit)
	}
	return rgbModel(r, g, b, alpha, hasAlpha, original, format)
}

func parseHSLHSVSmoke(text string, original any) (color.Model, bool) {
	if match := hslaMatcher.FindStringSubmatch(text); match != nil {
		return hslModel(match[1], match[2], match[3], match[4], true, original), true
	}
	if match := hslMatcher.FindStringSubmatch(text); match != nil {
		return hslModel(match[1], match[2], match[3], nil, false, original), true
	}
	if match := hsvaMatcher.FindStringSubmatch(text); match != nil {
		return hsvModel(match[1], match[2], match[3], match[4], true, original), true
	}
	if match := hsvMatcher.FindStringSubmatch(text); match != nil {
		return hsvModel(match[1], match[2], match[3], nil, false, original), true
	}
	return color.Model{}, false
}

func hslModel(h, s, l, alpha any, hasAlpha bool, original any) color.Model {
	hue := color.Bound01(h, 360)
	saturation := ratio(s)
	lightness := ratio(l)
	var q float64
	if lightness < 0.5 {
		q = lightness * (1 + saturation)
	} else {
		q = lightness + saturation - lightness*saturation
	}
	p := 2*lightness - q
	channel := func(t float64) float64 {
		if t < 0 {
			t++
		}
		if t > 1 {
			t--
		}
		switch {
		case t*6 < 1:
			return p + (q-p)*6*t
		case t*2 < 1:
			return q
		case t*3 < 2:
			return p + (q-p)*(2.0/3.0-t)*6
		default:
			return p
		}
	}
	if saturation == 0 {
		p = lightness
		q = lightness
	}
	model := color.Model{R: channel(hue+1.0/3.0) * 255, G: channel(hue) * 255, B: channel(hue-1.0/3.0) * 255, A: color.BoundAlpha(alpha), Valid: true, Format: color.FormatHSL, Original: original}
	if !hasAlpha {
		model.A = 1
	}
	return model
}

func hsvModel(h, s, v, alpha any, hasAlpha bool, original any) color.Model {
	hue := color.Bound01(h, 360) * 6
	saturation := ratio(s)
	value := ratio(v)
	i := int(math.Floor(hue))
	f := hue - math.Floor(hue)
	p := value * (1 - saturation)
	q := value * (1 - f*saturation)
	t := value * (1 - (1-f)*saturation)
	channels := [][3]float64{{value, t, p}, {q, value, p}, {p, value, t}, {p, q, value}, {t, p, value}, {value, p, q}}
	rgb := channels[i%6]
	model := color.Model{R: rgb[0] * 255, G: rgb[1] * 255, B: rgb[2] * 255, A: color.BoundAlpha(alpha), Valid: true, Format: color.FormatHSV, Original: original}
	if !hasAlpha {
		model.A = 1
	}
	return model
}

func ratio(value any) float64 {
	if number := color.ParseFloat(value); !color.IsPercentage(value) && !math.IsNaN(number) && number <= 1 {
		value = formatPercent(number*100) + "%"
	}
	return color.Bound01(value, 100)
}
