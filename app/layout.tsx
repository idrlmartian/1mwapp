import type { Metadata, Viewport } from "next";
import { IBM_Plex_Mono, IBM_Plex_Sans, IBM_Plex_Serif } from "next/font/google";
import MainLayout from "./components/MainLayout";
import StructuredData from "./components/StructuredData";
import "./globals.css";
import Script from "next/script";
import { Providers } from "./providers";

/*
  ONE SUPERFAMILY, COMPANY-WIDE.

  The product already ships IBM Plex Sans and IBM Plex Mono — magyverse's
  globals.css calls them "the binding visual spec". This site ran Plus Jakarta
  Sans and Geist Mono, so the marketing page and the thing it was selling were
  two designs that merely resembled each other, and every shared component
  would have needed two answers to "which face".

  Adopting Plex here is therefore not a restyle, it is a merge: the shared
  package becomes an EXTRACTION of what the product already has rather than a
  third system both must migrate onto.

  Serif is the one addition, and it is from the same superfamily on purpose. A
  marketing page needs a display voice with more presence than a UI sans, and
  bringing in a foreign face to get it is exactly how a company ends up with
  four typographic systems again. Plex Serif at 300 gives editorial weight
  while sharing the metrics, the language coverage and the foundry.
*/
const plexSans = IBM_Plex_Sans({
    subsets: ["latin"],
    variable: "--font-plex-sans",
    weight: ["300", "400", "500", "600", "700"],
    display: "swap",
});

/** Display only — headlines and pull quotes. Never body copy, never UI. */
const plexSerif = IBM_Plex_Serif({
    subsets: ["latin"],
    variable: "--font-plex-serif",
    weight: ["300", "400", "600"],
    display: "swap",
});

/** Every measured number, route, label and status chip. */
const plexMono = IBM_Plex_Mono({
    subsets: ["latin"],
    variable: "--font-plex-mono",
    weight: ["400", "500", "600"],
    display: "swap",
});




export const metadata: Metadata = {
    // www is canonical: it is what is indexed today, and changing canonical
    // hostname during a host migration during a product launch is three risks
    // multiplied. The apex 308s to www via next.config.js redirects().
    metadataBase: new URL("https://www.1martianway.com"),
    title: {
        default: "1 Martian Way Industries - Humanoid Robots & AI Consciousness",
        template: "%s | 1 Martian Way Industries",
    },
    description:
        "Leading creator of humanoid robots and AI consciousness software. We develop sentient autonomous beings that think, learn, and adapt to transform human-robot collaboration across industries.",
    keywords: [
        "humanoid robots",
        "AI consciousness",
        "artificial intelligence",
        "robotics",
        "sentient robots",
        "autonomous beings",
        "robot consciousness",
        "AI software",
        "humanoid technology",
        "robotic automation",
        "machine consciousness",
        "intelligent robots"
    ],
    authors: [{ name: "1 Martian Way Industries" }],
    creator: "1 Martian Way Industries",
    publisher: "1 Martian Way Industries",
    openGraph: {
        type: "website",
        locale: "en_US",
        url: "https://www.1martianway.com",
        siteName: "1 Martian Way Industries",
        title: "1 Martian Way Industries - Humanoid Robots & AI Consciousness",
        description:
            "Leading creator of humanoid robots and AI consciousness software. We develop sentient autonomous beings that think, learn, and adapt.",
        // No `images` here on purpose. app/opengraph-image.png is picked up by
        // Next's file convention, which fingerprints the URL and emits the
        // width/height/type tags automatically. The previous hardcoded path
        // (/assets/img/og-image.jpg) 404'd in production, which is why every
        // social preview on this site was broken.
    },
    twitter: {
        card: "summary_large_image",
        title: "1 Martian Way Industries - Humanoid Robots & AI Consciousness",
        description:
            "Leading creator of humanoid robots and AI consciousness software. We develop sentient autonomous beings that think, learn, and adapt.",
    },
    // No `icons` block either — app/icon.svg and app/apple-icon.png are file
    // conventions. Declaring both produces duplicate, conflicting <link> tags.
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
};

export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 5,
    // Matches the two palettes in base.css so the browser chrome agrees with
    // the page in both themes rather than always painting the dark canvas.
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#F2F3F7" },
        { media: "(prefers-color-scheme: dark)", color: "#0B0D12" },
    ],
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            className={`${plexSans.variable} ${plexSerif.variable} ${plexMono.variable}`}
            suppressHydrationWarning
        >
            <body className="bg-canvas text-fg min-h-screen antialiased">
                <StructuredData type="Organization" />
                {/* @radix-ui/themes removed: it wrapped the whole app purely to
                    set appearance="dark" + accentColor="violet" — a violet accent
                    that contradicts the single-red brand — and shipped ~700KB of
                    CSS on every page for it. @radix-ui/react-icons stays; it is
                    used across seven pages and tree-shakes. */}
                <Providers>
                    <MainLayout>{children}</MainLayout>
                </Providers>
                {/* Served from our own origin via the rewrite in next.config.js.
                    Cookieless, so no consent banner is required — which stays
                    true only as long as nothing else here sets one. */}
                {process.env.NEXT_PUBLIC_UMAMI_ID && (
                    <Script
                        src="/js/mw.js"
                        data-website-id={process.env.NEXT_PUBLIC_UMAMI_ID}
                        data-host-url="/"
                        strategy="afterInteractive"
                    />
                )}
            </body>
        </html>
    );
}
