// Package tinycolor exposes the compatibility facade over normalized parsing.
package tinycolor

import (
	"fmt"
	"math"
	"math/rand/v2"
	"strconv"
	"strings"

	"github.com/rajeet-04/tinycolor-go/internal/color"
	"github.com/rajeet-04/tinycolor-go/internal/parser"
)

type Color struct {
	model        color.Model
	gradientType bool
}
type CompatOptions struct {
	Format       string
	GradientType bool
}
type RGB struct {
	R, G, B int
	A       float64
}
type HSL struct{ H, S, L, A float64 }
type HSV struct{ H, S, V, A float64 }
type WCAG2Options struct {
	Level                 string
	Size                  string
	IncludeFallbackColors bool
}

func FromCompat(input any, fromRatio bool) (Color, error) {
	var model color.Model
	if fromRatio {
		model = parser.ParseFromRatio(input)
	} else {
		model = parser.Parse(input)
	}
	if model.R < 1 {
		model.R = math.Floor(model.R + .5)
	}
	if model.G < 1 {
		model.G = math.Floor(model.G + .5)
	}
	if model.B < 1 {
		model.B = math.Floor(model.B + .5)
	}
	return Color{model: model}, nil
}
func FromCompatWithOptions(input any, fromRatio bool, options CompatOptions) (Color, error) {
	c, e := FromCompat(input, fromRatio)
	if options.Format != "" {
		c.model.Format = color.Format(options.Format)
	}
	c.gradientType = options.GradientType
	return c, e
}

func (c Color) Valid() bool    { return c.model.Valid }
func (c Color) Format() string { return string(c.model.Format) }
func (c Color) Alpha() float64 { return c.model.A }
func (c Color) Original() any  { return c.model.Original }
func (c *Color) SetAlpha(value any) *Color {
	c.model.A = color.BoundAlpha(value)
	return c
}
func (c Color) RGB() map[string]any {
	return map[string]any{"r": math.Round(c.model.R), "g": math.Round(c.model.G), "b": math.Round(c.model.B), "a": c.model.A}
}
func (c Color) ToRGB() RGB {
	return RGB{int(math.Round(c.model.R)), int(math.Round(c.model.G)), int(math.Round(c.model.B)), c.model.A}
}
func (c Color) ToHSL() HSL {
	h, s, l := rgbToHSL(c.model.R, c.model.G, c.model.B)
	return HSL{h * 360, s, l, c.model.A}
}
func (c Color) ToHSV() HSV {
	h, s, v := rgbToHSV(c.model.R, c.model.G, c.model.B)
	return HSV{h * 360, s, v, c.model.A}
}
func (c Color) ToRGBString() string {
	x := c.ToRGB()
	if x.A == 1 {
		return fmt.Sprintf("rgb(%d, %d, %d)", x.R, x.G, x.B)
	}
	return fmt.Sprintf("rgba(%d, %d, %d, %s)", x.R, x.G, x.B, roundedAlpha(x.A))
}
func (c Color) ToPercentageRGB() RGB {
	return RGB{percent(c.model.R), percent(c.model.G), percent(c.model.B), c.model.A}
}
func (c Color) ToPercentageRGBString() string {
	x := c.ToPercentageRGB()
	if x.A == 1 {
		return fmt.Sprintf("rgb(%d%%, %d%%, %d%%)", x.R, x.G, x.B)
	}
	return fmt.Sprintf("rgba(%d%%, %d%%, %d%%, %s)", x.R, x.G, x.B, roundedAlpha(x.A))
}
func (c Color) ToHSLString() string {
	x := c.ToHSL()
	p := "hsl"
	if x.A < 1 {
		p = "hsla"
	}
	s := fmt.Sprintf("%s(%d, %d%%, %d%%", p, mathRound(x.H), mathRound(x.S*100), mathRound(x.L*100))
	if x.A < 1 {
		s += ", " + roundedAlpha(x.A)
	}
	return s + ")"
}
func (c Color) ToHSVString() string {
	x := c.ToHSV()
	p := "hsv"
	if x.A < 1 {
		p = "hsva"
	}
	s := fmt.Sprintf("%s(%d, %d%%, %d%%", p, mathRound(x.H), mathRound(x.S*100), mathRound(x.V*100))
	if x.A < 1 {
		s += ", " + roundedAlpha(x.A)
	}
	return s + ")"
}
func (c Color) ToHex() string {
	return fmt.Sprintf("%02x%02x%02x", mathRound(c.model.R), mathRound(c.model.G), mathRound(c.model.B))
}
func (c Color) ToHexString() string           { return "#" + c.ToHex() }
func (c Color) ToHex8() string                { return c.ToHex() + fmt.Sprintf("%02x", mathRound(c.model.A*255)) }
func (c Color) ToHex8String() string          { return "#" + c.ToHex8() }
func (c Color) ToString(format string) string { return c.toString(format, format != "") }
func (c Color) toString(format string, explicit bool) string {
	if format == "" {
		format = string(c.model.Format)
	}
	if !explicit && c.model.A < 1 && (format == "hex" || format == "hex6" || format == "hex3" || format == "hex4" || format == "hex8" || format == "name") {
		if format == "name" && c.model.A == 0 {
			return "transparent"
		}
		return c.ToRGBString()
	}
	switch format {
	case "rgb":
		return c.ToRGBString()
	case "prgb":
		return c.ToPercentageRGBString()
	case "hsl":
		return c.ToHSLString()
	case "hsv":
		return c.ToHSVString()
	case "hex", "hex6":
		return c.ToHexString()
	case "hex8":
		return c.ToHex8String()
	case "name":
		if n, ok := c.ToName(); ok {
			return n
		}
		return c.ToHexString()
	}
	return c.ToHexString()
}
func (c Color) ToName() (string, bool) {
	if c.model.A == 0 {
		return "transparent", true
	}
	if c.model.A < 1 {
		return "", false
	}
	n := parser.NameForRGB(mathRound(c.model.R), mathRound(c.model.G), mathRound(c.model.B))
	return n, n != ""
}
func (c Color) ToFilter(second *Color, gradient bool) string {
	start := "#" + fmt.Sprintf("%02x", mathRound(c.model.A*255)) + c.ToHex()
	end := start
	if second != nil {
		end = "#" + fmt.Sprintf("%02x", mathRound(second.model.A*255)) + second.ToHex()
	}
	prefix := ""
	if gradient || c.gradientType {
		prefix = "GradientType = 1, "
	}
	return "progid:DXImageTransform.Microsoft.gradient(" + prefix + "startColorstr=" + start + ",endColorstr=" + end + ")"
}
func (c Color) Brightness() float64 { x := c.ToRGB(); return float64(x.R*299+x.G*587+x.B*114) / 1000 }
func (c Color) Luminance() float64 {
	x := c.ToRGB()
	return .2126*luminanceChannel(x.R) + .7152*luminanceChannel(x.G) + .0722*luminanceChannel(x.B)
}
func Readability(first, second Color) float64 {
	firstLuminance, secondLuminance := first.Luminance(), second.Luminance()
	return (math.Max(firstLuminance, secondLuminance) + .05) / (math.Min(firstLuminance, secondLuminance) + .05)
}
func IsReadable(first, second Color, options WCAG2Options) bool {
	return isReadableRatio(Readability(first, second), options)
}
func MostReadable(base Color, candidates []Color, options WCAG2Options) (Color, bool) {
	bestColor, hasBest := Color{}, len(candidates) != 0
	if hasBest {
		bestColor = candidates[0]
	} else {
		bestColor, _ = FromCompat(nil, false)
	}
	bestScore := Readability(base, bestColor)
	for _, candidate := range candidates {
		if score := Readability(base, candidate); score > bestScore {
			bestScore, bestColor = score, candidate
		}
	}
	if IsReadable(base, bestColor, options) || !options.IncludeFallbackColors {
		return bestColor, hasBest
	}
	white, _ := FromCompat("#fff", false)
	black, _ := FromCompat("#000", false)
	return MostReadable(base, []Color{white, black}, WCAG2Options{Level: options.Level, Size: options.Size})
}
func isReadableRatio(ratio float64, options WCAG2Options) bool {
	options = normalizeWCAG2Options(options)
	switch options.Level + options.Size {
	case "AAsmall", "AAAlarge":
		return ratio >= 4.5
	case "AAlarge":
		return ratio >= 3
	case "AAAsmall":
		return ratio >= 7
	}
	return false
}
func normalizeWCAG2Options(options WCAG2Options) WCAG2Options {
	options.Level = strings.ToUpper(options.Level)
	options.Size = strings.ToLower(options.Size)
	if options.Level != "AA" && options.Level != "AAA" {
		options.Level = "AA"
	}
	if options.Size != "small" && options.Size != "large" {
		options.Size = "small"
	}
	return options
}
func (c Color) IsDark() bool  { return c.Brightness() < 128 }
func (c Color) IsLight() bool { return !c.IsDark() }
func (c Color) Clone() Color  { n, _ := FromCompat(c.String(), false); return n }
func Equals(a, b any) bool {
	if !jsTruthy(a) || !jsTruthy(b) {
		return false
	}
	x, _ := FromCompat(a, false)
	y, _ := FromCompat(b, false)
	return x.ToRGBString() == y.ToRGBString()
}
func jsTruthy(value any) bool {
	switch value := value.(type) {
	case nil:
		return false
	case bool:
		return value
	case string:
		return value != ""
	default:
		number := color.ParseFloat(value)
		return math.IsNaN(number) || number != 0
	}
}
func Random() Color {
	return Color{model: color.Model{R: rand.Float64() * 255, G: rand.Float64() * 255, B: rand.Float64() * 255, A: 1, Valid: true, Format: color.FormatPRGB}}
}
func mathRound(v float64) int {
	floor := math.Floor(v)
	if v-floor >= .5 {
		floor++
	}
	return int(floor)
}

// String supplies the minimal source-compatible string snapshot used by the
// JSONL oracle. Full public output APIs remain Phase 3 work.
func (c Color) String() string {
	return c.toString("", false)
	/*
		r, g, b := int(math.Round(c.model.R)), int(math.Round(c.model.G)), int(math.Round(c.model.B))
		if c.model.Format == color.FormatName {
			if c.model.A == 0 {
				return "transparent"
			}
			if name := parser.NameForRGB(r, g, b); name != "" {
				return name
			}
		}
		if c.model.Format == color.FormatPRGB {
			if c.model.A < 1 {
				return fmt.Sprintf("rgba(%d%%, %d%%, %d%%, %s)", percent(r), percent(g), percent(b), roundedAlpha(c.model.A))
			}
			return fmt.Sprintf("rgb(%d%%, %d%%, %d%%)", percent(r), percent(g), percent(b))
		}
		if c.model.Format == color.FormatHSL {
			h, s, l := rgbToHSL(c.model.R, c.model.G, c.model.B)
			if c.model.A < 1 {
				return fmt.Sprintf("hsla(%d, %d%%, %d%%, %s)", int(math.Round(h*360)), int(math.Round(s*100)), int(math.Round(l*100)), roundedAlpha(c.model.A))
			}
			return fmt.Sprintf("hsl(%d, %d%%, %d%%)", int(math.Round(h*360)), int(math.Round(s*100)), int(math.Round(l*100)))
		}
		if c.model.Format == color.FormatHSV {
			h, s, v := rgbToHSV(c.model.R, c.model.G, c.model.B)
			if c.model.A < 1 {
				return fmt.Sprintf("hsva(%d, %d%%, %d%%, %s)", int(math.Round(h*360)), int(math.Round(s*100)), int(math.Round(v*100)), roundedAlpha(c.model.A))
			}
			return fmt.Sprintf("hsv(%d, %d%%, %d%%)", int(math.Round(h*360)), int(math.Round(s*100)), int(math.Round(v*100)))
		}
		if c.model.Format == color.FormatRGB || c.model.A < 1 {
			if c.model.A == 1 {
				return fmt.Sprintf("rgb(%d, %d, %d)", r, g, b)
			}
			return fmt.Sprintf("rgba(%d, %d, %d, %s)", r, g, b, roundedAlpha(c.model.A))
		}
		return fmt.Sprintf("#%02x%02x%02x", r, g, b)
	*/
}

func (c Color) Inspect() map[string]any {
	format := any(c.Format())
	if c.Format() == "" {
		format = false
	}
	return map[string]any{"valid": c.Valid(), "format": format, "alpha": c.Alpha(), "rgb": c.RGB(), "value": c.String(), "original": c.Original()}
}

func percent(channel float64) int { return mathRound(color.Bound01(channel, 255) * 100) }
func roundedAlpha(alpha float64) string {
	return strconv.FormatFloat(math.Round(alpha*100)/100, 'f', -1, 64)
}

func rgbToHSL(r, g, b float64) (float64, float64, float64) {
	r, g, b = color.Bound01(r, 255), color.Bound01(g, 255), color.Bound01(b, 255)
	max, min := math.Max(r, math.Max(g, b)), math.Min(r, math.Min(g, b))
	l := (max + min) / 2
	if max == min {
		return 0, 0, l
	}
	d := max - min
	s := d / (2 - max - min)
	if l <= 0.5 {
		s = d / (max + min)
	}
	var h float64
	switch max {
	case r:
		h = (g-b)/d + map[bool]float64{true: 6, false: 0}[g < b]
	case g:
		h = (b-r)/d + 2
	default:
		h = (r-g)/d + 4
	}
	return h / 6, s, l
}

func rgbToHSV(r, g, b float64) (float64, float64, float64) {
	r, g, b = color.Bound01(r, 255), color.Bound01(g, 255), color.Bound01(b, 255)
	max, min := math.Max(r, math.Max(g, b)), math.Min(r, math.Min(g, b))
	d := max - min
	if max == 0 {
		return 0, 0, 0
	}
	if d == 0 {
		return 0, 0, max
	}
	var h float64
	switch max {
	case r:
		h = (g-b)/d + map[bool]float64{true: 6, false: 0}[g < b]
	case g:
		h = (b-r)/d + 2
	default:
		h = (r-g)/d + 4
	}
	return h / 6, d / max, max
}

func (c *Color) Lighten(amount float64) *Color {
	h, s, l := rgbToHSL(c.model.R, c.model.G, c.model.B)
	c.setHSL(h, s, clamp01(l+amount/100))
	return c
}

func (c *Color) Darken(amount float64) *Color {
	h, s, l := rgbToHSL(c.model.R, c.model.G, c.model.B)
	c.setHSL(h, s, clamp01(l-amount/100))
	return c
}

func (c *Color) Saturate(amount float64) *Color {
	h, s, l := rgbToHSL(c.model.R, c.model.G, c.model.B)
	c.setHSL(h, clamp01(s+amount/100), l)
	return c
}

func (c *Color) Desaturate(amount float64) *Color {
	h, s, l := rgbToHSL(c.model.R, c.model.G, c.model.B)
	c.setHSL(h, clamp01(s-amount/100), l)
	return c
}

func (c *Color) Greyscale() *Color { return c.Desaturate(100) }

func (c *Color) Brighten(amount float64) *Color {
	delta := float64(-mathRound(-255 * amount / 100))
	rgb := c.ToRGB()
	c.model.R = clampChannel(float64(rgb.R) + delta)
	c.model.G = clampChannel(float64(rgb.G) + delta)
	c.model.B = clampChannel(float64(rgb.B) + delta)
	return c
}

func (c *Color) Spin(amount float64) *Color {
	if math.IsNaN(amount) {
		c.model.R, c.model.G, c.model.B = 0, 0, 0
		return c
	}
	h, s, l := rgbToHSL(c.model.R, c.model.G, c.model.B)
	h = math.Mod(h*360+amount, 360)
	if h < 0 {
		h += 360
	}
	c.setHSL(h/360, s, l)
	return c
}

func Mix(first, second Color, amount float64) Color {
	p := amount / 100
	firstRGB, secondRGB := first.ToRGB(), second.ToRGB()
	raw := map[string]float64{
		"r": (float64(secondRGB.R)-float64(firstRGB.R))*p + float64(firstRGB.R),
		"g": (float64(secondRGB.G)-float64(firstRGB.G))*p + float64(firstRGB.G),
		"b": (float64(secondRGB.B)-float64(firstRGB.B))*p + float64(firstRGB.B),
		"a": (second.model.A-first.model.A)*p + first.model.A,
	}
	return Color{model: color.Model{
		R:        clampChannel(raw["r"]),
		G:        clampChannel(raw["g"]),
		B:        clampChannel(raw["b"]),
		A:        clampAlpha(raw["a"]),
		Valid:    true,
		Format:   color.FormatRGB,
		Original: raw,
	}}
}

func (c Color) Complement() Color {
	hsl := c.ToHSL()
	return hslColor(math.Mod(hsl.H+180, 360), hsl.S, hsl.L, hsl.A, true)
}

func (c Color) SplitComplement() []Color {
	hsl := c.ToHSL()
	return []Color{
		c,
		hslColor(math.Mod(hsl.H+72, 360), hsl.S, hsl.L, 1, false),
		hslColor(math.Mod(hsl.H+216, 360), hsl.S, hsl.L, 1, false),
	}
}

func (c Color) Triad() []Color  { return c.polyad(3) }
func (c Color) Tetrad() []Color { return c.polyad(4) }

func (c Color) Analogous(results, slices int) []Color {
	if results <= 0 || slices <= 0 {
		return []Color{}
	}
	hsl := c.ToHSL()
	part := 360 / float64(slices)
	palette := []Color{c}
	hue := math.Mod(hsl.H-float64(int(part*float64(results))>>1)+720, 360)
	input := map[string]any{"h": hue, "s": hsl.S, "l": hsl.L, "a": hsl.A}
	for remaining := results - 1; remaining > 0; remaining-- {
		hue = math.Mod(hue+part, 360)
		input["h"] = hue
		color, _ := FromCompat(input, false)
		palette = append(palette, color)
	}
	return palette
}

func (c Color) Monochromatic(results int) []Color {
	if results <= 0 {
		return []Color{}
	}
	hsv := c.ToHSV()
	palette := make([]Color, 0, results)
	value := hsv.V
	modification := 1 / float64(results)
	for remaining := results; remaining > 0; remaining-- {
		palette = append(palette, hsvColor(hsv.H, hsv.S, value))
		value = math.Mod(value+modification, 1)
	}
	return palette
}

func (c Color) polyad(number int) []Color {
	if number <= 0 {
		return []Color{}
	}
	hsl := c.ToHSL()
	palette := []Color{c}
	step := 360 / float64(number)
	for index := 1; index < number; index++ {
		palette = append(palette, hslColor(math.Mod(hsl.H+float64(index)*step, 360), hsl.S, hsl.L, 1, false))
	}
	return palette
}

func hslColor(hue, saturation, lightness, alpha float64, includeAlpha bool) Color {
	input := map[string]any{"h": hue, "s": saturation, "l": lightness}
	if includeAlpha {
		input["a"] = alpha
	}
	color, _ := FromCompat(input, false)
	return color
}

func hsvColor(hue, saturation, value float64) Color {
	color, _ := FromCompat(map[string]any{"h": hue, "s": saturation, "v": value}, false)
	return color
}

func (c *Color) setHSL(h, s, l float64) {
	converted := hslColor(h*360, s, l, c.model.A, true)
	c.model.R, c.model.G, c.model.B = converted.model.R, converted.model.G, converted.model.B
}

func clamp01(value float64) float64      { return math.Min(1, math.Max(0, value)) }
func clampChannel(value float64) float64 { return math.Min(255, math.Max(0, value)) }
func clampAlpha(value float64) float64 {
	if value < 0 || value > 1 || math.IsNaN(value) {
		return 1
	}
	return value
}
