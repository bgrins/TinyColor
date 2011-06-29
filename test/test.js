
console.log("HERE", test);

test("TinyColor initialization", function() {
	ok ( typeof tinycolor != "undefined", "tinycolor is initialized on the page" );
	ok ( typeof tinycolor("red") == "object", "tinycolor is able to be instantiated." );
});


module("Color translations");

test("Named colors", function() {
	equals (tinycolor("red").toHexCss(), "#ff0000", "red matches hex");
});

test("RGB colors", function() {
	equals (tinycolor("rgb 255 0 0").toHexCss(), "#ff0000", "spaced input");
	equals (tinycolor("rgb(255, 0, 0)").toHexCss(), "#ff0000", "parenthesized input");
	equals (tinycolor("rgb (255, 0, 0)").toHexCss(), "#ff0000", "parenthesized spaced input");
	equals (tinycolor({ r: 255, g: 0, b: 0 }).toHexCss(), "#ff0000", "object input");
});


test("Hex colors", function() {
	equals (tinycolor("ff0000").toHexCss(), "#ff0000", "6 character, no pound");
	equals (tinycolor("#ff0000").toHexCss(), "#ff0000", "6 character, with pound");
	equals (tinycolor("f00").toHexCss(), "#ff0000", "3 character, no pound");
	equals (tinycolor("#f00").toHexCss(), "#ff0000", "3 character, with pound");
});

module("Utilities");

test("Color equality", function() {
	ok (tinycolor.equals("#ff0000", "#ff0000"), "Same hex");
	ok (tinycolor.equals("ff0000", "#ff0000"), "Same hex");
	ok (tinycolor.equals("#f00", "#ff0000"), "Same hex");
	ok (tinycolor.equals("f00", "#ff0000"), "Same hex");
	ok (!tinycolor.equals("#ff0000", "#00ff00"), "Different hex");
});