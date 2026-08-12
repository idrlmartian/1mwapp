"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { LogoGlyph } from "@/app/components/brand/Logo";
import ThemeSwitch from "@/app/components/ui/ThemeSwitch";
import { navCtaClick } from "@/app/lib/analytics";
import { NAV } from "@/app/lib/constants";

/*
  The deck's chrome bar. 56px, sticky, glass.

  The "Get Early Access" button is the only red thing up here, and it is present
  on every route — whatever a visitor is reading, the ask is one click away.
*/
export default function Header() {
    const pathname = usePathname();
    const [open, setOpen] = useState(false);
    const isActive = (href: string) => pathname === href || pathname.startsWith(href + "/");

    return (
        <header className="border-line bg-canvas/80 sticky top-0 z-60 flex h-14 items-center gap-3.5 border-b px-3.5 backdrop-blur-xl">
            <Link
                href="/"
                className="flex shrink-0 items-center gap-2.5 text-[14.5px] font-extrabold tracking-[-0.015em]"
            >
                <LogoGlyph size={21} radius={64} />
                <span className="hidden sm:inline">1 Martian Way</span>
            </Link>

            <nav
                aria-label="Products"
                className="border-line bg-sunk ml-1 hidden rounded-[var(--radius-capsule)] border p-0.5 md:flex"
            >
                {NAV.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        aria-current={isActive(item.href) ? "page" : undefined}
                        className={`rounded-[var(--radius-capsule)] px-3.5 py-1.5 text-[12.5px] transition-colors ${
                            isActive(item.href)
                                ? "bg-blue-soft text-blue font-bold shadow-[inset_0_0_0_1px_color-mix(in_oklab,var(--color-blue)_38%,transparent)]"
                                : "text-fg-muted hover:text-fg font-medium"
                        }`}
                    >
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="ml-auto flex items-center gap-3">
                <div className="hidden sm:block">
                    <ThemeSwitch />
                </div>
                <Link
                    href="/#early-access"
                    onClick={() => navCtaClick(pathname)}
                    className="bg-red hover:bg-red-hover shadow-[var(--shadow-cta)] inline-flex items-center rounded-[9px] px-3.5 py-2.5 text-[12.5px] font-bold text-white transition-colors"
                >
                    Get Early Access
                </Link>
                <button
                    type="button"
                    onClick={() => setOpen((v) => !v)}
                    aria-expanded={open}
                    aria-label="Menu"
                    className="border-line text-fg-muted grid size-9 place-items-center rounded-[9px] border md:hidden"
                >
                    <svg viewBox="0 0 24 24" className="size-4" fill="none" stroke="currentColor" strokeWidth={2}>
                        {open ? <path d="M6 6l12 12M18 6L6 18" /> : <path d="M3 6h18M3 12h18M3 18h18" />}
                    </svg>
                </button>
            </div>

            {open && (
                <div className="border-line bg-canvas absolute inset-x-0 top-14 border-b p-3.5 md:hidden">
                    <nav className="flex flex-col gap-1">
                        {NAV.map((item) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                onClick={() => setOpen(false)}
                                className={`rounded-[var(--radius-md)] px-3 py-2.5 text-sm ${
                                    isActive(item.href) ? "bg-blue-soft text-blue font-bold" : "text-fg-muted"
                                }`}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </nav>
                    <div className="mt-3 sm:hidden">
                        <ThemeSwitch />
                    </div>
                </div>
            )}
        </header>
    );
}
