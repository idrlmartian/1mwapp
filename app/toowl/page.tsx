import type { Metadata } from "next";
import Link from "next/link";
import { ComingSoon, Metrics, Panel } from "@/app/components/ui/Panel";
import { Bullets, Eyebrow, Receipts, Showcase, Visual } from "@/app/components/ui/Showcase";
import ToowlPerch from "@/app/components/ui/ToowlPerch";
import ToowlOwl from "@/app/components/ui/ToowlOwl";
import CopyCommand from "@/app/components/ui/CopyCommand";
import { OG_IMAGE, TOOWL_URL } from "@/app/lib/constants";

/*
  Content mirrored from the live site at toowl.karmasteels.com so the two pages
  say the same thing. Copy is verbatim where it is the brand's own voice.

  Two things to know:
    · The install domain is toowl.dev — registered to us at Cloudflare, and the
      single name used by install.sh's header, website/src/content/seo.ts, and
      the Homebrew formula's homepage. This page previously printed toowl.sh,
      which RDAP and whois.nic.sh confirm was never registered by anyone; that
      is why `curl -fsSL https://toowl.sh/install.sh | sh` returned 000 rather
      than a 404. The toowl.dev apex still has no A/CNAME record, so the
      command here does not work yet — see deploy-website.yml's LAUNCH GATE in
      the toowl repo for the four steps that make it resolve.
    · toowl WILL be open source (decision 2026-08-13); the toowl-pro repo stays
      private. Until the repo is actually flipped public, this page must not
      link to it or call it open — a 404'd repo link is exactly the kind of
      unverifiable claim the site's strategy depends on avoiding. Add the CTA
      on flip day, not before.
*/

export const metadata: Metadata = {
    title: "toowl — Terminal You Will Love",
    description:
        "A GPU-fast desktop terminal and a tmux-style remote client in one binary — with daemon-backed workspaces and Claude on the Perch.",
    alternates: { canonical: "https://www.1martianway.com/toowl" },
    openGraph: {
        title: "toowl — Terminal You Will Love",
        description:
            "A GPU-fast desktop terminal and a tmux-style remote client in one binary, with Claude on the Perch.",
        url: "https://www.1martianway.com/toowl",
        images: [OG_IMAGE],
    },
};


const STATS = [
    { value: "<80ms", label: "cold start" },
    { value: "~80MB", label: "idle memory" },
    { value: "60fps", label: "smooth-glide cursor" },
    { value: "1 binary", label: "GUI + TUI" },
    { value: "37", label: "focused crates" },
    { value: "16", label: "built-in themes" },
] as const;

const BREAKTHROUGHS = [
    [
        "GPU-fast, idle-quiet",
        "A wgpu renderer that draws only when something changes — an <80ms cold-start target, ~80MB at rest, and a cursor that glides while it moves but costs nothing when you're reading.",
    ],
    [
        "Daemon-backed workspaces",
        "Named workspaces are owned by toowld, not the window. Close the window to detach; reopen to reattach — sessions keep running. Local or remote, same UI with an @host badge.",
    ],
    [
        "Two clients, one binary",
        "The same binary is a GPU desktop app on your laptop and a tmux-style crossterm client over SSH — talking to the daemon over a Unix socket, SSH-stdio, or WebSocket.",
    ],
    [
        "Claude on the Perch",
        "Open the sidebar and the Claude Feather is already there: your Claude Code sessions, resumable and crash-recoverable, integrated into the command palette. No browser detour.",
    ],
] as const;

const FEATHER = [
    ["Resume any session", "Every Claude Code conversation in this directory shows on the Perch, one click away."],
    ["Crash recovery, built in", "When Claude goes down mid-task, the Feather detects it and offers a one-key restart. Your context survives."],
    ["Palette-integrated", "Cmd-Shift-P opens Claude commands alongside terminal actions. One muscle memory, two superpowers."],
] as const;

/** The vocabulary is the brand — it is what makes toowl memorable. */
const GLOSSARY = [
    ["the Perch", "the left sidebar surface where feathers render their views"],
    ["Feather", "an extension — what other tools call a plugin"],
    ["the Claude Feather", "first-party Claude Code integration, shipped in v1.0"],
    ["Roost", "daemonize a pane, or a named workspace"],
    ["the Aviary", "the Feather registry — soon"],
    ["Hoot", "banner-style notifications from feathers — planned"],
] as const;

/*
  The shipped toowl version, read from toowl.dev rather than typed here.

  This badge said "v1.0 shipped" for eleven minor releases, because nothing
  connected it to a release -- it could only ever be corrected by someone
  noticing. toowl.dev/version.json is generated from [workspace.package].version
  in the toowl repo's Cargo.toml, and that repo's deploy refuses to publish a
  build whose HTML does not carry that version, so this inherits a guard rather
  than becoming a second thing to remember.

  Revalidated hourly, so a release shows up here without redeploying this site
  -- which matters because this repo has no CI/CD and ships by hand.

  Null on any failure, and the badge then reads just "shipped". A stale
  hardcoded number is worse than no number: it states something false with
  total confidence, which is the exact failure being fixed.
*/
async function shippedVersion(): Promise<string | null> {
    try {
        const res = await fetch("https://toowl.dev/version.json", {
            next: { revalidate: 3600 },
        });
        if (!res.ok) return null;
        const data: unknown = await res.json();
        const v = (data as { version?: unknown } | null)?.version;
        return typeof v === "string" && /^\d+\.\d+\.\d+$/.test(v) ? v : null;
    } catch {
        return null;
    }
}

export default async function ToowlPage() {
    const version = await shippedVersion();
    return (
        <ComingSoon>
            {/*
                THE HERO IS FLUSH — no card, no border, no radius.

                Everything below it stays in panels, and that contrast is the
                point rather than an inconsistency: the mockup's voice is
                "hairline rules instead of cards with shadows", and a hero that
                sits in the same box as the sections under it reads as the
                first of a list of equals. Off the card, it is the page.
            */}
            <section className="pt-10 pb-4">
                {/*
                    The GROUP is centred; the text inside it is not.

                    justify-between pinned the copy to the far left and the
                    mascot to the far right, so at 1500px the hero was mostly the
                    gap between them. justify-center with a fixed gap keeps the
                    two halves a deliberate distance apart at any width.

                    text-center was tried here and reverted. It broke two things
                    at once: the wordmark row is a flex (name, rule, chip) so it
                    stays full-width and its name sat hard left while everything
                    under it centred, and centred lines of different lengths
                    gave the block a ragged left edge with nothing to read back
                    to. Left-aligned copy inside a centred group is the shape
                    that actually reads.

                    The gap is wide at lg because the speech bubble hangs off the
                    mascot's left and needs somewhere to live — see the note on
                    the bubble below.
                */}
                <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-8 lg:gap-x-28">
                    <div className="min-w-0 max-w-[58ch] flex-1 basis-[440px]">
                        {/*
                            Same wordmark treatment as /magy, and for the same
                            reason: the loudest thing here was a tagline that
                            never says which product it belongs to, and the <h1>
                            did not contain "toowl" at all.

                            Caps with open tracking reads as a NAME rather than a
                            second headline, so it sits above the tagline without
                            competing. The hairline rule is deck-label's device.
                            Status chip is green, not red — v1 has shipped,
                            where Magy is still early access.
                        */}
                        {/*
                            The mockup's hero, and every difference from what
                            stood here is one of its rules:

                            · The headline is the SENTENCE, in the serif
                              display face. It was "Terminal You Will Love"
                              with "You Will Love" in blue — a tagline in a
                              second colour, saying nothing a reader could
                              check. Emphasis is weight here, never hue.

                            · The name moved into the eyebrow. A caps wordmark
                              at 2rem competed with the headline under it for
                              the same job; at 10px tracked out it labels the
                              page and gets out of the way.

                            · The version chip stays. It is the one thing on
                              this page fetched from the product's own release
                              rather than typed, and green is semantic — it
                              says "shipped", it is not an accent.
                        */}
                        <p className="deck-label mb-4 flex items-center gap-3">
                            Free on macOS, Linux and Windows
                            <span className="text-good inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-capsule)] bg-[color-mix(in_srgb,var(--color-good)_14%,transparent)] px-2.5 py-1 font-mono text-[10px] font-bold tracking-[0.14em]">
                                <i className="bg-good size-1.5 rounded-full" />
                                {version ? `V${version} SHIPPED` : "SHIPPED"}
                            </span>
                        </p>
                        <h1 className="font-display max-w-[15ch] text-[clamp(2rem,5vw,3.5rem)] leading-[1.04] font-light tracking-[-0.028em] text-balance">
                            A terminal you&rsquo;ll actually{" "}
                            <em className="font-semibold not-italic">keep</em>.
                        </h1>
                        <p className="text-fg-muted mt-5 max-w-[56ch] text-[17px] leading-[1.62]">
                            GPU-fast and idle-quiet. A desktop app and a tmux-style remote client
                            in one binary, with your Claude sessions on the Perch &mdash;
                            resumable, crash-recoverable, no browser.
                        </p>
                        <p className="text-fg-dim mt-3 font-mono text-[12.5px]">
                            <b className="text-fg">toowl</b> &middot; pronounced /tuːl/ &mdash; like
                            &ldquo;tool&rdquo;. The owl is just here for moral support.
                        </p>

                        {/* The `$` is rendered but NOT copied — see CopyCommand. */}
                        <CopyCommand className="mt-6 max-w-[31rem]" command={`curl -fsSL ${TOOWL_URL}/install.sh | sh`} />

                        {/*
                            THE SITE SIGNAL, not toowl's amber.

                            The amber was tried here on the mockup's rule —
                            each product spends its one colour on the action —
                            and it is wrong on a real page for two reasons the
                            mockup could not show. The header carries a filled
                            signal-orange CTA on every route, so the amber put
                            two different warm fills on one screen competing to
                            be the thing you click. And at button size #b98a3f
                            goes muddy: it reads as a DISABLED control next to
                            the crisp one above it.

                            The consistent rule is the stronger one anyway —
                            the signal always means "this is the action", and a
                            product's colour identifies the product. toowl's
                            amber keeps the dot on the hub and its accents; it
                            does not also have to be the button.
                        */}
                        <div className="mt-5 flex flex-wrap gap-2.5">
                            <a
                                href={TOOWL_URL}
                                className="bg-red hover:bg-red-hover text-on-red shadow-[var(--shadow-cta)] inline-flex items-center gap-2 rounded-[var(--radius-md)] px-5 py-3 text-sm font-semibold transition-colors"
                            >
                                Install toowl <span aria-hidden>&rarr;</span>
                            </a>
                            <a
                                href={`${TOOWL_URL}/docs`}
                                className="border-line-hi text-fg hover:bg-sunk inline-flex items-center rounded-[var(--radius-md)] border px-5 py-3 text-sm font-semibold transition-colors"
                            >
                                Read the docs
                            </a>
                        </div>
                        <p className="text-fg-dim mt-3 text-[12.5px]">
                            Free to use. No account needed.
                        </p>
                    </div>

                    {/*
                        The mascot as toowl actually draws it, not the favicon
                        mark. The bubble is content rather than decoration — the
                        rhyme is what teaches the /tuːl/ pronunciation — so the
                        visible text is aria-hidden and a real sentence sits
                        behind it for anyone who cannot see the joke land.
                    */}
                    <div className="owl-stage shrink-0">
                        <div className="owl-bubble left-[-96px] top-[26px] max-lg:hidden" aria-hidden>
                            <span>
                                Oh so <em>toowl</em>
                            </span>
                        </div>
                        <span className="sr-only">
                            toowl is pronounced like the word &ldquo;tool&rdquo;, and rhymes with
                            &ldquo;cool&rdquo;.
                        </span>
                        <ToowlOwl size={232} />
                    </div>
                </div>
            </section>

            <Panel label="By the numbers">
                <Metrics items={STATS} />
            </Panel>

            {/*
                Was three flat cards under a paragraph — the weakest section on
                the page, and the one toowl's own site does best. Same content in
                the Showcase pattern, with the Perch drawn beside it.
            */}
            <Panel label="First feather on the Perch">
                <Showcase
                    visual={
                        /*
                          The caption claims only what is true and verifiable:
                          these features ship. It says nothing about how the
                          picture was made, which is the part that kept going
                          wrong — "Real UI" asserted a drawing was a capture,
                          and "Illustration" hedged the other way, pointing at
                          the medium instead of the product.

                          state stays "drawn" because that IS what this is, and
                          Visual's contract uses it to mean "an illustration we
                          authored". The prop is the honest record; the caption
                          is the sentence a reader gets. Switch to "pending"
                          only if this slot is ever waiting on a real capture.
                        */
                        <Visual
                            caption="The Perch, the session list, the crash banner and palette integration — all shipped in v1.0."
                            state="drawn"
                        >
                            <ToowlPerch />
                        </Visual>
                    }
                >
                    <Eyebrow
                        icon={
                            <svg viewBox="0 0 24 24" className="size-[13px] shrink-0" fill="currentColor" aria-hidden>
                                <path d="M12 2 2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
                            </svg>
                        }
                    >
                        First feather on the Perch
                    </Eyebrow>
                    <h2 className="text-h2">Claude on the Perch.</h2>
                    <p className="text-fg-muted mt-2.5 max-w-[47ch] text-[14px]">
                        Open the Perch (<kbd className="border-line bg-sunk text-fg rounded-[4px] border px-1.5 py-0.5 font-mono text-[11px]">⌘B</kbd>).
                        The Claude Feather is already there — no setup, no detour through a browser.
                    </p>
                    <Bullets items={FEATHER.map(([title, body]) => ({ title, body }))} />
                    <Receipts>
                        Built on toowl&apos;s first-party <code className="font-mono text-[12px]">toowl-plugin-agent</code>.
                        Shipped, tested, in this binary — bring your own{" "}
                        <code className="font-mono text-[12px]">claude</code> binary and the Feather handles the rest.
                    </Receipts>
                </Showcase>
            </Panel>

            <Panel label="Breakthroughs, not bullet points">
                <h2 className="text-h2 mb-4 max-w-[52ch]">
                    The handful of things toowl does that no other terminal puts in one binary.
                </h2>
                <div className="grid gap-3 sm:grid-cols-2">
                    {BREAKTHROUGHS.map(([t, b]) => (
                        <div key={t} className="border-line bg-sunk rounded-[var(--radius-md)] border p-4">
                            <h3 className="text-h3 font-bold">{t}</h3>
                            <p className="text-fg-muted mt-1.5 text-[13px]">{b}</p>
                        </div>
                    ))}
                </div>
            </Panel>

            <div className="grid gap-3.5 lg:grid-cols-[1.15fr_0.85fr]">
                <Panel label="One daemon. Every client.">
                    <h2 className="text-h2 mb-2">Your sessions live in the daemon, not the window.</h2>
                    <p className="text-fg-muted mb-4 text-[13.5px]">
                        Attach from the desktop app, a tmux-style TUI over SSH, or a browser — local
                        or across the world, same UI. One daemon per host owns your workspaces; any
                        client attaches over a transport.
                    </p>
                    <div className="grid gap-3 sm:grid-cols-2">
                        <div>
                            <p className="deck-label mb-2">Clients</p>
                            <ul className="text-fg-muted space-y-1.5 font-mono text-[12px]">
                                <li>Desktop GUI · wgpu, native chrome</li>
                                <li>TUI client · crossterm, over SSH</li>
                                <li>Browser · roost-web, scoped URL</li>
                            </ul>
                        </div>
                        <div>
                            <p className="deck-label mb-2">Transport</p>
                            <ul className="text-fg-muted space-y-1.5 font-mono text-[12px]">
                                <li>Unix socket</li>
                                <li>SSH-stdio</li>
                                <li>WebSocket / WSS</li>
                            </ul>
                        </div>
                    </div>
                </Panel>

                <Panel label="A terminal for owls">
                    <h2 className="text-h2 mb-3">The vocabulary</h2>
                    <dl className="grid gap-2.5">
                        {GLOSSARY.map(([term, def]) => (
                            <div key={term} className="border-line border-b pb-2.5 last:border-0">
                                <dt className="text-fg font-mono text-[12.5px] font-bold">{term}</dt>
                                <dd className="text-fg-muted mt-0.5 text-[12.5px]">{def}</dd>
                            </div>
                        ))}
                    </dl>
                </Panel>
            </div>

            <Panel label="Install your way" id="install">
                <p className="text-fg-muted mb-4 text-[13.5px]">
                    Two paths, same outcome. Pick the one your environment already loves.
                </p>
                <div className="grid gap-3 sm:grid-cols-2">
                    {[
                        ["curl · macOS / Linux", `curl -fsSL ${TOOWL_URL}/install.sh | sh`, "Detects your OS and arch, downloads the matching binary, verifies the SHA256, installs to ~/.toowl/bin/toowl. About five seconds on a fresh machine."],
                        ["Homebrew", "brew install 1martianway/tap/toowl", "Installs from toowl's Homebrew tap. Auto-updates via brew upgrade. Use this if you already manage tools with brew."],
                    ].map(([title, cmd, body]) => (
                        <div key={title} className="border-line bg-sunk rounded-[var(--radius-md)] border p-4">
                            <p className="deck-label mb-2">{title}</p>
                            {/* Copyable here too. A visitor who scrolls to the
                                install section is further along than one who
                                skimmed the hero, so this is the more likely
                                place they actually reach for the command. */}
                            <CopyCommand command={cmd} />
                            <p className="text-fg-muted mt-1 text-[12.5px]">{body}</p>
                        </div>
                    ))}
                </div>
                <p className="text-fg-dim mt-3.5 text-[12.5px]">
                    Pre-built binaries ship for Linux (x86_64 and aarch64) with every release. macOS
                    and Windows build from source via Homebrew.
                </p>
            </Panel>

            {/*
              The "Get Early Access" block is gone (2026-08-26). toowl is free
              and installs with one command; ending the page by asking for an
              email to join a list for something else undercut that. The page
              now closes on the install, which is the action we actually want.
            */}
            <p className="text-fg-dim mt-2 text-center text-[12.5px]">
                <Link href="/about" className="text-red hover:underline">
                    More from 1 Martian Way
                </Link>
            </p>
        </ComingSoon>
    );
}
