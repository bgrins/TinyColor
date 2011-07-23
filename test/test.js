
test("TinyColor initialization", function() {
	ok ( typeof tinycolor != "undefined", "tinycolor is initialized on the page" );
	ok ( typeof tinycolor("red") == "object", "tinycolor is able to be instantiated." );
});

module("Color translations");

test("RGB colors", function() {
	equal (tinycolor("rgb 255 0 0").toHexCss(), "#ff0000", "spaced input");
	equal (tinycolor("rgb(255, 0, 0)").toHexCss(), "#ff0000", "parenthesized input");
	equal (tinycolor("rgb (255, 0, 0)").toHexCss(), "#ff0000", "parenthesized spaced input");
	equal (tinycolor({ r: 255, g: 0, b: 0 }).toHexCss(), "#ff0000", "object input");
	deepEqual (tinycolor({ r: 255, g: 0, b: 0 }).toRgb(), { r: 255, g: 0, b: 0 }, "object input and compare");
});

test("RGB Text Parsing", function() {
	ok (tinycolor.equals({r:200, g: 100, b: 0 }, "rgb(200, 100, 0)"));
	ok (tinycolor.equals({r:200, g: 100, b: 0 }, "rgb 200 100 0"));
	ok (tinycolor.equals({r:200, g: 100, b: 0 }, "rgb 200 100 0"));
	
	ok (!tinycolor.equals({r:199, g: 100, b: 0 }, "rgb(200, 100, 0)"));
	ok (!tinycolor.equals({r:199, g: 100, b: 0 }, "rgb 200 100 0"));
	ok (!tinycolor.equals({r:199, g: 100, b: 0 }, "rgb 200 100 0"));
	
	
	ok (tinycolor.equals(tinycolor({r:200, g: 100, b: 0 }), "rgb(200, 100, 0)"));
	ok (tinycolor.equals(tinycolor({r:200, g: 100, b: 0 }), "rgb 200 100 0"));
	ok (tinycolor.equals(tinycolor({r:200, g: 100, b: 0 }), "rgb 200 100 0"));
	
});

test("HSL parsing", function() {
	equal( tinycolor({ h: 251, s: 100, l: .38 }).toHexCss(), "#2400c2", "to hex" );
	equal( tinycolor({ h: 251, s: 100, l: .38 }).toRgbCss(), "rgb(36, 0, 194)", "to rgb" );
	equal( tinycolor({ h: 251, s: 100, l: .38 }).toHslCss(), "hsl(251, 100%, 38%)", "to hsl" );
	equal( tinycolor("hsl(251, 100%, 38%)").toHexCss(), "#2400c2", "to hex" );
	equal( tinycolor("hsl(251, 100%, 38%)").toRgbCss(), "rgb(36, 0, 194)", "to rgb" );
	equal( tinycolor("hsl(251, 100%, 38%)").toHslCss(), "hsl(251, 100%, 38%)", "to hsl" );
});


test("HSV Parsing", function() {
	var height = 500;
	var index = 0;
	var hue = 0.0;
	var sat = 1;
	var x,y;    
	for(y = height-1; y >=0; y--){
	   hue = y / height;
	   hue = (hue - Math.floor(hue));
	   
	   var hsv = {h:hue, s:sat, v: 1};
	}
});

test("Hex colors", function() {
	//console.log(c, c.toString(16), shorthands.length, standards.length);
	equal (tinycolor("ff0000").toHexCss(), "#ff0000", "6 character, no pound");
	equal (tinycolor("#ff0000").toHexCss(), "#ff0000", "6 character, with pound");
	equal (tinycolor("f00").toHexCss(), "#ff0000", "3 character, no pound");
	equal (tinycolor("#f00").toHexCss(), "#ff0000", "3 character, with pound");
});

test("Named colors", function() {
	equal (tinycolor("aliceblue").toHex(), "f0f8ff");
	equal (tinycolor("antiquewhite").toHex(), "faebd7");
	equal (tinycolor("aqua").toHex(), "00ffff");
	equal (tinycolor("aquamarine").toHex(), "7fffd4");
	equal (tinycolor("azure").toHex(), "f0ffff");
	equal (tinycolor("beige").toHex(), "f5f5dc");
	equal (tinycolor("bisque").toHex(), "ffe4c4");
	equal (tinycolor("black").toHex(), "000000");
	equal (tinycolor("blanchedalmond").toHex(), "ffebcd");
	equal (tinycolor("blue").toHex(), "0000ff");
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
	equal (tinycolor("cyan").toHex(), "00ffff");
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
	equal (tinycolor("feldspar").toHex(), "d19275");
	equal (tinycolor("firebrick").toHex(), "b22222");
	equal (tinycolor("floralwhite").toHex(), "fffaf0");
	equal (tinycolor("forestgreen").toHex(), "228b22");
	equal (tinycolor("fuchsia").toHex(), "ff00ff");
	equal (tinycolor("gainsboro").toHex(), "dcdcdc");
	equal (tinycolor("ghostwhite").toHex(), "f8f8ff");
	equal (tinycolor("gold").toHex(), "ffd700");
	equal (tinycolor("goldenrod").toHex(), "daa520");
	equal (tinycolor("gray").toHex(), "808080");
	equal (tinycolor("grey").toHex(), "808080");
	equal (tinycolor("green").toHex(), "00ff00");
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
	equal (tinycolor("lightslateblue").toHex(), "8470ff");
	equal (tinycolor("lightslategray").toHex(), "778899");
	equal (tinycolor("lightsteelblue").toHex(), "b0c4de");
	equal (tinycolor("lightyellow").toHex(), "ffffe0");
	equal (tinycolor("lime").toHex(), "00ff00");
	equal (tinycolor("limegreen").toHex(), "32cd32");
	equal (tinycolor("linen").toHex(), "faf0e6");
	equal (tinycolor("magenta").toHex(), "ff00ff");
	equal (tinycolor("maroon").toHex(), "800000");
	equal (tinycolor("mediumaquamarine").toHex(), "66cdaa");
	equal (tinycolor("mediumblue").toHex(), "0000cd");
	equal (tinycolor("mediumorchid").toHex(), "ba55d3");
	equal (tinycolor("mediumpurple").toHex(), "9370d8");
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
	equal (tinycolor("palevioletred").toHex(), "d87093");
	equal (tinycolor("papayawhip").toHex(), "ffefd5");
	equal (tinycolor("peachpuff").toHex(), "ffdab9");
	equal (tinycolor("peru").toHex(), "cd853f");
	equal (tinycolor("pink").toHex(), "ffc0cb");
	equal (tinycolor("plum").toHex(), "dda0dd");
	equal (tinycolor("powderblue").toHex(), "b0e0e6");
	equal (tinycolor("purple").toHex(), "800080");
	equal (tinycolor("red").toHex(), "ff0000");
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
	equal (tinycolor("violetred").toHex(), "d02090");
	equal (tinycolor("wheat").toHex(), "f5deb3");
	equal (tinycolor("white").toHex(), "ffffff");
	equal (tinycolor("whitesmoke").toHex(), "f5f5f5");
	equal (tinycolor("yellow").toHex(), "ffff00");
	equal (tinycolor("yellowgreen").toHex(), "9acd32");
});

module("Utilities");

test("Color equality", function() {
	ok (tinycolor.equals("#ff0000", "#ff0000"), "Same hex");
	ok (tinycolor.equals("ff0000", "#ff0000"), "Same hex");
	ok (tinycolor.equals("#f00", "#ff0000"), "Same hex");
	ok (tinycolor.equals("f00", "#ff0000"), "Same hex");
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
