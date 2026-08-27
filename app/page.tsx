import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/app/components/StructuredData";
import { Panel } from "@/app/components/ui/Panel";
import { COMPANY, HOME_PRODUCTS, HOME_ERAS } from "@/app/lib/constants";

/*
  THE COMPANY HUB — built, and deliberately not yet served.

  `/` currently 307s to `/toowl` (next.config.js, founder's call 2026-08-26)
  and that is the CORRECT call while it stands: Magy and MOS are held back
  until the patent filings are settled, which leaves exactly one shippable
  product, and a company page listing one product is weaker than that
  product's own page. This file is what `/` becomes on filing day, when there
  are four things to point at and a hub is obviously right.

  Flipping it is two edits, both already marked: uncomment the held entries in
  HOME_PRODUCTS (and their siblings in NAV, Footer, routes.ts and about), and
  delete the two `/` redirects in next.config.js. Nothing here needs rewriting
  for that to happen — the page renders whatever HOME_PRODUCTS contains, so it
  is honest at one product and honest at four.

  WHAT THIS PAGE MAY NOT DO, until those filings are in: name Magy or MOS, or
  describe anything either of them does. Not in copy, not in a comment that
  ships, not in metadata. The whole patent hold rests on matter not being
  "made available to the public", and a page nobody visits is still public if
  it answers 200.
*/

export const metadata: Metadata = {
    title: "1 Martian Way — we build machines that do the work",
    description:
        "1 Martian Way Industries builds developer tools and agent software in Mumbai. We make toowl, a GPU-accelerated terminal with Claude built in.",
    alternates: { canonical: "https://www.1martianway.com/" },
};

export default function HomePage() {
    return (
        <div className="mx-auto grid max-w-[var(--container-page)] gap-3.5 px-[var(--container-pad)] py-3.5">
            <StructuredData type="Organization" />

            {/*
                The thesis, in the display face. One sentence about what the
                company does, and nothing about how anything decides — the
                five-family rule binds this page the same as the film.
            */}
            <section className="pt-14 pb-10 sm:pt-20 sm:pb-14">
                <p className="deck-label mb-5">Developer tools · agent software · robotics</p>
                <h1 className="font-display max-w-[15ch] text-[clamp(2.1rem,6vw,3.75rem)] leading-[1.04] font-light tracking-[-0.028em] text-balance">
                    We build machines that{" "}
                    <em className="font-semibold not-italic">do the work</em>.
                </h1>
                <p className="text-fg-muted mt-5 max-w-[52ch] text-[17px] leading-[1.62]">
                    {COMPANY.legal} is a Mumbai company. We are small, we ship, and we publish
                    the numbers behind what we claim — which is why the ones on this site are
                    measured rather than rounded up.
                </p>
                <div className="mt-7 flex flex-wrap gap-2.5">
                    <Link
                        href="/toowl"
                        className="bg-red hover:bg-red-hover shadow-[var(--shadow-cta)] inline-flex items-center gap-2 rounded-[var(--radius-md)] px-5 py-3 text-sm font-bold text-on-red transition-colors"
                    >
                        Get toowl &mdash; free
                    </Link>
                    <Link
                        href="/about"
                        className="border-line hover:bg-sunk inline-flex items-center gap-2 rounded-[var(--radius-md)] border px-5 py-3 text-sm font-semibold transition-colors"
                    >
                        What we&rsquo;re building
                    </Link>
                </div>
            </section>

            {/*
                Products as a rhythm of equal columns, not cards with shadows.
                They are siblings and the layout should say so. Each owns one
                colour, and it appears twice: the identifying dot, and that
                product's own link. Nothing else on the row is coloured.
            */}
            <section id="products" aria-labelledby="products-h" className="mb-12 scroll-mt-20">
                <h2 id="products-h" className="sr-only">
                    What we make
                </h2>
                {/*
                    `auto-fit` and not a fixed column count: with Magy and MOS
                    held back this list is ONE item, and a two-column grid would
                    leave a dead cell beside it. It becomes two columns at two
                    products and four at four, without this file knowing how
                    many there are.
                */}
                <ul
                    className="border-line grid gap-px overflow-hidden rounded-[var(--radius-md)] border bg-[var(--color-line)]"
                    style={{ gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 20rem), 1fr))" }}
                >
                    {HOME_PRODUCTS.map((p) => (
                        <li key={p.name} className="bg-solid p-5">
                            <div className="mb-2.5 flex items-center gap-2.5">
                                <span
                                    aria-hidden
                                    className="size-2.5 shrink-0 rounded-full"
                                    style={{ background: p.accent }}
                                />
                                <span className="text-[15.5px] font-semibold tracking-[-0.01em]">
                                    {p.name}
                                </span>
                                <span className="deck-label ml-auto">{p.state}</span>
                            </div>
                            <p className="text-fg-muted text-[13.5px] leading-[1.55]">{p.line}</p>
                            <Link
                                href={p.href}
                                className="mt-3.5 inline-block text-[13px] font-medium"
                                style={{ color: p.accent }}
                            >
                                {p.cta} &rarr;
                            </Link>
                        </li>
                    ))}
                </ul>
            </section>

            {/*
                The arc, told straight — the same reasoning /about already
                carries: a company that shipped in four domains over a decade is
                more investable than one claiming a straight line.
            */}
            <Panel label="Where we came from" className="mb-12">
                <ul className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                    {HOME_ERAS.map(([era, line]) => (
                        <li key={era}>
                            <b className="block text-[14px] font-semibold">{era}</b>
                            <span className="text-fg-muted text-[13.5px] leading-[1.55]">
                                {line}
                            </span>
                        </li>
                    ))}
                </ul>
            </Panel>

            <section className="mb-16">
                <h2 className="font-display text-[clamp(1.4rem,3vw,2rem)] leading-[1.12] font-light tracking-[-0.022em]">
                    Registered in Mumbai, shipping from it.
                </h2>
                <p className="text-fg-muted mt-3.5 max-w-[56ch] text-[15px]">
                    {COMPANY.legal} &middot; CIN {COMPANY.cin}. Press, licensing and
                    contact are one click away in the footer, and a person reads every
                    message that arrives.
                </p>
            </section>
        </div>
    );
}
