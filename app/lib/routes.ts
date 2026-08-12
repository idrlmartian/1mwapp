/**
 * The single registry of public routes.
 *
 * The sitemap is generated from this list, so a route cannot be added without
 * appearing in it. That is exactly how /dr2u/privacy went missing from the old
 * hand-maintained sitemap.
 */

export const SITE_URL = "https://www.1martianway.com";

export type Route = { path: string; changeFrequency: "daily" | "weekly" | "monthly" | "yearly" };

export const ROUTES: Route[] = [
    // "/" is deliberately absent: it 307s to /magy (see next.config.js), and a
    // sitemap that lists a redirecting URL is a Search Console warning. Put it
    // back in the same change that removes the redirect.
    { path: "/magy", changeFrequency: "daily" },
    { path: "/mos", changeFrequency: "weekly" },
    { path: "/toowl", changeFrequency: "weekly" },
    // "/martianos" is absent: it now 307s away (see next.config.js) because its
    // stated specs are unverified, and a sitemap entry for a redirecting URL is
    // a Search Console warning. Restore alongside the redirect removal.
    // "/products" (Humanoid robots) is deliberately absent: the product isn't
    // ready to be shown, so it is unlinked sitewide and noindex'd. A sitemap
    // entry would defeat that by inviting Google to crawl and rank it anyway.
    { path: "/artificialintelligence", changeFrequency: "monthly" },
    { path: "/brands", changeFrequency: "monthly" },
    { path: "/press", changeFrequency: "monthly" },
    { path: "/licensing", changeFrequency: "monthly" },
    { path: "/contact", changeFrequency: "monthly" },
    { path: "/privacy", changeFrequency: "yearly" },
    { path: "/terms", changeFrequency: "yearly" },
    // App-store obligation. Never change this URL.
    { path: "/dr2u/privacy", changeFrequency: "yearly" },
];
