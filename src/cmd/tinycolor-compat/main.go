package main

import (
	"bufio"
	"encoding/json"
	"flag"
	"fmt"
	"io"
	"math"
	"os"
	"strconv"
	"strings"

	"github.com/rajeet-04/tinycolor-go/internal/compat"
	"github.com/rajeet-04/tinycolor-go/internal/parser"
	"github.com/rajeet-04/tinycolor-go/tinycolor"
)

func main() {
	os.Exit(run(os.Args[1:], os.Stdin, os.Stdout, os.Stderr))
}

func run(args []string, stdin io.Reader, stdout, stderr io.Writer) int {
	if len(args) == 0 {
		return runJSONL(stdin, stdout, stderr)
	}
	switch args[0] {
	case "bridge":
		if len(args) != 2 {
			usage(stderr, "bridge <json-request>")
			return 2
		}
		request, err := compat.Decode([]byte(args[1]))
		if err != nil {
			response, _ := compat.Failure("", err.Error())
			write(response, stdout, stderr)
			return 1
		}
		write(handle(request), stdout, stderr)
		return 0
	case "parse":
		return runParse(args[1:], stdout, stderr)
	case "convert":
		return runConvert(args[1:], stdout, stderr)
	case "lighten":
		return runLighten(args[1:], stdout, stderr)
	case "palette":
		return runPalette(args[1:], stdout, stderr)
	case "contrast":
		return runContrast(args[1:], stdout, stderr)
	default:
		usage(stderr, "")
		return 2
	}
}

func runJSONL(stdin io.Reader, stdout, stderr io.Writer) int {
	scanner := bufio.NewScanner(stdin)
	for scanner.Scan() {
		line := scanner.Bytes()
		if len(line) == 0 {
			continue
		}
		request, err := compat.Decode(line)
		if err != nil {
			response, _ := compat.Failure("", err.Error())
			write(response, stdout, stderr)
			continue
		}
		write(handle(request), stdout, stderr)
	}
	return 0
}

func runParse(args []string, stdout, stderr io.Writer) int {
	flags := flag.NewFlagSet("parse", flag.ContinueOnError)
	flags.SetOutput(stderr)
	jsonOutput := flags.Bool("json", false, "output JSON")
	if flags.Parse(args) != nil || flags.NArg() != 1 {
		usage(stderr, "parse [--json] <color>")
		return 2
	}
	color, _ := tinycolor.FromCompat(flags.Arg(0), false)
	if *jsonOutput {
		inspection := color.Inspect()
		inspection["hex"] = color.ToHex()
		return writeJSON(stdout, inspection)
	}
	fmt.Fprintln(stdout, color.String())
	return 0
}

func runConvert(args []string, stdout, stderr io.Writer) int {
	flags := flag.NewFlagSet("convert", flag.ContinueOnError)
	flags.SetOutput(stderr)
	to := flags.String("to", "", "hex, hex8, rgb, percentage-rgb, hsl, hsv, or name")
	jsonOutput := flags.Bool("json", false, "output JSON")
	if flags.Parse(args) != nil || flags.NArg() != 1 || *to == "" {
		usage(stderr, "convert --to hex|hex8|rgb|percentage-rgb|hsl|hsv|name [--json] <color>")
		return 2
	}
	color, _ := tinycolor.FromCompat(flags.Arg(0), false)
	var result string
	switch *to {
	case "hex":
		result = color.ToHexString()
	case "hex8":
		result = color.ToHex8String()
	case "rgb":
		result = color.ToRGBString()
	case "percentage-rgb":
		result = color.ToPercentageRGBString()
	case "hsl":
		result = color.ToHSLString()
	case "hsv":
		result = color.ToHSVString()
	case "name":
		result = color.ToString("name")
	default:
		usage(stderr, "convert --to hex|hex8|rgb|percentage-rgb|hsl|hsv|name [--json] <color>")
		return 2
	}
	if *jsonOutput {
		return writeJSON(stdout, result)
	}
	fmt.Fprintln(stdout, result)
	return 0
}

func runLighten(args []string, stdout, stderr io.Writer) int {
	flags := flag.NewFlagSet("lighten", flag.ContinueOnError)
	flags.SetOutput(stderr)
	amount := flags.Float64("amount", 10, "lightness percentage")
	jsonOutput := flags.Bool("json", false, "output JSON")
	if flags.Parse(args) != nil || flags.NArg() != 1 {
		usage(stderr, "lighten [--amount 10] [--json] <color>")
		return 2
	}
	color, _ := tinycolor.FromCompat(flags.Arg(0), false)
	color.Lighten(*amount)
	result := color.ToHexString()
	if *jsonOutput {
		return writeJSON(stdout, result)
	}
	fmt.Fprintln(stdout, result)
	return 0
}

func runPalette(args []string, stdout, stderr io.Writer) int {
	flags := flag.NewFlagSet("palette", flag.ContinueOnError)
	flags.SetOutput(stderr)
	kind := flags.String("type", "", "palette type")
	results := flags.Int("results", 6, "number of colors")
	slices := flags.Int("slices", 30, "number of hue slices")
	jsonOutput := flags.Bool("json", false, "output JSON")
	if flags.Parse(args) != nil || flags.NArg() != 1 || *kind == "" {
		usage(stderr, "palette --type complement|splitcomplement|triad|tetrad|analogous|monochromatic [--results 6] [--slices 30] [--json] <color>")
		return 2
	}
	color, _ := tinycolor.FromCompat(flags.Arg(0), false)
	var colors []tinycolor.Color
	switch *kind {
	case "complement":
		colors = []tinycolor.Color{color.Complement()}
	case "splitcomplement":
		colors = color.SplitComplement()
	case "triad":
		colors = color.Triad()
	case "tetrad":
		colors = color.Tetrad()
	case "analogous":
		colors = color.Analogous(*results, *slices)
	case "monochromatic":
		colors = color.Monochromatic(*results)
	default:
		usage(stderr, "palette --type complement|splitcomplement|triad|tetrad|analogous|monochromatic [--results 6] [--slices 30] [--json] <color>")
		return 2
	}
	if *jsonOutput {
		inspections := make([]map[string]any, len(colors))
		for index, paletteColor := range colors {
			inspections[index] = paletteColor.Inspect()
		}
		return writeJSON(stdout, inspections)
	}
	for _, paletteColor := range colors {
		fmt.Fprintln(stdout, paletteColor.ToHexString())
	}
	return 0
}

func runContrast(args []string, stdout, stderr io.Writer) int {
	flags := flag.NewFlagSet("contrast", flag.ContinueOnError)
	flags.SetOutput(stderr)
	jsonOutput := flags.Bool("json", false, "output JSON")
	if flags.Parse(args) != nil || flags.NArg() != 2 {
		usage(stderr, "contrast [--json] <first> <second>")
		return 2
	}
	first, _ := tinycolor.FromCompat(flags.Arg(0), false)
	second, _ := tinycolor.FromCompat(flags.Arg(1), false)
	ratio := tinycolor.Readability(first, second)
	if *jsonOutput {
		return writeJSON(stdout, map[string]any{
			"ratio":    ratio,
			"aaSmall":  tinycolor.IsReadable(first, second, tinycolor.WCAG2Options{Level: "AA", Size: "small"}),
			"aaLarge":  tinycolor.IsReadable(first, second, tinycolor.WCAG2Options{Level: "AA", Size: "large"}),
			"aaaSmall": tinycolor.IsReadable(first, second, tinycolor.WCAG2Options{Level: "AAA", Size: "small"}),
			"aaaLarge": tinycolor.IsReadable(first, second, tinycolor.WCAG2Options{Level: "AAA", Size: "large"}),
		})
	}
	fmt.Fprintln(stdout, ratio)
	return 0
}

func usage(stderr io.Writer, command string) {
	if command == "" {
		fmt.Fprintln(stderr, "Usage: tinycolor <parse|convert|lighten|palette|contrast>")
		return
	}
	fmt.Fprintln(stderr, "Usage: tinycolor "+command)
}

func writeJSON(stdout io.Writer, value any) int {
	if err := json.NewEncoder(stdout).Encode(value); err != nil {
		return 1
	}
	return 0
}

func handle(request compat.Request) compat.Response {
	var (
		color tinycolor.Color
		err   error
	)
	args, _ := request.Args.(map[string]any)
	switch request.Operation {
	case "inspect", "string":
		color, err = tinycolor.FromCompat(request.Input, false)
	case "fromRatio":
		format, _ := args["format"].(string)
		gradientType, _ := args["gradientType"].(bool)
		color, err = tinycolor.FromCompatWithOptions(request.Input, true, tinycolor.CompatOptions{Format: format, GradientType: gradientType})
	case "output", "analysis", "clone", "modify", "mix", "readability", "isReadable", "mostReadable", "palette", "setAlpha":
		color, err = tinycolor.FromCompatWithOptions(request.Input, false, options(args))
	case "equals", "randomInvariant", "random", "names":
	default:
		response, _ := compat.Failure(request.ID, "unsupported operation")
		return response
	}
	if err != nil {
		response, _ := compat.Failure(request.ID, err.Error())
		return response
	}
	if request.Operation == "string" {
		format, _ := args["format"].(string)
		response, _ := compat.Success(request.ID, color.ToString(format))
		return response
	}
	switch request.Operation {
	case "output":
		return output(request.ID, color, args)
	case "analysis":
		return analysis(request.ID, color, args["method"])
	case "clone":
		response, _ := compat.Success(request.ID, color.Clone().Inspect())
		return response
	case "modify":
		return modify(request.ID, &color, args)
	case "mix":
		return mix(request.ID, color, args)
	case "readability":
		return readability(request.ID, color, args)
	case "isReadable":
		return isReadable(request.ID, color, args)
	case "mostReadable":
		return mostReadable(request.ID, color, args)
	case "palette":
		return palette(request.ID, color, args)
	case "setAlpha":
		color.SetAlpha(args["value"])
		response, _ := compat.Success(request.ID, color.Inspect())
		return response
	case "equals":
		response, _ := compat.Success(request.ID, tinycolor.Equals(request.Input, args["other"]))
		return response
	case "randomInvariant":
		randomColor := tinycolor.Random()
		rgb := randomColor.ToRGB()
		response, _ := compat.Success(request.ID, map[string]any{
			"valid":      randomColor.Valid(),
			"alpha":      float64(1),
			"rgbInRange": rgb.R >= 0 && rgb.R <= 255 && rgb.G >= 0 && rgb.G <= 255 && rgb.B >= 0 && rgb.B <= 255,
		})
		return response
	case "random":
		response, _ := compat.Success(request.ID, tinycolor.Random().Inspect())
		return response
	case "names":
		response, _ := compat.Success(request.ID, parser.Names())
		return response
	}
	response, _ := compat.Success(request.ID, color.Inspect())
	return response
}

func modify(id string, color *tinycolor.Color, args map[string]any) compat.Response {
	before := color.Inspect()
	method, _ := args["method"].(string)
	var returned *tinycolor.Color
	switch method {
	case "lighten":
		returned = color.Lighten(defaultAmount(args, 10))
	case "brighten":
		returned = color.Brighten(defaultAmount(args, 10))
	case "darken":
		returned = color.Darken(defaultAmount(args, 10))
	case "saturate":
		returned = color.Saturate(defaultAmount(args, 10))
	case "desaturate":
		returned = color.Desaturate(defaultAmount(args, 10))
	case "greyscale":
		returned = color.Greyscale()
	case "spin":
		if _, ok := args["amount"]; ok {
			returned = color.Spin(number(args["amount"]))
		} else {
			returned = color.Spin(math.NaN())
		}
	default:
		response, _ := compat.Failure(id, "unsupported method")
		return response
	}
	response, _ := compat.Success(id, map[string]any{
		"before":       before,
		"after":        color.Inspect(),
		"sameReceiver": returned == color,
	})
	return response
}

func mix(id string, first tinycolor.Color, args map[string]any) compat.Response {
	second, err := tinycolor.FromCompat(args["other"], false)
	if err != nil {
		response, _ := compat.Failure(id, err.Error())
		return response
	}
	response, _ := compat.Success(id, tinycolor.Mix(first, second, defaultAmount(args, 50)).Inspect())
	return response
}

func readability(id string, first tinycolor.Color, args map[string]any) compat.Response {
	second, _ := tinycolor.FromCompat(args["other"], false)
	response, _ := compat.Success(id, tinycolor.Readability(first, second))
	return response
}

func isReadable(id string, first tinycolor.Color, args map[string]any) compat.Response {
	second, _ := tinycolor.FromCompat(args["other"], false)
	options, err := wcagOptions(args)
	if err != nil {
		response, _ := compat.Failure("", err.Error())
		return response
	}
	response, _ := compat.Success(id, tinycolor.IsReadable(first, second, options))
	return response
}

func mostReadable(id string, base tinycolor.Color, args map[string]any) compat.Response {
	inputs, _ := args["candidates"].([]any)
	candidates := make([]tinycolor.Color, 0, len(inputs))
	for _, input := range inputs {
		candidate, _ := tinycolor.FromCompat(input, false)
		candidates = append(candidates, candidate)
	}
	options, err := wcagOptions(args)
	if err != nil {
		response, _ := compat.Failure("", err.Error())
		return response
	}
	result, ok := tinycolor.MostReadable(base, candidates, options)
	if !ok {
		response, _ := compat.Success(id, nil)
		return response
	}
	response, _ := compat.Success(id, result.Inspect())
	return response
}

func palette(id string, color tinycolor.Color, args map[string]any) compat.Response {
	method, _ := args["method"].(string)
	var colors []tinycolor.Color
	switch method {
	case "complement":
		colors = []tinycolor.Color{color.Complement()}
	case "splitcomplement":
		colors = color.SplitComplement()
	case "triad":
		colors = color.Triad()
	case "tetrad":
		colors = color.Tetrad()
	case "analogous":
		colors = color.Analogous(defaultCount(args["results"], 6), defaultCount(args["slices"], 30))
	case "monochromatic":
		colors = color.Monochromatic(defaultCount(args["results"], 6))
	default:
		response, _ := compat.Failure(id, "unsupported method")
		return response
	}
	inspections := make([]map[string]any, len(colors))
	for index, paletteColor := range colors {
		inspections[index] = paletteColor.Inspect()
	}
	response, _ := compat.Success(id, inspections)
	return response
}

func defaultAmount(args map[string]any, fallback float64) float64 {
	if value, ok := args["amount"]; ok {
		if amount, ok := value.(float64); ok && amount == 0 {
			return 0
		}
		if truthy(value) {
			return number(value)
		}
	}
	return fallback
}

func defaultCount(value any, fallback int) int {
	if !truthy(value) {
		return fallback
	}
	return int(number(value))
}

func number(value any) float64 {
	switch value := value.(type) {
	case float64:
		return value
	case bool:
		if value {
			return 1
		}
		return 0
	case nil:
		return 0
	case string:
		value = strings.TrimSpace(value)
		if value == "" {
			return 0
		}
		amount, err := strconv.ParseFloat(value, 64)
		if err == nil {
			return amount
		}
	}
	return math.NaN()
}

func options(args map[string]any) tinycolor.CompatOptions {
	options, _ := args["options"].(map[string]any)
	format, _ := options["format"].(string)
	gradientType, _ := options["gradientType"].(bool)
	return tinycolor.CompatOptions{Format: format, GradientType: gradientType}
}

func wcagOptions(args map[string]any) (tinycolor.WCAG2Options, error) {
	raw, _ := args["options"].(map[string]any)
	level, size := "", ""
	if value := raw["level"]; truthy(value) {
		var ok bool
		if level, ok = value.(string); !ok {
			return tinycolor.WCAG2Options{}, fmt.Errorf("(parms.level || \"AA\").toUpperCase is not a function")
		}
	}
	if value := raw["size"]; truthy(value) {
		var ok bool
		if size, ok = value.(string); !ok {
			return tinycolor.WCAG2Options{}, fmt.Errorf("(parms.size || \"small\").toLowerCase is not a function")
		}
	}
	return tinycolor.WCAG2Options{
		Level:                 level,
		Size:                  size,
		IncludeFallbackColors: truthy(raw["includeFallbackColors"]),
	}, nil
}

func analysis(id string, color tinycolor.Color, method any) compat.Response {
	var result any
	switch method {
	case "brightness":
		result = color.Brightness()
	case "luminance":
		result = color.Luminance()
	case "isDark":
		result = color.IsDark()
	case "isLight":
		result = color.IsLight()
	default:
		response, _ := compat.Failure(id, "unsupported method")
		return response
	}
	response, _ := compat.Success(id, result)
	return response
}

func output(id string, color tinycolor.Color, args map[string]any) compat.Response {
	var result any
	switch args["method"] {
	case "toRgb":
		rgb := color.ToRGB()
		result = map[string]any{"r": rgb.R, "g": rgb.G, "b": rgb.B, "a": rgb.A}
	case "toPercentageRgb":
		rgb := color.ToPercentageRGB()
		result = map[string]any{"r": fmt.Sprintf("%d%%", rgb.R), "g": fmt.Sprintf("%d%%", rgb.G), "b": fmt.Sprintf("%d%%", rgb.B), "a": rgb.A}
	case "toHsl":
		hsl := color.ToHSL()
		result = map[string]any{"h": hsl.H, "s": hsl.S, "l": hsl.L, "a": hsl.A}
	case "toHsv":
		hsv := color.ToHSV()
		result = map[string]any{"h": hsv.H, "s": hsv.S, "v": hsv.V, "a": hsv.A}
	case "toHex":
		result = compactHex(color.ToHex(), truthy(args["compact"]))
	case "toHex8":
		result = compactHex(color.ToHex8(), truthy(args["compact"]))
	case "toHexString":
		result = "#" + compactHex(color.ToHex(), truthy(args["compact"]))
	case "toHex8String":
		result = "#" + compactHex(color.ToHex8(), truthy(args["compact"]))
	case "toRgbString":
		result = color.ToRGBString()
	case "toPercentageRgbString":
		result = color.ToPercentageRGBString()
	case "toHslString":
		result = color.ToHSLString()
	case "toHsvString":
		result = color.ToHSVString()
	case "toString":
		format, _ := args["format"].(string)
		switch format {
		case "hex3":
			result = "#" + compactHex(color.ToHex(), true)
		case "hex4":
			result = "#" + compactHex(color.ToHex8(), true)
		default:
			result = color.ToString(format)
		}
	case "toName":
		name, ok := color.ToName()
		if ok {
			result = name
		} else {
			result = false
		}
	case "toFilter":
		var second *tinycolor.Color
		if truthy(args["secondColor"]) {
			parsed, _ := tinycolor.FromCompat(args["secondColor"], false)
			second = &parsed
		}
		result = color.ToFilter(second, false)
	default:
		response, _ := compat.Failure(id, "unsupported method")
		return response
	}
	response, _ := compat.Success(id, result)
	return response
}

func compactHex(hex string, enabled bool) string {
	if !enabled || (len(hex) != 6 && len(hex) != 8) {
		return hex
	}
	compact := make([]byte, 0, len(hex)/2)
	for index := 0; index < len(hex); index += 2 {
		if hex[index] != hex[index+1] {
			return hex
		}
		compact = append(compact, hex[index])
	}
	return string(compact)
}

func truthy(value any) bool {
	switch value := value.(type) {
	case nil:
		return false
	case bool:
		return value
	case float64:
		return value != 0
	case string:
		return value != ""
	default:
		return true
	}
}

func write(response compat.Response, stdout, stderr io.Writer) {
	encoded, err := compat.Encode(response)
	if err != nil {
		fmt.Fprintln(stderr, err)
		return
	}
	fmt.Fprintln(stdout, string(encoded))
}
