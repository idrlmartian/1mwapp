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
    alternates: { canonical: "https://www.1martianway.com/licensing" },
    title: "Licensing | 1 Martian Way",
    description:
 "1 Martian Way licenses its innovations for third-party usage.",
};

export default function Licensing() {
    return (
        <>
            <div className="mx-auto max-w-7xl px-6 py-8 sm:py-12 lg:px-8">
                <div className="mx-auto max-w-2xl lg:mx-0">
                    <h1 className="text-xl font-bold tracking-tight text-white sm:text-2xl">
                        Licensing & Partnerships
                    </h1>
                    <p className="mt-4 text-lg leading-8 text-white/80">
                        Explore opportunities to leverage our cutting-edge
                        technology through various licensing and partnership
                        options.
                    </p>
                </div>

                <div className="mx-auto mt-8 max-w-2xl space-y-8 lg:mx-0">
                    {/* Licensing Options */}
                    <div className="rounded-2xl bg-solid dark:bg-panel p-8 shadow-xs ring-1 ring-gray-900/5">
                        <h2 className="text-2xl font-semibold text-fg dark:text-white">
                            Available Opportunities
                        </h2>
                        <div className="mt-4 space-y-4">
                            <div className="rounded-lg bg-sunk dark:bg-panel p-4">
                                <h3 className="text-lg font-medium text-fg dark:text-white">
                                    Technology Licensing
                                </h3>
                                <p className="mt-2 text-sm text-fg-muted dark:text-fg-muted">
                                    Access our proprietary drone technology, AI
                                    algorithms, and robotics solutions for
                                    integration into your products.
                                </p>
                            </div>
                            <div className="rounded-lg bg-sunk dark:bg-panel p-4">
                                <h3 className="text-lg font-medium text-fg dark:text-white">
                                    Distribution Partnerships
                                </h3>
                                <p className="mt-2 text-sm text-fg-muted dark:text-fg-muted">
                                    Become an authorized distributor of our
                                    products and solutions in your region.
                                </p>
                            </div>
                            <div className="rounded-lg bg-sunk dark:bg-panel p-4">
                                <h3 className="text-lg font-medium text-fg dark:text-white">
                                    Strategic Alliances
                                </h3>
                                <p className="mt-2 text-sm text-fg-muted dark:text-fg-muted">
                                    Partner with us to develop innovative
                                    solutions and expand market reach through
                                    collaborative ventures.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="rounded-2xl bg-solid dark:bg-panel p-8 shadow-xs ring-1 ring-gray-900/5">
                        <h2 className="text-2xl font-semibold text-fg dark:text-white">
                            Get Started
                        </h2>
                        <p className="mt-4 text-sm text-fg-muted dark:text-fg-muted">
                            Contact us to discuss licensing options and
                            partnership opportunities. Our team typically
                            responds within minutes via email.
                        </p>

                        <div className="mt-6 space-y-4">
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
                </div>
            </div>
        </>
    );
}
