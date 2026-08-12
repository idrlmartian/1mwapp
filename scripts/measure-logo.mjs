#!/usr/bin/env node
//
// One-off tool: derive exact SVG geometry for the 1MW Martian mark from the
// founder's raster.
//
// No vector original exists — every candidate in Drive is an AI-generated PNG
// sitting in the Google AI Studio output folder, and a Drive-wide search for
// SVG/AI/EPS since Sept 2025 returns nothing. So we measure rather than hunt.
//
// We do NOT trace with potrace: the mark is three primitives (a circle and two
// tapered quadrilaterals), and an autotracer would emit hundreds of Bezier
// nodes chasing JPEG ringing on the hard red/white edges. Measured geometry
// gives exact, minimal, editable paths — which is what a mark that has to scale
// from a 16px favicon to a billboard actually needs.
//
// Method:
//   1. Brand red  = per-channel MEDIAN over corner patches (median, not mean:
//      JPEG noise makes the mean drift).
//   2. White mask = pixels far from the measured red.
//   3. Circle     = bbox of the mask above the legs band.
//   4. Legs       = for each row, find white runs; keep rows with exactly two.
//                   Least-squares fit x = m*y + c PER EDGE (x as a function of
//                   y — the edges are steep, so the inverse fit is
//                   ill-conditioned).
//   5. Vertices   = intersect each fitted edge with the top/bottom horizontals.
//   6. Verify     = rasterize the generated SVG and XOR against the source mask.
//
// Usage: node scripts/measure-logo.mjs [path-to-source-image]

import sharp from "sharp";
import { writeFileSync } from "node:fs";

const SRC = process.argv[2] ?? "/Users/karan/Desktop/logo.jpg";

const { data, info } = await sharp(SRC)
    .removeAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

const { width: W, height: H, channels: C } = info;
const px = (x, y) => {
    const i = (y * W + x) * C;
    return [data[i], data[i + 1], data[i + 2]];
};

// ── 1. brand red, by median over the four corner patches ────────────────────
const median = (a) => a.slice().sort((p, q) => p - q)[a.length >> 1];
const rs = [], gs = [], bs = [];
const PATCH = 40;
for (const [ox, oy] of [[0, 0], [W - PATCH, 0], [0, H - PATCH], [W - PATCH, H - PATCH]]) {
    for (let y = oy; y < oy + PATCH; y++) {
        for (let x = ox; x < ox + PATCH; x++) {
            const [r, g, b] = px(x, y);
            rs.push(r); gs.push(g); bs.push(b);
        }
    }
}
const RED = [median(rs), median(gs), median(bs)];
const hex = (c) => "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("").toUpperCase();

// ── 2. white mask ───────────────────────────────────────────────────────────
const mask = new Uint8Array(W * H);
const isWhite = (x, y) => {
    const [r, g, b] = px(x, y);
    return r > 170 && g > 170 && b > 170;
};
for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) if (isWhite(x, y)) mask[y * W + x] = 1;

const rowRuns = (y) => {
    const runs = [];
    let start = -1;
    for (let x = 0; x < W; x++) {
        const on = mask[y * W + x] === 1;
        if (on && start < 0) start = x;
        if ((!on || x === W - 1) && start >= 0) {
            runs.push([start, on && x === W - 1 ? x : x - 1]);
            start = -1;
        }
    }
    return runs;
};

// ── 3. circle: the mask above the legs band ─────────────────────────────────
// Find the vertical gap between head and legs: the first row (scanning down
// from the head) with no white at all.
let firstWhiteRow = -1;
for (let y = 0; y < H && firstWhiteRow < 0; y++) if (rowRuns(y).length) firstWhiteRow = y;

let gapRow = -1;
for (let y = firstWhiteRow; y < H; y++) {
    if (rowRuns(y).length === 0) { gapRow = y; break; }
}
const headBottom = gapRow > 0 ? gapRow : Math.floor(H * 0.42);

let hx0 = W, hx1 = 0, hy0 = H, hy1 = 0;
for (let y = 0; y < headBottom; y++) {
    for (let x = 0; x < W; x++) {
        if (mask[y * W + x]) {
            if (x < hx0) hx0 = x; if (x > hx1) hx1 = x;
            if (y < hy0) hy0 = y; if (y > hy1) hy1 = y;
        }
    }
}
const cx = (hx0 + hx1) / 2, cy = (hy0 + hy1) / 2;
const rX = (hx1 - hx0) / 2, rY = (hy1 - hy0) / 2;
const r = (rX + rY) / 2;

// ── 4. legs: rows with exactly two runs ─────────────────────────────────────
let baseline = 0;
for (let y = H - 1; y >= 0; y--) if (rowRuns(y).length) { baseline = y; break; }

const Lout = [], Lin = [], Rin = [], Rout = [];
let legTop = H;
for (let y = headBottom; y <= baseline; y++) {
    const runs = rowRuns(y);
    if (runs.length !== 2) continue;
    if (y < legTop) legTop = y;
    Lout.push([y, runs[0][0]]);
    Lin.push([y, runs[0][1]]);
    Rin.push([y, runs[1][0]]);
    Rout.push([y, runs[1][1]]);
}

// least squares: x = m*y + c
const fit = (pts) => {
    const n = pts.length;
    let sy = 0, sx = 0, syy = 0, sxy = 0;
    for (const [y, x] of pts) { sy += y; sx += x; syy += y * y; sxy += x * y; }
    const m = (n * sxy - sy * sx) / (n * syy - sy * sy);
    return { m, c: (sx - m * sy) / n };
};
const at = (f, y) => f.m * y + f.c;

const fLout = fit(Lout), fLin = fit(Lin), fRin = fit(Rin), fRout = fit(Rout);

// ── 5. the top bevel ────────────────────────────────────────────────────────
// Each leg's top is an ANGLED cut, not a horizontal one — which is why a
// horizontal slice at legTop reads ~59px wide while the baseline reads ~101px.
// The apparent taper is the bevel, not a tapering strip. So fit the top edge as
// its own line (y = a*x + b over the columns spanned by the cut) and intersect
// it with the two long edges to get the real top vertices.
const fitY = (pts) => { // y = a*x + b
    const n = pts.length;
    let sx = 0, sy = 0, sxx = 0, sxy = 0;
    for (const [x, y] of pts) { sx += x; sy += y; sxx += x * x; sxy += x * y; }
    const a = (n * sxy - sx * sy) / (n * sxx - sx * sx);
    return { a, b: (sy - a * sx) / n };
};

const topEdgePts = (fOuter, fInner, side) => {
    const xa = at(fOuter, legTop), xb = at(fInner, legTop);
    const lo = Math.ceil(Math.min(xa, xb)) + 3;
    const hi = Math.floor(Math.max(xa, xb)) - 3;
    const pts = [];
    for (let x = lo; x <= hi; x++) {
        for (let y = headBottom; y <= baseline; y++) {
            if (mask[y * W + x]) { pts.push([x, y]); break; }
        }
    }
    return pts;
};
let fTopL = fitY(topEdgePts(fLout, fLin, "L"));

// intersect x = m*y + c  with  y = a*x + b   ->   y = (a*c + b) / (1 - a*m)
const meet = (fEdge, fTop) => {
    const y = (fTop.a * fEdge.c + fTop.b) / (1 - fTop.a * fEdge.m);
    return [at(fEdge, y), y];
};

// Refinement pass. The first inner-edge fit is contaminated: for every row that
// still crosses the bevel, the run's inner end lies ON the bevel, not on the
// inner edge. Now that we have an approximate bevel, refit the inner edges
// using only rows strictly below it, then refit the bevel against the corrected
// edges. Two passes converge — the correction is ~50 rows out of ~360.
let fLinR = fLin, fRinR = fRin;
for (let pass = 0; pass < 2; pass++) {
    const yCut = meet(fLinR, fTopL)[1] + 3;
    const Lin2 = Lin.filter(([y]) => y >= yCut);
    const Rin2 = Rin.filter(([y]) => y >= yCut);
    if (Lin2.length < 30 || Rin2.length < 30) break;
    fLinR = fit(Lin2);
    fRinR = fit(Rin2);
    fTopL = fitY(topEdgePts(fLout, fLinR, "L"));
}

// ── 6. vertices, then enforce exact mirror symmetry about x = W/2 ───────────
// The source is AI-generated and only *almost* symmetric; forcing symmetry is a
// real improvement to the mark, not a shortcut.
const AX = W / 2;
const mirror = (x) => 2 * AX - x;

const [txOut, tyOut] = meet(fLout, fTopL);
const [txIn, tyIn] = meet(fLinR, fTopL);
const botL_out = (at(fLout, baseline) + mirror(at(fRout, baseline))) / 2;
const botL_in = (at(fLinR, baseline) + mirror(at(fRinR, baseline))) / 2;
const cxSym = (cx + mirror(cx)) / 2;

const R2 = (v) => Math.round(v * 10) / 10;
const leftPath = `M${R2(txOut)} ${R2(tyOut)} L${R2(txIn)} ${R2(tyIn)} L${R2(botL_in)} ${baseline} L${R2(botL_out)} ${baseline} Z`;
const rightPath = `M${R2(mirror(txOut))} ${R2(tyOut)} L${R2(mirror(txIn))} ${R2(tyIn)} L${R2(mirror(botL_in))} ${baseline} L${R2(mirror(botL_out))} ${baseline} Z`;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">
  <rect width="${W}" height="${H}" fill="${hex(RED)}"/>
  <g fill="#FFFFFF">
    <circle cx="${R2(cxSym)}" cy="${R2(cy)}" r="${R2(r)}"/>
    <path d="${leftPath}"/>
    <path d="${rightPath}"/>
  </g>
</svg>`;

// ── 6. verify: rasterize and XOR against the source mask ────────────────────
const rast = await sharp(Buffer.from(svg)).removeAlpha().raw().toBuffer();
let diff = 0;
for (let i = 0; i < W * H; i++) {
    const j = i * 3;
    const gen = rast[j] > 170 && rast[j + 1] > 170 && rast[j + 2] > 170 ? 1 : 0;
    if (gen !== mask[i]) diff++;
}
const pct = (diff / (W * H)) * 100;

console.log(`source          ${SRC}  (${W}x${H})`);
console.log(`brand red       ${hex(RED)}   rgb(${RED.join(", ")})`);
console.log(`head bottom     y=${headBottom}   (gap row detected: ${gapRow > 0})`);
console.log(`circle          cx=${R2(cxSym)} cy=${R2(cy)} r=${R2(r)}   [rX=${R2(rX)} rY=${R2(rY)}, ellipse skew ${R2(Math.abs(rX - rY))}px]`);
console.log(`legs            top y=${legTop}  baseline y=${baseline}  (${Lout.length} usable rows)`);
console.log(`left  outer     x = ${fLout.m.toFixed(4)}y + ${fLout.c.toFixed(1)}`);
console.log(`left  inner     x = ${fLinR.m.toFixed(4)}y + ${fLinR.c.toFixed(1)}  (refined)`);
console.log(`top bevel       y = ${fTopL.a.toFixed(4)}x + ${fTopL.b.toFixed(1)}`);
console.log(`top vertices    outer (${R2(txOut)}, ${R2(tyOut)})  inner (${R2(txIn)}, ${R2(tyIn)})`);
console.log(`leg width       ${R2(Math.hypot(txIn - txOut, tyIn - tyOut))}px across the bevel, ${R2(botL_in - botL_out)}px at baseline`);
console.log(`\nMISMATCH        ${pct.toFixed(3)}%   ${pct < 0.5 ? "PASS (<0.5%)" : "FAIL — iterate"}`);

writeFileSync("/tmp/1mw-mark-traced.svg", svg);
console.log(`\nwrote /tmp/1mw-mark-traced.svg (intermediate — canonical geometry lives in scripts/generate-brand-assets.mjs)`);
