package parser

import "github.com/rajeet-04/tinycolor-go/internal/color"

func parseHSL(text string, original any) (color.Model, bool) {
	if match := hslaMatcher.FindStringSubmatch(text); match != nil {
		return hslModel(match[1], match[2], match[3], match[4], true, original), true
	}
	if match := hslMatcher.FindStringSubmatch(text); match != nil {
		return hslModel(match[1], match[2], match[3], nil, false, original), true
	}
	return color.Model{}, false
}
