import type { Metadata } from "next";
import Link from "next/link";
import { Panel } from "@/app/components/ui/Panel";
import { COMPANY } from "@/app/lib/constants";

/*
  Rebuilt on the design system (2026-08-26). The previous version predated it
  and was the only page on the site that looked like a different product:

    · `text-white` hardcoded on the h1 and the intro. The site has a light
      theme, so on a light background the entire header rendered white on
      near-white and was effectively invisible -- which is how this was
      spotted.
    · Tailwind-default card chrome (`rounded-2xl … ring-1 ring-gray-900/5`)
      and `dark:` variants, where every other page uses Panel and the token
      colours that already answer to the theme switch.
    · Its own container (`max-w-7xl px-6 lg:px-8`) rather than the shared
      --container-page / --container-pad, so it did not line up with the
      header or the footer.
    · A hardcoded copy of the registered address, and an @radix-ui icon set
      no current page uses. The address now comes from COMPANY, so it cannot
      drift from the footer's.

  Also fixed while here: a <MobileIcon /> row with no phone number beside it,
  which rendered as an icon floating against empty space.
*/

export const metadata: Metadata = {
    alternates: { canonical: "https://www.1martianway.com/licensing" },
    title: "Licensing & partnerships",
    description:
        "License 1 Martian Way's robotics, humanoid and AI software technology, distribute our products, or build with us. Talk to us about what you have in mind.",
};

const OPPORTUNITIES = [
    {
        name: "Technology licensing",
        line: "Use our robotics and humanoid platforms, Martian OS, and the AI software around them inside your own products.",
    },
    {
        name: "Distribution partnerships",
        line: "Become an authorised distributor of our products and solutions in your region.",
    },
    {
        name: "Strategic alliances",
        line: "Build with us — joint development, and reaching markets neither of us reaches alone.",
    },
];

export default function LicensingPage() {
    return (
        <div className="mx-auto grid max-w-[var(--container-page)] gap-3.5 px-[var(--container-pad)] py-3.5">
            <Panel>
                <p className="deck-label mb-3">Licensing</p>
                <h1 className="text-hero mb-4 max-w-[20ch]">
                    Licensing &amp; <em className="font-semibold not-italic">partnerships</em>.
                </h1>
                <p className="text-fg-muted max-w-[64ch] text-[14.5px]">
                    We license what we build, and we work with people who want to take it
                    somewhere we would not get to on our own. If one of these is close to what
                    you had in mind, tell us the rest.
                </p>
            </Panel>

            <Panel label="Available opportunities">
                <ul className="grid gap-3 sm:grid-cols-3">
                    {OPPORTUNITIES.map((o) => (
                        <li key={o.name}>
                            <div className="border-line bg-sunk h-full rounded-[var(--radius-md)] border p-4">
                                <b className="text-[15px] font-extrabold">{o.name}</b>
                                <p className="text-fg-muted mt-2 text-[13px]">{o.line}</p>
                            </div>
                        </li>
                    ))}
                </ul>
            </Panel>

            <Panel label="Get started">
                <p className="text-fg-muted max-w-[64ch] text-[14.5px]">
                    Write to us with what you are building and which of the above fits. We
                    usually reply the same day.
                </p>

                <div className="mt-5 grid gap-3.5 sm:grid-cols-2">
                    <div>
                        <p className="deck-label mb-2">Registered office</p>
                        <address className="text-fg-muted text-[13px] not-italic leading-relaxed">
                            {COMPANY.address.map((l) => (
                                <span key={l} className="block">
                                    {l}
                                </span>
                            ))}
                        </address>
                    </div>

                    <div>
                        <p className="deck-label mb-2">Contact</p>
                        <a
                            href={`mailto:${COMPANY.email}`}
                            className="text-red inline-block text-[13.5px] hover:underline"
                        >
                            {COMPANY.email}
                        </a>
                        <p className="text-fg-dim mt-1 text-[12.5px]">CIN {COMPANY.cin}</p>
                    </div>
                </div>

                <Link
                    href="/contact"
                    className="bg-red hover:bg-red-hover shadow-[var(--shadow-cta)] mt-6 inline-flex items-center gap-2 rounded-[9px] px-4 py-2.5 text-[13px] font-bold text-on-red transition-colors"
                >
                    Contact us <span aria-hidden="true">→</span>
                </Link>
            </Panel>
        </div>
    );
}
