import type { Metadata } from "next";
import WaitlistForm from "@/app/components/WaitlistForm";
import StructuredData from "@/app/components/StructuredData";
import VideoBackdrop from "@/app/components/ui/VideoBackdrop";
import { ACTIVITY, AGENTS, METRICS, STATUS } from "@/app/lib/constants";

export const metadata: Metadata = {
    title: "Magy — Infinite agents. Infinite worlds. Any work.",
    description:
        "The world's first 3D embodied multi-agent platform. A team of AI engineers, embodied in a world you build — they delegate face to face, learn what they don't know, and ship a pull request while you watch.",
    alternates: { canonical: "https://www.1martianway.com/" },
    openGraph: {
        title: "Magy — Infinite agents. Infinite worlds. Any work.",
        description:
            "The world's first 3D embodied multi-agent platform. Build the world, hire the team, watch the work happen.",
        url: "https://www.1martianway.com/",
    },
};

const STATUS_DOT = {
    shipping: "bg-good",
    building: "shadow-[inset_0_0_0_1.5px_var(--color-warn)]",
    planned: "shadow-[inset_0_0_0_1.5px_var(--color-fg-dim)]",
} as const;

export default function Home() {
    return (
        <>
            <StructuredData type="SoftwareApplication" />

            {/* ── the deck ──────────────────────────────────────────────── */}
            <main className="relative isolate overflow-hidden p-3.5">
                <div className="deck-grid">
                    <VideoBackdrop />

                    <div className="deck-rail flex flex-col gap-3">
                        <section className="deck-card p-4">
                            <p className="deck-label mb-3 flex items-center gap-2">
                                <i className="bg-red size-1.5 rounded-full" />
                                Magy
                            </p>
                            <h1 className="text-hero">
                                Infinite agents.
                                <br />
                                Infinite worlds.
                                <br />
                                <em className="text-blue not-italic">Any work.</em>
                            </h1>
                            <p className="text-fg-muted mt-3 text-[13.5px]">
                                A team of AI engineers, embodied in a world you build. They delegate
                                face to face, learn what they don&apos;t know, and ship a pull
                                request while you watch.
                            </p>

                            <ul className="mt-3.5 flex flex-wrap gap-1.5">
                                {AGENTS.map((a) => (
                                    <li
                                        key={a.id}
                                        className="border-line bg-sunk text-fg-muted inline-flex items-center gap-1.5 rounded-[var(--radius-capsule)] border py-1 pl-2 pr-2.5 text-[11.5px]"
                                    >
                                        {/* Agent colour arrives as data, so it MUST come through an
                                            inline custom property — Tailwind cannot see a runtime
                                            string, and bg-[${...}] would generate nothing. */}
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

                        {/* Proof sits before the ask, not after it. */}
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

                        {/* ── the composer, locked ──────────────────────────
                            It keeps the composer's position and shape because that IS
                            the pitch: this is where you will assign work. The header,
                            the lock and the red ring stop it reading as a chat box. */}
                        <section
                            id="early-access"
                            className="border-red bg-solid shadow-[var(--shadow-deck),0_0_0_4px_var(--color-red-soft)] overflow-hidden rounded-[var(--radius-lg)] border scroll-mt-20"
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
                                    <b className="text-fg font-bold">assign work to your agents</b>. Drop
                                    your email and we&apos;ll unlock it the moment the first build is ready.
                                </p>
                                <WaitlistForm source="home-hero" size="composer" cta="Get Early Access" />
                            </div>
                        </section>
                    </div>
                </div>
            </main>

            {/* ── panels ────────────────────────────────────────────────── */}
            <div className="mx-auto grid max-w-[var(--container-page)] gap-3.5 px-3.5 pb-3.5">
                <section className="deck-card p-5">
                    <p className="deck-label mb-3.5 flex items-center gap-2.5 after:h-px after:flex-1 after:bg-[var(--color-line)] after:content-['']">
                        The differentiator
                    </p>
                    <div className="grid gap-3.5 lg:grid-cols-2">
                        <div>
                            <h2 className="text-h2 mb-2">Not seven agents. As many as the work needs.</h2>
                            <p className="text-fg-muted max-w-[66ch] text-[13.5px]">
                                Every other multi-agent product ships a fixed cast. Magy ships a world
                                measured at a hundred thousand — because ambient population is a
                                closed-form function of time, not an integration.
                            </p>
                            <blockquote className="border-blue mt-3.5 border-l-2 pl-4">
                                <p className="text-fg font-mono text-[12.5px] leading-relaxed">
                                    &ldquo;The server ships a seed instead of a population.&rdquo;
                                </p>
                                <p className="text-fg-muted mt-2 font-mono text-[12.5px] leading-relaxed">
                                    Clients cannot drift apart, and an agent nobody evaluates costs
                                    nothing at all.
                                </p>
                            </blockquote>
                        </div>
                        <ul className="border-line grid grid-cols-2 gap-px overflow-hidden rounded-[var(--radius-md)] border bg-[var(--color-line)] sm:grid-cols-3">
                            {METRICS.map((m) => (
                                <li key={m.label} className="bg-solid p-3.5">
                                    <b className="text-data tabnum block font-mono font-semibold">{m.value}</b>
                                    <span className="deck-label mt-1.5 block leading-snug">{m.label}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>

                <div className="grid gap-3.5 lg:grid-cols-2">
                    <section className="deck-card p-5">
                        <p className="deck-label mb-3.5">Retention</p>
                        <h2 className="text-h2 mb-2">They get better while you&apos;re asleep.</h2>
                        <p className="text-fg-muted text-[13.5px]">
                            Agents walk to the library and read real books whose contents enter their
                            knowledge graph. They sleep, and they dream. A server-side director keeps
                            the world living at 1&nbsp;Hz whether or not a browser is open.
                        </p>
                        <blockquote className="border-blue mt-3.5 border-l-2 pl-4">
                            <p className="text-fg-muted text-[13.5px]">
                                &ldquo;The user comes back surprised — oh, she went to the library
                                while I was gone, and now she knows about X.&rdquo;
                            </p>
                        </blockquote>
                    </section>

                    <section className="deck-card p-5">
                        <p className="deck-label mb-3.5">Infinite worlds</p>
                        <h2 className="text-h2 mb-2">The world is editable, all of it.</h2>
                        <p className="text-fg-muted text-[13.5px]">
                            Open the in-world editor and move a desk, add a room, relight the
                            scene — gizmos, multi-select, full undo. Or describe the change in
                            plain language and watch it apply. Agents adapt without new code,
                            because objects advertise what can be done with them rather than
                            every interaction being hardcoded.
                        </p>
                    </section>

                    <section className="deck-card p-5">
                        <p className="deck-label mb-3.5">Under the hood</p>
                        <h2 className="text-h2 mb-2">Rust, all the way down.</h2>
                        <p className="text-fg-muted font-mono text-[12px] leading-[1.95]">
                            tokio · NATS JetStream · Postgres 16 + pgvector · four-tier memory ·
                            knowledge graph with confidence decay · your keys and your models, chosen per
                            agent across 7 providers · worktree isolation → auto-PR · 48 tools · WASM-sandboxed
                            skills · Telegram · cron
                        </p>
                    </section>
                </div>

                <section className="deck-card p-5">
                    <p className="deck-label mb-3.5">Straight answers</p>
                    <h2 className="text-h2 mb-1">What&apos;s shipping, and what isn&apos;t.</h2>
                    <ul>
                        {STATUS.map((s) => (
                            <li
                                key={s.state}
                                className="border-line grid items-start gap-3.5 border-t py-3 sm:grid-cols-[112px_1fr]"
                            >
                                <span className="text-fg-muted inline-flex items-center gap-2 font-mono text-[9.5px] font-bold uppercase tracking-[0.14em]">
                                    <span className={`size-2 rounded-full ${STATUS_DOT[s.state]}`} />
                                    {s.label}
                                </span>
                                <p className="text-fg-muted text-[13px]">{s.text}</p>
                            </li>
                        ))}
                    </ul>
                </section>

                {/* ── closing CTA ───────────────────────────────────────── */}
                <section className="border-line bg-solid shadow-[var(--shadow-deck)] rounded-[var(--radius-lg)] border px-6 py-10 text-center [background:radial-gradient(70%_120%_at_50%_0%,var(--color-red-soft),transparent_68%),var(--color-solid)] sm:py-14">
                    <h2 className="text-[clamp(1.4rem,3.2vw,2.2rem)] font-extrabold tracking-[-0.03em]">
                        Get Early Access
                    </h2>
                    <p className="text-fg-muted mx-auto mt-2.5 max-w-[48ch] text-sm">
                        Be first into the Magyverse. We&apos;ll email you the moment the first build
                        is ready — one email, and nothing else.
                    </p>
                    <div className="mx-auto mt-5 max-w-[480px]">
                        <WaitlistForm source="home-final" size="hero" cta="Get Early Access" />
                    </div>
                </section>
            </div>
        </>
    );
}
