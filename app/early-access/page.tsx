import type { Metadata } from "next";
import Link from "next/link";
import WaitlistForm from "@/app/components/WaitlistForm";
import { LogoGlyph } from "@/app/components/brand/Logo";
import { COMPANY, TOOWL_URL } from "@/app/lib/constants";

/*
  THE ACCOUNT DOOR — one email field, and deliberately nothing else.

  It exists because of a measured result: the waitlist table held ZERO rows,
  and the reason was not the plumbing (verified end to end) but that no
  reachable page carried a form. /magy and /mos have three between them and
  both 404 under the patent hold; toowl's was removed when it shipped. The
  header's "Create account" needed somewhere real to land, and this is it.

  WHAT THIS PAGE MAY NOT DO, until the filings are in: name Magy or MOS, or
  describe anything either of them does — the hold rests on matter not being
  "made available to the public", and a page nobody visits is still public if
  it answers 200. So the copy is about the ACCOUNT, which is honest, already
  decided, and gives nothing away. `product` on the form is a database column,
  not a page: it routes the row, it does not appear in the markup.

  When 1MW ID lands (plan Phase 1) this page becomes the real create-account
  screen — Google, Apple, GitHub, IDRL, magic link — and the email box stays as
  the low-friction door beside them. ACCOUNT_HREF already points here, so that
  is a change to this file and to nothing else.
*/

export const metadata: Metadata = {
    title: "Early access — 1 Martian Way",
    description:
        "One 1 Martian Way account for everything we build. Join the early-access list and we will write when your turn comes up.",
    alternates: { canonical: "https://www.1martianway.com/early-access" },
};

export default function EarlyAccessPage() {
    return (
        <div className="mx-auto grid max-w-[var(--container-page)] px-[var(--container-pad)] py-3.5">
            <section className="mx-auto w-full max-w-[27rem] pt-16 pb-24 sm:pt-24">
                {/*
                    THE TILE, and this is the one page on the site that gets it.

                    "One lockup everywhere" is a rule about CHROME — the header
                    and the footer, where the mark is a label on a page about
                    something else and a sumi square would read as a black box
                    with a logo trapped in it. Here the mark is not labelling
                    the page, it IS the page: nothing else above the fold is
                    branded, and a bare pair of strokes floating over paper at
                    this size reads as a stray glyph rather than a company.
                    Same reason a favicon and an app icon keep the tile.

                    Kin on Sumi is also the identity as the manual states it —
                    gold on ink-black — and this is the only surface with room
                    to show it that way.
                */}
                <LogoGlyph size={40} radius={11} className="mb-6" title="1 Martian Way" />

                <h1 className="font-display text-[clamp(1.75rem,4vw,2.25rem)] leading-[1.1] font-light tracking-[-0.025em] text-balance">
                    One account for{" "}
                    <em className="font-semibold not-italic">everything we build</em>.
                </h1>
                <p className="text-fg-muted mt-4 text-[15px] leading-[1.62]">
                    We are opening access in stages. Leave your address and we will write when
                    your turn comes up — no queue to refresh, no announcement to catch.
                </p>

                <WaitlistForm
                    className="mt-7"
                    source="early-access"
                    size="hero"
                    cta="Request early access"
                    autoFocus
                />

                {/*
                    The one product that is already free and needs no account at
                    all. Saying so here costs a click and buys the page its
                    credibility: a waitlist that admits what you can have right
                    now reads differently from one that does not.
                */}
                <div className="border-line mt-9 border-t pt-6">
                    <p className="text-fg-muted text-[13.5px] leading-[1.6]">
                        <b className="text-fg font-semibold">Want something today?</b>{" "}
                        <Link href="/toowl" className="text-red font-medium">
                            toowl
                        </Link>{" "}
                        is free, shipped and needs no account — macOS, Linux and Windows.
                    </p>
                    <p className="text-fg-dim mt-3 font-mono text-[11.5px]">
                        <code>$ curl -fsSL {TOOWL_URL}/install.sh | sh</code>
                    </p>
                </div>

                <p className="text-fg-dim mt-7 text-[12px] leading-[1.6]">
                    {COMPANY.legal} · your address is used to write to you about early access and
                    nothing else. Details in the{" "}
                    <Link href="/privacy" className="underline underline-offset-2">
                        privacy policy
                    </Link>
                    .
                </p>
            </section>
        </div>
    );
}
