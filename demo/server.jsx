/** @jsxImportSource https://esm.sh/preact */
import { ImageResponse } from "https://deno.land/x/og_edge/mod.ts";
import { h } from "https://esm.sh/preact";
import render from "https://esm.sh/preact-render-to-string";
import { serve } from "https://deno.land/std@0.126.0/http/server.ts";
import { serveFile } from "https://deno.land/std@0.140.0/http/file_server.ts";
import tinycolor from "../mod.js";

function color_detail(color) {
  return {
    hex: color.toHexString(),
    hex8: color.toHex8String(),
    rgb: color.toRgbString(),
    hsl: color.toHslString(),
    hsv: color.toHsvString(),
    name: color.toName() || "none",
    format: color.getFormat(),
    lighten: color.lighten(20).toHexString(),
    darken: color.darken(20).toHexString(),
    saturate: color.saturate(20).toHexString(),
    desaturate: color.desaturate(20).toHexString(),
    greyscale: color.greyscale().toHexString(),
    brighten: color.brighten(20).toHexString(),
    triad: color.triad().map((c) => c.toHexString()),
    tetrad: color.tetrad().map((c) => c.toHexString()),
    monochromatic: color.monochromatic().map((c) => c.toHexString()),
    analogous: color.analogous().map((c) => c.toHexString()),
    splitcomplement: color.splitcomplement().map((c) => c.toHexString()),
  };
}
async function api_handler(req, input) {
  const color = tinycolor(input);
  if (!color.isValid()) {
    return new Response(
      JSON.stringify({
        error: "Invalid color",
      }),
      {
        status: 400,
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
  return new Response(
    JSON.stringify(Object.assign({ input }, color_detail(color)), null, 2),
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
}
async function image_handler(req, input) {
  const color = tinycolor(input || "lavender");
  console.log(input, color.toHexString());
  const { searchParams } = new URL(req.url);
  const fontSize = searchParams.get("fontSize") || 60;
  const width = searchParams.get("width") || 1200;
  const height = searchParams.get("height") || 627;
  const debug = searchParams.get("debug") || false;
  const detail = color_detail(color);
  console.log(detail);
  if (!color.isValid()) {
    return new Response("Invalid color", { status: 400 });
  }

  let textColor = tinycolor.mostReadable(color, ["#333", "#ddd"]);
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          flexDirection: "column",
          justifyContent: "center",
          fontSize,
          color: textColor.toHexString(),
          backgroundColor: detail.hex,
        }}
      >
        <div>{detail.name}</div>
        <div>{detail.hex}</div>
        <div>{detail.rgb}</div>
        <div>{detail.hsl}</div>
        <div>{detail.hsv}</div>
      </div>
    ),
    {
      debug,
      width,
      height,
    }
  );
}

const port = 8080;
const handler = (req) => {
  const url = new URL(req.url);
  const { pathname } = url;
  if (pathname === "/") {
    return serveFile(req, "./index.html");
  }
  if (["/demo/demo.css", "/tinycolor.js"].includes(pathname)) {
    return serveFile(req, `.${pathname}`);
  }
  if (pathname.startsWith("/api/")) {
    const input = pathname.replace("/api/", "");
    return api_handler(req, input);
  }
  if (pathname.startsWith("/graphic/")) {
    const input = pathname.replace("/graphic/", "");
    return image_handler(req, input);
  }
  return new Response("Not Found", { status: 404 });
};

console.log(`HTTP webserver running. Access it at: http://localhost:8080/`);
await serve(handler, { port });
