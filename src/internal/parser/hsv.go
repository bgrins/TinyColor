package parser

import "github.com/rajeet-04/tinycolor-go/internal/color"

func parseHSV(text string, original any) (color.Model, bool) {
	if match := hsvaMatcher.FindStringSubmatch(text); match != nil {
		return hsvModel(match[1], match[2], match[3], match[4], true, original), true
	}
	if match := hsvMatcher.FindStringSubmatch(text); match != nil {
		return hsvModel(match[1], match[2], match[3], nil, false, original), true
	}
	return color.Model{}, false
}
