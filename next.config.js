/** @type {import('next').NextConfig} */
const nextConfig = {
    // Enable React Compiler (stable in Next.js 16)
    reactCompiler: true,
    experimental: {
        // Enable Turbopack file system caching (beta)
        turbopackFileSystemCacheForDev: true,
    },
    poweredByHeader: false,

    /*
      First-party analytics proxy. Ad-blockers match on hostname and path, so a
      script served from our own origin at a non-obvious path survives most of
      them. Without this, self-hosted analytics typically reports about half of
      real traffic.

      UMAMI_HOST must be present at BUILD time, not just run time. This
      function is evaluated by `next build` and frozen into
      .next/routes-manifest.json; `next start` reads that manifest and never
      calls rewrites() again. Supplying the host only through the runtime
      --env-file produces an empty rewrite table and a 404 on /js/mw.js while
      every environment variable still reads as correctly set — so
      scripts/deploy.sh passes it as a --build-arg as well.

      When it is genuinely unset these rewrites are simply not emitted, so a
      missing analytics host cannot break the build.
    */
    /*
      Next prerenders these pages and ships them with s-maxage=31536000 — a
      one-year SHARED-cache lifetime. Behind a CDN that means a deploy becomes
      invisible for a year, and even without one, intermediaries and some
      browsers hold the document far longer than a launch week can tolerate.

      Documents must always revalidate; the immutable, content-hashed assets
      under /_next/static keep their long life untouched. /media is versioned by
      filename (.v1.), so it can also be immutable.
    */
    async headers() {
        return [
            {
                source: "/:path*",
                headers: [
                    { key: "Cache-Control", value: "public, max-age=0, must-revalidate" },
                ],
            },
            {
                source: "/media/:path*",
                headers: [
                    { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
                ],
            },
        ];
    },

    async rewrites() {
        const host = process.env.UMAMI_HOST;
        if (!host) return [];
        return [
            { source: "/js/mw.js", destination: `${host}/script.js` },
            { source: "/api/send", destination: `${host}/api/send` },
        ];
    },

    async redirects() {
        return [
            // "/" -> "/magy", TEMPORARY (founder's call, 2026-08-12).
            //
            // Two rules, not one, and the apex variant has to sit ABOVE the
            // apex->www catch-all below: otherwise apex "/" would take two hops
            // (apex/ -> www/ -> www/magy), and the cutover runbook requires no
            // redirect chain longer than one hop.
            //
            // permanent:false (307) is load-bearing. A 308 is cached by browsers
            // more or less forever, so "for now" would become "until every
            // visitor clears their cache". app/page.tsx is left in place and
            // unreachable so reverting is deleting these two entries.
            {
                source: "/",
                has: [{ type: "host", value: "1martianway.com" }],
                destination: "https://www.1martianway.com/magy",
                permanent: false,
            },
            // /idrl -> droneracingindia.com.
            //
            // Sits ABOVE the apex->www rule and carries NO host condition on
            // purpose: the destination is an absolute external URL, so one rule
            // serves apex and www visitors alike in a single hop. Adding a host
            // condition here would push apex traffic through www first and
            // break the one-hop rule the cutover runbook verifies against.
            //
            // 307, because the plan's position was to BUILD this page rather
            // than link out — IDRL is the only venture with third-party proof
            // (the DD Sports coverage), and an outbound link exports that
            // credibility off-domain. Keeping it temporary leaves that open.
            { source: "/idrl", destination: "https://droneracingindia.com", permanent: false },
            { source: "/idrl/:path*", destination: "https://droneracingindia.com", permanent: false },
            /*
              /martianos -> /magy, TEMPORARY.

              The page states <1μs latency, 1000Hz sustained, 100% memory safety
              and zero overhead as ACHIEVED specifications, while mos-hal,
              mos-rtos and mos-kernel are stubs and no physical hardware has ever
              run it. Every link to it was removed sitewide; this makes the URL
              itself unreachable so the claims cannot be served to anyone who
              has the address.

              Unlike /products — unlinked but merely noindex'd, because "not
              ready to show" is different from "says things that aren't true" —
              this one should not render at all.

              307, and the page file is untouched, so restoring it is deleting
              these two rules once the claims are either true or reframed as
              design targets.
            */
            { source: "/martianos", destination: "/magy", permanent: false },
            { source: "/martianos/:path*", destination: "/magy", permanent: false },
            /*
              /artificialintelligence -> /magy, TEMPORARY.

              Same defect as /martianos, and literally the same number: the page
              states "<1μs latency for critical consciousness loops" alongside
              100 TOPS neural processing, quantum error correction, infinite
              memory capacity, 99.9% consciousness uptime and Level 4 full
              sentience — all as SHIPPED capability, all built on the Martian OS
              claims already redirected away above.

              Whoever removed the "Explore Martian OS" CTA from this page
              because those specs are unverified left the same specs on the page
              itself. robots.ts explicitly invites GPTBot, ClaudeBot and
              PerplexityBot, so every day this renders it is being copied into
              model training and answer engines, where a redirect cannot reach it.

              /magy is the destination because it is the honest version of the
              same subject — AI agents, with the numbers measured.
            */
            { source: "/artificialintelligence", destination: "/magy", permanent: false },
            { source: "/artificialintelligence/:path*", destination: "/magy", permanent: false },
            /*
              /brands -> /about, TEMPORARY.

              Not a claims problem so much as a contradiction: app/about/page.tsx
              was written to REPLACE this page ("presented IDRL alongside two
              'divisions' that read as padding around one real thing"), and both
              were live in the sitemap at once, describing the same company
              differently. It also carries four unsourced IDRL figures — 300+
              events, 50ms AI response, 200+ km/h, 15+ teams.

              /about is a genuinely equivalent destination rather than a
              convenient one, which is why this redirect is correct where
              /geospatial's would not have been: it is the page that took over
              this one's job, and it still covers IDRL.
            */
            { source: "/brands", destination: "/about", permanent: false },
            { source: "/brands/:path*", destination: "/about", permanent: false },
            /*
              /products -> /about, TEMPORARY.

              This page was previously handled one notch more gently than
              /martianos — unlinked and noindex'd, but still served — on the
              reasoning that "not ready to show" differs from "says things that
              aren't true". Reading it, it is the second category: four humanoid
              models with heights, weights, payloads, battery life, ±0.1mm
              precision, "Medical Certified" and "AI Level: Consciousness", for
              a line with no shipped hardware.

              noindex was never the right tool for that anyway. It asks a
              crawler not to list the page; it does nothing about anyone who has
              the URL, and nothing about the AI crawlers robots.ts invites.

              The noindex block in the page's own metadata is deliberately left
              in place: if this redirect is ever removed, that is the weaker
              protection to fall back to, not nothing.
            */
            { source: "/products", destination: "/about", permanent: false },
            { source: "/products/:path*", destination: "/about", permanent: false },
            // Apex -> www.
            //
            // This redirect USED to be a Vercel dashboard setting, which means it
            // disappears the moment DNS moves off Vercel. Every URL this repo
            // emits (metadataBase, sitemap, robots, JSON-LD) points at the apex,
            // so without this the apex would start serving 200s and we'd have the
            // same content on two hostnames with no canonical.
            //
            // /up is excluded so a health check that arrives with an apex Host
            // header still answers 200 instead of 308.
            {
                source: "/:path((?!up$).*)",
                has: [{ type: "host", value: "1martianway.com" }],
                destination: "https://www.1martianway.com/:path",
                permanent: true,
            },
            // The www (and any other host) case of the "/" -> "/magy" rule above.
            { source: "/", destination: "/magy", permanent: false },
            /*
              /geospatial has no rule and should not get one. It used to
              redirect to /martianos, which now redirects itself, and pointing
              it at /magy instead would send someone looking for aerial survey
              work to an AI agent platform — an irrelevant redirect that Google
              treats as a soft 404 anyway. A deleted page returning 404 is the
              honest answer.
            */
        ];
    },
};

module.exports = nextConfig;
