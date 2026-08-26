import type { Metadata } from "next";
import Link from "next/link";
import WaitlistForm from "@/app/components/WaitlistForm";
import StructuredData from "@/app/components/StructuredData";
import WorldCanvas from "@/app/components/ui/WorldCanvas";
import { Metrics, Panel, Quote } from "@/app/components/ui/Panel";
import { Bullets, CaptureSlot, Eyebrow, Receipts, Showcase, Visual } from "@/app/components/ui/Showcase";
import MagyWorkspace from "@/app/components/ui/MagyWorkspace";
import CortexGraph from "@/app/components/ui/CortexGraph";
import SectionNav from "@/app/components/ui/SectionNav";
import { ACTIVITY, AGENTS, MAGY_YOUTUBE_ID, METRICS, SHIPPING_AGENTS, STATUS, WORLD } from "@/app/lib/constants";

export const metadata: Metadata = {
    title: "Magy — the 3D embodied multi-agent platform",
    description:
        "AI engineers embodied in a world you build. They delegate face to face, walk to the library to learn what they don't know, and ship a pull request while you watch. Measured at 100,000 agents rendered at 60 fps.",
    alternates: { canonical: "https://www.1martianway.com/magy" },
    /*
      Held back from publication until the patent filings are settled
      (2026-08-26). The page still renders — the product has its own separate
      deployment which must stay reachable — but it is unlinked sitewide, out of
      the sitemap, and tells crawlers not to list it. Deliberately noindex
      rather than a robots.txt Disallow: see app/lib/routes.ts for why the
      Disallow would have been the weaker of the two.
    */
    robots: { index: false, follow: false },
    openGraph: {
        title: "Magy — the 3D embodied multi-agent platform",
        description:
            "Infinite agents. Infinite worlds. Any work. Measured at 100,000 agents rendered at 60 fps.",
        url: "https://www.1martianway.com/magy",
    },
};

const SECTIONS = [
    ["demo", "Demo"],
    ["how", "How it works"],
    ["world", "The world"],
    ["cortex", "Cortex"],
    ["learning", "Learning"],
    ["cast", "Cast"],
    ["scale", "Scale"],
    ["status", "Status"],
    ["faq", "FAQ"],
] as const;

const FAQ = [
    {
        q: "Does it run locally?",
        a: "Yes. `magy assistant` is a single agent in a REPL with no NATS, no Postgres and no Redis — it runs on your machine with zero external services. The full eight-agent runtime and the 3D world need the production path.",
    },
    {
        q: "How many agents can I actually run?",
        a: "Two different numbers, and we keep them apart on purpose. The 100,000 figure is what the world renders — ambient agents drawn at 60 fps on a laptop and 56.2 on a phone. Agents that actually think are backed by an LLM, and an agent turn is spent almost entirely waiting on your model provider rather than on a server, so there is no cap on agent count in our runtime. What sets your ceiling is your model budget and your provider's rate limits — your keys, your call. We have not published a number for that because we have not measured one, and a figure we estimated would tell you less than this paragraph does.",
    },
    {
        q: "Which models does it use — and do I control that?",
        a: "You control it completely, per agent. Bring your own API keys or your Claude subscription, and assign whichever model you want to whichever agent: the strongest one for your CTO, something cheap for routine work. Seven providers are supported — Anthropic, OpenAI, Gemini, Bedrock, Ollama, Kimi and MiniMax. Set an agent to `auto` instead and Magy picks for you, inside the per-agent budget you set, and routes around a provider that is slow or rate-limited. Keys live in your own config, never in our database.",
    },
    {
        q: "Does my code leave my machine?",
        a: "Your prompts and the code context go to whichever LLM provider you configure, the same as any AI coding tool. Magy hard-limits which repositories an agent may touch, per conversation, and every task runs in its own git worktree.",
    },
    {
        q: "Is it open source?",
        a: "No. Magy is a commercial product. Licensing and pricing are being finalised — talk to us if you need specific terms.",
    },
    {
        q: "What does it cost?",
        a: "Pricing is not live yet. Early-access signups hear first, and founding-member pricing goes to that list.",
    },
    {
        q: "When can I use it?",
        a: "We are opening access in stages. Everyone on the early-access list is notified by email as soon as their turn comes up — no waiting on an announcement, no queue to check.",
    },
];

const COUNT_WORD: Record<number, string> = {
    6: "Six", 7: "Seven", 8: "Eight", 9: "Nine", 10: "Ten", 11: "Eleven", 12: "Twelve",
};

const STATUS_DOT = {
    shipping: "bg-good",
    building: "shadow-[inset_0_0_0_1.5px_var(--color-warn)]",
    planned: "shadow-[inset_0_0_0_1.5px_var(--color-fg-dim)]",
} as const;

export default function MagyPage() {
    return (
        <>
            <StructuredData type="SoftwareApplication" />

            {/*
                The hero shares the site container and gutter with everything
                below it. It was on a flat p-3.5 while the sections used
                --container-pad, so the deck ran ~50px wider on each side than
                the panels under it and the page had two different left edges
                stacked vertically — the same defect the header and footer had.

                In DARK the world is position:absolute inset:0 against this
                <main>, so it still bleeds past the gutter to the window edges.
                Padding the container does not contain the backdrop, which is
                the behaviour we want: copy respects the grid, footage does not.
            */}
            <main className="relative isolate overflow-hidden px-[var(--container-pad)] py-3.5">
                <div className="deck-grid mx-auto max-w-[var(--container-page)]">
                    <WorldCanvas />
                    <div className="deck-rail flex flex-col gap-3">
                        <section className="deck-card p-4">
                            {/*
                                The product name was a 10px mono eyebrow, so the
                                loudest thing on the page was a tagline that
                                never says what it is selling — and the <h1> did
                                not contain the word "Magy" at all, which is also
                                what a search engine and a screen reader read
                                first.

                                Both fixed by putting the wordmark INSIDE the h1
                                above the tagline. One heading, reading "Magy —
                                Infinite agents. Infinite worlds. Any work.", with
                                the name set larger than the tagline so it wins
                                the glance.
                            */}
                            <h1>
                                {/*
                                    Set as a WORDMARK, not a second heading. Caps
                                    with open tracking reads as a name; the same
                                    word at 2.9rem and -0.05em read as a headline
                                    competing with the tagline under it, which is
                                    why two large things were fighting.

                                    The hairline rule running off to the right is
                                    the device deck-label already uses on every
                                    panel header, so this lands as part of the
                                    system rather than a one-off. The status chip
                                    sits at the end of that rule, which also
                                    stops it hanging awkwardly off the wordmark's
                                    line box.

                                    Tracking adds trailing space after the final
                                    letter; -mr keeps the rule from starting a
                                    hair too far right.
                                */}
                                <span className="flex items-center gap-3">
                                    <span className="-mr-[0.16em] text-[clamp(1.55rem,3vw,2rem)] font-extrabold uppercase leading-none tracking-[0.16em]">
                                        Magy
                                    </span>
                                    <span className="bg-line h-px flex-1" />
                                    <span className="text-red-ink bg-red-soft inline-flex shrink-0 items-center gap-1.5 rounded-[var(--radius-capsule)] px-2.5 py-1 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em]">
                                        <i className="bg-red size-1.5 rounded-full" />
                                        Early access
                                    </span>
                                </span>
                                <span className="text-hero mt-4 block">
                                    Infinite agents.
                                    <br />
                                    Infinite worlds.
                                    <br />
                                    <em className="text-blue not-italic">Any work.</em>
                                </span>
                            </h1>
                            <p className="text-fg-muted mt-3 text-[13.5px]">
                                The world&apos;s first 3D embodied multi-agent platform. Build the
                                world, hire the team, watch the work happen.
                            </p>

                            <ul className="mt-3.5 flex flex-wrap gap-1.5">
                                {AGENTS.map((a) => (
                                    <li
                                        key={a.id}
                                        className="border-line bg-sunk text-fg-muted inline-flex items-center gap-1.5 rounded-[var(--radius-capsule)] border py-1 pl-2 pr-2.5 text-[11.5px]"
                                    >
                                        <i
                                            className="size-1.5 rounded-full bg-[var(--dot)] shadow-[0_0_6px_var(--dot)]"
                                            style={{ ["--dot" as string]: `var(--c-${a.token})` }}
                                        />
                                        <b className="text-fg font-semibold">{a.name}</b> {a.role}
                                        {a.pending && <span className="text-warm font-mono text-[8.5px] font-bold uppercase tracking-[0.1em]">soon</span>}
                                    </li>
                                ))}
                                <li className="border-line text-fg-dim inline-flex items-center rounded-[var(--radius-capsule)] border border-dashed px-2.5 py-1 text-[11.5px]">
                                    +∞
                                </li>
                            </ul>
                        </section>

                        <section
                            id="early-access"
                            className="border-red bg-solid shadow-[var(--shadow-deck),0_0_0_4px_var(--color-red-soft)] scroll-mt-20 overflow-hidden rounded-[var(--radius-lg)] border"
                        >
                            <div className="border-line bg-red-soft flex items-center gap-2 border-b px-3.5 py-2.5">
                                <h2 className="text-red-ink font-mono text-[12px] font-extrabold uppercase tracking-[0.15em]">
                                    Get Early Access
                                </h2>
                                <span className="text-fg-dim ml-auto inline-flex items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-[0.12em]">
                                    <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                                        <rect x="4" y="10" width="16" height="11" rx="2" />
                                        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
                                    </svg>
                                    Composer locked
                                </span>
                            </div>
                            <div className="p-3.5">
                                <p className="text-fg-muted mb-3 text-[12.5px]">
                                    This is where you&apos;ll{" "}
                                    <b className="text-fg font-bold">assign work to your agents</b>.
                                </p>
                                <WaitlistForm source="magy-hero" cta="Get Early Access" autoFocus />
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/*
                Lifted out of the rail, where it was the third stacked card.

                Three cards made the rail the tallest thing in the deck, which
                pushed the world into whatever height was left over and buried
                most of the capture behind the column. Two cards let the world
                breathe at its own ratio.

                It also reads better here: the feed and the command that produced
                it, side by side, instead of crammed into a 404px column.
            */}
            {/* pb-7, not pb-0: the sticky section nav follows immediately, and
                without a bottom gap the panel sits flush against it. Matches the
                prototype's 28px before the nav. */}
            <div className="mx-auto grid max-w-[var(--container-page)] px-[var(--container-pad)] pb-7 pt-3.5">
                <Panel label="Live activity">
                    <div className="grid gap-7 lg:grid-cols-2">
                        <ul>
                            {ACTIVITY.map((e) => (
                                <li
                                    key={e.time}
                                    className="grid grid-cols-[9px_46px_1fr] items-baseline gap-2.5 py-1 text-[12.5px]"
                                >
                                    <i
                                        className="size-1.5 translate-y-[3px] rounded-full bg-[var(--dot)] shadow-[0_0_7px_var(--dot)]"
                                        style={{ ["--dot" as string]: `var(--c-${e.token})` }}
                                    />
                                    <time className="text-fg-dim tabnum font-mono">{e.time}</time>
                                    <span className="text-fg-muted">
                                        {e.agent && <b className="text-fg font-semibold">{e.agent} </b>}
                                        {e.text}
                                    </span>
                                </li>
                            ))}
                        </ul>
                        <pre className="border-line bg-sunk text-fg-muted overflow-x-auto rounded-[var(--radius-md)] border p-3 font-mono text-[11px] leading-[1.85]">
                            <code>
                                {`$ magy delegate --to zara "extract the parser"\n`}
                                <span className="text-blue">zara</span> worktree{" "}
                                <span className="text-good">acquired</span> · feat/parser-extract{"\n"}
                                <span className="text-blue">luna</span> review{" "}
                                <span className="text-good">approved</span> → PR #482 opened
                            </code>
                        </pre>
                    </div>
                </Panel>
            </div>

            {/* Sticky section nav. Active state matches the header's current-page
                pill exactly — see the note in ui/SectionNav.tsx. */}
            <SectionNav sections={SECTIONS} />

            <div className="mx-auto grid max-w-[var(--container-page)] gap-3.5 px-[var(--container-pad)] py-3.5">
                {/* ── demo ─────────────────────────────────────────────── */}
                <Panel id="demo" label="Watch it work">
                    {/* Two columns on purpose: full-bleed 16:9 at container width makes a
                        cinema-sized player for a 90-second film, and leaves the eye nowhere
                        to go afterwards. Constraining it and putting the beats beside it
                        gives the video context and the section a second job. */}
                    <div className="grid items-start gap-5 lg:grid-cols-[1.5fr_1fr]">
                        <div>
                            {MAGY_YOUTUBE_ID ? (
                                <div className="border-line overflow-hidden rounded-[var(--radius-md)] border">
                                    <iframe
                                        className="aspect-video w-full"
                                        src={`https://www.youtube-nocookie.com/embed/${MAGY_YOUTUBE_ID}?rel=0`}
                                        title="Magy — the Magyverse"
                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                        allowFullScreen
                                    />
                                </div>
                            ) : (
                                /* The placeholder converts rather than apologises — the missing
                                   video becomes a second reason to sign up. Swap
                                   MAGY_YOUTUBE_ID and this becomes the embed. */
                                <div className="border-line bg-sunk relative grid aspect-video place-items-center overflow-hidden rounded-[var(--radius-md)] border text-center">
                                    <div className="p-6">
                                        <span className="border-line bg-solid mx-auto mb-4 grid size-12 place-items-center rounded-full border">
                                            <svg viewBox="0 0 24 24" className="text-red-ink ml-0.5 size-5" fill="currentColor" aria-hidden>
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </span>
                                        {/* Untimed on purpose. This said "lands this week",
                                            which becomes false the moment the date slips —
                                            on the one page whose whole strategy is being
                                            believed. Don't reintroduce a deadline here
                                            unless the capture is already recorded. */}
                                        <h2 className="text-h3 mb-1.5 font-bold">The demo is coming.</h2>
                                        <p className="text-fg-muted mx-auto max-w-[38ch] text-[13px]">
                                            A real capture, driven live — no mockups.
                                        </p>
                                    </div>
                                    <p className="deck-label absolute bottom-3 left-4">
                                        Magyverse · live capture · coming
                                    </p>
                                </div>
                            )}
                        </div>

                        <div>
                            <h2 className="text-h2 mb-2">What you&apos;ll see.</h2>
                            <p className="text-fg-muted mb-4 text-[13.5px]">
                                One feature, start to finish, in the world — captured live from a
                                running instance rather than staged.
                            </p>
                            <ol className="mb-5 grid gap-2">
                                {[
                                    "A request typed into the composer",
                                    "Juno writes the spec, Aria assigns it",
                                    "A delegation drawn between two agents",
                                    "Code appearing on the monitor as it's written",
                                    "Luna reviewing, and a pull request opening",
                                ].map((beat, i) => (
                                    <li key={beat} className="border-line flex gap-3 border-t pt-2 text-[13px]">
                                        <span className="text-blue mt-px shrink-0 font-mono text-[11px] font-bold">
                                            0{i + 1}
                                        </span>
                                        <span className="text-fg-muted">{beat}</span>
                                    </li>
                                ))}
                            </ol>
                            {!MAGY_YOUTUBE_ID && (
                                <WaitlistForm source="magy-demo" cta="Notify me" />
                            )}
                        </div>
                    </div>
                </Panel>

                {/* ── how it works ─────────────────────────────────────── */}
                {/*
                    Was four numbered tiles of prose with no visual. The numbering
                    was doing real work — it IS a sequence — so the order survives
                    in the drawn trace beside it, where it reads faster than four
                    boxes did.
                */}
                <Panel id="how" label="How it works">
                    <Showcase
                        visual={
                            <Visual caption="Real surfaces — composer, roster, trace, auto-PR. Drawn, not photographed." state="drawn">
                                <MagyWorkspace />
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
                            Delegation, drawn
                        </Eyebrow>
                        <h2 className="text-h2">You describe the work. They do it.</h2>
                        <p className="text-fg-muted mt-2.5 max-w-[47ch] text-[14px]">
                            One request becomes a spec, an assignment, an isolated worktree and a
                            reviewed pull request — without you touching any step between.
                        </p>
                        <Bullets
                            items={[
                                {
                                    title: "Specced before it's started",
                                    body: "Juno writes it up, Aria assigns it. Delegation happens face to face in the world.",
                                },
                                {
                                    title: "Isolated while it runs",
                                    body: "One git worktree per task, so two agents can never write over each other.",
                                },
                                {
                                    title: "Reviewed before it lands",
                                    body: "Luna reviews, Atlas ships. Nothing merges unread.",
                                },
                            ]}
                        />
                        <Receipts>
                            Every step is a real command — <code className="font-mono text-[12px]">magy delegate</code>,
                            one worktree per task, auto-PR on completion.
                        </Receipts>
                    </Showcase>
                </Panel>

                {/* ── the world ────────────────────────────────────────── */}
                <Panel id="world" label="The world is the UI">
                    <div className="grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
                        <div>
                            <h2 className="text-h2 mb-2">A world you author, not a scene we shipped.</h2>
                            {/* MagyVerse is the runtime, NOT the office. This used to read
                                "MagyVerse is a 36 × 20 × 5 m open-plan office…", which
                                defined the platform as one fixed place — contradicting the
                                heading directly above it and turning "infinite worlds" into
                                a claim the page itself disproves. The dimensions describe
                                the `magy` world, which is one world inside it.

                                Numbers come from WORLD so they cannot drift from
                                magyverse/public/worlds/magy/scene.json, which is what that
                                constant is verified against. */}
                            <p className="text-fg-muted text-[13.5px]">
                                MagyVerse is the world your agents are embodied in. The one that ships
                                is a {WORLD.dims} open-plan office, a {WORLD.outdoor} lawn outside,
                                and a library through the corridor. Agents walk it properly — around the furniture, never through it. They sit down and type —
                                and what they are typing renders on the monitor in front of them.
                                When one needs another, it walks over, and a dashed arc is drawn
                                between them for as long as the delegation is open.
                            </p>
                            <p className="text-fg-muted mt-3 text-[13.5px]">
                                And none of it is fixed. Press <kbd className="border-line bg-sunk text-fg rounded-[4px] border px-1.5 py-0.5 font-mono text-[11px]">E</kbd>{" "}
                                and you are in the scene editor — move a desk, add a room, change
                                the lighting, with gizmos, multi-select and full undo. Or just
                                describe the change in words and let the world rebuild itself.
                            </p>
                            <p className="text-fg-muted mt-3 text-[13.5px]">
                                That is what &ldquo;infinite worlds&rdquo; means here: not a menu of
                                scenes to pick from, but a world that is yours to extend — and
                                agents whose behaviour follows the objects you put in it, because
                                furniture advertises what can be done with it rather than being
                                hardcoded.
                            </p>
                            <p className="text-fg-muted mt-3 text-[13.5px]">
                                You can also walk around it yourself, right-click any agent for a
                                quick action, or type a task straight into its head.
                            </p>

                            {/*
                                A capture slot, left visibly empty on purpose.

                                Every other visual on this page is drawn SVG, which is honest for
                                UI chrome — a composer and a roster are rectangles and text. The
                                world is not drawable: a stylised 3D office would be the first
                                untrue thing on a page whose demo section promises "a real
                                capture, driven live — no mockups". An empty slot costs less than
                                a fake one. Swap in the still when it is shot.
                            */}
                            <div className="mt-5">
                                <Visual caption="Awaiting a real capture — nothing drawn stands in for the world" state="pending">
                                    <CaptureSlot ratio="16/7">Capture slot — office interior, wide</CaptureSlot>
                                </Visual>
                            </div>
                        </div>
                        <ul className="border-line grid gap-px self-start overflow-hidden rounded-[var(--radius-md)] border bg-[var(--color-line)] sm:grid-cols-3">
                            {[
                                ["Office", "36 × 20 × 5 m", "Desks, whiteboard, coffee, the pool"],
                                ["Outdoors", "26 × 18 m", "The lawn, reached through a door that opens itself"],
                                ["Library", "adjoining", "Shelves of real books, and somewhere to read them"],
                            ].map(([area, size, what]) => (
                                <li key={area} className="bg-solid p-4">
                                    <b className="block text-[13.5px] font-bold">{area}</b>
                                    <span className="deck-label mt-1 block">{size}</span>
                                    <p className="text-fg-muted mt-2 text-[12.5px]">{what}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </Panel>

                {/* ── learning ─────────────────────────────────────────── */}
                <Panel id="learning" label="Real learning, not cosmetic">
                    <div className="grid gap-5 lg:grid-cols-2">
                        <div>
                            <h2 className="text-h2 mb-2">They get better while you&apos;re asleep.</h2>
                            <p className="text-fg-muted text-[13.5px]">
                                An agent that doesn&apos;t know something walks to the library, takes a
                                real book, and reads it. The contents are ingested into its knowledge
                                graph and fed back into its next turn — so the reading changes what it
                                can do, rather than playing an animation. They also sleep, and dream,
                                and the dream has a mood drawn from what actually happened that day.
                            </p>
                            <p className="text-fg-muted mt-3 text-[13.5px]">
                                A server-side director keeps the world living at 1&nbsp;Hz whether or
                                not a browser is open.
                            </p>
                        </div>
                        <Quote className="self-center">
                            <p className="text-fg-muted text-[13.5px]">
                                &ldquo;The user comes back surprised — oh, she went to the library
                                while I was gone, and now she knows about X. That surprise is the
                                retention mechanism. It is the difference between an LLM with a 3D
                                mascot and a world you want to log into.&rdquo;
                            </p>
                        </Quote>
                    </div>
                </Panel>

                {/* ── cortex ───────────────────────────────────────────── */}
                {/*
                    NOTE ON THE COPY: the graph is seeded and synthetic — see the
                    header of ui/CortexGraph.tsx. The MECHANISM described here is
                    real and lives in the magy repo (cortex_episode, cortex_entity,
                    cortex_hyperedge, cortex_agent_lens). The SHAPE on screen is
                    not anyone's data, and this section must not say it is until
                    a demo-workspace export feeds it.
                */}
                <Panel id="cortex" label="Cortex">
                    <Showcase visual={<CortexGraph />}>
                        <Eyebrow
                            icon={
                                <svg viewBox="0 0 24 24" className="size-[13px] shrink-0" fill="none" stroke="currentColor" strokeWidth={2.2} aria-hidden>
                                    <circle cx="12" cy="12" r="3" />
                                    <circle cx="5" cy="6" r="2" />
                                    <circle cx="19" cy="6" r="2" />
                                    <circle cx="19" cy="18" r="2" />
                                    <path d="M7 7l3 3M17 7l-3 3M17 17l-3-3" />
                                </svg>
                            }
                        >
                            One graph, every view
                        </Eyebrow>
                        <h2 className="text-h2">Every agent sees a different shape of the same memory.</h2>
                        <p className="text-fg-muted mt-2.5 max-w-[47ch] text-[14px]">
                            Cortex is one knowledge graph with a sense of time. What changes per
                            agent is the lens: the same facts, re-weighted around what that agent
                            actually works on.
                        </p>
                        <Bullets
                            items={[
                                {
                                    title: "Facts carry two clocks",
                                    body: "When it happened, and when Cortex learned it — so you can ask what an agent knew last Tuesday.",
                                },
                                {
                                    title: "A meeting is one edge, not a mesh",
                                    body: "Threads and meetings are hyperedges over everyone in them, rather than every pair wired together.",
                                },
                                {
                                    title: "The lens moves the centre",
                                    body: "Switch agents on the graph. Same nodes, re-weighted by whose memory you are standing in.",
                                },
                            ]}
                        />
                        <Receipts>
                            The mechanism is shipping — episodes, entities and relationships that
                            span a whole meeting. The graph shown is illustrative, not an export of
                            real data.
                        </Receipts>
                    </Showcase>
                </Panel>

                {/* ── cast ─────────────────────────────────────────────── */}
                {/*
                    "Seven to start" counts SHIPPING_AGENTS, not AGENTS. Argus is
                    in the roster with a "soon" marker but does not move this
                    number until it is seeded — see the note in lib/constants.ts.
                */}
                <Panel id="cast" label="The cast">
                    {/* Spelled, not a numeral — "8 to start." reads like a stat.
                        Falls back to the digit past twelve, which is a problem
                        we would enjoy having. */}
                    <h2 className="text-h2 mb-1">{COUNT_WORD[SHIPPING_AGENTS.length] ?? SHIPPING_AGENTS.length} to start. Then whoever you need.</h2>
                    <p className="text-fg-muted mb-4 max-w-[66ch] text-[13.5px]">
                        The live fleet already runs a CFO, an investor-relations agent and a
                        fundraising agent alongside the engineers. You define the rest.
                    </p>
                    <ul className="grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
                        {AGENTS.map((a) => (
                            <li key={a.id} className="border-line bg-sunk rounded-[var(--radius-md)] border p-3.5">
                                <span className="flex items-center gap-2">
                                    <i
                                        className="size-2 rounded-full bg-[var(--dot)] shadow-[0_0_7px_var(--dot)]"
                                        style={{ ["--dot" as string]: `var(--c-${a.token})` }}
                                    />
                                    <b className="text-[13.5px] font-bold">{a.name}</b>
                                    <span className="text-fg-dim text-[12px]">{a.role}</span>
                                    {a.pending && (
                                        <span className="bg-warm-soft text-warm ml-auto rounded-[var(--radius-capsule)] px-2 py-0.5 font-mono text-[8.5px] font-bold uppercase tracking-[0.1em]">
                                            Soon
                                        </span>
                                    )}
                                </span>
                            </li>
                        ))}
                        <li className="border-line text-fg-dim rounded-[var(--radius-md)] border border-dashed p-3.5 text-[13px]">
                            <b className="text-fg font-bold">+ ∞</b> any role you can describe
                        </li>
                    </ul>
                </Panel>

                {/* ── scale ────────────────────────────────────────────── */}
                <Panel id="scale" label="Scale">
                    <div className="grid gap-5 lg:grid-cols-2">
                        <div>
                            <h2 className="text-h2 mb-2">Not eight agents. As many as the work needs.</h2>
                            <p className="text-fg-muted text-[13.5px]">
                                Ambient population is a closed-form function of time rather than an
                                integration — every agent&apos;s state is computed from a seed and a
                                clock, never accumulated frame to frame.
                            </p>
                            <p className="text-fg-muted mt-3 text-[13.5px]">
                                Three things follow. The server ships a seed instead of a population.
                                Two clients cannot drift apart. And an agent nobody evaluates costs
                                nothing at all — not merely less.
                            </p>
                            <Quote className="mt-3.5">
                                <p className="text-fg font-mono text-[12.5px] leading-relaxed">
                                    &ldquo;State is a closed-form function of time, not an integration.&rdquo;
                                </p>
                            </Quote>
                            {/* Stated rather than left to inference. Beside copy about
                                engineers shipping pull requests, "100,000 agents" reads
                                as 100,000 workers — and a reader who works out that it
                                means rendered avatars stops believing the other five
                                numbers too. Saying it plainly costs nothing and is the
                                reason the rest is credible. */}
                            <p className="text-fg-muted mt-3.5 text-[13.5px]">
                                Those numbers are what the world <em>renders</em>. The agents that
                                think are backed by an LLM, and a turn is spent almost entirely
                                waiting on your model provider rather than on a server — so nothing
                                in the runtime caps how many you run. Your model budget and your
                                provider&apos;s rate limits do. We publish no figure for that
                                because we have not measured one.
                            </p>
                        </div>
                        <div>
                            <Metrics items={METRICS} />
                            <p className="text-fg-dim mt-3 font-mono text-[11px]">
                                Dev build capture · 2026-08-05 · high preset, dpr 1
                            </p>
                        </div>
                    </div>
                </Panel>

                {/* ── status ───────────────────────────────────────────── */}
                <Panel id="status" label="Straight answers">
                    <h2 className="text-h2 mb-1">What&apos;s shipping, and what isn&apos;t.</h2>
                    <ul>
                        {STATUS.map((s) => (
                            <li key={s.state} className="border-line grid items-start gap-3.5 border-t py-3 sm:grid-cols-[112px_1fr]">
                                <span className="text-fg-muted inline-flex items-center gap-2 font-mono text-[10.5px] font-bold uppercase tracking-[0.14em]">
                                    <span className={`size-2 rounded-full ${STATUS_DOT[s.state]}`} />
                                    {s.label}
                                </span>
                                <p className="text-fg-muted text-[13px]">{s.text}</p>
                            </li>
                        ))}
                    </ul>
                    <p className="text-fg-dim mt-4 text-[12.5px]">
                        Magy is a commercial product, not open source. Licensing terms are being
                        finalised —{" "}
                        <a href="mailto:licensing@1martianway.com" className="text-blue hover:underline">
                            licensing@1martianway.com
                        </a>{" "}
                        if you need specifics.
                    </p>
                </Panel>

                {/* ── faq ──────────────────────────────────────────────── */}
                <Panel id="faq" label="FAQ">
                    <h2 className="text-h2 mb-4">Questions worth asking.</h2>
                    <div className="grid gap-2">
                        {FAQ.map((f) => (
                            <details key={f.q} className="border-line bg-sunk group rounded-[var(--radius-md)] border">
                                <summary className="flex cursor-pointer items-center gap-3 p-3.5 text-[13.5px] font-bold">
                                    {f.q}
                                    <svg viewBox="0 0 24 24" className="text-fg-dim ml-auto size-4 shrink-0 transition-transform group-open:rotate-45" fill="none" stroke="currentColor" strokeWidth={2} aria-hidden>
                                        <path d="M12 5v14M5 12h14" />
                                    </svg>
                                </summary>
                                <p className="text-fg-muted px-3.5 pb-3.5 text-[13px]">{f.a}</p>
                            </details>
                        ))}
                    </div>
                    {/* Scoped to this page deliberately — Footer.tsx is shared with
                        /mos and /toowl, and this application covers Magy's embeddable
                        player only, not either of those products. */}
                    <p className="text-fg-dim mt-3.5 text-[12.5px]">
                        Embeddable player: Patent Pending — Indian Patent Application No. 202621101001.
                    </p>
                </Panel>

                <section className="border-line bg-solid shadow-[var(--shadow-deck)] rounded-[var(--radius-lg)] border px-6 py-10 text-center [background:radial-gradient(70%_120%_at_50%_0%,var(--color-red-soft),transparent_68%),var(--color-solid)] sm:py-14">
                    <h2 className="text-[clamp(1.4rem,3.2vw,2.2rem)] font-extrabold tracking-[-0.03em]">
                        Get Early Access
                    </h2>
                    <p className="text-fg-muted mx-auto mt-2.5 max-w-[48ch] text-sm">
                        One email when the first build is ready. Nothing else, ever.
                    </p>
                    <div className="mx-auto mt-5 max-w-[480px]">
                        <WaitlistForm source="magy-final" size="hero" cta="Get Early Access" />
                    </div>
                    <p className="text-fg-dim mt-6 text-[12.5px]">
                        Also from 1 Martian Way:{" "}
                        <Link href="/mos" className="text-blue hover:underline">MOS</Link>
                        {" · "}
                        <Link href="/toowl" className="text-blue hover:underline">Toowl</Link>
                        {/* Martian OS unlinked: its stated specs are unverified. */}
                    </p>
                </section>
            </div>
        </>
    );
}
