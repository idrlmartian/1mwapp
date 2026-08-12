import type { Metadata, Viewport } from "next";
import { GeistMono } from "geist/font/mono";
import { Plus_Jakarta_Sans } from "next/font/google";
import MainLayout from "./components/MainLayout";
import StructuredData from "./components/StructuredData";
import "./globals.css";
import { Providers } from "./providers";

// Plus Jakarta Sans is the Mission Deck's own face — using it here is what
// makes the marketing site and the product read as one design rather than two
// that resemble each other.
const jakarta = Plus_Jakarta_Sans({
    subsets: ["latin"],
    variable: "--font-jakarta",
    weight: ["400", "500", "600", "700", "800"],
    display: "swap",
});

// Geist Mono carries every measured number, panel header and status chip. It is
// already a dependency and served from node_modules, so it costs no extra
// request — and tabular-nums keeps the metric grid from shifting.

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
        { media: "(prefers-color-scheme: light)", color: "#EDF0F5" },
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
            className={`${jakarta.variable} ${GeistMono.variable}`}
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
            </body>
        </html>
    );
}
