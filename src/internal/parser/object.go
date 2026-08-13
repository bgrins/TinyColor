package parser

import "github.com/rajeet-04/tinycolor-go/internal/color"

func parseObjectFull(object map[string]any, original any) color.Model {
	if model := parseObject(object, original); model.Valid {
		return model
	}
	h, hasH := object["h"]
	s, hasS := object["s"]
	if !hasH || !hasS || !validCSSUnit(h) || !validCSSUnit(s) {
		return color.Invalid(original)
	}
	alpha, hasAlpha := object["a"]
	if v, ok := object["v"]; ok && validCSSUnit(v) {
		return hsvModel(h, s, v, alpha, hasAlpha, original)
	}
	if l, ok := object["l"]; ok && validCSSUnit(l) {
		return hslModel(h, s, l, alpha, hasAlpha, original)
	}
	return color.Invalid(original)
}
