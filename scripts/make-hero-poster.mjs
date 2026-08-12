#!/usr/bin/env node
//
// Turns a raw MagyVerse screen capture into the hero poster set.
//
// The poster is the most performance-critical image on the site: it paints
// first, it carries LCP, and the video only attaches after it. So it has to be
// small, and it has to survive being darkened and vignetted behind white text.
//
// What this does:
//   1. Crops the in-app UI chrome (the 1ST / 3RD / POSSESS / FOLLOW pills sit in
//      the top-right of a capture and would read as broken furniture on a
//      marketing page).
//   2. Grades it toward the deck palette — the raw world renders bright and
//      slightly warm, which fights a #0b0d12 canvas.
//   3. Emits AVIF + WebP + JPEG at the sizes the page actually requests, plus a
//      tiny base64 LQIP for the instant-paint layer.
//
// Usage:
//   node scripts/make-hero-poster.mjs ~/Desktop/shot.png
//   node scripts/make-hero-poster.mjs ~/Desktop/shot.png --no-grade
//   node scripts/make-hero-poster.mjs ~/Desktop/shot.png --crop-top 90

import sharp from "sharp";
import { mkdirSync, writeFileSync } from "node:fs";
import { basename, join } from "node:path";

const args = process.argv.slice(2);
const SRC = args.find((a) => !a.startsWith("--"));
if (!SRC) {
    console.error("usage: node scripts/make-hero-poster.mjs <image> [--no-grade] [--crop-top N]");
    process.exit(1);
}
const GRADE = !args.includes("--no-grade");
const cropTopArg = args.indexOf("--crop-top");
const CROP_TOP = cropTopArg > -1 ? Number(args[cropTopArg + 1]) : 0;

const OUT = "public/media";
mkdirSync(OUT, { recursive: true });

const src = sharp(SRC).rotate();
const meta = await src.metadata();
const W = meta.width ?? 0;
const H = meta.height ?? 0;
console.log(`source  ${basename(SRC)}  ${W}x${H}`);

// ── 1. crop ──────────────────────────────────────────────────────────────────
// Trim the capture's own chrome off the top, then take a 16:9 window from the
// upper-middle — that is where the desks and agents sit in a typical orbit
// framing, and it keeps the empty floor out of frame.
const top = Math.round(CROP_TOP);
const availH = H - top;
const targetH = Math.min(availH, Math.round(W * 9 / 16));
const cropTop = top + Math.round((availH - targetH) * 0.28);

let img = src.extract({ left: 0, top: cropTop, width: W, height: targetH });

// ── 2. grade ─────────────────────────────────────────────────────────────────
// Pull it toward deep space so the glass panels sit ON it rather than fight it.
// Deliberately gentle: the CSS scrim does the rest, and over-darkening here
// destroys detail the video will later reveal.
if (GRADE) {
    // NOTE: do NOT use sharp's .tint() here. It converts to greyscale before
    // applying the tint, which flattens the wood tones and — worse — kills the
    // coloured agent name badges, which are the single most product-specific
    // thing in the frame. Brightness and saturation only.
    img = img
        .modulate({ brightness: 0.76, saturation: 0.72 })
        .linear(1.06, -6); // slight contrast, blacks a touch deeper
}

const graded = await img.png().toBuffer();

// ── 3. emit ──────────────────────────────────────────────────────────────────
const widths = [1600, 1200, 800];
for (const w of widths) {
    const base = sharp(graded).resize(w, null, { kernel: "lanczos3" });
    await base.clone().avif({ quality: 46, effort: 6 }).toFile(join(OUT, `magy-hero-${w}.v1.avif`));
    await base.clone().webp({ quality: 72 }).toFile(join(OUT, `magy-hero-${w}.v1.webp`));
    await base.clone().jpeg({ quality: 76, mozjpeg: true }).toFile(join(OUT, `magy-hero-${w}.v1.jpg`));
}

// LQIP — 24px wide, inlined into the HTML so *something* paints on the first
// frame even before the poster request resolves.
const lqip = await sharp(graded).resize(24).blur(1.2).webp({ quality: 40 }).toBuffer();
const dataUri = `data:image/webp;base64,${lqip.toString("base64")}`;
writeFileSync(join(OUT, "magy-hero-lqip.txt"), dataUri);

// A larger data URI, for pasting straight into a self-contained mockup where
// external hosts are blocked.
const inline = await sharp(graded).resize(1400).webp({ quality: 62 }).toBuffer();
writeFileSync(
    join(OUT, "magy-hero-inline.txt"),
    `data:image/webp;base64,${inline.toString("base64")}`
);

const kb = (b) => (b / 1024).toFixed(1) + " KB";
console.log(`graded  ${GRADE ? "yes" : "no (--no-grade)"}   crop  top ${cropTop}px, ${W}x${targetH}`);
for (const w of widths) {
    const a = await sharp(join(OUT, `magy-hero-${w}.v1.avif`)).metadata();
    console.log(`  ${w}px  avif ${kb(a.size ?? 0)}`);
}
console.log(`  lqip   ${kb(lqip.length)}  (inlined)`);
console.log(`  inline ${kb(inline.length)}  -> public/media/magy-hero-inline.txt`);
console.log(`\nwrote ${widths.length * 3 + 2} files to ${OUT}/`);
