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
    // "/" is deliberately absent: it 307s to /toowl (see next.config.js), and a
    // sitemap that lists a redirecting URL is a Search Console warning. Put it
    // back in the same change that removes the redirect.
    /*
      "/magy" and "/mos" are out of the sitemap from 2026-08-26: neither is to
      be published while the patent filings are open.

      They are NOT added to robots.ts Disallow, and that is deliberate. A
      Disallow stops the crawl, not the indexing — a URL that is linked from
      anywhere else can still be listed, and because the crawler is forbidden
      to fetch the page it can never see the noindex that would have removed
      it. Dropping them from the sitemap, unlinking them sitewide, and letting
      Googlebot fetch a page whose metadata says `index: false` is what
      actually keeps them out of the index.
    */
    // { path: "/magy", changeFrequency: "daily" },
    // { path: "/mos", changeFrequency: "weekly" },
    { path: "/toowl", changeFrequency: "weekly" },
    // "/martianos" is absent: it now 307s away (see next.config.js) because its
    // stated specs are unverified, and a sitemap entry for a redirecting URL is
    // a Search Console warning. Restore alongside the redirect removal.
    // "/products" (Humanoid robots) is absent for both reasons at once: it is
    // noindex'd AND it now 307s away, because its four model cards state
    // heights, payloads, battery life, ±0.1mm precision and "Medical Certified"
    // for hardware that does not exist. A sitemap entry would invite Google to
    // crawl and rank a redirecting URL it is meant to forget.
    // "/artificialintelligence" and "/brands" are absent for the same reason as
    // "/martianos": both now 307 away (see next.config.js). The AI page repeated
    // the same <1μs Martian OS claim verbatim, plus 100 TOPS, quantum error
    // correction and "Level 4 full sentience"; /brands contradicted /about,
    // which was written to replace it, and carried four unsourced IDRL figures.
    // Restore each entry in the same change that removes its redirect.
    { path: "/press", changeFrequency: "monthly" },
    { path: "/licensing", changeFrequency: "monthly" },
    { path: "/contact", changeFrequency: "monthly" },
    { path: "/privacy", changeFrequency: "yearly" },
    { path: "/terms", changeFrequency: "yearly" },
    // App-store obligation. Never change this URL.
    { path: "/dr2u/privacy", changeFrequency: "yearly" },
];
