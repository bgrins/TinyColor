
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
