import Link from "next/link";
import { TOOWL_URL } from "@/app/lib/constants";

/* A 404 that converts beats a dead end. */
export default function NotFound() {
    return (
        <div className="mx-auto grid min-h-[70svh] max-w-[52ch] place-content-center px-6 py-16 text-center">
            <p className="deck-label mb-4">Error 404</p>
            <h1 className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold tracking-[-0.03em]">
                Nothing at this address.
            </h1>
            <p className="text-fg-muted mt-3 text-[14px]">
                The page moved, or never existed. While you&apos;re here — toowl is a
                GPU-accelerated terminal with Claude built in, and it is free today.
            </p>
            {/*
              A "Get Early Access" form here contradicted the sentence above it
              -- toowl is free today, so the useful next step is installing it,
              not joining a list for something else. Removed alongside the same
              block on /toowl and /about (2026-08-26).
            */}
            <p className="mt-6">
                <a
                    href={TOOWL_URL}
                    className="bg-red hover:bg-red-hover shadow-[var(--shadow-cta)] inline-flex items-center rounded-[9px] px-4 py-2.5 text-[13px] font-bold text-white transition-colors"
                >
                    Get toowl
                </a>
            </p>
            <p className="text-fg-dim mt-6 text-[13px]">
                <Link href="/" className="text-blue hover:underline">Home</Link>
                {" · "}
                {/* Magy: unpublished until the patents are settled (2026-08-26). */}
                <Link href="/toowl" className="text-blue hover:underline">Toowl</Link>
                {" · "}
                <Link href="/contact" className="text-blue hover:underline">Contact</Link>
            </p>
        </div>
    );
}
