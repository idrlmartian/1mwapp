import Link from "next/link";
import { IDENTITY, markPaths, cutFor, SIGNAL_FILL } from "@/app/lib/brand";

/**
 * The 1 Martian Way mark — a standing figure: a circle head above two splayed
 * legs, forming an A-frame.
 *
 * Geometry is measured, not eyeballed: scripts/measure-logo.mjs derives it from
 * the founder's raster and verifies at 0.126% XOR mismatch. It now lives in
 * app/lib/brand.ts, which this file and scripts/generate-brand-assets.mjs both
 * import — previously each kept its own hand-synced copy, and a comment asking
 * people not to edit one of them was the only thing holding them together.
 *
 * THE SYMBOL IS THE BRAND. The white figure — a head above two splayed legs,
 * opening upward and outward — is the mark, and it stands for unlimited growth.
 * The red square behind it is a background, not part of the identity: it can be
 * any colour the surface calls for, and the mark can sit on no background at all.
 *
 * So `variant="mark"` is the primary form and inherits currentColor; `tile` is
 * the convenience wrapper for places that need a self-contained app icon.
 *
 * Rules:
 *   - Never distort the figure's proportions, and never rotate it — the upward
 *     opening is the whole point.
 *   - Clear space is 0.25x the width on every side.
 *   - Minimum 20px for `tile`, 16px for `mark`.
 *   - Never recolour the figure to an agent colour. Agent colours are data.
 */

/** @deprecated UI fill. The MARK is IDENTITY.mark (Kin); this is the CTA red. */
export const BRAND_RED = SIGNAL_FILL;

type LogoProps = {
    /**
     * `tile` = red square + white figure. THE DEFAULT, and what ships.
     *
     * The mark alone in red was tried and reverted: at 21px in a header the
     * figure is three thin strokes with nothing holding them together, so it
     * reads as a stray glyph rather than a logo. White inside red gives it a
     * field to sit on and that is what makes it legible at chrome sizes.
     *
     * `mark` = figure alone in currentColor. Still correct for a surface that
     * supplies its own ground and wants no second one — but it is the
     * exception, not the default.
     */
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
                <rect width="512" height="512" rx={radius || undefined} fill={IDENTITY.mark} />
            )}
            {/*
                Two cuts off one skeleton — swept terminals above 40px, flat
                below. A tapering stroke loses its tip first, so the display
                cut dissolves at favicon sizes while the UI cut holds.
                See app/lib/brand.ts for why the strokes are unequal.
            */}
            <g
                fill={variant === "tile" ? "#FFFFFF" : "currentColor"}
                dangerouslySetInnerHTML={{ __html: markPaths(cutFor(size)) }}
            />
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
