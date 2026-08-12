import Link from "next/link";
import { LogoGlyph } from "@/app/components/brand/Logo";
import { COMPANY } from "@/app/lib/constants";

/*
  A real company footer.

  The previous one carried four fabricated stat tiles (24/7, 99.9%, <1ms, ∞),
  three links that all pointed at /contact, a "Careers" link that was a lie, and
  three href="#" socials. Invented metrics sitting next to the measured Magy
  numbers devalue the measured ones, so they are gone.

  TODO before launch: real social URLs (these are placeholders), and the CIN,
  which an Indian Pvt Ltd site should carry.
*/

const PRODUCTS = [
    { href: "/magy", label: "Magy" },
    { href: "/mos", label: "MOS — robotics simulation" },
    { href: "/toowl", label: "Toowl — terminal" },
    { href: "/martianos", label: "Martian OS" },
    { href: "/products", label: "Humanoid robots" },
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
        label: "X",
        href: "#",
        path: "M18.9 2H22l-7.1 8.1L23.2 22h-6.6l-5.1-6.7L5.6 22H2.5l7.6-8.7L1.2 2h6.8l4.6 6.1Zm-1.1 18h1.7L7.3 3.8H5.4Z",
    },
    {
        label: "LinkedIn",
        href: "#",
        path: "M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0ZM.2 8.2h4.6V24H.2Zm7.6 0h4.4v2.2h.1a4.8 4.8 0 0 1 4.3-2.4c4.6 0 5.4 3 5.4 6.9V24h-4.6v-7.6c0-1.8 0-4.1-2.5-4.1s-2.9 2-2.9 4V24H7.8Z",
    },
    {
        label: "YouTube",
        href: "#",
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
            <div className="mx-auto max-w-[1280px] px-6 pb-8 pt-12">
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
                    <span>© {new Date().getFullYear()} {COMPANY.legal} All rights reserved.</span>
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
