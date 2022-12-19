import { build, emptyDir } from "https://deno.land/x/dnt/mod.ts";
import { rollup } from "npm:rollup";
import { minify } from "npm:terser";

await emptyDir("./npm");

const version = Deno.args[0];
if (!version) {
  throw new Error("Must pass version as first argument");
}

await build({
  entryPoints: ["./mod.js"],
  declaration: false,
  outDir: "./npm",
  scriptModule: "umd",
  shims: {
    // see JS docs for overview and more options
    deno: "dev",
  },
  typeCheck: false,
  package: {
    // package.json properties
    name: "@bgrins/test-tinycolor-esm",
    version,
    description: "Fast Color Parsing and Manipulation",
    author:
      "Brian Grinstead <briangrinstead@gmail.com> (http://briangrinstead.com)",
    license: "MIT",
    url: "http://bgrins.github.com/TinyColor",
    repository: {
      type: "git",
      url: "https://github.com/bgrins/TinyColor.git",
    },
    bugs: {
      url: "https://github.com/bgrins/TinyColor/issues",
    },
    keywords: ["color", "color manipulation", "color parsing"],
  },
});

// post build steps
Deno.copyFileSync("LICENSE", "npm/LICENSE");
Deno.copyFileSync("README.md", "npm/README.md");

let bundle = await rollup({
  input: "mod.js",
});

let { output } = await bundle.generate({
  format: "umd",
  name: "tinycolor",
});
let minified = await minify(output[0].code);
const preamble = `// This file is autogenerated.
// Ideally it wouldn't exist, but it's here for backwards compatibility for people
// using it directly from a CDN. Please use the npm package which exports both CJS and ESM.
`;

Deno.writeTextFileSync("tinycolor.js", preamble + output[0].code);
Deno.writeTextFileSync("dist/tinycolor-min.js", preamble + minified.code);
