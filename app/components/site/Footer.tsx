import Link from "next/link";
import { LogoGlyph } from "@/app/components/brand/Logo";
import { COMPANY } from "@/app/lib/constants";

/*
  A real company footer.

  The previous one carried four fabricated stat tiles (24/7, 99.9%, <1ms, ∞),
  three links that all pointed at /contact, a "Careers" link that was a lie, and
  three href="#" socials. Invented metrics sitting next to the measured Magy
  numbers devalue the measured ones, so they are gone.

  Social URLs are real (wired in f847613) and the CIN is now carried in the
  legal line, per Companies Act 2013 s.12(3)(c).
*/

const PRODUCTS = [
    { href: "/magy", label: "Magy" },
    { href: "/mos", label: "MOS — robotics simulation" },
    { href: "/toowl", label: "Toowl — terminal" },
    /*
      Two entries are deliberately unlisted, both unlinked sitewide and
      noindex'd, both restorable by putting the line back:

        /martianos — states <1μs latency, 1000Hz sustained, 100% memory safety
          and zero overhead as ACHIEVED specifications, while the mos-hal,
          mos-rtos and mos-kernel crates are stubs and no physical hardware has
          ever run it. Unverifiable claims sitting next to Magy's measured
          numbers devalue the measured ones, which are the numbers that matter.
        /products — the humanoid line isn't ready to be shown.
    */
];

const COMPANY_LINKS: { href: string; label: string; external?: boolean }[] = [
    { href: "/about", label: "About" },
    { href: "/press", label: "Press & media" },
    { href: "/licensing", label: "Licensing & partnerships" },
    { href: "https://droneracingindia.com", label: "IDRL ↗", external: true },
    { href: "/contact", label: "Contact" },
];

const SOCIALS = [
    {
        label: "Facebook",
        href: "https://facebook.com/1martianway",
        path: "M24 12.07C24 5.4 18.63 0 12 0S0 5.4 0 12.07C0 18.1 4.39 23.1 10.13 24v-8.44H7.08v-3.49h3.05V9.41c0-3.02 1.79-4.69 4.53-4.69 1.31 0 2.68.24 2.68.24v2.96h-1.51c-1.49 0-1.96.93-1.96 1.89v2.26h3.33l-.53 3.49h-2.8V24C19.61 23.1 24 18.1 24 12.07Z",
    },
    {
        label: "Instagram",
        href: "https://instagram.com/1martianway",
        path: "M12 2.16c3.2 0 3.58.01 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s-.01 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58-.01-4.85-.07c-1.17-.05-1.8-.25-2.23-.41-.56-.22-.96-.48-1.38-.9-.42-.42-.68-.82-.9-1.38-.16-.42-.36-1.06-.41-2.23C2.17 15.58 2.16 15.2 2.16 12s.01-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.17 8.8 2.16 12 2.16ZM12 0C8.74 0 8.33.01 7.05.07 5.78.13 4.9.33 4.14.63c-.79.3-1.46.72-2.13 1.38A5.9 5.9 0 0 0 .63 4.14c-.3.76-.5 1.64-.56 2.91C.01 8.33 0 8.74 0 12s.01 3.67.07 4.95c.06 1.27.26 2.15.56 2.91.3.79.72 1.46 1.38 2.13a5.9 5.9 0 0 0 2.13 1.38c.76.3 1.64.5 2.91.56C8.33 23.99 8.74 24 12 24s3.67-.01 4.95-.07c1.27-.06 2.15-.26 2.91-.56a5.9 5.9 0 0 0 2.13-1.38 5.9 5.9 0 0 0 1.38-2.13c.3-.76.5-1.64.56-2.91.06-1.28.07-1.69.07-4.95s-.01-3.67-.07-4.95c-.06-1.27-.26-2.15-.56-2.91a5.9 5.9 0 0 0-1.38-2.13A5.9 5.9 0 0 0 19.86.63c-.76-.3-1.64-.5-2.91-.56C15.67.01 15.26 0 12 0Zm0 5.84A6.16 6.16 0 1 0 18.16 12 6.16 6.16 0 0 0 12 5.84Zm0 10.16A4 4 0 1 1 16 12a4 4 0 0 1-4 4Zm7.85-10.4a1.44 1.44 0 1 1-1.44-1.44 1.44 1.44 0 0 1 1.44 1.44Z",
    },
    {
        label: "X",
        href: "https://x.com/1martianway",
        path: "M18.9 2H22l-7.1 8.1L23.2 22h-6.6l-5.1-6.7L5.6 22H2.5l7.6-8.7L1.2 2h6.8l4.6 6.1Zm-1.1 18h1.7L7.3 3.8H5.4Z",
    },
    {
        label: "LinkedIn",
        href: "https://www.linkedin.com/company/1martianway",
        path: "M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.2 8.2h4.6V24H.2Zm7.6 0h4.4v2.2h.1a4.8 4.8 0 0 1 4.3-2.4c4.6 0 5.4 3 5.4 6.9V24h-4.6v-7.6c0-1.8 0-4.1-2.5-4.1s-2.9 2-2.9 4V24H7.8Z",
    },
    {
        label: "YouTube",
        href: "https://www.youtube.com/@1martianway",
        path: "M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.5 15.6V8.4l6.3 3.6Z",
    },
];

function Column({
    title,
    links,
}: {
    title: string;
    links: { href: string; label: string; external?: boolean }[];
}) {
    const cls = "text-fg-muted hover:text-fg text-[13.5px] transition-colors";
    return (
        <div>
            <h4 className="deck-label mb-3.5">{title}</h4>
            <ul className="space-y-2.5">
                {links.map((l) => (
                    <li key={l.href}>
                        {l.external ? (
                            <a href={l.href} target="_blank" rel="noopener" className={cls}>
                                {l.label}
                            </a>
                        ) : (
                            <Link href={l.href} className={cls}>
                                {l.label}
                            </Link>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default function Footer() {
    return (
        <footer className="border-line bg-canvas-2 mt-3.5 border-t">
            {/* --container-page, not a literal. This was max-w-[1280px] with
                px-6 while the page above it ran 1560 with px-3.5, so the footer
                sat 126px right of everything else on a 1512px laptop and 150px
                on a 1920. Same token, same padding, one left edge. */}
            <div className="mx-auto max-w-[var(--container-page)] px-[var(--container-pad)] pb-8 pt-12">
                <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.6fr_repeat(3,1fr)]">
                    <div>
                        <Link href="/" className="flex items-center gap-2.5 text-[14.5px] font-extrabold tracking-[-0.015em]">
                            <LogoGlyph size={21} radius={64} />
                            1 Martian Way
                        </Link>
                        <p className="text-fg-muted mt-3 max-w-[34ch] text-[13px]">
                            We build embodied multi-agent systems, robotics simulation, and the
                            software that runs them.
                        </p>
                        <div className="mt-4 flex gap-2">
                            {SOCIALS.map((s) => (
                                <a
                                    key={s.label}
                                    href={s.href}
                                    aria-label={s.label}
                                    rel="noopener"
                                    className="border-line text-fg-muted hover:text-fg hover:border-line-hi grid size-8 place-items-center rounded-[9px] border transition-colors"
                                >
                                    <svg viewBox="0 0 24 24" className="size-[15px]" fill="currentColor" aria-hidden>
                                        <path d={s.path} />
                                    </svg>
                                </a>
                            ))}
                        </div>
                    </div>

                    <Column title="Products" links={PRODUCTS} />
                    <Column title="Company" links={COMPANY_LINKS} />

                    <div>
                        <h4 className="deck-label mb-3.5">Registered office</h4>
                        <address className="text-fg-muted text-[13px] not-italic leading-relaxed">
                            {COMPANY.address.map((line) => (
                                <span key={line} className="block">
                                    {line}
                                </span>
                            ))}
                        </address>
                        <a
                            href={`mailto:${COMPANY.email}`}
                            className="text-blue mt-3 inline-block text-[13.5px] hover:underline"
                        >
                            {COMPANY.email}
                        </a>
                    </div>
                </div>

                <div className="border-line text-fg-dim mt-8 flex flex-wrap items-center justify-between gap-3.5 border-t pt-5 text-[12.5px]">
                    <span>
                        © {new Date().getFullYear()} {COMPANY.legal} All rights reserved.
                        <span className="ml-2">CIN: {COMPANY.cin}</span>
                        {/* Visible build stamp. Baked in at docker build time, so it
                            identifies the exact commit a visitor is looking at — the
                            fastest way to tell a stale page from a current one. */}
                        <span className="text-fg-dim ml-2 font-mono text-[11px]">
                            build {process.env.NEXT_PUBLIC_BUILD_SHA ?? "dev"}
                        </span>
                    </span>
                    <nav className="flex flex-wrap gap-4">
                        <Link href="/privacy" className="hover:text-fg transition-colors">Privacy</Link>
                        <Link href="/terms" className="hover:text-fg transition-colors">Terms</Link>
                        <Link href="/contact" className="hover:text-fg transition-colors">Contact</Link>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
