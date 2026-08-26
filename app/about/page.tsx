import type { Metadata } from "next";
import Link from "next/link";
import StructuredData from "@/app/components/StructuredData";
import { Panel } from "@/app/components/ui/Panel";
import { COMPANY } from "@/app/lib/constants";

/*
  Replaces /brands, which presented IDRL alongside two "divisions" that read as
  padding around one real thing.

  The arc is told straight. A company that shipped in four domains over a decade
  is more investable than one claiming a straight line — and the press page
  proves every era actually happened, so hiding it would be both dishonest and
  weaker.
*/

export const metadata: Metadata = {
    title: "About",
    description:
        "1 Martian Way Industries builds developer tools and agent software. We make toowl, a GPU-accelerated terminal with Claude built in. Founded in Mumbai.",
    alternates: { canonical: "https://www.1martianway.com/about" },
};

const BUILDING = [
    {
        name: "Toowl",
        href: "/toowl",
        line: "A GPU-fast terminal and a tmux-style remote client in one binary, with Claude on the Perch.",
        state: "v1.0",
    },
    /*
      Magy and MOS are commented out from 2026-08-26 — unpublished until the
      patent filings are settled, so they are not named anywhere a crawler or
      a reader can reach. Restore both entries alongside the NAV, Footer,
      routes.ts and per-page noindex blocks.

        Magy — "A 3D world where AI agents do engineering work you can watch.
          Measured at 100,000 agents rendered at 60 fps." (Early access)
        MOS — "Robotics simulation with a portable dynamics kernel — the same
          physics in a browser, on a CPU and on a GPU." (Private alpha)
    */
    /*
      Martian OS is deliberately absent. Its page states <1μs latency, 1000Hz
      sustained, 100% memory safety and zero overhead as ACHIEVED specs, while
      mos-hal / mos-rtos / mos-kernel are stubs and no physical hardware has
      run it. Unverified claims beside Magy's measured numbers devalue the
      measured ones. Restore this entry when the claims are true.
    */
];

const ERAS = [
    ["Chess robots", "Robot arms that play a physical board. The first thing we shipped."],
    ["Drones", "Autonomous racing, fleet software, and aerial survey work."],
    ["Humanoid robotics", "Prototype platforms, and the operating system to run them."],
    ["Developer tools", "Toowl, and the agent software behind it — where nearly all the work goes today."],
];

export default function AboutPage() {
    return (
        <>
            <StructuredData type="Organization" />
            <div className="mx-auto grid max-w-[var(--container-page)] gap-3.5 px-[var(--container-pad)] py-3.5">
                <Panel>
                    <p className="deck-label mb-3">About</p>
                    <h1 className="text-hero mb-4 max-w-[20ch]">
                        We build things that <em className="text-blue not-italic">do the work</em>.
                    </h1>
                    <p className="text-fg-muted max-w-[64ch] text-[14.5px]">
                        1 Martian Way Industries is a Mumbai company building developer tools
                        and agent software. Toowl, our GPU-accelerated terminal, is free and
                        installs with one command. We are small, we ship, and we publish the
                        numbers behind what we claim.
                    </p>
                </Panel>

                <Panel label="What we're building">
                    <ul className="grid gap-3 sm:grid-cols-2">
                        {BUILDING.map((b) => (
                            <li key={b.name}>
                                <Link
                                    href={b.href}
                                    className="border-line bg-sunk hover:border-line-hi block h-full rounded-[var(--radius-md)] border p-4 transition-colors"
                                >
                                    <span className="flex items-baseline gap-2.5">
                                        <b className="text-[15px] font-extrabold">{b.name}</b>
                                        <span className="deck-label">{b.state}</span>
                                    </span>
                                    <p className="text-fg-muted mt-2 text-[13px]">{b.line}</p>
                                </Link>
                            </li>
                        ))}
                    </ul>
                    <p className="text-fg-dim mt-4 text-[13px]">
                        We also run AgentBooks, accounting agents for Indian chartered accountants,
                        and Litaria, a platform for AI-assisted literature. Neither has a public
                        page yet.
                    </p>
                </Panel>

                <div className="grid gap-3.5 lg:grid-cols-[1.15fr_0.85fr]">
                    <Panel label="How we got here">
                        <h2 className="text-h2 mb-2">Four domains, one company.</h2>
                        <p className="text-fg-muted mb-4 max-w-[60ch] text-[13.5px]">
                            We have pivoted twice, and both times because the thing we learned was
                            worth more than the thing we were selling. The through-line is machines
                            that act on their own, and the software that makes that safe to watch.
                        </p>
                        <ol className="grid gap-2.5">
                            {ERAS.map(([era, what], i) => (
                                <li key={era} className="border-line flex gap-3.5 border-t pt-2.5">
                                    <span className="text-blue mt-0.5 shrink-0 font-mono text-[11px] font-bold">
                                        0{i + 1}
                                    </span>
                                    <span>
                                        <b className="text-[13.5px] font-bold">{era}</b>
                                        <p className="text-fg-muted text-[13px]">{what}</p>
                                    </span>
                                </li>
                            ))}
                        </ol>
                        <p className="text-fg-dim mt-4 text-[13px]">
                            The <Link href="/press" className="text-blue hover:underline">press page</Link>{" "}
                            covers most of it — CBS News, India Today, DD Sports and others.
                        </p>
                    </Panel>

                    <div className="grid gap-3.5">
                        <Panel label="Ventures">
                            <h2 className="text-h2 mb-2">IDRL</h2>
                            <p className="text-fg-muted text-[13.5px]">
                                We built and run India&apos;s drone racing league — a real-world
                                testbed for autonomy, and a talent pipeline.
                            </p>
                            <a
                                href="https://droneracingindia.com"
                                target="_blank"
                                rel="noopener"
                                className="text-blue mt-3 inline-block text-[13.5px] font-semibold hover:underline"
                            >
                                droneracingindia.com ↗
                            </a>
                        </Panel>

                        <Panel label="Company">
                            <address className="text-fg-muted text-[13px] not-italic leading-relaxed">
                                {COMPANY.address.map((l) => (
                                    <span key={l} className="block">{l}</span>
                                ))}
                            </address>
                            <a
                                href={`mailto:${COMPANY.email}`}
                                className="text-blue mt-3 inline-block text-[13.5px] hover:underline"
                            >
                                {COMPANY.email}
                            </a>
                        </Panel>
                    </div>
                </div>

            </div>
        </>
    );
}
