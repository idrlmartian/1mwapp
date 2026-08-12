import Link from "next/link";

/**
 * The 1 Martian Way mark — a standing figure: a circle head above two splayed
 * legs, forming an A-frame.
 *
 * Geometry is measured, not eyeballed: scripts/measure-logo.mjs derives it from
 * the founder's raster and verifies at 0.126% XOR mismatch. The same numbers
 * generate every raster in scripts/generate-brand-assets.mjs — if the mark ever
 * changes, change it there and re-run, never by hand-editing paths here.
 *
 * Rules:
 *   - Clear space is 0.25x the tile width on every side.
 *   - Minimum 20px for `tile`, 16px for `mark`.
 *   - Never place the red tile on a red surface — use variant="mark" in white.
 *   - Never recolour the figure to an agent colour. Agent colours are data.
 */

export const BRAND_RED = "#D22222";

const CIRCLE = { cx: 256, cy: 165, r: 43.2 };
const LEG_L = "M218.4 210.2 L245.2 243.9 L167.4 389.5 L123.8 389.5 Z";
const LEG_R = "M293.6 210.2 L266.8 243.9 L344.6 389.5 L388.2 389.5 Z";

type LogoProps = {
    /** `tile` = red square + white figure. `mark` = figure alone in currentColor. */
    variant?: "tile" | "mark";
    /** Rendered height in px. */
    size?: number;
    /** Corner radius on the tile, in tile-space units (0-256). */
    radius?: number;
    /** Accessible name. Omit to mark the SVG decorative. */
    title?: string;
    className?: string;
};

export function LogoGlyph({
    variant = "tile",
    size = 32,
    radius = 0,
    title,
    className,
}: LogoProps) {
    const labelled = Boolean(title);
    return (
        <svg
            viewBox="0 0 512 512"
            width={size}
            height={size}
            className={className}
            role={labelled ? "img" : undefined}
            aria-label={labelled ? title : undefined}
            aria-hidden={labelled ? undefined : true}
            focusable="false"
        >
            {variant === "tile" && (
                <rect width="512" height="512" rx={radius || undefined} fill={BRAND_RED} />
            )}
            <g fill={variant === "tile" ? "#FFFFFF" : "currentColor"}>
                <circle cx={CIRCLE.cx} cy={CIRCLE.cy} r={CIRCLE.r} />
                <path d={LEG_L} />
                <path d={LEG_R} />
            </g>
        </svg>
    );
}

type LockupProps = LogoProps & {
    /** Wordmark treatment beside the glyph. */
    wordmark?: "full" | "short" | "none";
    /** Wrap the lockup in a link to `href`. Pass null for a bare lockup. */
    href?: string | null;
};

/** Glyph + wordmark, optionally linked. This is what the header and footer use. */
export function Logo({
    variant = "tile",
    size = 32,
    radius = 6,
    wordmark = "full",
    href = "/",
    className,
}: LockupProps) {
    const label = wordmark === "short" ? "1MW" : "1 Martian Way";

    const inner = (
        <>
            <LogoGlyph
                variant={variant}
                size={size}
                radius={radius}
                title={wordmark === "none" ? "1 Martian Way" : undefined}
            />
            {wordmark !== "none" && (
                <span
                    className="font-display font-semibold tracking-tight text-fg"
                    style={{ fontSize: size * 0.55 }}
                >
                    {label}
                </span>
            )}
        </>
    );

    const cls = `inline-flex items-center gap-2.5 ${className ?? ""}`;

    if (href === null) return <span className={cls}>{inner}</span>;
    return (
        <Link href={href} className={`${cls} transition-opacity hover:opacity-80`}>
            {inner}
        </Link>
    );
}

export default Logo;
