#!/usr/bin/env node
//
// Developer-page header backdrop: 4096x2304, 24-bit, no alpha, <1MB.
//
// Static echo of the Cortex graph (app/components/ui/CortexGraph.tsx) rather
// than an unrelated abstract gradient — same seeded Fibonacci-shell layout,
// same per-type agent-colour tokens, same halo/edge rendering rules, just
// projected once to a wide frame instead of animated in a square canvas.
// Left third stays sparse/dark so foreground text has somewhere to sit.
//
// Usage: node scripts/make-dev-backdrop.mjs

import sharp from "sharp";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = (p) => join(ROOT, p);

const W = 4096, H = 2304;
const BG = "#0b0d12";
const BG2 = "#080a0e";

// Same LCG as CortexGraph.tsx.
function rng(seed) {
  let s = seed >>> 0;
  return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

// Same six type/colour pairs as the live component.
const TYPES = [
  { c: "#f472b6" }, // zara
  { c: "#38bdf8" }, // kai
  { c: "#4ade80" }, // juno
  { c: "#8b5cf6" }, // nova
  { c: "#f59e0b" }, // luna
  { c: "#00f0ff" }, // aria
];

// buildShell(seed, count) makes one Fibonacci-shell cluster. Two clusters —
// a dense "hero" one and a sparser, dimmer "field" one — read as one graph
// with depth rather than a single blob with empty space around it.
function buildShell(seed, count) {
  const r = rng(seed);
  const nodes = [];
  for (let i = 0; i < count; i++) {
    const ty = TYPES[(r() * TYPES.length) | 0];
    const u = (i + 0.5) / count;
    const phi = Math.acos(1 - 2 * u);
    const th = Math.PI * (1 + Math.sqrt(5)) * i;
    const rad = 0.62 + r() * 0.38;
    nodes.push({
      x: Math.cos(th) * Math.sin(phi) * rad,
      y: Math.cos(phi) * rad * 0.78,
      z: Math.sin(th) * Math.sin(phi) * rad,
      c: ty.c,
      pr: 0.18 + Math.pow(r(), 2.4) * 0.82,
    });
  }
  return nodes;
}

function buildEdges(nodes, seed, threshold, prob) {
  const r = rng(seed);
  const edges = [];
  for (let i = 0; i < nodes.length; i++)
    for (let j = i + 1; j < nodes.length; j++) {
      const d = Math.hypot(nodes[i].x - nodes[j].x, nodes[i].y - nodes[j].y, nodes[i].z - nodes[j].z);
      if (d < threshold && r() < prob) edges.push([i, j]);
    }
  return edges;
}

const HERO = buildShell(70131, 80);
const HERO_EDGES = buildEdges(HERO, 9317, 0.62, 0.5);

const FIELD = buildShell(51113, 110);
const FIELD_EDGES = buildEdges(FIELD, 4471, 0.5, 0.22);

// Fixed rotation — the component's resting angle before auto-spin advances it.
const rot = { x: -0.22, y: 0.5 };
const cyr = Math.cos(rot.y), syr = Math.sin(rot.y);
const cxr = Math.cos(rot.x), sxr = Math.sin(rot.x);
const FOV = 2.6;

function project(nodes, cx, cy, scale) {
  return nodes.map((n, i) => {
    let x = n.x * cyr - n.z * syr;
    let z = n.x * syr + n.z * cyr;
    const y = n.y * cxr - z * sxr;
    z = n.y * sxr + z * cxr;
    const p = FOV / (FOV - z);
    return { i, x: cx + x * scale * p, y: cy + y * scale * p, z, p };
  });
}

function render(nodes, edges, P, { sizeMul, opacityMul, edgeOpacityMul }) {
  let edgeSvg = "";
  for (const [a, b] of edges) {
    const A = P[a], B = P[b];
    const alpha = ((0.05 + ((A.z + B.z) / 2 + 1) * 0.07) * edgeOpacityMul).toFixed(3);
    edgeSvg += `<line x1="${A.x.toFixed(1)}" y1="${A.y.toFixed(1)}" x2="${B.x.toFixed(1)}" y2="${B.y.toFixed(1)}" stroke="#ffffff" stroke-opacity="${alpha}" stroke-width="1.5"/>`;
  }

  let nodeSvg = "";
  for (const pt of [...P].sort((a, b) => a.z - b.z)) {
    const n = nodes[pt.i];
    const r = (2.4 + n.pr * 15) * pt.p * sizeMul;
    const depth = 0.3 + (pt.z + 1) * 0.35;
    nodeSvg += `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="${(r * 2.5).toFixed(1)}" fill="${n.c}" opacity="${(0.15 * depth * opacityMul).toFixed(3)}" filter="url(#halo)"/>`;
    nodeSvg += `<circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="${r.toFixed(1)}" fill="${n.c}" opacity="${(Math.min(1, 0.42 + depth * 0.62) * opacityMul).toFixed(3)}"/>`;
  }
  return { edgeSvg, nodeSvg };
}

// Field: dim, smaller, spans the whole frame (fills the left side).
const fieldP = project(FIELD, W * 0.38, H * 0.5, Math.min(W, H) * 0.82);
const field = render(FIELD, FIELD_EDGES, fieldP, { sizeMul: 0.55, opacityMul: 0.5, edgeOpacityMul: 0.55 });

// Hero: the original dense right-of-frame cluster, full brightness, on top.
const heroP = project(HERO, W * 0.66, H * 0.46, Math.min(W, H) * 0.62);
const hero = render(HERO, HERO_EDGES, heroP, { sizeMul: 1, opacityMul: 1, edgeOpacityMul: 1 });

const edgeSvg = field.edgeSvg + hero.edgeSvg;
const nodeSvg = field.nodeSvg + hero.nodeSvg;

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <radialGradient id="base" cx="66%" cy="40%" r="70%">
      <stop offset="0%" stop-color="#10131b"/>
      <stop offset="100%" stop-color="${BG2}"/>
    </radialGradient>
    <radialGradient id="vignette" cx="50%" cy="45%" r="75%">
      <stop offset="55%" stop-color="${BG}" stop-opacity="0"/>
      <stop offset="100%" stop-color="${BG}" stop-opacity="0.5"/>
    </radialGradient>
    <filter id="halo" x="-60%" y="-60%" width="220%" height="220%">
      <feGaussianBlur stdDeviation="14"/>
    </filter>
    <filter id="grain">
      <feTurbulence type="fractalNoise" baseFrequency="0.35" numOctaves="2" stitchTiles="stitch" result="n"/>
      <feColorMatrix in="n" type="matrix" values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 0.025 0"/>
    </filter>
  </defs>

  <rect width="${W}" height="${H}" fill="url(#base)"/>
  <g>${edgeSvg}</g>
  <g>${nodeSvg}</g>
  <rect width="${W}" height="${H}" fill="url(#vignette)"/>
  <rect width="${W}" height="${H}" filter="url(#grain)"/>
</svg>`;

await sharp(Buffer.from(svg), { density: 300 })
  .resize(W, H)
  .flatten({ background: BG })
  .jpeg({ quality: 88, chromaSubsampling: "4:4:4" })
  .toFile(out("public/assets/img/dev-page-backdrop.jpg"));

console.log("wrote public/assets/img/dev-page-backdrop.jpg");
