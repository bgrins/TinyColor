
test("TinyColor initialization", function() {
	ok ( typeof tinycolor != "undefined", "tinycolor is initialized on the page" );
	ok ( typeof tinycolor("red") == "object", "tinycolor is able to be instantiated." );
});

// Taken from convertWikipediaColors.html
var conversions = [
{"hex":"#FFFFFF","rgb":{"r":"100.0%","g":"100.0%","b":"100.0%"},"hsv":{"h":"0","s":"0.000","v":"1.000"},"hsl":{"h":"0","s":"0.000","l":"1.000"}},
{"hex":"#808080","rgb":{"r":"050.0%","g":"050.0%","b":"050.0%"},"hsv":{"h":"0","s":"0.000","v":"0.500"},"hsl":{"h":"0","s":"0.000","l":"0.500"}},
{"hex":"#000000","rgb":{"r":"000.0%","g":"000.0%","b":"000.0%"},"hsv":{"h":"0","s":"0.000","v":"0.000"},"hsl":{"h":"0","s":"0.000","l":"0.000"}},
{"hex":"#FF0000","rgb":{"r":"100.0%","g":"000.0%","b":"000.0%"},"hsv":{"h":"0.0","s":"1.000","v":"1.000"},"hsl":{"h":"0.0","s":"1.000","l":"0.500"}},
{"hex":"#BFBF00","rgb":{"r":"075.0%","g":"075.0%","b":"000.0%"},"hsv":{"h":"60.0","s":"1.000","v":"0.750"},"hsl":{"h":"60.0","s":"1.000","l":"0.375"}},
{"hex":"#008000","rgb":{"r":"000.0%","g":"050.0%","b":"000.0%"},"hsv":{"h":"120.0","s":"1.000","v":"0.500"},"hsl":{"h":"120.0","s":"1.000","l":"0.250"}},
{"hex":"#80FFFF","rgb":{"r":"050.0%","g":"100.0%","b":"100.0%"},"hsv":{"h":"180.0","s":"0.500","v":"1.000"},"hsl":{"h":"180.0","s":"1.000","l":"0.750"}},
{"hex":"#8080FF","rgb":{"r":"050.0%","g":"050.0%","b":"100.0%"},"hsv":{"h":"240.0","s":"0.500","v":"1.000"},"hsl":{"h":"240.0","s":"1.000","l":"0.750"}},
{"hex":"#BF40BF","rgb":{"r":"075.0%","g":"025.0%","b":"075.0%"},"hsv":{"h":"300.0","s":"0.667","v":"0.750"},"hsl":{"h":"300.0","s":"0.500","l":"0.500"}},
{"hex":"#A0A424","rgb":{"r":"062.8%","g":"064.3%","b":"014.2%"},"hsv":{"h":"61.8","s":"0.779","v":"0.643"},"hsl":{"h":"61.8","s":"0.638","l":"0.393"}},
//{"hex":"#411BEA","rgb":{"r":"025.5%","g":"010.4%","b":"091.8%"},"hsv":{"h":"251.1","s":"0.887","v":"0.918"},"hsl":{"h":"251.1","s":"0.832","l":"0.511"}},
{"hex":"#1EAC41","rgb":{"r":"011.6%","g":"067.5%","b":"025.5%"},"hsv":{"h":"134.9","s":"0.828","v":"0.675"},"hsl":{"h":"134.9","s":"0.707","l":"0.396"}},
//{"hex":"#F0C80E","rgb":{"r":"094.1%","g":"078.5%","b":"005.3%"},"hsv":{"h":"49.5","s":"0.944","v":"0.941"},"hsl":{"h":"49.5","s":"0.893","l":"0.497"}},
{"hex":"#B430E5","rgb":{"r":"070.4%","g":"018.7%","b":"089.7%"},"hsv":{"h":"283.7","s":"0.792","v":"0.897"},"hsl":{"h":"283.7","s":"0.775","l":"0.542"}},
//{"hex":"#ED7651","rgb":{"r":"093.1%","g":"046.3%","b":"031.6%"},"hsv":{"h":"14.3","s":"0.661","v":"0.931"},"hsl":{"h":"14.3","s":"0.817","l":"0.624"}},
{"hex":"#FEF888","rgb":{"r":"099.8%","g":"097.4%","b":"053.2%"},"hsv":{"h":"56.9","s":"0.467","v":"0.998"},"hsl":{"h":"56.9","s":"0.991","l":"0.765"}},
{"hex":"#19CB97","rgb":{"r":"009.9%","g":"079.5%","b":"059.1%"},"hsv":{"h":"162.4","s":"0.875","v":"0.795"},"hsl":{"h":"162.4","s":"0.779","l":"0.447"}},
{"hex":"#362698","rgb":{"r":"021.1%","g":"014.9%","b":"059.7%"},"hsv":{"h":"248.3","s":"0.750","v":"0.597"},"hsl":{"h":"248.3","s":"0.601","l":"0.373"}},
{"hex":"#7E7EB8","rgb":{"r":"049.5%","g":"049.3%","b":"072.1%"},"hsv":{"h":"240.5","s":"0.316","v":"0.721"},"hsl":{"h":"240.5","s":"0.290","l":"0.607"}}
];


module("Color translations");

test("Color Equality", function() {
	for (var i = 0; i < conversions.length; i++) {
		var c =  conversions[i];
		var tiny =  tinycolor(c.hex);
		
		ok (true, 
			"Testing " + c.hex + ": " + tiny.toRgbString() + " " + tiny.toHsvString() + " " + tiny.toHslString() + " " + tiny.toHexString() +
			"Original: " + JSON.stringify(c.rgb) + " " + JSON.stringify(c.hsv) + " " + JSON.stringify(c.hsl)
		);
		ok (tinycolor.equals(c.rgb, c.hex), "RGB equals hex " + c.hex);
		ok (tinycolor.equals(c.rgb, c.hsl), "RGB equals HSL " + c.hex);
		ok (tinycolor.equals(c.rgb, c.hsv), "RGB equals HSV " + c.hex);
		ok (tinycolor.equals(c.rgb, c.rgb), "RGB equals RGB " + c.hex);
		
		ok (tinycolor.equals(c.hex, c.hex), "hex equals hex " + c.hex);
		ok (tinycolor.equals(c.hex, c.hsl), "hex equals HSL " + c.hex);
		ok (tinycolor.equals(c.hex, c.hsv), "hex equals HSV " + c.hex);
		
		ok (tinycolor.equals(c.hsl, c.hsv), "HSL equals HSV " + c.hex);
		
	}
});

module("Ratio Parsing");
test("With Ratio", function() {
	equal (tinycolor.fromRatio({r: 1, g: 1, b: 1}).toHexString(), "#fff", "white");
});

test("Without Ratio", function() {
	equal (tinycolor({r: 1, g: 1, b: 1}).toHexString(), "#010101", "010101");
});

module("String Parsing");

test("RGB Text Parsing", function() {

	equal (tinycolor("rgb 255 0 0").toHexString(), "#f00", "spaced input");
	equal (tinycolor("rgb(255, 0, 0)").toHexString(), "#f00", "parenthesized input");
	equal (tinycolor("rgb (255, 0, 0)").toHexString(), "#f00", "parenthesized spaced input");
	equal (tinycolor({ r: 255, g: 0, b: 0 }).toHexString(), "#f00", "object input");
	deepEqual (tinycolor({ r: 255, g: 0, b: 0 }).toRgb(), { r: 255, g: 0, b: 0, a: 1 }, "object input and compare");


	ok (tinycolor.equals({r:200, g: 100, b: 0 }, "rgb(200, 100, 0)"));
	ok (tinycolor.equals({r:200, g: 100, b: 0 }, "rgb 200 100 0"));
	ok (tinycolor.equals({r:200, g: 100, b: 0 }, "rgb 200 100 0"));
	ok (tinycolor.equals({r:200, g: 100, b: 0, a: .4 }, "rgba 200 100 0 .4"));
	ok (!tinycolor.equals({r:199, g: 100, b: 0 }, "rgba 200 100 0 1"));
	
	ok (!tinycolor.equals({r:199, g: 100, b: 0 }, "rgb(200, 100, 0)"));
	ok (!tinycolor.equals({r:199, g: 100, b: 0 }, "rgb 200 100 0"));
	ok (!tinycolor.equals({r:199, g: 100, b: 0 }, "rgb 200 100 0"));
	
	
	ok (tinycolor.equals(tinycolor({r:200, g: 100, b: 0 }), "rgb(200, 100, 0)"));
	ok (tinycolor.equals(tinycolor({r:200, g: 100, b: 0 }), "rgb 200 100 0"));
	ok (tinycolor.equals(tinycolor({r:200, g: 100, b: 0 }), "rgb 200 100 0"));
	
});

test("HSL parsing", function() {
	equal( tinycolor({ h: 251, s: 100, l: .38 }).toHexString(), "#2400c2", "to hex" );
	equal( tinycolor({ h: 251, s: 100, l: .38 }).toRgbString(), "rgb(36, 0, 194)", "to rgb" );
	equal( tinycolor({ h: 251, s: 100, l: .38 }).toHslString(), "hsl(251, 100%, 38%)", "to hsl" );
	equal( tinycolor("hsl(251, 100, 38)").toHexString(), "#2400c2", "to hex" );
	equal( tinycolor("hsl(251, 100%, 38%)").toRgbString(), "rgb(36, 0, 194)", "to rgb" );
	equal( tinycolor("hsl(251, 100%, 38%)").toHslString(), "hsl(251, 100%, 38%)", "to hsl" );
	equal( tinycolor("hsl 100 20 10").toHslString(), "hsl(100, 20%, 10%)", "problematic hsl");
});


test("Hex Parsing", function() {
	//equal (tinycolor(rgb).toHexString().toLowerCase(), c.hex.toLowerCase());

});

test("HSV Parsing", function() {

	equal( tinycolor("hsv 251.1 0.887 .918").toHsvString(), "hsv(251, 89%, 92%)");
	equal( tinycolor("hsv 251.1 0.887 0.918").toHsvString(), "hsv(251, 89%, 92%)");

});

test("Named colors", function() {
	equal (tinycolor("aliceblue").toHex(), "f0f8ff");
	equal (tinycolor("antiquewhite").toHex(), "faebd7");
	equal (tinycolor("aqua").toHex(), "0ff");
	equal (tinycolor("aquamarine").toHex(), "7fffd4");
	equal (tinycolor("azure").toHex(), "f0ffff");
	equal (tinycolor("beige").toHex(), "f5f5dc");
	equal (tinycolor("bisque").toHex(), "ffe4c4");
	equal (tinycolor("black").toHex(), "000");
	equal (tinycolor("blanchedalmond").toHex(), "ffebcd");
	equal (tinycolor("blue").toHex(), "00f");
	equal (tinycolor("blueviolet").toHex(), "8a2be2");
	equal (tinycolor("brown").toHex(), "a52a2a");
	equal (tinycolor("burlywood").toHex(), "deb887");
	equal (tinycolor("cadetblue").toHex(), "5f9ea0");
	equal (tinycolor("chartreuse").toHex(), "7fff00");
	equal (tinycolor("chocolate").toHex(), "d2691e");
	equal (tinycolor("coral").toHex(), "ff7f50");
	equal (tinycolor("cornflowerblue").toHex(), "6495ed");
	equal (tinycolor("cornsilk").toHex(), "fff8dc");
	equal (tinycolor("crimson").toHex(), "dc143c");
	equal (tinycolor("cyan").toHex(), "0ff");
	equal (tinycolor("darkblue").toHex(), "00008b");
	equal (tinycolor("darkcyan").toHex(), "008b8b");
	equal (tinycolor("darkgoldenrod").toHex(), "b8860b");
	equal (tinycolor("darkgray").toHex(), "a9a9a9");
	equal (tinycolor("darkgreen").toHex(), "006400");
	equal (tinycolor("darkkhaki").toHex(), "bdb76b");
	equal (tinycolor("darkmagenta").toHex(), "8b008b");
	equal (tinycolor("darkolivegreen").toHex(), "556b2f");
	equal (tinycolor("darkorange").toHex(), "ff8c00");
	equal (tinycolor("darkorchid").toHex(), "9932cc");
	equal (tinycolor("darkred").toHex(), "8b0000");
	equal (tinycolor("darksalmon").toHex(), "e9967a");
	equal (tinycolor("darkseagreen").toHex(), "8fbc8f");
	equal (tinycolor("darkslateblue").toHex(), "483d8b");
	equal (tinycolor("darkslategray").toHex(), "2f4f4f");
	equal (tinycolor("darkturquoise").toHex(), "00ced1");
	equal (tinycolor("darkviolet").toHex(), "9400d3");
	equal (tinycolor("deeppink").toHex(), "ff1493");
	equal (tinycolor("deepskyblue").toHex(), "00bfff");
	equal (tinycolor("dimgray").toHex(), "696969");
	equal (tinycolor("dodgerblue").toHex(), "1e90ff");
	equal (tinycolor("firebrick").toHex(), "b22222");
	equal (tinycolor("floralwhite").toHex(), "fffaf0");
	equal (tinycolor("forestgreen").toHex(), "228b22");
	equal (tinycolor("fuchsia").toHex(), "f0f");
	equal (tinycolor("gainsboro").toHex(), "dcdcdc");
	equal (tinycolor("ghostwhite").toHex(), "f8f8ff");
	equal (tinycolor("gold").toHex(), "ffd700");
	equal (tinycolor("goldenrod").toHex(), "daa520");
	equal (tinycolor("gray").toHex(), "808080");
	equal (tinycolor("grey").toHex(), "808080");
	equal (tinycolor("green").toHex(), "008000");
	equal (tinycolor("greenyellow").toHex(), "adff2f");
	equal (tinycolor("honeydew").toHex(), "f0fff0");
	equal (tinycolor("hotpink").toHex(), "ff69b4");
	equal (tinycolor("indianred ").toHex(), "cd5c5c");
	equal (tinycolor("indigo ").toHex(), "4b0082");
	equal (tinycolor("ivory").toHex(), "fffff0");
	equal (tinycolor("khaki").toHex(), "f0e68c");
	equal (tinycolor("lavender").toHex(), "e6e6fa");
	equal (tinycolor("lavenderblush").toHex(), "fff0f5");
	equal (tinycolor("lawngreen").toHex(), "7cfc00");
	equal (tinycolor("lemonchiffon").toHex(), "fffacd");
	equal (tinycolor("lightblue").toHex(), "add8e6");
	equal (tinycolor("lightcoral").toHex(), "f08080");
	equal (tinycolor("lightcyan").toHex(), "e0ffff");
	equal (tinycolor("lightgoldenrodyellow").toHex(), "fafad2");
	equal (tinycolor("lightgrey").toHex(), "d3d3d3");
	equal (tinycolor("lightgreen").toHex(), "90ee90");
	equal (tinycolor("lightpink").toHex(), "ffb6c1");
	equal (tinycolor("lightsalmon").toHex(), "ffa07a");
	equal (tinycolor("lightseagreen").toHex(), "20b2aa");
	equal (tinycolor("lightskyblue").toHex(), "87cefa");
	equal (tinycolor("lightslategray").toHex(), "789");
	equal (tinycolor("lightsteelblue").toHex(), "b0c4de");
	equal (tinycolor("lightyellow").toHex(), "ffffe0");
	equal (tinycolor("lime").toHex(), "0f0");
	equal (tinycolor("limegreen").toHex(), "32cd32");
	equal (tinycolor("linen").toHex(), "faf0e6");
	equal (tinycolor("magenta").toHex(), "f0f");
	equal (tinycolor("maroon").toHex(), "800000");
	equal (tinycolor("mediumaquamarine").toHex(), "66cdaa");
	equal (tinycolor("mediumblue").toHex(), "0000cd");
	equal (tinycolor("mediumorchid").toHex(), "ba55d3");
	equal (tinycolor("mediumpurple").toHex(), "9370db");
	equal (tinycolor("mediumseagreen").toHex(), "3cb371");
	equal (tinycolor("mediumslateblue").toHex(), "7b68ee");
	equal (tinycolor("mediumspringgreen").toHex(), "00fa9a");
	equal (tinycolor("mediumturquoise").toHex(), "48d1cc");
	equal (tinycolor("mediumvioletred").toHex(), "c71585");
	equal (tinycolor("midnightblue").toHex(), "191970");
	equal (tinycolor("mintcream").toHex(), "f5fffa");
	equal (tinycolor("mistyrose").toHex(), "ffe4e1");
	equal (tinycolor("moccasin").toHex(), "ffe4b5");
	equal (tinycolor("navajowhite").toHex(), "ffdead");
	equal (tinycolor("navy").toHex(), "000080");
	equal (tinycolor("oldlace").toHex(), "fdf5e6");
	equal (tinycolor("olive").toHex(), "808000");
	equal (tinycolor("olivedrab").toHex(), "6b8e23");
	equal (tinycolor("orange").toHex(), "ffa500");
	equal (tinycolor("orangered").toHex(), "ff4500");
	equal (tinycolor("orchid").toHex(), "da70d6");
	equal (tinycolor("palegoldenrod").toHex(), "eee8aa");
	equal (tinycolor("palegreen").toHex(), "98fb98");
	equal (tinycolor("paleturquoise").toHex(), "afeeee");
	equal (tinycolor("palevioletred").toHex(), "db7093");
	equal (tinycolor("papayawhip").toHex(), "ffefd5");
	equal (tinycolor("peachpuff").toHex(), "ffdab9");
	equal (tinycolor("peru").toHex(), "cd853f");
	equal (tinycolor("pink").toHex(), "ffc0cb");
	equal (tinycolor("plum").toHex(), "dda0dd");
	equal (tinycolor("powderblue").toHex(), "b0e0e6");
	equal (tinycolor("purple").toHex(), "800080");
	equal (tinycolor("red").toHex(), "f00");
	equal (tinycolor("rosybrown").toHex(), "bc8f8f");
	equal (tinycolor("royalblue").toHex(), "4169e1");
	equal (tinycolor("saddlebrown").toHex(), "8b4513");
	equal (tinycolor("salmon").toHex(), "fa8072");
	equal (tinycolor("sandybrown").toHex(), "f4a460");
	equal (tinycolor("seagreen").toHex(), "2e8b57");
	equal (tinycolor("seashell").toHex(), "fff5ee");
	equal (tinycolor("sienna").toHex(), "a0522d");
	equal (tinycolor("silver").toHex(), "c0c0c0");
	equal (tinycolor("skyblue").toHex(), "87ceeb");
	equal (tinycolor("slateblue").toHex(), "6a5acd");
	equal (tinycolor("slategray").toHex(), "708090");
	equal (tinycolor("snow").toHex(), "fffafa");
	equal (tinycolor("springgreen").toHex(), "00ff7f");
	equal (tinycolor("steelblue").toHex(), "4682b4");
	equal (tinycolor("tan").toHex(), "d2b48c");
	equal (tinycolor("teal").toHex(), "008080");
	equal (tinycolor("thistle").toHex(), "d8bfd8");
	equal (tinycolor("tomato").toHex(), "ff6347");
	equal (tinycolor("turquoise").toHex(), "40e0d0");
	equal (tinycolor("violet").toHex(), "ee82ee");
	equal (tinycolor("wheat").toHex(), "f5deb3");
	equal (tinycolor("white").toHex(), "fff");
	equal (tinycolor("whitesmoke").toHex(), "f5f5f5");
	equal (tinycolor("yellow").toHex(), "ff0");
	equal (tinycolor("yellowgreen").toHex(), "9acd32");
});


module("Initialization from output");
test("HSL Object", function() {
    var random = tinycolor.random();
	equal (random.toHexString(), tinycolor(random.toHsl()).toHexString(), "HSL Object");
});
/*
test("HSL String", function() {
    var random = tinycolor.random();
	equal (random.toHexString(), tinycolor(random.toHslString()).toHexString(), random.toHexString());
});
test("HSV String", function() {
    var random = tinycolor.random();
	equal (random.toHexString(), tinycolor(random.toHsvString()).toHexString(), random.toHsvString());
});
*/
test("HSV Object", function() {
    var random = tinycolor.random();
	equal (random.toHexString(), tinycolor(random.toHsv()).toHexString(), "HSV Object");
});
test("RGB Object", function() {
    var random = tinycolor.random();
	equal (random.toHexString(), tinycolor(random.toRgb()).toHexString(), "HSL");
});
test("RGB String", function() {
    var random = tinycolor.random();
	equal (random.toHexString(), tinycolor(random.toRgbString()).toHexString(), "HSL");
});
test("Object", function() {
    var random = tinycolor.random();
	equal (random.toHexString(), tinycolor(random).toHexString(), "Object");
});


module("Utilities");

test("Color equality", function() {
	ok (tinycolor.equals("#ff0000", "#ff0000"), "Same hex");
	ok (tinycolor.equals("ff0000", "#ff0000"), "Same hex");
	ok (tinycolor.equals("#f00", "#ff0000"), "Same hex");
	ok (tinycolor.equals("f00", "#ff0000"), "Same hex");
	equal (tinycolor("010101").toHexString(), "#010101");
	ok (!tinycolor.equals("#ff0000", "#00ff00"), "Different hex");
});



/* Too slow: 1677731 possibilities
asyncTest("Ajax load", function() {

	$.get("allhex.txt", function(d) {
		var hex = d.split('\n');
		for (var i = 0, l = hex.length; i < l; i++) {
			ok(tinycolor(hex[i]).toHex(), hex[i]);
		}
		console.log(hex.length);
   		start();
	});
});
*/
