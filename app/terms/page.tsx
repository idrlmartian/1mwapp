import type { Metadata } from "next";
import { COMPANY } from "@/app/lib/constants";

export const metadata: Metadata = {
    title: "Terms",
    description: "Terms of use for the 1 Martian Way website.",
    alternates: { canonical: "https://www.1martianway.com/terms" },
};

export default function TermsPage() {
    return (
        <article className="mx-auto max-w-[72ch] px-6 py-14">
            <h1 className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold tracking-[-0.03em]">Terms of use</h1>
            <p className="text-fg-dim mt-2 font-mono text-[12px]">Last updated 12 August 2026</p>

            <div className="mt-8 space-y-6 text-[14px] leading-relaxed [&_h2]:mt-9 [&_h2]:text-[1.05rem] [&_h2]:font-bold [&_p]:text-[var(--color-fg-muted)]">
                <p>
                    These terms cover this website. They do not cover our software products, which
                    are licensed separately.
                </p>

                <h2>The site</h2>
                <p>
                    Everything here is provided as-is and for information. We may change or remove
                    any of it at any time. Forward-looking statements about products, timelines and
                    capabilities are exactly that — statements of intent, not commitments.
                </p>

                <h2>Waitlists</h2>
                <p>
                    Joining a waitlist is not a purchase and does not guarantee access, pricing or a
                    delivery date. We may contact you about the product you signed up for; you can
                    unsubscribe at any time.
                </p>

                <h2>Product licensing</h2>
                <p>
                    Magy, MOS and toowl are commercial products. Licensing terms for each are
                    being finalised and will be published alongside their pricing; where a licence
                    has been issued it takes precedence over anything on this page. For specific
                    terms, write to licensing@1martianway.com.
                </p>

                <h2>Trademarks and content</h2>
                <p>
                    The 1 Martian Way name and mark, and the Magy, MOS and toowl names, belong to
                    us. The text and design of this site are ours. Please do not reproduce them
                    commercially without asking.
                </p>

                <h2>Liability</h2>
                <p>
                    To the extent the law allows, we are not liable for losses arising from your use
                    of this website. Nothing here limits liability that cannot lawfully be limited.
                </p>

                <h2>Governing law</h2>
                <p>
                    These terms are governed by the laws of India, with courts in Mumbai having
                    jurisdiction.
                </p>

                <h2>Contact</h2>
                <p>
                    {COMPANY.legal} —{" "}
                    <a href={`mailto:${COMPANY.email}`} className="text-red hover:underline">{COMPANY.email}</a>
                </p>
            </div>
        </article>
    );
}
