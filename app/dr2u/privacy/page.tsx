import {
    ArrowRightIcon,
    EnvelopeClosedIcon,
    GlobeIcon,
    HomeIcon,
    MobileIcon,
} from "@radix-ui/react-icons";
import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
    alternates: { canonical: "https://www.1martianway.com/dr2u/privacy" },
    title: "Privacy Policy | DR2U",
    description:
 "Privacy Policy for DR2U - Learn how we collect, use, and protect your personal information.",
};

export default function Privacy() {
    return (
        <>
            <div className="mx-auto max-w-7xl px-6 py-8 sm:py-12 lg:px-8">
                <div className="mx-auto max-w-2xl text-center">
                    <h1 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                        Privacy Policy | DR2U App
                    </h1>
                    <p className="mt-4 text-lg leading-8 text-white/80">
                        Last Updated: April 22, 2025
                    </p>
                </div>

                <div className="mx-auto mt-8 max-w-2xl space-y-8">
                    {/* Introduction */}
                    <div className="rounded-2xl bg-solid dark:bg-panel p-8 shadow-xs ring-1 ring-gray-900/5">
                        <h2 className="text-2xl font-semibold text-fg dark:text-white">
                            Introduction
                        </h2>
                        <p className="mt-4 text-sm text-fg-muted dark:text-fg-muted">
                            Welcome to DR2U ("we," "our," "us"). We are
                            committed to protecting your privacy and ensuring
                            that your personal information is handled in a safe
                            and responsible manner. This Privacy Policy explains
                            how we collect, use, store, and protect your
                            personal information when you use our mobile
                            application ("App"). By using the App, you agree to
                            the terms outlined in this Privacy Policy.
                        </p>
                    </div>

                    {/* Information We Collect */}
                    <div className="rounded-2xl bg-solid dark:bg-panel p-8 shadow-xs ring-1 ring-gray-900/5">
                        <h2 className="text-2xl font-semibold text-fg dark:text-white">
                            Information We Collect
                        </h2>
                        <div className="mt-4 space-y-4">
                            <div className="rounded-lg bg-sunk dark:bg-panel p-4">
                                <h3 className="text-lg font-medium text-fg dark:text-white">
                                    User Registration Information
                                </h3>
                                <ul className="mt-2 text-sm text-fg-muted dark:text-fg-muted list-disc pl-5">
                                    <li>Name</li>
                                    <li>Email address</li>
                                    <li>Phone number</li>
                                    <li>Other contact details</li>
                                </ul>
                            </div>
                            <div className="rounded-lg bg-sunk dark:bg-panel p-4">
                                <h3 className="text-lg font-medium text-fg dark:text-white">
                                    Health-Related Information
                                </h3>
                                <ul className="mt-2 text-sm text-fg-muted dark:text-fg-muted list-disc pl-5">
                                    <li>Medical history</li>
                                    <li>Symptoms</li>
                                    <li>
                                        Other health data necessary for
                                        providing medical services
                                    </li>
                                </ul>
                            </div>
                            <div className="rounded-lg bg-sunk dark:bg-panel p-4">
                                <h3 className="text-lg font-medium text-fg dark:text-white">
                                    Location Data
                                </h3>
                                <p className="mt-2 text-sm text-fg-muted dark:text-fg-muted">
                                    Your current location to connect you with
                                    nearby doctors
                                </p>
                            </div>
                            <div className="rounded-lg bg-sunk dark:bg-panel p-4">
                                <h3 className="text-lg font-medium text-fg dark:text-white">
                                    Payment Information
                                </h3>
                                <p className="mt-2 text-sm text-fg-muted dark:text-fg-muted">
                                    Credit card details or other payment methods
                                    for processing transactions
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* How We Use Your Information */}
                    <div className="rounded-2xl bg-solid dark:bg-panel p-8 shadow-xs ring-1 ring-gray-900/5">
                        <h2 className="text-2xl font-semibold text-fg dark:text-white">
                            How We Use Your Information
                        </h2>
                        <div className="mt-4 space-y-4">
                            <ul className="text-sm text-fg-muted dark:text-fg-muted list-disc pl-5 space-y-2">
                                <li>
                                    User Registration Information: To create and
                                    manage your account.
                                </li>
                                <li>
                                    Health-Related Information: To provide
                                    medical services and connect you with
                                    appropriate healthcare providers.
                                </li>
                                <li>
                                    Location Data: To facilitate the booking of
                                    doctors based on your location.
                                </li>
                                <li>
                                    Payment Information: To process payments for
                                    services rendered.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Data Sharing and Security */}
                    <div className="rounded-2xl bg-solid dark:bg-panel p-8 shadow-xs ring-1 ring-gray-900/5">
                        <h2 className="text-2xl font-semibold text-fg dark:text-white">
                            Data Sharing and Security
                        </h2>
                        <div className="mt-4 space-y-6">
                            <div>
                                <h3 className="text-lg font-medium text-fg dark:text-white">
                                    Data Sharing and Third Parties
                                </h3>
                                <p className="mt-2 text-sm text-fg-muted dark:text-fg-muted">
                                    We do not share your personal information
                                    with any third parties, except in the
                                    following limited circumstances:
                                </p>
                                <ul className="mt-2 text-sm text-fg-muted dark:text-fg-muted list-disc pl-5">
                                    <li>
                                        Healthcare Providers: We may share
                                        necessary health-related information
                                        with doctors or healthcare providers to
                                        facilitate the medical services you
                                        request.
                                    </li>
                                    <li>
                                        Payment Processing: We use third-party
                                        payment processors to handle
                                        transactions. These processors are
                                        contractually obligated not to retain,
                                        share, or use your payment information
                                        for any purpose other than processing
                                        your payments.
                                    </li>
                                </ul>
                            </div>
                            <div>
                                <h3 className="text-lg font-medium text-fg dark:text-white">
                                    Data Security
                                </h3>
                                <ul className="mt-2 text-sm text-fg-muted dark:text-fg-muted list-disc pl-5">
                                    <li>
                                        Encryption: Sensitive data, such as
                                        health-related information and payment
                                        details, is encrypted during
                                        transmission and storage.
                                    </li>
                                    <li>
                                        Secure Servers: Your data is stored on
                                        secure servers with restricted access.
                                    </li>
                                    <li>
                                        Regular Audits: We conduct regular
                                        security audits to ensure the integrity
                                        of our systems.
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Your Rights */}
                    <div className="rounded-2xl bg-solid dark:bg-panel p-8 shadow-xs ring-1 ring-gray-900/5">
                        <h2 className="text-2xl font-semibold text-fg dark:text-white">
                            Your Rights
                        </h2>
                        <div className="mt-4">
                            <p className="text-sm text-fg-muted dark:text-fg-muted">
                                You have the following rights regarding your
                                personal information:
                            </p>
                            <ul className="mt-2 text-sm text-fg-muted dark:text-fg-muted list-disc pl-5">
                                <li>
                                    Access: You can request access to the
                                    personal information we hold about you.
                                </li>
                                <li>
                                    Correction: You can request correction of
                                    any inaccuracies in your personal
                                    information.
                                </li>
                                <li>
                                    Deletion: You can request the deletion of
                                    your personal information, subject to legal
                                    and contractual obligations.
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="rounded-2xl bg-solid dark:bg-panel p-8 shadow-xs ring-1 ring-gray-900/5">
                        <h2 className="text-2xl font-semibold text-fg dark:text-white">
                            Contact Us
                        </h2>
                        <p className="mt-4 mb-6 text-sm text-fg-muted dark:text-fg-muted">
                            If you have any questions or concerns about this
                            Privacy Policy or our data practices, please contact
                            us:
                        </p>

                        <div className="space-y-4">
                            <div>
                                <h3 className="text-base font-semibold text-fg dark:text-white">
                                    1 Martian Way Industries Pvt. Ltd
                                </h3>
                                <div className="mt-2 flex items-center text-sm text-fg-muted dark:text-fg-muted">
                                    <GlobeIcon className="h-5 w-5 text-fg-dim mr-2" />
                                    https://1martianway.com
                                </div>
                            </div>

                            <div>
                                <h3 className="text-base font-semibold text-fg dark:text-white">
                                    Registered Office
                                </h3>
                                <div className="mt-2 flex items-start text-sm text-fg-muted dark:text-fg-muted">
                                    <HomeIcon className="h-5 w-5 text-fg-dim mr-2 mt-0.5" />
                                    <div>
                                        502 Satya Sadan, Bhimani Street
                                        <br />
                                        Matunga East
                                        <br />
                                        Mumbai – 400 019
                                        <br />
                                        India
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-2">
                                <div className="flex items-center text-sm text-fg-muted dark:text-fg-muted">
                                    <EnvelopeClosedIcon className="h-5 w-5 text-fg-dim mr-2" />
                                    sales[at]1martianway[dot]com
                                </div>
                                <div className="flex items-center text-sm text-fg-muted dark:text-fg-muted">
                                    <MobileIcon className="h-5 w-5 text-fg-dim mr-2" />
                                </div>
                            </div>

                            <div className="pt-4">
                                <Link
                                    href="/contact"
                                    className="inline-flex items-center rounded-full bg-blue-soft px-4 py-2.5 text-sm font-semibold text-white shadow-xs hover:bg-blue-soft focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                                >
                                    Contact Us
                                    <ArrowRightIcon className="ml-2 h-4 w-4" />
                                </Link>
                            </div>
                        </div>
                    </div>

                    {/* Changes to Privacy Policy */}
                    <div className="rounded-2xl bg-solid dark:bg-panel p-8 shadow-xs ring-1 ring-gray-900/5">
                        <h2 className="text-2xl font-semibold text-fg dark:text-white">
                            Changes to This Privacy Policy
                        </h2>
                        <p className="mt-4 text-sm text-fg-muted dark:text-fg-muted">
                            We may update this Privacy Policy from time to time.
                            We will notify you of any changes by posting the new
                            Privacy Policy on this page and updating the "Last
                            Updated" date. Your continued use of the App after
                            any changes constitutes your acceptance of the new
                            Privacy Policy.
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
}
