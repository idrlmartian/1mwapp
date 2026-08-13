import type { Metadata } from "next";
import Link from "next/link";
import WaitlistForm from "@/app/components/WaitlistForm";
import { ComingSoon, Metrics, Panel } from "@/app/components/ui/Panel";
import { Bullets, Eyebrow, Receipts, Showcase, Visual } from "@/app/components/ui/Showcase";
import ToowlPerch from "@/app/components/ui/ToowlPerch";
import ToowlOwl from "@/app/components/ui/ToowlOwl";

/*
  Content mirrored from the live site at toowl.karmasteels.com so the two pages
  say the same thing. Copy is verbatim where it is the brand's own voice.

  Two things to know:
    · Links point at https://toowl.sh, which does not resolve yet. That is a
      deliberate call — the founder wants the destination published now.
    · Toowl is NOT open source and the repository is private. The live site at
      toowl.karmasteels.com still says "Open source. Free forever." and carries
      a GitHub CTA — both are wrong and should be corrected there too. Nothing
      on this page claims an open licence, and there is no repo link.
*/

export const metadata: Metadata = {
    title: "Toowl — Terminal You Will Love",
    description:
        "A GPU-fast desktop terminal and a tmux-style remote client in one binary — with daemon-backed workspaces and Claude on the Perch.",
    alternates: { canonical: "https://www.1martianway.com/toowl" },
    openGraph: {
        title: "Toowl — Terminal You Will Love",
        description:
            "A GPU-fast desktop terminal and a tmux-style remote client in one binary, with Claude on the Perch.",
        url: "https://www.1martianway.com/toowl",
    },
};

const TOOWL_URL = "https://toowl.sh";

const STATS = [
    { value: "<80ms", label: "cold start" },
    { value: "~80MB", label: "idle memory" },
    { value: "120fps", label: "smooth-glide cursor" },
    { value: "1 binary", label: "GUI + TUI" },
    { value: "29", label: "focused crates" },
    { value: "17", label: "built-in themes" },
] as const;

const BREAKTHROUGHS = [
    [
        "GPU-fast, idle-quiet",
        "A wgpu renderer that draws only when something changes — <80ms cold start, ~80MB at rest, and a cursor that glides at your display's refresh rate but costs nothing when you're reading.",
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

/** The vocabulary is the brand — it is what makes Toowl memorable. */
const GLOSSARY = [
    ["the Perch", "the left sidebar surface where feathers render their views"],
    ["Feather", "an extension — what other tools call a plugin"],
    ["the Claude Feather", "first-party Claude Code integration, shipped in v1.0"],
    ["Roost", "daemonize a pane, or a named workspace"],
    ["the Aviary", "the Feather registry — soon"],
    ["Hoot", "banner-style notifications from feathers — planned"],
] as const;

export default function ToowlPage() {
    return (
        <ComingSoon>
            <Panel>
                <div className="flex flex-wrap items-start justify-between gap-6">
                    <div className="min-w-0 flex-1">
                        {/*
                            Same wordmark treatment as /magy, and for the same
                            reason: the loudest thing here was a tagline that
                            never says which product it belongs to, and the <h1>
                            did not contain "toowl" at all.

                            Caps with open tracking reads as a NAME rather than a
                            second headline, so it sits above the tagline without
                            competing. The hairline rule is deck-label's device.
                            Status chip is green, not red — v1.0 has shipped,
                            where Magy is still early access.
                        */}
                        <h1 className="mb-3">
                            <span className="flex items-center gap-3">
                                <span className="-mr-[0.16em] text-[clamp(1.55rem,3vw,2rem)] font-extrabold uppercase leading-none tracking-[0.16em]">
                                    toowl
                                </span>
                                <span className="bg-line h-px flex-1" />
                                <span className="text-good inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-capsule)] bg-[color-mix(in_srgb,var(--color-good)_14%,transparent)] px-2.5 py-1 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em]">
                                    <i className="bg-good size-1.5 rounded-full" />
                                    v1.0 shipped
                                </span>
                            </span>
                            <span className="text-hero mt-4 block">
                                Terminal <em className="text-blue not-italic">You Will Love.</em>
                            </span>
                        </h1>
                        <p className="text-fg-dim mb-3 font-mono text-[12.5px]">
                            <b className="text-fg">toowl</b> · pronounced /tuːl/ — like &ldquo;tool&rdquo;.
                            The owl is just here for moral support.
                        </p>
                        <p className="text-fg-muted max-w-[58ch] text-[14px]">
                            A GPU-fast desktop terminal and a tmux-style remote client in one binary
                            — with daemon-backed workspaces and Claude on the Perch.
                        </p>

                        {/* inline-flex, not flex: a block-level flex container
                            fills its parent, so the box ran the full column
                            width with most of it empty. w-fit shrink-wraps to
                            the command; max-w-full keeps it scrollable rather
                            than overflowing on a narrow screen. */}
                        <div className="border-line bg-sunk mt-5 inline-flex w-fit max-w-full items-center gap-3 overflow-x-auto rounded-[var(--radius-md)] border px-3.5 py-3 font-mono text-[12.5px]">
                            <span className="text-good shrink-0">$</span>
                            <code className="text-fg-muted whitespace-nowrap">
                                curl -fsSL {TOOWL_URL}/install.sh | sh
                            </code>
                        </div>

                        <div className="mt-4 flex flex-wrap gap-2.5">
                            <a
                                href={TOOWL_URL}
                                className="bg-red hover:bg-red-hover shadow-[var(--shadow-cta)] inline-flex items-center gap-2 rounded-[var(--radius-md)] px-5 py-3 text-sm font-bold text-white transition-colors"
                            >
                                Get toowl <span aria-hidden>→</span>
                            </a>
                            <a
                                href={`${TOOWL_URL}/docs`}
                                className="border-line-hi text-fg hover:bg-sunk inline-flex items-center rounded-[var(--radius-md)] border px-5 py-3 text-sm font-bold transition-colors"
                            >
                                Read the docs
                            </a>
                        </div>
                        <p className="text-fg-dim mt-3 text-[12.5px]">
                            Free to use. macOS · Linux · Windows.
                        </p>
                    </div>

                    {/*
                        The mascot as toowl actually draws it, not the favicon
                        mark. The bubble is content rather than decoration — the
                        rhyme is what teaches the /tuːl/ pronunciation — so the
                        visible text is aria-hidden and a real sentence sits
                        behind it for anyone who cannot see the joke land.
                    */}
                    <div className="owl-stage mx-auto shrink-0 sm:mx-0">
                        <div className="owl-bubble left-[-118px] top-[52px] max-lg:hidden" aria-hidden>
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
            </Panel>

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
                        <Visual caption="Real UI — the Perch, the session list, the crash banner, palette integration. All in v1.0." state="drawn">
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
                        Built on toowl&apos;s first-party <code className="font-mono text-[12px]">toowl-plugin-claude</code>.
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

            <Panel label="Install your way">
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
                            <code className="text-fg block overflow-x-auto whitespace-nowrap font-mono text-[12px]">{cmd}</code>
                            <p className="text-fg-muted mt-2.5 text-[12.5px]">{body}</p>
                        </div>
                    ))}
                </div>
                <p className="text-fg-dim mt-3.5 text-[12.5px]">
                    Pre-built binaries ship for Linux (x86_64 and aarch64) with every release. macOS
                    and Windows build from source via Homebrew.
                </p>
            </Panel>

            <section className="border-line bg-solid shadow-[var(--shadow-deck)] rounded-[var(--radius-lg)] border px-6 py-10 text-center [background:radial-gradient(70%_120%_at_50%_0%,var(--color-red-soft),transparent_68%),var(--color-solid)]">
                <h2 className="text-[clamp(1.3rem,3vw,2rem)] font-extrabold tracking-[-0.03em]">
                    Get Early Access
                </h2>
                <p className="text-fg-muted mx-auto mt-2.5 max-w-[46ch] text-sm">
                    Toowl Pro adds terminal-native intelligence. We&apos;ll email you when it opens.
                </p>
                <div className="mx-auto mt-5 max-w-[470px]">
                    <WaitlistForm source="toowl" product="toowl" size="hero" cta="Get Early Access" autoFocus />
                </div>
                <p className="text-fg-dim mt-6 text-[12.5px]">
                    Also from 1 Martian Way:{" "}
                    <Link href="/magy" className="text-blue hover:underline">Magy</Link>
                    {" · "}
                    <Link href="/mos" className="text-blue hover:underline">MOS</Link>
                </p>
            </section>
        </ComingSoon>
    );
}
