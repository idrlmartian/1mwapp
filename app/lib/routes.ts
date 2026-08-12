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
    { path: "/", changeFrequency: "daily" },
    { path: "/magy", changeFrequency: "daily" },
    { path: "/mos", changeFrequency: "weekly" },
    { path: "/toowl", changeFrequency: "weekly" },
    { path: "/martianos", changeFrequency: "monthly" },
    { path: "/products", changeFrequency: "monthly" },
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
