#!/usr/bin/env bun
//
// Generates every brand raster + SVG from ONE source of geometry.
//
// Geometry, palette and scales all come from app/lib/brand.ts, which
// app/components/brand/Logo.tsx imports too. They used to be separate hand-kept
// copies in both files; they are not any more.
//
// THE SYMBOL IS THE BRAND — the white figure, which stands for unlimited
// growth. The field behind it is a background and may be any colour in the
// palette; the mark also ships standalone (1mw-mark.svg, currentColor) for
// surfaces that need no field at all.
//
// Three optical sizes, because one file cannot serve all of them. Each is now
// SOLVED rather than chosen by eye — see CONTAINMENT in app/lib/brand.ts:
//   full     — the mark as drawn. Site logo, OG images.
//   avatar   — reaches 77% of the crop radius. Favicons and every circular
//              avatar. Replaces a hand-picked 1.30 whose outer leg corners
//              landed at 93% of the radius and read as touching the edge.
//   maskable — reaches 72%, comfortably inside Android's 80% safe circle.
//              Replaces a hand-picked 0.78 that reached only 57%, wasting a
//              fifth of the icon's linear extent.
//
// Every scale is applied about the mark's AREA centroid rather than its
// bounding-box centre. The figure is bottom-heavy, so those differ by 11 units
// and only one of them looks centred.
//
// Usage: bun scripts/generate-brand-assets.mjs
//        (bun, not node — this imports a .ts module)

import sharp from "sharp";
import { writeFileSync, mkdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { IDENTITY, KIN, SUMI, markPaths, markSvg, tileSvg, VIEW } from "../app/lib/brand.ts";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");

const BRAND_RED = IDENTITY.mark;   // the MARK colour is Kin now
export { BRAND_RED };

const markGroup = (fill = "#FFFFFF") => `<g fill="${fill}">${markPaths()}</g>`;

/** Red square + white mark. */
// Delegates to brand.ts so the reach-based containment is applied in ONE place.
// Hardcoding a scale here is what put a leg against the avatar border before.
const tile = (radius = 0, ground = SUMI) => tileSvg({ fill: KIN, ground, radius });

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
const markOnly = (fill = "currentColor") =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="200" height="200">` +
    markGroup(fill) +
    `</svg>`;

const out = (p) => join(ROOT, p);
mkdirSync(out("public/icons"), { recursive: true });

// ── SVGs ────────────────────────────────────────────────────────────────────
writeFileSync(out("public/assets/img/1mw-mark.svg"), markOnly("currentColor"));
writeFileSync(out("public/assets/img/1mw-mark-white.svg"), markOnly("#FFFFFF"));
writeFileSync(out("public/assets/img/1mw-mark-red.svg"), markOnly(KIN));
// Overwriting 1mw-logo.svg swaps the logo in all three existing call sites
// (Header x2, Footer x1) with no component edits, and deletes ~4KB of SMIL
// animation loops and two Gaussian blur filters that ran forever on every page.
writeFileSync(out("public/assets/img/1mw-logo.svg"), tile(0));
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
/*
  38 of 200 = 19%, which is ~3px at 16px — visible as a curve, not a pill.

  A FAVICON_RADIUS = 96 constant sat here for a while, described as "18.75% of
  512", and nothing read it: the call below has always passed 38 directly. A
  named constant that does not feed the call it names is worse than the
  literal, because it is the number a reader will trust when they change it.
*/
writeFileSync(out("app/icon.svg"), tile(38));

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
    png(tile(0), 180, "app/apple-icon.png", BRAND_RED),
    png(tile(0), 192, "public/icons/icon-192.png", BRAND_RED),
    png(tile(0), 512, "public/icons/icon-512.png", BRAND_RED),
    /*
      IDENTICAL to icon-512 by design, and worth stating because it looks like
      a bug: the two files are byte-for-byte the same.

      manifest.ts used to say the maskable was separate because "Android crops
      ~10% per edge, which would clip the legs off the as-drawn mark". Measured,
      it does not: CONTAINMENT puts the mark's reach at 74% of half-width and
      Android's safe zone is a circle of 80% diameter, so the as-drawn mark is
      already inside it with room. The tile is also full-bleed with no
      transparent corners, which is the other thing purpose:"maskable" needs.

      The file stays because the manifest references it by name and a maskable
      entry is worth having; what changed is that its reason is now true.
    */
    png(tile(0), 512, "public/icons/icon-512-maskable.png", BRAND_RED),
    // Email CID logo: 240px source displayed at 120px for retina.
    png(tile(0), 240, "public/assets/img/1mw-mark-240.png", BRAND_RED),
    png(tile(0), 512, "public/assets/img/1mw-mark-512.png", BRAND_RED),
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
        sharp(Buffer.from(tile(38)), { density: 400 })
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

console.log(`mark fill   ${BRAND_RED}  (Kin, on Sumi ${SUMI})`);
console.log(`cut         one, swept, tips 8/10 — no flat variant`);
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
    <g transform="scale(0.27)"><rect width="512" height="512" rx="32" fill="${BRAND_RED}"/>${markGroup(KIN)}</g>
  </g>
  <text x="238" y="176" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="30" font-weight="600" fill="#FFFFFF" letter-spacing="-0.5">1 Martian Way</text>
  <text x="238" y="212" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="19" font-weight="500" fill="#7C7C88" letter-spacing="2.5">TOOWL &#183; FREE &#183; MACOS + LINUX</text>
  <text x="84" y="352" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="70" font-weight="700" fill="#FFFFFF" letter-spacing="-2">Terminal</text>
  <text x="84" y="428" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="70" font-weight="700" fill="#FFFFFF" letter-spacing="-2">You Will</text>
  <text x="84" y="504" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="70" font-weight="700" fill="${BRAND_RED}" letter-spacing="-2">Love.</text>
  <text x="84" y="576" font-family="Helvetica Neue, Helvetica, Arial, sans-serif" font-size="26" font-weight="500" fill="#B4B4BD">A GPU-fast terminal and a tmux-style remote client in one binary.</text>
</svg>`;
await sharp(Buffer.from(ogSvg), { density: 200 })
    .resize(1200, 630)
    .png({ compressionLevel: 9 })
    .toFile(out("app/opengraph-image.png"));
writeFileSync(
    out("app/opengraph-image.alt.txt"),
    "toowl by 1 Martian Way — Terminal You Will Love. A GPU-fast terminal and a tmux-style remote client in one binary."
);
console.log("  app/opengraph-image.png (1200x630) + .alt.txt");
