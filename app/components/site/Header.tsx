"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Logo } from "@/app/components/brand/Logo";
import ThemeSwitch from "@/app/components/ui/ThemeSwitch";
import { NAV, ACCOUNT_HREF, ACCOUNT_ORIGIN } from "@/app/lib/constants";
import { navCtaClick } from "@/app/lib/analytics";

/*
  The company bar, ported from the site mockup.

  WHAT CHANGED, and why each was a mockup decision rather than a preference:

  · The nav links were a bordered capsule of pills with a blue active state.
    That treatment belongs to a segmented CONTROL — something you switch
    between — and site sections are not that. They are plain text now, with
    weight and ink carrying the current page, which is what the mockup draws
    and what every site whose nav is not a widget does.

  · The mark lost its tile. A sumi square is right on a dark ground or an app
    icon, where the mark needs a field of its own; in a light header the tile
    reads as a second logo sitting behind the first. Bare Kin strokes at 21px
    is the mockup's lockup, and it is why LOCKUP moved to title case.

  · The right-hand pair is the account, not a product. "Get toowl" pointed at
    another site from the company's own chrome — the one action available on
    every page led OFF it. The mockup's pair is Sign in / Create account,
    because the account is the thing that spans every product.

  The bar stays full-bleed so its rule spans the viewport; the ROW inside is
  constrained to --container-page, the same token the page content and the
  footer use, so the logo, the panels and the footer share one left edge.
*/
export default function Header() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const isActive = (href: string) =>
        href.startsWith("/") && (pathname === href || pathname.startsWith(href + "/"));

    /*
      Mockup: 14px, ink-2, and the current page in full ink at 500. No pill, no
      border, no background — the only difference between states is weight and
      colour, which is enough at this size and stops the bar from looking like
      a toolbar.
    */
    const link = (active: boolean) =>
        `text-[14px] transition-colors ${
            active ? "text-fg font-medium" : "text-fg-muted hover:text-fg"
        }`;

    /*
      SOLID PANEL, not glass. The mockup's bar is --panel over --bg: white on
      paper in light, #181b21 on #101216 in dark — so the bar sits ABOVE the
      page in both, and the hairline under it is a real edge rather than the
      point where a blur stops.

      bg-canvas/80 + backdrop-blur was right while the ground carried a
      gradient light source and panels were translucent. Both went when the
      grounds went flat, and a blurred bar over a flat ground is just the page
      colour with extra compositing.
    */
    return (
        <header className="border-line-hi bg-solid sticky top-0 z-60 border-b">
            <div className="mx-auto flex h-14 max-w-[var(--container-page)] items-center gap-[26px] px-[var(--container-pad)]">
                <Logo variant="mark" size={21} className="shrink-0" />

                <nav aria-label="Sections" className="hidden items-center gap-[22px] md:flex">
                    {NAV.map((item) =>
                        item.href.startsWith("/") ? (
                            <Link
                                key={item.href}
                                href={item.href}
                                aria-current={isActive(item.href) ? "page" : undefined}
                                className={link(isActive(item.href))}
                            >
                                {item.label}
                            </Link>
                        ) : (
                            <a key={item.href} href={item.href} className={link(false)}>
                                {item.label}
                            </a>
                        ),
                    )}
                </nav>

                <div className="ml-auto flex items-center gap-3">
                    <div className="hidden sm:block">
                        <ThemeSwitch />
                    </div>
                    {/*
                        Quiet, because it is the returning user's door and they
                        already know where it is. The new visitor's door is the
                        filled one beside it — the only signal-coloured thing in
                        the bar, on every route.
                    */}
                    {/*
                        Plain anchors, not next/link. These cross to another
                        origin (id.1martianway.com), and next/link prefetches
                        and client-routes — neither of which works across
                        origins, and the prefetch would fire a pointless
                        cross-origin request on hover for every visitor.
                    */}
                    {/*
                        BOTH STATES ARE RENDERED; CSS PICKS ONE.

                        This site cannot see the session — id.1martianway.com is
                        a different origin — so a pre-paint probe in layout.tsx
                        stamps data-account from a credential-free hint cookie
                        and utilities.css hides the wrong half. That keeps every
                        page statically generated and shows no flicker, neither
                        of which an effect-based swap manages.
                    */}
                    <a
                        href={ACCOUNT_HREF}
                        className="when-signed-out text-fg-muted hover:text-fg hidden text-[13.5px] transition-colors sm:block"
                    >
                        Sign in
                    </a>
                    <a
                        href={ACCOUNT_HREF}
                        onClick={() => navCtaClick(pathname)}
                        className="when-signed-out bg-red hover:bg-red-hover text-on-red shadow-[var(--shadow-cta)] inline-flex items-center rounded-[7px] px-3.5 py-2 text-[13px] font-medium transition-colors"
                    >
                        Create account
                    </a>
                    {/*
                        Signed in: ONE control, and quiet. Someone with an
                        account does not need to be sold a door they are already
                        through — the loud filled button here would be a second
                        thing competing with whatever the page is actually for.
                    */}
                    <a
                        href={ACCOUNT_ORIGIN}
                        className="when-signed-in border-line hover:bg-sunk inline-flex items-center gap-2 rounded-[7px] border px-3.5 py-2 text-[13px] font-medium transition-colors"
                    >
                        <svg viewBox="0 0 24 24" className="size-3.5" fill="none" stroke="currentColor" strokeWidth={1.8} aria-hidden>
                            <circle cx="12" cy="8" r="3.5" />
                            <path d="M4.5 20a7.5 7.5 0 0 1 15 0" />
                        </svg>
                        Account
                    </a>
                    <button
                        type="button"
                        onClick={() => setOpen((v) => !v)}
                        aria-expanded={open}
                        aria-label="Menu"
                        className="border-line text-fg-muted grid size-9 place-items-center rounded-[7px] border md:hidden"
                    >
                        <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2}>
                            {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
                        </svg>
                    </button>
                </div>
            </div>

            {/* Stays a direct child of <header>, outside the constrained row:
                inset-x-0 has to span the viewport so the sheet's edges meet the
                bar's. Mobile-only, so the container width never applies. */}
            {open && (
                <div className="border-line bg-canvas absolute inset-x-0 top-14 border-b p-3.5 md:hidden">
                    <nav className="flex flex-col gap-1">
                        {NAV.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`rounded-[var(--radius-md)] px-3 py-2.5 text-sm ${
                                    isActive(item.href) ? "text-fg bg-sunk font-semibold" : "text-fg-muted"
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                        <a
                            href={ACCOUNT_HREF}
                            onClick={() => setOpen(false)}
                            className="when-signed-out text-fg-muted rounded-[var(--radius-md)] px-3 py-2.5 text-sm"
                        >
                            Sign in
                        </a>
                        <a
                            href={ACCOUNT_ORIGIN}
                            onClick={() => setOpen(false)}
                            className="when-signed-in text-fg rounded-[var(--radius-md)] px-3 py-2.5 text-sm font-semibold"
                        >
                            Your account
                        </a>
                    </nav>
                    <div className="mt-3 sm:hidden">
                        <ThemeSwitch />
                    </div>
                </div>
            )}
        </header>
    );
}
