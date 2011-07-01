
var s = require("sys");
var c = 0;
var char = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "a", "b", "c", "d", "e", "f"];

var standards = [];
var shorthands = [];

for (var i = 0x0; i <= 0xf; i++) {
    for (var j = 0x0; j <= 0xf; j++) {
    	for (var k = 0x0; k <= 0xf; k++) {
    		for (var l = 0x0; l <= 0xf; l++) {				
    			for (var m = 0x0; m <= 0xf; m++) {
    				for (var n = 0x0; n <= 0xf; n++) {
    				
    					if (i == j && k == l && m == n) {
    						//shorthands.push([char[i], char[k], char[m]].join(''));
    					}
    					
    					
    					standards.push([char[i], char[j], char[k], char[l], char[m], char[n]].join(''));
    					
    					c++;
    				}
    			}
    		}
    	}
    }
}
	
var x = 16777216;

s.puts(standards.slice(0*(x/10), x/10).join("\n"));
s.puts(standards.slice(1*(x/10), x/10).join("\n"));
s.puts(standards.slice(2*(x/10), x/10).join("\n"));
s.puts(standards.slice(3*(x/10), x/10).join("\n"));
s.puts(standards.slice(4*(x/10), x/10).join("\n"));
s.puts(standards.slice(5*(x/10), x/10).join("\n"));
s.puts(standards.slice(6*(x/10), x/10).join("\n"));
s.puts(standards.slice(7*(x/10), x/10).join("\n"));
s.puts(standards.slice(8*(x/10), x/10).join("\n"));
s.puts(standards.slice(9*(x/10), x/10).join("\n"));

//s.puts(standards.join("\n"));