import Link from "next/link";
import { IDENTITY, LOCKUP, VIEW, containedMark, SIGNAL_FILL } from "@/app/lib/brand";

/**
 * The 1 Martian Way mark — 八, two unequal strokes that widen as they descend
 * and never meet.
 *
 * 八 does not mean eight. In 八百万の神 it means COUNTLESS; in 八方 it means
 * EVERYWHERE. The strokes diverge from a gap of 11 units to roughly 103 and
 * terminate without enclosing anything, because a ring would close the one
 * thing the character exists to say. Geometry and rationale: app/lib/brand.ts.
 *
 * THE MARK IS KIN ON SUMI — gold on ink-black. Not white on gold. A previous
 * version of this file filled the tile's *background* with `IDENTITY.mark` and
 * drew the figure white, which inverted the identity; it also dropped
 * `markPaths()` (authored in a 200-unit space) into a 512 viewBox, so the mark
 * rendered at 38% scale anchored to the top-left corner. Both are why every
 * field here is derived from brand.ts rather than written out by hand.
 *
 * Rules:
 *   - Never equalise the strokes — the asymmetry is what stops it reading as a
 *     ribbon. Never rotate it; the widening reads as growth only while it
 *     descends. Never enclose it, and never add a head.
 *   - Containment is by REACH, not bounding box: `containedMark` scales so the
 *     farthest point sits at 74% of the crop radius, so a circular avatar
 *     cannot clip the long right stroke.
 *   - Minimum 12px. One cut at every size — a flat-terminal variant was
 *     measured and dropped (identical ink at 12px, blunted character).
 */

/** @deprecated UI fill. The MARK is IDENTITY.mark (Kin); this is the CTA red. */
export const BRAND_RED = SIGNAL_FILL;

type LogoProps = {
    /**
     * `tile` = sumi square + kin mark. THE DEFAULT, and what ships.
     *
     * The mark alone needs a ground at chrome sizes: at 21px in a header two
     * tapering strokes with nothing behind them read as a stray glyph rather
     * than a logo. The tile gives them a field.
     *
     * `mark` = strokes alone in currentColor, for a surface that already
     * supplies its own ground and wants no second one.
     */
    variant?: "tile" | "mark";
    /** Rendered height in px. */
    size?: number;
    /** Corner radius, in view-box units (0-100). */
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
            viewBox={`0 0 ${VIEW} ${VIEW}`}
            width={size}
            height={size}
            className={className}
            role={labelled ? "img" : undefined}
            aria-label={labelled ? title : undefined}
            aria-hidden={labelled ? undefined : true}
            focusable="false"
        >
            {variant === "tile" && (
                <rect
                    width={VIEW}
                    height={VIEW}
                    rx={radius || undefined}
                    fill={IDENTITY.ground}
                />
            )}
            <g
                dangerouslySetInnerHTML={{
                    __html: containedMark(
                        variant === "tile" ? IDENTITY.mark : "currentColor",
                    ),
                }}
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

/**
 * Glyph + wordmark. The three numbers below are the lockup and they scale
 * together — see LOCKUP in app/lib/brand.ts for why the type is lifted.
 */
export function Logo({
    variant = "tile",
    size = 32,
    radius = 24,
    wordmark = "full",
    href = "/",
    className,
}: LockupProps) {
    const label = wordmark === "short" ? "1MW" : "1 MARTIAN WAY";

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
                    className="font-wordmark whitespace-nowrap"
                    style={{
                        fontSize: size * LOCKUP.typeRatio,
                        fontWeight: LOCKUP.weight,
                        letterSpacing: LOCKUP.tracking,
                        lineHeight: 1,
                        transform: `translateY(${LOCKUP.baselineLift})`,
                    }}
                >
                    {label}
                </span>
            )}
        </>
    );

    const cls = `inline-flex items-center ${className ?? ""}`;
    const style = { gap: size * LOCKUP.gapRatio };

    if (href === null)
        return (
            <span className={cls} style={style}>
                {inner}
            </span>
        );
    return (
        <Link
            href={href}
            className={`${cls} transition-opacity hover:opacity-80`}
            style={style}
        >
            {inner}
        </Link>
    );
}

export default Logo;
