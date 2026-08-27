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
    /*
      FLOW — chosen 2026-08-27, after eight directions were drawn and compared
      at every size down to twelve pixels.

      The previous drawing kept these same two strokes nearly parallel-sided —
      12 down to 8, and 19 down to 10 — so each one read as a folded strip
      rather than a gesture. A strip has two edges of equal weight and no
      direction, and the eye resolved the pair as a ribbon looped at the top.
      That is what made the mark read as a badge rather than a mark, and it was
      a geometry problem, not a colour problem.

      Three changes, and every one of the four locked decisions above survives
      them — it still never closes, still widens ninefold, the halves are still
      unequal, and there is still no head:

        1. CURVATURE INCREASES TOWARD THE TIP instead of running out straight,
           so the eye reads a path rather than an edge.
        2. THE TAPER EASES AT 2.6, not 2.2 — the mass stays in the body and all
           the thinning happens in the last quarter. That is what reads as
           continuing rather than stopping.
        3. THE RIGHT STROKE OVERSHOOTS the frame before `centre()` pulls it
           back, which is what makes the pair feel like it carries on past the
           crop.

      THE TIP FLOOR IS MEASURED, NOT TASTE. Tips stop at 5.5 and 6.5 units.
      Below roughly 4.2 a tip falls under one device pixel at 12px and the
      stroke visibly shortens — so the mark would change length with size,
      which breaks "one cut, everywhere" in the least obvious way possible.
      Do not thin these further to make the flow more dramatic.

      Gate and Ascend remain live alternates (see the mark competition); Ascend
      in particular merges this with the threshold direction. Swapping is this
      function and nothing else — every consumer goes through `containedMark`.
    */
    return [
        sweepPts([84, 28], [68, 86], [46, 130], [10, 152], 14, 5.5, 2.6),
        sweepPts([122, 28], [146, 94], [176, 150], [210, 170], 17.5, 6.5, 2.6),
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

/*
  THE INK BOX — where the mark's actual ink sits inside the 200-unit view.

  Measured from markPaths(), not estimated: x -3.08..203.08, y 23.21..176.79.
  Two things fall out of it, and both matter.

  The mark is WIDER THAN ITS VIEW BOX. The strokes end 3.08 units past each
  edge, so dropping markPaths() into a 200 viewBox clips both tips — a small
  clip, but of the one feature the character exists to state, which is that the
  strokes never terminate. FIT below scales that away.

  And the ink is 76.8% of the box TALL against 103.1% WIDE, so the mark is a
  wide, short shape. Any lockup ratio measured against the box rather than the
  ink is measuring mostly empty space above and below the strokes.
*/
export const INK = { x0: -3.08, x1: 203.08, y0: 23.21, y1: 176.79 } as const;

/**
 * The mark scaled to FIT its view box on the ink's own bounds, centred on the
 * ink rather than on the view.
 *
 * This is the inline lockup's transform, and `containedMark` is the avatar's.
 * They are not interchangeable and the difference is 40% of the mark's height:
 * CONTAINMENT scales by REACH so a circular crop cannot clip the long right
 * stroke, which necessarily leaves the corners of a square empty. Using it in
 * a header renders a mark that is correct for a crop that is not happening,
 * beside type sized for the mark it should have been.
 */
export const fittedMark = (fill: string, margin = 0) => {
    const w = INK.x1 - INK.x0, h = INK.y1 - INK.y0;
    const k = (VIEW * (1 - margin)) / Math.max(w, h);
    const dx = (VIEW - w * k) / 2 - INK.x0 * k;
    const dy = (VIEW - h * k) / 2 - INK.y0 * k;
    return `<g transform="translate(${dx.toFixed(2)} ${dy.toFixed(2)}) scale(${k.toFixed(4)})"`
        + ` fill="${fill}">${markPaths()}</g>`;
};

/**
 * The mark, scaled and centred BY REACH inside the 200-unit view box.
 *
 * Everything that draws the mark on a field must go through this. Dropping
 * `markPaths()` straight into a viewBox of some other size silently anchors it
 * top-left at the wrong scale, which is exactly what shipped in Logo.tsx.
 */
export const containedMark = (fill: string, containment = CONTAINMENT) => {
    const k = (containment * C) / reachOf();
    const off = C - C * k;
    return `<g transform="translate(${off.toFixed(2)} ${off.toFixed(2)}) scale(${k.toFixed(4)})"`
        + ` fill="${fill}">${markPaths()}</g>`;
};

/*
  THE LOCKUP — mark beside wordmark. Three numbers, scaled together.

  `baselineLift` is not a nudge. Zen Kaku Gothic New is a Japanese face: its
  line box runs 1.448em (ascent 1.160 + descent 0.288) against a cap height of
  0.700em, so centring the boxes drops the caps ink by (1.448-0.700)/2 =
  0.086em. Measured 26.5px on a 304px render against 26.1px predicted. Lift the
  type by that much and the cap-height centre lands on the mark's ink centre.

  Do NOT align to the mark's area centroid instead: it sits 5.3% higher (the
  strokes are heavy at the top and taper down) and overshoots visibly. The eye
  reads a mark's extremes, not its mass.
*/
export const LOCKUP = {
    markBox: 78,
    fontSize: 38,
    gap: 30,
    /*
      Zero, because the face changed. The note above measures Zen Kaku Gothic
      New, a Japanese face whose 1.448em line box drops the caps by 0.086em.
      The wordmark is IBM Plex Sans now — the same family the product already
      ships — and a Latin face centres its own caps, so the lift that corrected
      Zen Kaku would now push the type ABOVE the mark's ink centre.
    */
    baselineLift: "0em",
    /** font-size as a fraction of the mark box. */
    typeRatio: 38 / 78,
    /** gap as a fraction of the mark box. */
    gapRatio: 30 / 78,
    /*
      TITLE CASE, not caps, and tracked in rather than out.

      All-caps "1 MARTIAN WAY" at 0.02em was the Zen Kaku treatment: a display
      lockup, read once on a title card. In a 56px header it is read every
      page, next to lowercase nav links, and caps there read as a shout — the
      company's name should sit at the same volume as "Products".

      Title case also lets the name keep its shape: "1 Martian Way" has two
      ascenders and a descender-free baseline, and the eye recognises that
      silhouette faster than a caps rectangle.
    */
    tracking: "-0.01em",
    weight: 600,
    label: "1 Martian Way",
    labelShort: "1MW",
    /*
      THE BARE LOCKUP — mark without a tile, which is what the chrome wears.

      Its own ratios, because the tile lockup's cannot be reused: there `size`
      is the TILE, and the mark inside it is smaller than its field, so
      typeRatio 38/78 sizes type against a box that is mostly padding. Reusing
      it here rendered a 10px wordmark beside a 21px mark.

      15/21 and 9/21 are the mockup's nav, measured off it rather than
      re-derived — .nav .brand is font-size 15px, gap 9px, beside markSVG(21).
    */
    bare: { typeRatio: 15 / 21, gapRatio: 9 / 21 },
} as const;

/** Mark centred on its field and scaled by reach, so a circle never clips it. */
export const tileSvg = (
    { fill, ground, radius = 0, containment = CONTAINMENT }:
    { fill: string; ground: string; radius?: number; containment?: number }
) => {
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${VIEW} ${VIEW}" width="${VIEW}" height="${VIEW}">`
        + `<rect width="${VIEW}" height="${VIEW}"${radius ? ` rx="${radius}"` : ""} fill="${ground}"/>`
        + `${containedMark(fill, containment)}</svg>`;
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
    /*
      Wordmark: IBM Plex Sans 600.

      It was Zen Kaku Gothic New 700 — a Japanese foundry face chosen to echo
      the 八 mark without announcing it. That reasoning went with the mark. The
      company now runs one superfamily end to end (see layout.tsx), and holding
      an extra family for a single lockup is not a cost a wordmark earns.

      NOTE the baseline lift below is no longer needed for the same reason it
      existed: Plex Sans has Latin metrics, not a 1.448em CJK line box. It is
      kept at 0 rather than deleted so the lockup's three numbers stay one
      shape and a future face can set it again.
    */
    typeface: `var(--font-plex-sans), -apple-system, "Segoe UI", sans-serif`,
    typeWeight: 600,
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
