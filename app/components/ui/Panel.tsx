import type { ReactNode } from "react";

/**
 * A glass panel. Solid card in light, translucent + blurred in dark — see the
 * note in styles/utilities.css for why that is a composition change rather than
 * a token swap.
 */
export function Panel({
    label,
    children,
    className = "",
    id,
}: {
    /** Mono uppercase micro-heading with a rule running off to the right. */
    label?: string;
    children: ReactNode;
    className?: string;
    id?: string;
}) {
    return (
        <section id={id} className={`deck-card p-5 ${id ? "scroll-mt-20" : ""} ${className}`}>
            {label && (
                <p className="deck-label mb-3.5 flex items-center gap-2.5 after:h-px after:flex-1 after:bg-[var(--color-line)] after:content-['']">
                    {label}
                </p>
            )}
            {children}
        </section>
    );
}

/** Measured numbers, in a hairline grid. Mono + tabular so columns line up. */
export function Metrics({ items }: { items: readonly { value: string; label: string }[] }) {
    return (
        <ul className="border-line grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)] border bg-[var(--color-line)] sm:grid-cols-3">
            {items.map((m) => (
                <li key={m.label} className="bg-solid p-3.5">
                    <b className="text-data tabnum block font-mono font-semibold">{m.value}</b>
                    <span className="deck-label mt-1.5 block leading-snug">{m.label}</span>
                </li>
            ))}
        </ul>
    );
}

/** A quiet pull-quote with the product accent down its left edge. */
export function Quote({ children, className = "" }: { children: ReactNode; className?: string }) {
    return (
        <blockquote className={`border-blue border-l-2 pl-4 ${className}`}>{children}</blockquote>
    );
}

/**
 * The teaser shell for a product that has not launched.
 * A "coming shortly" page still has to be worth landing on.
 */
export function ComingSoon({ children }: { children: ReactNode }) {
    return (
        <div className="mx-auto grid max-w-[var(--container-page)] gap-3.5 p-3.5">{children}</div>
    );
}
