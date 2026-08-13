#!/usr/bin/env node
//
// Generates every brand raster + SVG from ONE source of geometry.
//
// The geometry below was measured from the founder's raster by
// scripts/measure-logo.mjs and verified at 0.126% XOR mismatch against the
// source mask. Do not hand-edit these numbers — re-run the measure script.
//
// THE SYMBOL IS THE BRAND — the white figure, which stands for unlimited
// growth. The red field behind it is a background and may be any colour; the
// mark also ships standalone (1mw-mark.svg, currentColor) for surfaces that
// need no field at all.
//
// Three optical sizes, because one file cannot serve all of them:
//   tile     — the mark as drawn. Site logo, OG images, email.
//   compact  — mark scaled 1.30x. At 16px the as-drawn legs thin to ~1px and
//              the head merges into them; compact keeps it legible as a favicon.
//   maskable — mark scaled 0.78x. Android masks app icons to a circle/squircle
//              and crops ~10% per edge, which would clip the as-drawn legs.
//
// Usage: node scripts/generate-brand-assets.mjs

import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

export const BRAND_RED = "#D22222";

// Canonical geometry, 512 viewBox.
const CIRCLE = { cx: 256, cy: 165, r: 43.2 };
const LEG_L = "M218.4 210.2 L245.2 243.9 L167.4 389.5 L123.8 389.5 Z";
const LEG_R = "M293.6 210.2 L266.8 243.9 L344.6 389.5 L388.2 389.5 Z";

// Mark bounding box in the 512 space, used as the scale origin.
const MARK_CENTER = { x: 256, y: 255.7 };

const markGroup = (scale = 1, fill = "#FFFFFF") => {
    const transform =
        scale === 1
            ? ""
            : ` transform="translate(${(MARK_CENTER.x * (1 - scale)).toFixed(2)} ${(MARK_CENTER.y * (1 - scale)).toFixed(2)}) scale(${scale})"`;
    return `<g fill="${fill}"${transform}><circle cx="${CIRCLE.cx}" cy="${CIRCLE.cy}" r="${CIRCLE.r}"/><path d="${LEG_L}"/><path d="${LEG_R}"/></g>`;
};

/** Red square + white mark. */
export const tileSvg = (scale = 1, radius = 0) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">` +
    `<rect width="512" height="512"${radius ? ` rx="${radius}"` : ""} fill="${BRAND_RED}"/>` +
    markGroup(scale) +
    `</svg>`;

/**
 * Mark alone on transparency, inheriting colour from the caller.
 *
 * NOT what ships on chrome. Shipping the bare mark in red was tried and
 * reverted: at the 16-24px the header and tab strip use, the figure is three
 * thin strokes with nothing holding them together, and it reads as a stray
 * glyph rather than a logo. The red field is what makes it legible small.
 *
 * Kept for surfaces that supply their own ground and want no second one.
 * Takes the same optical scale as tileSvg.
 */
export const markSvg = (fill = "currentColor", scale = 1) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">` +
    markGroup(scale, fill) +
    `</svg>`;

const out = (p) => join(ROOT, p);
mkdirSync(out("public/icons"), { recursive: true });

// ── SVGs ────────────────────────────────────────────────────────────────────
writeFileSync(out("public/assets/img/1mw-mark.svg"), markSvg("currentColor"));
writeFileSync(out("public/assets/img/1mw-mark-white.svg"), markSvg("#FFFFFF"));
writeFileSync(out("public/assets/img/1mw-mark-red.svg"), markSvg(BRAND_RED));
// Overwriting 1mw-logo.svg swaps the logo in all three existing call sites
// (Header x2, Footer x1) with no component edits, and deletes ~4KB of SMIL
// animation loops and two Gaussian blur filters that ran forever on every page.
writeFileSync(out("public/assets/img/1mw-logo.svg"), tileSvg());
/*
  THE FAVICON IS THE ONE ROUNDED SURFACE.

  Everything else keeps square corners. The favicon gets FAVICON_RADIUS because
  a tab strip and a bookmark bar are full of rounded chips, and a hard 90°
  square reads as a screenshot dropped into the chrome rather than an app icon.

  Corners outside the rounding are transparent, which is the whole reason to
  round it: the browser's own tab colour shows through in both themes instead of
  four red pixels poking out of the curve.

  White-inside-red, not the mark alone. That was tried and reverted — at 16px
  the bare figure is three thin strokes with no field to hold them together.
*/
const FAVICON_RADIUS = 96; // 18.75% of 512 — ~3px at 16px, visible but not a pill
writeFileSync(out("app/icon.svg"), tileSvg(1.3, FAVICON_RADIUS));

// ── rasters ─────────────────────────────────────────────────────────────────
const png = (svg, size, path, bg) => {
    let img = sharp(Buffer.from(svg), { density: 400 }).resize(size, size);
    if (bg) img = img.flatten({ background: bg });
    return img.png({ compressionLevel: 9 }).toFile(out(path));
};

// Square corners and a solid red field everywhere except the favicon. iOS
// ignores alpha and composites on black, Android masks to its own shape, and
// email clients are a lottery — all three want an opaque tile.
await Promise.all([
    png(tileSvg(1.3), 180, "app/apple-icon.png", BRAND_RED),
    png(tileSvg(1.3), 192, "public/icons/icon-192.png", BRAND_RED),
    png(tileSvg(1.3), 512, "public/icons/icon-512.png", BRAND_RED),
    png(tileSvg(0.78), 512, "public/icons/icon-512-maskable.png", BRAND_RED),
    // Email CID logo: 240px source displayed at 120px for retina.
    png(tileSvg(1.15), 240, "public/assets/img/1mw-mark-240.png", BRAND_RED),
    png(tileSvg(), 512, "public/assets/img/1mw-mark-512.png", BRAND_RED),
]);

// ── favicon.ico (16/32/48) ──────────────────────────────────────────────────
// sharp cannot write ICO, but the container format is trivial: a 6-byte header,
// one 16-byte directory entry per image, then the PNG payloads concatenated.
// (PNG-in-ICO is valid and universally supported since Vista.)
// Same rounded tile as app/icon.svg, and deliberately NOT flattened: ICO
// carries alpha through its PNG payload, so the corners outside the rounding
// stay transparent. Flattening would fill them with red and undo the rounding
// entirely — the curve would still be drawn, with red behind it.
const icoSizes = [16, 32, 48];
const icoPngs = await Promise.all(
    icoSizes.map((s) =>
        sharp(Buffer.from(tileSvg(1.3, FAVICON_RADIUS)), { density: 400 })
            .resize(s, s)
            .png({ compressionLevel: 9 })
            .toBuffer()
    )
);
const header = Buffer.alloc(6);
header.writeUInt16LE(0, 0); // reserved
header.writeUInt16LE(1, 2); // type: icon
header.writeUInt16LE(icoSizes.length, 4);
let offset = 6 + 16 * icoSizes.length;
const entries = icoSizes.map((s, i) => {
    const e = Buffer.alloc(16);
    e.writeUInt8(s === 256 ? 0 : s, 0); // width
    e.writeUInt8(s === 256 ? 0 : s, 1); // height
    e.writeUInt8(0, 2); // palette
    e.writeUInt8(0, 3); // reserved
    e.writeUInt16LE(1, 4); // colour planes
    e.writeUInt16LE(32, 6); // bits per pixel
    e.writeUInt32LE(icoPngs[i].length, 8);
    e.writeUInt32LE(offset, 12);
    offset += icoPngs[i].length;
    return e;
});
writeFileSync(out("public/favicon.ico"), Buffer.concat([header, ...entries, ...icoPngs]));

console.log(`brand red   ${BRAND_RED}`);
console.log("wrote:");
for (const p of [
    "public/assets/img/1mw-logo.svg (overwritten — swaps Header x2 + Footer)",
    "public/assets/img/1mw-mark{,-white,-red}.svg",
    "public/assets/img/1mw-mark-{240,512}.png",
    "app/icon.svg  app/apple-icon.png",
    "public/icons/icon-{192,512,512-maskable}.png",
    "public/favicon.ico (real multi-size ICO: 16/32/48)",
]) console.log("  " + p);

// ── Open Graph card ─────────────────────────────────────────────────────────
// Static, committed, generated once. Deliberately NOT next/og: Satori +
// resvg-wasm on arm64 is a runtime failure surface on a Next.js beta, for an
// image whose content never changes. The site's OG image 404s today, so this is
// launch-critical rather than polish.
const ogSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <rect width="1200" height="630" fill="#0A0A0B"/>
  <rect x="0" y="0" width="1200" height="4" fill="${BRAND_RED}"/>
  <g transform="translate(84 84)">
    <g transform="scale(0.27)"><rect width="512" height="512" rx="32" fill="${BRAND_RED}"/>${markGroup(1.15)}</g>
  </g>
  <text x="238" y="176" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="30" font-weight="600" fill="#FFFFFF" letter-spacing="-0.5">1 Martian Way</text>
  <text x="238" y="212" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="19" font-weight="500" fill="#7C7C88" letter-spacing="2.5">MAGY · EARLY ACCESS</text>
  <text x="84" y="352" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="70" font-weight="700" fill="#FFFFFF" letter-spacing="-2">Infinite agents.</text>
  <text x="84" y="428" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="70" font-weight="700" fill="#FFFFFF" letter-spacing="-2">Infinite worlds.</text>
  <text x="84" y="504" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="70" font-weight="700" fill="${BRAND_RED}" letter-spacing="-2">Any work.</text>
  <text x="84" y="576" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="26" font-weight="500" fill="#B4B4BD">The world\u2019s first 3D embodied multi-agent platform.</text>
</svg>`;
await sharp(Buffer.from(ogSvg), { density: 200 })
    .resize(1200, 630)
    .png({ compressionLevel: 9 })
    .toFile(out("app/opengraph-image.png"));
writeFileSync(
    out("app/opengraph-image.alt.txt"),
    "Magy by 1 Martian Way — Infinite agents. Infinite worlds. Any work."
);
console.log("  app/opengraph-image.png (1200x630) + .alt.txt");
