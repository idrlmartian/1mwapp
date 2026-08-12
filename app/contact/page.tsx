import type { Metadata } from "next";
import ContactForm from "@/app/components/ContactForm";
import StructuredData from "@/app/components/StructuredData";
import { COMPANY } from "@/app/lib/constants";

/*
  A server component now. It used to be "use client" purely to hold a
  handleSubmit for a form that had been deleted — which meant this route could
  not export metadata at all, and /api/contact had no caller. The interactive
  part lives in ContactForm; this page is static and indexable.

  No phone number, deliberately. It was removed to cut spam calls, and the two
  copies that survived on /licensing and /dr2u/privacy are removed too.
*/

export const metadata: Metadata = {
    title: "Contact",
    description:
        "Talk to 1 Martian Way about Magy, MOS, Toowl, licensing or press. Email is our preferred channel and we reply within one business day.",
    alternates: { canonical: "https://www.1martianway.com/contact" },
};

export default function ContactPage() {
    return (
        <>
            <StructuredData type="Organization" />
            <div className="mx-auto max-w-[var(--container-page)] px-3.5 py-10">
                <div className="mx-auto max-w-[900px]">
                    <p className="deck-label mb-3">Contact</p>
                    <h1 className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold tracking-[-0.03em]">
                        Tell us what you need.
                    </h1>
                    <p className="text-fg-muted mt-3 max-w-[58ch] text-[14px]">
                        Email is our preferred channel — we read everything and reply within one
                        business day. If you&apos;re after early access to a product, the waitlist is
                        faster than writing to us.
                    </p>

                    <div className="mt-7 grid gap-3.5 lg:grid-cols-[1.4fr_0.6fr]">
                        <ContactForm />

                        <aside className="deck-card h-fit p-5">
                            <h2 className="deck-label mb-3">Direct</h2>
                            <a
                                href={`mailto:${COMPANY.email}`}
                                className="text-blue text-[14px] font-semibold hover:underline"
                            >
                                {COMPANY.email}
                            </a>
                            <p className="text-fg-muted mt-2 text-[12.5px]">
                                We don&apos;t publish a phone number — we prefer email, and it keeps
                                the spam calls away.
                            </p>

                            <h2 className="deck-label mb-3 mt-6">Registered office</h2>
                            <address className="text-fg-muted text-[13px] not-italic leading-relaxed">
                                {COMPANY.address.map((line) => (
                                    <span key={line} className="block">{line}</span>
                                ))}
                            </address>
                        </aside>
                    </div>
                </div>
            </div>
        </>
    );
}
