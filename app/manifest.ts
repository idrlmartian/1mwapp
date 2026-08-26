import type { MetadataRoute } from "next";

// Replaces the old public/manifest.json, which declared a single 256px PNG as
// the 48, 192 AND 512 icon, and carried a violet theme_color (#7c3aed) that no
// longer exists anywhere in the brand.
export default function manifest(): MetadataRoute.Manifest {
    return {
        name: "1 Martian Way Industries",
        short_name: "1MW",
        // Was Magy's tagline; toowl is the public face while Magy and MOS are
        // held back for the patent filings (2026-08-26).
        description:
            "1 Martian Way Industries — makers of toowl, a GPU-accelerated terminal with Claude built in.",
        start_url: "/",
        display: "standalone",
        background_color: "#0A0A0B",
        theme_color: "#0A0A0B",
        icons: [
            { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
            { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
            {
                // Separate file: Android crops ~10% per edge to fit its mask, which
                // would clip the legs off the as-drawn mark.
                src: "/icons/icon-512-maskable.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
            },
        ],
    };
}
