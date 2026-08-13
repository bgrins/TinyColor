package color

import (
	"math"
	"regexp"
	"strconv"
	"strings"
)

var jsParseFloat = regexp.MustCompile(`^[\t\n\v\f\r ]*[+-]?(?:(?:\d+\.?\d*)|(?:\.\d+))(?:[eE][+-]?\d+)?`)

// ParseFloat mirrors the prefix parsing used by JavaScript parseFloat for the
// numeric forms TinyColor accepts.
func ParseFloat(value any) float64 {
	switch number := value.(type) {
	case float64:
		return number
	case float32:
		return float64(number)
	case int:
		return float64(number)
	case int64:
		return float64(number)
	case string:
		match := jsParseFloat.FindString(number)
		if match == "" {
			return math.NaN()
		}
		parsed, err := strconv.ParseFloat(strings.TrimSpace(match), 64)
		if err != nil {
			return math.NaN()
		}
		return parsed
	default:
		return math.NaN()
	}
}

func IsPercentage(value any) bool {
	text, ok := value.(string)
	return ok && strings.Contains(text, "%")
}

func IsOnePointZero(value any) bool {
	text, ok := value.(string)
	return ok && strings.Contains(text, ".") && ParseFloat(text) == 1
}

// Bound01 is TinyColor's bound01 helper, including percentage truncation and
// its near-maximum floating-point correction.
func Bound01(value any, max float64) float64 {
	if IsOnePointZero(value) {
		value = "100%"
	}
	percentage := IsPercentage(value)
	number := ParseFloat(value)
	if math.IsNaN(number) {
		return math.NaN()
	}
	number = math.Min(max, math.Max(0, number))
	if percentage {
		number = math.Trunc(number*max) / 100
	}
	if math.Abs(number-max) < 0.000001 {
		return 1
	}
	return math.Mod(number, max) / max
}

// BoundAlpha keeps TinyColor's intentionally forgiving alpha behavior.
func BoundAlpha(value any) float64 {
	alpha := ParseFloat(value)
	if math.IsNaN(alpha) || alpha < 0 || alpha > 1 {
		return 1
	}
	return alpha
}
