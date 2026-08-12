import type { Metadata } from "next";
import { CONSENT_TEXT } from "@/app/lib/waitlist";
import { COMPANY } from "@/app/lib/constants";

export const metadata: Metadata = {
    title: "Privacy",
    description: "How 1 Martian Way Industries handles your personal data.",
    alternates: { canonical: "https://www.1martianway.com/privacy" },
};

/*
  Required, not optional: the site collects email addresses, and the consent
  line beside every signup field links here. India's DPDP Act 2023 also
  requires a notice and a named grievance officer.

  The officer is named in COMPANY.grievanceOfficer and must remain a real
  reachable person — the obligation is to publish someone who can actually
  answer, so a generic inbox with no name behind it does not satisfy it.
*/
export default function PrivacyPage() {
    const updated = "12 August 2026";
    return (
        <article className="mx-auto max-w-[72ch] px-6 py-14">
            <h1 className="text-[clamp(1.6rem,4vw,2.4rem)] font-extrabold tracking-[-0.03em]">Privacy</h1>
            <p className="text-fg-dim mt-2 font-mono text-[12px]">Last updated {updated}</p>

            <div className="mt-8 space-y-6 text-[14px] leading-relaxed [&_h2]:mt-9 [&_h2]:text-[1.05rem] [&_h2]:font-bold [&_p]:text-[var(--color-fg-muted)] [&_li]:text-[var(--color-fg-muted)]">
                <p>
                    {COMPANY.legal} (&ldquo;we&rdquo;) builds Magy, MOS, Toowl and related software.
                    This page describes what we collect from this website and why.
                </p>

                <h2>What we collect</h2>
                <p>Only what the site actually needs:</p>
                <ul className="list-disc space-y-1.5 pl-5">
                    <li><b>Your email address</b>, when you join a waitlist or send us a message.</li>
                    <li><b>How you arrived</b> — referring page and any campaign parameters in the URL.</li>
                    <li><b>Your browser&rsquo;s user agent</b>, and a one-way hash of your IP address.</li>
                </ul>
                <p>
                    We do not store raw IP addresses. The hash exists so we can rate-limit abuse and
                    investigate spam; it cannot be reversed to recover an address.
                </p>

                <h2>Consent</h2>
                <p>
                    When you join a waitlist we record the exact wording you agreed to, alongside the
                    time you agreed to it. Today that wording is:
                </p>
                <blockquote className="border-blue text-fg border-l-2 pl-4 text-[13.5px]">{CONSENT_TEXT}</blockquote>

                <h2>What we do with it</h2>
                <p>
                    We email you about the product you signed up for. That is the whole purpose. We
                    do not sell, rent or share your address, and we do not use it for unrelated
                    marketing. Every email carries a one-click unsubscribe, and unsubscribing is
                    immediate and permanent.
                </p>

                <h2>Where it lives</h2>
                <p>
                    On our own servers in India, not a third-party marketing platform. Email is
                    delivered through our mail provider, which necessarily processes the address in
                    order to send the message.
                </p>

                <h2>Cookies</h2>
                <p>
                    This site sets no advertising or tracking cookies. Your theme preference is kept
                    in your browser&rsquo;s local storage and never leaves your device.
                </p>

                <h2>Your rights</h2>
                <p>
                    You can ask us what we hold about you, ask us to correct it, or ask us to delete
                    it — write to{" "}
                    <a href={`mailto:${COMPANY.email}`} className="text-blue hover:underline">{COMPANY.email}</a>{" "}
                    and we will action it.
                </p>

                <h2>Grievance Officer</h2>
                <p>
                    Under India&rsquo;s Digital Personal Data Protection Act, 2023 you may raise a
                    grievance about how we handle your personal data with our Grievance Officer:
                </p>
                <address className="not-italic">
                    <span className="block font-medium text-[var(--color-fg)]">
                        {COMPANY.grievanceOfficer.name}
                    </span>
                    <span className="block">{COMPANY.grievanceOfficer.title}, {COMPANY.legal}</span>
                    <a
                        href={`mailto:${COMPANY.grievanceOfficer.email}`}
                        className="text-blue mt-1 inline-block hover:underline"
                    >
                        {COMPANY.grievanceOfficer.email}
                    </a>
                </address>
                <p>
                    We aim to acknowledge a grievance within 48 hours and resolve it within 30 days.
                </p>

                <h2>Contact</h2>
                <address className="not-italic">
                    {COMPANY.address.map((l) => (<span key={l} className="block">{l}</span>))}
                    <a href={`mailto:${COMPANY.email}`} className="text-blue mt-2 inline-block hover:underline">{COMPANY.email}</a>
                </address>
            </div>
        </article>
    );
}
