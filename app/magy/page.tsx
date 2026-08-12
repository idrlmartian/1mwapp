import type { Metadata } from "next";
import Link from "next/link";
import WaitlistForm from "@/app/components/WaitlistForm";
import StructuredData from "@/app/components/StructuredData";
import VideoBackdrop from "@/app/components/ui/VideoBackdrop";
import { Metrics, Panel, Quote } from "@/app/components/ui/Panel";
import { ACTIVITY, AGENTS, MAGY_YOUTUBE_ID, METRICS, STATUS, WORLD } from "@/app/lib/constants";

export const metadata: Metadata = {
    title: "Magy — the 3D embodied multi-agent platform",
    description:
        "AI engineers embodied in a world you build. They delegate face to face, walk to the library to learn what they don't know, and ship a pull request while you watch. Measured at 100,000 agents rendered at 60 fps.",
    alternates: { canonical: "https://www.1martianway.com/magy" },
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
    ["learning", "Learning"],
    ["cast", "Cast"],
    ["scale", "Scale"],
    ["status", "Status"],
    ["faq", "FAQ"],
] as const;

const FAQ = [
    {
        q: "Does it run locally?",
        a: "Yes. `magy assistant` is a single agent in a REPL with no NATS, no Postgres and no Redis — it runs on your machine with zero external services. The full seven-agent runtime and the 3D world need the production path.",
    },
    {
        q: "How many agents can I actually run?",
        a: "Two different numbers, and we keep them apart on purpose. The 100,000 figure is what the world renders — ambient agents drawn at 60 fps on a laptop and 56.2 on a phone. Agents that actually think are backed by an LLM, and an agent turn is spent almost entirely waiting on your model provider rather than on a server, so there is no cap on agent count in our runtime. What sets your ceiling is your model budget and your provider's rate limits — your keys, your call. We have not published a number for that because we have not measured one, and a figure we estimated would tell you less than this paragraph does.",
    },
    {
        q: "Which models does it use — and do I control that?",
        a: "You control it completely, per agent. Bring your own API keys or your Claude subscription, and assign whichever model you want to whichever agent: the strongest one for your CTO, something cheap for routine work. Seven providers are supported — Anthropic, OpenAI, Gemini, Bedrock, Ollama, Kimi and MiniMax. Set an agent to `auto` instead and a cost-aware router walks a ladder from the strongest model down, with circuit breakers and per-agent budgets. Keys live in your own config, never in our database.",
    },
    {
        q: "Does my code leave my machine?",
        a: "Your prompts and the code context go to whichever LLM provider you configure, the same as any AI coding tool. Magy adds a per-conversation TaskScope that hard-limits which repositories an agent may touch, and every task runs in its own git worktree.",
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

const STATUS_DOT = {
    shipping: "bg-good",
    building: "shadow-[inset_0_0_0_1.5px_var(--color-warn)]",
    planned: "shadow-[inset_0_0_0_1.5px_var(--color-fg-dim)]",
} as const;

export default function MagyPage() {
    return (
        <>
            <StructuredData type="SoftwareApplication" />

            <main className="relative isolate overflow-hidden p-3.5">
                <div className="deck-grid">
                    <VideoBackdrop />
                    <div className="deck-rail flex flex-col gap-3">
                        <section className="deck-card p-4">
                            <p className="deck-label mb-3 flex items-center gap-2">
                                <i className="bg-red size-1.5 rounded-full" />
                                Magy · early access
                            </p>
                            <h1 className="text-hero">
                                Infinite agents.
                                <br />
                                Infinite worlds.
                                <br />
                                <em className="text-blue not-italic">Any work.</em>
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
                                    </li>
                                ))}
                                <li className="border-line text-fg-dim inline-flex items-center rounded-[var(--radius-capsule)] border border-dashed px-2.5 py-1 text-[11.5px]">
                                    +∞
                                </li>
                            </ul>
                        </section>

                        <section className="deck-card overflow-hidden">
                            <p className="deck-label border-line border-b px-3.5 py-2.5">Live activity</p>
                            <ul className="py-1.5">
                                {ACTIVITY.map((e) => (
                                    <li
                                        key={e.time}
                                        className="grid grid-cols-[9px_42px_1fr] items-baseline gap-2.5 px-3.5 py-1 text-[11.5px]"
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
                            <pre className="border-line bg-sunk text-fg-muted mx-3.5 mb-3 overflow-x-auto rounded-[var(--radius-md)] border p-2.5 font-mono text-[10.5px] leading-relaxed">
                                <code>
                                    {`$ magy delegate --to zara "extract the parser"\n`}
                                    <span className="text-blue">zara</span> worktree{" "}
                                    <span className="text-good">acquired</span> · feat/parser-extract{"\n"}
                                    <span className="text-blue">luna</span> review{" "}
                                    <span className="text-good">approved</span> → PR #482 opened
                                </code>
                            </pre>
                        </section>

                        <section
                            id="early-access"
                            className="border-red bg-solid shadow-[var(--shadow-deck),0_0_0_4px_var(--color-red-soft)] scroll-mt-20 overflow-hidden rounded-[var(--radius-lg)] border"
                        >
                            <div className="border-line bg-red-soft flex items-center gap-2 border-b px-3.5 py-2.5">
                                <h2 className="text-red font-mono text-[12px] font-extrabold uppercase tracking-[0.15em]">
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
                                <WaitlistForm source="magy-hero" cta="Get Early Access" />
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* sticky section nav */}
            <nav
                aria-label="On this page"
                className="border-line bg-canvas/85 sticky top-14 z-40 -mb-1 overflow-x-auto border-y backdrop-blur-xl"
            >
                <ul className="mx-auto flex max-w-[var(--container-page)] gap-1 px-3.5 py-2">
                    {SECTIONS.map(([id, label]) => (
                        <li key={id}>
                            <a
                                href={`#${id}`}
                                className="text-fg-muted hover:text-fg hover:bg-sunk whitespace-nowrap rounded-[var(--radius-sm)] px-2.5 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.13em] transition-colors"
                            >
                                {label}
                            </a>
                        </li>
                    ))}
                </ul>
            </nav>

            <div className="mx-auto grid max-w-[var(--container-page)] gap-3.5 p-3.5">
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
                                            <svg viewBox="0 0 24 24" className="text-red ml-0.5 size-5" fill="currentColor" aria-hidden>
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
                <Panel id="how" label="How it works">
                    <h2 className="text-h2 mb-4">You describe the work. They do it.</h2>
                    <ol className="grid gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
                        {[
                            ["01", "You describe the work", "In plain language, in the composer or from Telegram."],
                            ["02", "The team plans and delegates", "Juno writes the spec, Aria assigns it. Delegation happens face to face in the world."],
                            ["03", "Each agent works isolated", "One git worktree per task, with file leases so two agents can never write the same path."],
                            ["04", "Pull requests come back", "Luna reviews before merge. Atlas ships. Nothing lands unreviewed."],
                        ].map(([n, title, body]) => (
                            <li key={n} className="border-line bg-sunk rounded-[var(--radius-md)] border p-4">
                                <span className="text-blue font-mono text-[11px] font-bold tracking-[0.14em]">{n}</span>
                                <h3 className="text-h3 mt-2 font-bold">{title}</h3>
                                <p className="text-fg-muted mt-1.5 text-[13px]">{body}</p>
                            </li>
                        ))}
                    </ol>
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
                                and a library through the corridor. Agents walk it on a real navmesh. They sit down and type —
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

                {/* ── cast ─────────────────────────────────────────────── */}
                <Panel id="cast" label="The cast">
                    <h2 className="text-h2 mb-1">Seven to start. Then whoever you need.</h2>
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
                            <h2 className="text-h2 mb-2">Not seven agents. As many as the work needs.</h2>
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
                                <span className="text-fg-muted inline-flex items-center gap-2 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em]">
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
