/*
  THE single source of the 1 Martian Way mark: its geometry, its palette, and
  the scales derived from both.

  Before this file the geometry lived in TWO hand-kept copies — one in
  app/components/brand/Logo.tsx, one in scripts/generate-brand-assets.mjs — and
  the red lived in six. Logo.tsx's own header instructed the reader to "change
  it there and re-run, never by hand-editing paths here", which is a convention
  asking to be broken rather than a mechanism. Both now import from here.

  scripts/generate-brand-assets.mjs is a .mjs that imports this .ts, so it must
  be run with `bun`, not `node`. Bun resolves TypeScript natively; that is the
  whole reason the script can share this file instead of copying it.
*/

// ── palette ─────────────────────────────────────────────────────────────────
/*
  Six full-saturation hues, one default.

  The previous single #D22222 was replaced because it read dull at every size:
  it sits at 3.60:1 on the dark ground, under the 4.5:1 that text needs, and a
  colour can only reach 4.5:1 on WHITE by being dark — which is what made every
  attempt to brighten it in place fail. The fix was to stop pinning the brand
  colour to a body-text threshold it never had to meet. A mark needs 3:1.

  Every hue below is at 100% saturation and clears 3:1 on white AND on #1A1A1A,
  so there is no light/dark pair to keep in sync — one colour per context.

  `deep` is the reserve stop for the rare case of small red text on white; it is
  not a second brand colour and should not appear on a fill.
*/
export type BrandColour = {
    id: string;
    name: string;
    hex: string;
    hue: string;
    deep: string;
    use: string;
};

export const PALETTE: BrandColour[] = [
    {
        id: "signal",
        name: "Signal",
        hex: "#FF0033",
        hue: "348",
        deep: "#A30020",
        use: "Default. Product, CTAs, the mark everywhere unless a context says otherwise.",
    },
    {
        id: "ruby",
        name: "Ruby",
        hex: "#FF0A54",
        hue: "340",
        deep: "#A30435",
        use: "Warmer, softer register — community surfaces, Discord, lifestyle photography.",
    },
    {
        id: "magenta",
        name: "Magenta",
        hex: "#FF0090",
        hue: "326",
        deep: "#A3005C",
        use: "High-attention moments. Launches, announcements, event collateral.",
    },
    {
        id: "scarlet",
        name: "Scarlet",
        hex: "#FF2600",
        hue: "6",
        deep: "#A81800",
        use: "The Mars register. Hardware, robotics, anything trading on the iron-oxide story.",
    },
    {
        id: "ember",
        name: "Ember",
        hex: "#FF6A00",
        hue: "25",
        deep: "#A84300",
        use: "Warm accent beside Signal. Charts, highlights, secondary CTAs.",
    },
    {
        id: "plasma",
        name: "Plasma",
        hex: "#7C3AED",
        hue: "258",
        deep: "#4C1D95",
        use: "The cool counterweight. AI and software surfaces where red would over-signal.",
    },
];

export const SIGNAL = "#FF0033";
export const SIGNAL_DEEP = "#A30020";

/*
  Signal at the lightness where WHITE TEXT ON IT still clears AA.

  Same hue (348), same full saturation, L 42% instead of 50%. It exists because
  a mark and a button are held to different thresholds, and this codebase had
  already discovered that — see the note beside --c-red-ink in base.css:

      "The button is white-on-red and passes in both themes (5.41 / 5.26)."

  A logo is a graphic and needs 3:1, which Signal clears at 3.96. A button is
  white text on a fill and needs 4.5, which Signal does not. Dropping #FF0033
  straight into --c-red would have quietly regressed the primary CTA in both
  themes. This lands at 5.39 — within a rounding error of the 5.41 it replaces.

  So: SIGNAL paints the mark, SIGNAL_FILL paints anything carrying white text.
  They are the same colour to the eye and differ only where the maths forces it.
*/
export const SIGNAL_FILL = "#D6002B";

/**
 * The default brand fill.
 *
 * Kept under the old name so every existing import keeps working; the value is
 * now Signal rather than #D22222.
 */
export const BRAND_RED = SIGNAL;

export const colour = (id: string): string =>
    PALETTE.find((p) => p.id === id)?.hex ?? SIGNAL;

// ── geometry ────────────────────────────────────────────────────────────────
/*
  Canonical, 512 viewBox. Measured from the founder's raster by
  scripts/measure-logo.mjs and verified at 0.126% XOR mismatch against the
  source mask. Do not hand-edit these numbers — re-run the measure script.
*/
export const VIEW = 512;
export const CROP = VIEW / 2; // radius of the circle a platform crops to

export const CIRCLE = { cx: 256, cy: 165, r: 43.2 };
export const LEG_L = "M218.4 210.2 L245.2 243.9 L167.4 389.5 L123.8 389.5 Z";
export const LEG_R = "M293.6 210.2 L266.8 243.9 L344.6 389.5 L388.2 389.5 Z";

/** The leg vertices, as points, for the reach solve below. */
const LEG_VERTS: ReadonlyArray<readonly [number, number]> = [
    [218.4, 210.2], [245.2, 243.9], [167.4, 389.5], [123.8, 389.5],
    [293.6, 210.2], [266.8, 243.9], [344.6, 389.5], [388.2, 389.5],
];

/*
  AREA centroid — not the bounding-box centre, and the difference is the whole
  point of this constant.

    head   π·43.2²    =  5 863  @ y 165
    legs   2 × 7 171  = 14 342  @ y 308.3   (shoelace)
    ȳ = (5863·165 + 14342·308.3) / 20205    = 266.7

  The bbox centre is 255.65, so the mark is 11.05 units bottom-heavy: two large
  filled legs against one small head. Scaling about the bbox centre — which is
  what this codebase did — leaves the figure sitting visibly low the moment a
  platform crops it to a circle.
*/
export const CENTROID = { x: 256, y: 266.7 };

/**
 * How far the mark reaches from the tile centre at scale `k`, when scaled about
 * the area centroid with that centroid placed on the tile centre.
 *
 * Reach, not bounding box. A bounding box understates a pointed shape: the
 * corners of the box are empty, while the outer leg vertices are real ink and
 * are what a circular crop actually cuts.
 */
export function maxReach(k: number): number {
    const mid = VIEW / 2;
    let m = 0;
    for (const [px, py] of LEG_VERTS) {
        const x = mid + k * (px - CENTROID.x);
        const y = mid + k * (py - CENTROID.y);
        m = Math.max(m, Math.hypot(x - mid, y - mid));
    }
    // The head is a circle, so its farthest point is its centre plus its radius.
    const hx = mid + k * (CIRCLE.cx - CENTROID.x);
    const hy = mid + k * (CIRCLE.cy - CENTROID.y);
    m = Math.max(m, Math.hypot(hx - mid, hy - mid) + CIRCLE.r * k);
    return m;
}

/** Scale at which the mark reaches `fraction` of the crop radius. */
export function scaleForContainment(fraction: number): number {
    return (fraction * CROP) / maxReach(1); // reach is linear in k
}

/*
  Containment targets, chosen by eye against the live fit tool and then fixed
  here as numbers.

  avatar   0.77 — every social surface crops to a circle, and the old scale left
                  the outer leg corners at 238 of 256, which read as touching.
  maskable 0.72 — Android masks to its own shape and guarantees only the central
                  80% (a circle of radius 0.40·512). 0.72 leaves margin inside
                  that. The previous 0.78 scale reached only 57% of the crop
                  radius, wasting a fifth of the icon's linear extent.
*/
export const CONTAINMENT = { avatar: 0.77, maskable: 0.72 } as const;

export const SCALE = {
    /** As drawn. The full-bleed lockup tile, where nothing is cropped. */
    full: 1,
    /** Favicons, app icons, every circular avatar. */
    avatar: scaleForContainment(CONTAINMENT.avatar),
    /** Android maskable only. */
    maskable: scaleForContainment(CONTAINMENT.maskable),
} as const;

/**
 * The transform that scales about the area centroid and lands that centroid on
 * the tile centre. This is what makes the mark look centred rather than merely
 * be centred.
 */
export function markTransform(k: number): string {
    const mid = VIEW / 2;
    return `translate(${(mid - k * CENTROID.x).toFixed(2)} ${(mid - k * CENTROID.y).toFixed(2)}) scale(${k.toFixed(4)})`;
}
