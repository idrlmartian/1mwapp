/*
  THE single source of the 1 Martian Way identity: the mark, the palette, and
  the scales derived from both.

  scripts/generate-brand-assets.mjs is a .mjs that imports this .ts, so it must
  be run with `bun`, not `node`.

  ─────────────────────────────────────────────────────────────────────────
  八百万 — YAOYOROZU
  ─────────────────────────────────────────────────────────────────────────
  八 does not mean eight. In 八百万の神 — the "eight million gods" of Shinto —
  it means COUNTLESS, WITHOUT LIMIT; in 八方, the eight directions, it means
  EVERYWHERE. It is the character Japanese reaches for to say infinite, in a
  sacred register. Its shape also widens as it descends — 末広がり, spreading
  toward the end — which is why it reads as prosperity that grows.

  The mark is that and nothing else. Four decisions, none decorative:

    1. IT NEVER CLOSES.  Two strokes diverge and terminate without meeting or
       enclosing anything. A ring would have put infinity inside a circle and
       closed the one thing the character exists to say.

    2. IT WIDENS.  The gap runs 11 units at the top to ~103 at the foot — a
       ninefold expansion. Growth is not illustrated; it is the geometry.

    3. THE STROKES ARE UNEQUAL.  The previous mark read as an awareness ribbon,
       and a ribbon is a folded strip — necessarily symmetrical. One stroke
       heavier and longer than the other makes that reading impossible. DO NOT
       "tidy" lw/rw or ldrop/rdrop into matching values; the asymmetry is the
       whole defence.

    4. NO HEAD.  A circle above two splayed legs is the person/aid pictogram.
       It was what put the old mark in the wrong category.

  ─────────────────────────────────────────────────────────────────────────
  ONE CUT, EVERYWHERE
  ─────────────────────────────────────────────────────────────────────────
  The terminals are swept and tapered, never flat. A blunt cut says stop; a
  taper says continues, which is the only thing 八百万 is about.

  There was briefly a second "UI" cut with flat ends, on the belief that a
  taper dissolves at favicon sizes. Measured, that was false — it was an
  artefact of tapering too hard. At tip widths 8 and 10 the swept mark carries
  the SAME ink as a flat one all the way down:

      size    swept 8/10      flat
      32px    192 solid       188
      20px     68              70
      16px     43              43
      12px     22              22

  So there is one mark and it is used at every size, on every surface. Do not
  reintroduce a flat variant: it blunts the character for no measurable gain,
  and an icon that differs between the favicon and the signage is two icons.
*/

export const VIEW = 200;
const C = VIEW / 2;

// ── the skeleton ────────────────────────────────────────────────────────────
/** Locked geometry. See decision 3 above before editing any of these. */
export const SKELETON = {
    lw: 24,        // left stroke width  — lighter
    rw: 38,        // right stroke width — heavier
    ldrop: 140,    // left stroke ends higher
    rdrop: 184,    // right stroke ends lower
    lspread: 38,
    rspread: 54,
    gap: 11,       // between the inner edges at the top
    top: 38,
} as const;

const poly = (pts: ReadonlyArray<readonly [number, number]>) =>
    `<path d="M` + pts.map((p) => p.map((v) => +v.toFixed(2)).join(",")).join(" L") + ` Z"/>`;

type Pt = [number, number];

/*
  Centre on the bounding box, then measure MAX REACH from that centre.

  Bounding-box centring alone is not enough for a circular crop. The mark is
  deliberately asymmetric, so its heavy right stroke reaches further from the
  centre than anything else does — a bbox-centred mark still puts that one leg
  hard against the circle's edge while the left side floats in space. Avatars
  therefore scale by REACH, never by bbox.
*/
function centre(strokes: Pt[][]): { strokes: Pt[][]; reach: number } {
    const all = strokes.flat();
    const xs = all.map((p) => p[0]), ys = all.map((p) => p[1]);
    const dx = C - (Math.min(...xs) + Math.max(...xs)) / 2;
    const dy = C - (Math.min(...ys) + Math.max(...ys)) / 2;
    const moved = strokes.map((st) => st.map(([x, y]) => [x + dx, y + dy] as Pt));
    let reach = 0;
    for (const st of moved)
        for (const [x, y] of st) reach = Math.max(reach, Math.hypot(x - C, y - C));
    return { strokes: moved, reach };
}

// ── the UI cut: flat terminals ─────────────────────────────────────────────
function uiStrokes(): Pt[][] {
    const s = SKELETON, hg = s.gap / 2;
    const lIn = C - hg, lOut = lIn - s.lw, rIn = C + hg, rOut = rIn + s.rw;
    return [
        [[lIn, s.top], [lOut, s.top], [lOut - s.lspread, s.ldrop], [lIn - s.lspread, s.ldrop]],
        [[rIn, s.top], [rOut, s.top], [rOut + s.rspread, s.rdrop], [rIn + s.rspread, s.rdrop]],
    ];
}

// ── the mark: a swept centreline, offset by an easing width ────────────────
type P = readonly [number, number];
const bez = (a: P, b: P, c: P, d: P, t: number): Pt => {
    const u = 1 - t;
    return [
        u*u*u*a[0] + 3*u*u*t*b[0] + 3*u*t*t*c[0] + t*t*t*d[0],
        u*u*u*a[1] + 3*u*u*t*b[1] + 3*u*t*t*c[1] + t*t*t*d[1],
    ];
};
const der = (a: P, b: P, c: P, d: P, t: number): Pt => {
    const u = 1 - t;
    return [
        3*u*u*(b[0]-a[0]) + 6*u*t*(c[0]-b[0]) + 3*t*t*(d[0]-c[0]),
        3*u*u*(b[1]-a[1]) + 6*u*t*(c[1]-b[1]) + 3*t*t*(d[1]-c[1]),
    ];
};
/** `ease` above 2 keeps the stroke full for most of its length, thinning only near the tip. */
function sweepPts(p0: P, c0: P, c1: P, p1: P, w0: number, w1: number, ease = 2.2, n = 40): Pt[] {
    const A: Pt[] = [], B: Pt[] = [];
    for (let i = 0; i <= n; i++) {
        const t = i / n, pt = bez(p0, c0, c1, p1, t), d = der(p0, c0, c1, p1, t);
        const len = Math.hypot(d[0], d[1]) || 1, nx = -d[1] / len, ny = d[0] / len;
        const w = w0 + (w1 - w0) * Math.pow(t, ease);
        A.push([pt[0] + nx * w, pt[1] + ny * w]);
        B.push([pt[0] - nx * w, pt[1] - ny * w]);
    }
    return [...A, ...B.reverse()];
}
function displayStrokes(): Pt[][] {
    // half-widths 12 and 19; tips 8 and 10 — heavy enough to hold at 12px
    return [
        sweepPts([82.5, 38], [78, 88], [60, 124], [22, 146], 12, 8, 2.2),
        sweepPts([124.5, 38], [134, 94], [162, 150], [198, 178], 19, 10, 2.2),
    ];
}

const BUILT = (() => {
    const c = centre(displayStrokes());
    return { svg: c.strokes.map(poly).join(""), reach: c.reach };
})();

/** Inner SVG for the mark, centred in a 200x200 viewBox. One cut, all sizes. */
export const markPaths = () => BUILT.svg;
/** Farthest the mark reaches from the centre, in viewBox units (max 100). */
export const reachOf = () => BUILT.reach;

export const markSvg = (fill: string, size?: number) =>
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW} ${VIEW}"`
    + (size ? ` width="${size}" height="${size}"` : "")
    + ` fill="${fill}">${markPaths()}</svg>`;

/*
  How much of the crop radius the mark may occupy.

  0.74 leaves a quarter of the radius clear on every side, measured from the
  farthest point of the mark rather than from a bounding box — so the long right
  stroke and the short left one are both the same distance from the edge, and a
  circular crop cannot clip either.
*/
export const CONTAINMENT = 0.74;

/** Mark centred on its field and scaled by reach, so a circle never clips it. */
export const tileSvg = (
    { fill, ground, radius = 0, containment = CONTAINMENT }:
    { fill: string; ground: string; radius?: number; containment?: number }
) => {
    const k = (containment * C) / reachOf();
    const off = C - C * k;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW} ${VIEW}" width="${VIEW}" height="${VIEW}">`
        + `<rect width="${VIEW}" height="${VIEW}"${radius ? ` rx="${radius}"` : ""} fill="${ground}"/>`
        + `<g transform="translate(${off.toFixed(2)} ${off.toFixed(2)}) scale(${k.toFixed(4)})" fill="${fill}">`
        + `${markPaths()}</g></svg>`;
};

// ── palette ─────────────────────────────────────────────────────────────────
/*
  墨と金 — SUMI TO KIN. Gold on ink-black.

  Chosen from Japanese pigment names with nothing inherited from the previous
  identity. 八 carries fortune and permanence, and gold is close to unused in
  robotics and AI, where the field runs on blue, violet and near-black.

  A CONTRAST FACT THAT DECIDES LAYOUT: white on Kin is 2.17:1 — it fails
  comfortably. Sumi on Kin is 9.68:1. So gold is a MARK colour and a text
  colour on dark; it is not a button fill under white text. Anything set on
  gold must be near-black.
*/
export const KIN = "#D9A93C";
export const SUMI = "#0B0B0D";
export const SHIRO = "#F2EFE9";

export const IDENTITY = {
    mark: KIN,
    ground: SUMI,
    /** For the mark on a light ground. */
    markOnLight: "#8C6A1F",
    lightGround: "#F5F2EA",
    /** Wordmark: Zen Kaku Gothic New 700, Japanese foundry, geometric and calm. */
    typeface: `"Zen Kaku Gothic New", -apple-system, "Segoe UI", sans-serif`,
    typeWeight: 700,
    typeTracking: "0.02em",
} as const;

/*
  UI COLOUR IS DELIBERATELY UNCHANGED HERE.

  Adopting Kin across the interface is a separate decision with a real cost:
  theme.css binds red to every conversion action, and gold cannot carry white
  text (2.17:1). Switching would mean re-styling every CTA to dark-on-gold, not
  recolouring it. Until that call is made, the mark is Kin and the UI stays as
  it is — which works, because the mark is always presented on its own sumi
  field and never sits directly beside a red button.
*/
export const SIGNAL = "#FF0033";
export const SIGNAL_FILL = "#D6002B";
/** @deprecated Prefer IDENTITY.mark for the mark, SIGNAL_FILL for UI fills. */
export const BRAND_RED = SIGNAL_FILL;
