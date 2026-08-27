/**
 * Everything the launch can need changed without touching JSX.
 */

/** Swap this when the launch film is live. One constant, no component edits. */
export const MAGY_YOUTUBE_ID: string | null = null;

/** Hero loop. Encoded by scripts/make-hero-poster.mjs + the ffmpeg recipe in
 *  1mw-gtm/lanes/magy/launch-video-plan.md. Version the filenames — /media is
 *  served immutable, so a bare overwrite would be cached forever. */
export const HERO = {
    poster: "/media/magy-hero-1600.v1.avif",
    posterFallback: "/media/magy-hero-1600.v1.jpg",
    mp4: "/media/magy-hero-1600.v1.mp4",
    webm: "/media/magy-hero-1600.v1.webm",
} as const;

/** Present tense: what a visitor sees moving in the world pane. */
export const WORLD = {
    name: "magy",
    dims: "36 × 20 × 5 m",
    outdoor: "26 × 18 m",
    // Verified against magyverse/public/worlds/magy/scene.json.
    zones: "office · outdoors · library",
} as const;

export type Agent = {
    id: string;
    name: string;
    role: string;
    token: string;
    /** Designed and named, but NOT seeded in the runtime yet. See ARGUS below. */
    pending?: boolean;
};

/** The starting cast. `token` maps to a --color-* in theme.css.
 *  Colours here are DATA — chips and dots only, never chrome. */
export const AGENTS: Agent[] = [
    { id: "aria", name: "Aria", role: "CTO", token: "aria" },
    { id: "juno", name: "Juno", role: "PM", token: "juno" },
    { id: "nova", name: "Nova", role: "Lead", token: "nova" },
    { id: "kai", name: "Kai", role: "Dev", token: "kai" },
    { id: "zara", name: "Zara", role: "Dev", token: "zara" },
    { id: "luna", name: "Luna", role: "QA", token: "luna" },
    { id: "atlas", name: "Atlas", role: "Ops", token: "atlas" },
    /*
      ARGUS — the eighth agent. The hundred-eyed watchman who never had every
      eye closed. Sits between Luna and Atlas: she checks that it works, he
      checks that it is safe, then it ships.

      SEEDED AND LIVE as of magy 4a0bbed9 / migration 139, applied to the
      production `magy` database 2026-08-13. Verified before this flag came off:
      the row exists with 16 tools and role "security", the runtime's working
      directory is /home/ubuntu/repos/magy so its relative prompt path resolves,
      and prompts/argus-security.md is on disk and readable by the runtime user
      — llm_agent/mod.rs:440 hard-errors on a missing prompt file, so the row
      alone would have produced an agent that could not be constructed.

      That verification is the point of the flag, not ceremony. It existed so
      the page could not claim an agent the runtime did not have — the exact
      defect that got /martianos, /artificialintelligence, /brands and /products
      redirected away, on the page those redirects were protecting.
    */
    { id: "argus", name: "Argus", role: "Security", token: "argus" },
];

/** Agents actually in the runtime today — what the cast headline may count. */
export const SHIPPING_AGENTS = AGENTS.filter((a) => !a.pending);

/** Every number here is measured and published in the magy repo. Do not round,
 *  do not embellish — the whole page's credibility rests on these being exact. */
export const METRICS = [
    // "on screen" is load-bearing, not filler. This is a RENDERING measurement
    // — ambient crowd avatars drawn client-side. It is not 100,000 LLM-backed
    // agents doing work; the working fleet is ~10, each max_concurrent_tasks:1.
    // Beside copy about engineers shipping pull requests, the bare number reads
    // as 100,000 workers, and a reader who checks stops trusting the other five.
    { value: "100,000", label: "agents on screen @ 60.0 fps" },
    { value: "1", label: "draw call" },
    { value: "25 B", label: "per agent" },
    { value: "56.2", label: "fps on a phone" },
    { value: "322", label: "draw calls, scene" },
    { value: "0.14 µs", label: "per agent tick" },
] as const;

/** Illustrative of one session — labelled as such on the page. */
export const ACTIVITY = [
    { time: "09:12", token: "nova", agent: "Nova", text: "walks to the library" },
    { time: "09:31", token: "nova", agent: "", text: "knowledge graph +14 facts" },
    { time: "11:02", token: "kai", agent: "Kai", text: "delegates to Zara" },
    { time: "11:40", token: "argus", agent: "Argus", text: "cleared PR #482 — no secrets, no new advisories" },
] as const;

/** The honesty band. Shipping a limitations list on a launch page is unusual,
 *  and it is exactly why this page gets believed by the audience it targets. */
export const STATUS = [
    {
        state: "shipping" as const,
        label: "Shipping",
        text: "Agents including Argus the pre-merge security gate, MagyVerse, worktree isolation with auto-PR, four-tier memory, knowledge graph, per-agent model choice with your own keys across seven providers, Telegram, cron, skills.",
    },
    {
        state: "building" as const,
        label: "Building",
        text: "Marathon mode's worker loop is a skeleton — it logs progress but doesn't yet dispatch real work.",
    },
    {
        state: "planned" as const,
        label: "Not yet",
        text: "Slack, Jira and Notion connectors are stubs. Pre-built binaries and the paid tier are next.",
    },
];

export const NAV = [
    /*
      Magy and MOS are commented out, not deleted (2026-08-26): both stay
      unpublished until the patent filings are settled, and the pages
      themselves keep rendering so the products' own separate deployments
      are untouched. Restoring them is uncommenting
      these two lines — and the matching blocks in routes.ts, Footer.tsx,
      about/page.tsx, and the noindex in each page's own metadata.
    */
    // { href: "/magy", label: "Magy" },
    // { href: "/mos", label: "MOS" },
    { href: "/toowl", label: "toowl" },
    { href: "/about", label: "Company" },
] as const;

/*
  Where "Get toowl" goes. toowl.dev is the product's own site and the only
  place the install command, the docs and the releases actually live; this
  site's /toowl page is a summary of it. Lived as a private const inside
  app/toowl/page.tsx until the header and the 404 needed it too.
*/
export const TOOWL_URL = "https://toowl.dev";

export const COMPANY = {
    legal: "1 Martian Way Industries Pvt. Ltd.",
    email: "sales@1martianway.com",
    /*
      Companies Act 2013 s.12(3)(c) requires the CIN on a company's official
      publications, which a public website is generally read to include.
      Decodes as: U (unlisted) · 72900 (IT services) · MH · 2020 · PTC
      (private limited) — the embedded year independently corroborates
      foundingDate "2020" in StructuredData.tsx, so keep the two in step.
    */
    cin: "U72900MH2020PTC343654",
    /*
      DPDP Act 2023 requires a Data Fiduciary to publish the contact details of
      a named person who can answer questions about how personal data is
      processed. The waitlist makes us one the moment it collects an address,
      so this is an obligation rather than a courtesy — and it must stay a real
      reachable person, not a role placeholder.

      privacy@ is deliberately a separate alias from sales@: grievances should
      not compete with sales mail for attention, and the address outlives
      whoever holds the role.
    */
    grievanceOfficer: {
        name: "Karan Kamdar",
        title: "Grievance Officer",
        email: "privacy@1martianway.com",
    },
    address: [
        "1 Martian Way Industries Pvt. Ltd.",
        "502 Satya Sadan, Bhimani Street",
        "Matunga East, Mumbai 400 019",
        "India",
    ],
} as const;

/*
  The Open Graph card, referenced explicitly.

  `app/opengraph-image.png` is a Next file convention, and it injects `og:image`
  into a segment's OWN metadata. A page that exports its own `openGraph` object
  replaces the inherited one wholesale — so every page that customises its og
  text silently loses the image, while every page that leaves og text alone
  keeps it. Nothing warns about this; the tag is simply absent.

  Measured against production on 2026-08-27: /about, /press, /licensing and
  /contact all carried og:image. /toowl carried none — and /toowl is the page
  the apex 307s to, so the site's primary share card was a bare text card with
  `twitter:card: summary_large_image` promising an image that was never sent.

  Any page that declares `openGraph` must therefore pass `images: [OG_IMAGE]`.
  (The alternative is dropping a per-route `opengraph-image.png` into each
  segment, which duplicates a 33 KB asset to say the same thing.)

  The path is deliberately unfingerprinted. The file convention's own URL
  carries a content hash that changes every time the card is regenerated, and it
  cannot be referenced from here without importing the asset. This path is
  stable and serves the same bytes.

  The artwork is toowl's, because toowl is what the site publishes. If /magy or
  /mos come back with their own cards, give those segments their own
  opengraph-image file rather than widening this.
*/
export const OG_IMAGE = {
    url: "/opengraph-image.png",
    width: 1200,
    height: 630,
    alt: "toowl by 1 Martian Way — Terminal You Will Love. A GPU-fast terminal and a tmux-style remote client in one binary.",
} as const;
