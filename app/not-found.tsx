import Link from "next/link";
import WaitlistForm from "@/app/components/WaitlistForm";

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
            <div className="mx-auto mt-6 w-full max-w-[430px]">
                <WaitlistForm source="404" product="toowl" cta="Get Early Access" />
            </div>
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
