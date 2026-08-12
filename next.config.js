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

      UMAMI_HOST is set at deploy time; when it is unset these rewrites are
      simply not emitted, so a missing analytics host cannot break the build.
    */
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
            // /geospatial was deleted in 31f48af but four links kept pointing at
            // it. Those are fixed now; this catches external inbound links.
            { source: "/geospatial", destination: "/martianos", permanent: true },
            { source: "/geospatial/:path*", destination: "/martianos", permanent: true },
        ];
    },
};

module.exports = nextConfig;
