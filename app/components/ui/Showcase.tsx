import type { ReactNode } from "react";

/*
  The Showcase section pattern.

  Ported from the toowl site, which solves the same problem this page has: a
  reader who will not wade through four paragraphs to find the one claim they
  came for. /magy carried ~2,400 words of body copy and rendered zero images.

  The shape is: eyebrow → headline → ONE sub-paragraph → check bullets →
  receipts line, with a captioned visual beside it. The bullets are the win;
  three scannable claims replace three paragraphs saying the same thing.

  The receipts line is the part that fits this site specifically. The visual
  makes a claim and the line underneath says where it can be checked — the same
  posture /mos already takes with "the error bars are printed".
*/

/** Warm pill above the headline. Icon is optional but earns its place. */
export function Eyebrow({ children, icon }: { children: ReactNode; icon?: ReactNode }) {
    return (
        <p className="border-warm bg-warm-soft text-warm mb-3.5 inline-flex items-center gap-[7px] rounded-[var(--radius-capsule)] border py-[5px] pl-2.5 pr-3 font-mono text-[10px] font-bold uppercase tracking-[0.14em]">
            {icon}
            {children}
        </p>
    );
}

/*
  The tick is DRAWN, never typed. A "✓" glyph carries its own font metrics and
  sits low-left in its em box, which no amount of centring fixes.

  Coordinates: (7,12) → (10.5,15.5) → (17,8.5).
    · bbox x 7–17 and y 8.5–15.5, so both midpoints land on 12 — dead centre of
      the 24-unit viewBox, and at a 24px badge that is one unit per pixel.
    · the short arm is dx 3.5 / dy 3.5, exactly 45°, the angle that antialiases
      most evenly.
    · halves rather than thirds, so the stroke straddles a pixel boundary
      symmetrically instead of smearing across two.
  Round caps grow the painted edge by half the stroke on every side, which is
  symmetric, so none of it moves the centre.
*/
function Tick() {
    return (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M7 12 10.5 15.5 17 8.5" />
        </svg>
    );
}

export type Bullet = { title: string; body: ReactNode };

/** Check bullets — the scannability win over a wall of paragraphs. */
export function Bullets({ items, className = "" }: { items: readonly Bullet[]; className?: string }) {
    return (
        <ul className={`mt-5 grid gap-3.5 ${className}`}>
            {items.map((b) => (
                <li key={b.title} className="flex items-start gap-3">
                    <span className="check-badge grid place-items-center">
                        <Tick />
                    </span>
                    <span>
                        <b className="block text-[13.5px] font-bold tracking-[-0.01em]">{b.title}</b>
                        <span className="text-fg-muted mt-0.5 block text-[13px]">{b.body}</span>
                    </span>
                </li>
            ))}
        </ul>
    );
}

/**
 * Where the claim can be checked. Keep it specific — a file, a command, a
 * measurement. A receipts line that says "trust us" is worse than none.
 */
export function Receipts({ children }: { children: ReactNode }) {
    return (
        <p className="border-line text-fg-dim mt-5 border-t pt-3.5 text-[12.5px] italic">{children}</p>
    );
}

/**
 * A captioned visual.
 *
 * `state` is not decoration. "drawn" marks an illustration we authored, and is
 * only ever honest for UI surfaces — a terminal is rectangles and text, so SVG
 * reproduces it faithfully. "pending" marks a slot waiting on a real capture.
 * Nothing drawn may ever stand in for the 3D world: this page promises "a real
 * capture, driven live — no mockups", and a stylised office would be the first
 * thing on it that isn't true.
 */
export function Visual({
    children,
    caption,
    state = "drawn",
}: {
    children: ReactNode;
    caption: string;
    state?: "drawn" | "live" | "pending";
}) {
    const dot =
        state === "pending"
            ? "bg-warn"
            : state === "live"
              ? "bg-blue"
              : "bg-good";
    return (
        <div className="flex flex-col gap-3">
            <div className="border-line bg-sunk overflow-hidden rounded-[var(--radius-md)] border [&>svg]:block [&>svg]:h-auto [&>svg]:w-full">
                {children}
            </div>
            <p className="text-fg-dim flex items-center gap-2 text-[12px]">
                <i className={`size-1.5 shrink-0 rounded-full ${dot}`} />
                {caption}
            </p>
        </div>
    );
}

/**
 * Two columns: copy and visual. `flip` puts the visual first on wide screens,
 * so consecutive sections alternate instead of marching down one edge.
 */
export function Showcase({
    children,
    visual,
    flip = false,
}: {
    children: ReactNode;
    visual: ReactNode;
    flip?: boolean;
}) {
    return (
        <div className="grid items-start gap-6 lg:grid-cols-[0.95fr_1.05fr] lg:gap-9">
            <div className={flip ? "lg:order-2" : undefined}>{children}</div>
            <div className={flip ? "lg:order-1" : undefined}>{visual}</div>
        </div>
    );
}

/**
 * A capture slot that has not been shot yet.
 *
 * Deliberately reads as empty rather than being filled with something drawn.
 * An honest gap costs less than a fake.
 */
export function CaptureSlot({ children, ratio = "16/10" }: { children: ReactNode; ratio?: string }) {
    return (
        <div
            className="from-canvas-2 to-sunk grid place-items-center bg-gradient-to-br p-6 text-center"
            style={{ aspectRatio: ratio }}
        >
            <div>
                <span className="border-line-hi text-fg-dim mx-auto mb-3 grid size-10 place-items-center rounded-full border border-dashed">
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2}>
                        <rect x="3" y="5" width="18" height="14" rx="2" />
                        <circle cx="12" cy="12" r="3" />
                    </svg>
                </span>
                <p className="text-fg-dim mx-auto max-w-[34ch] text-[12.5px]">{children}</p>
            </div>
        </div>
    );
}
