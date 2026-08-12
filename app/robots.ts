import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/lib/routes";

/*
  Two deliberate changes from the previous version:

  · crawlDelay is gone. Google ignores it outright and Bing honours it, so the
    only thing it achieved was throttling our own indexing.
  · AI crawlers are explicitly allowed. For a developer-tools launch we want to
    be in those indexes, and silence here reads as ambiguity.
*/
export default function robots(): MetadataRoute.Robots {
    const disallow = ["/api/", "/admin/", "/private/"];
    return {
        rules: [
            { userAgent: "*", allow: "/", disallow },
            { userAgent: ["Googlebot", "Bingbot"], allow: "/", disallow },
            { userAgent: ["GPTBot", "ClaudeBot", "PerplexityBot", "Google-Extended"], allow: "/", disallow },
        ],
        sitemap: `${SITE_URL}/sitemap.xml`,
        host: SITE_URL,
    };
}
