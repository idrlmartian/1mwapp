import type { Metadata } from "next";
import Link from "next/link";
import WaitlistForm from "@/app/components/WaitlistForm";
import { ComingSoon, Metrics, Panel, Quote } from "@/app/components/ui/Panel";

/*
  ACCURACY NOTES — MOS's own committed landing copy contains claims we must not
  repeat. Verified against the repo, 2026-08-12:

    · "Open-source platform" appears in mos-web HeroSection, but LICENSE and
      README both say PROPRIETARY AND CONFIDENTIAL. Never say open source.
    · No sim-to-real claim. mos-hal, mos-rtos and mos-kernel are stubs and MOS
      has never run on physical hardware. The README's own hedge is
      "sim-to-real preparation".
    · No throughput figures and no Isaac comparison numbers — MOS is ~19x behind
      Isaac Lab. Compare on PORTABILITY, which is the real claim.
    · Never imply the GPU path is faster; today it is slower than CPU.
    · No screenshots: ~15 UI panels ran on mock data.
    · No outbound links — mos.karmasteels.com is internal and Firebase-gated.
    · No teal #4ec9b0 wordmark; it breaks the single-accent rule.
*/

export const metadata: Metadata = {
    title: "MOS — the robotics simulator that runs everywhere",
    description:
        "A robotics simulation platform with a portable dynamics kernel — the same physics in a browser, on a CPU and on a GPU, with the divergence measured and published.",
    alternates: { canonical: "https://www.1martianway.com/mos" },
    openGraph: {
        title: "MOS — the robotics simulator that runs everywhere",
        description: "Train a robot policy in a browser tab. No install, no NVIDIA card.",
        url: "https://www.1martianway.com/mos",
    },
};

const VERIFIED = [
    { value: "111", label: "tests, kernel + verify" },
    { value: "1e-5", label: "policy golden tolerance" },
    { value: "426 KB", label: "browser WASM kernel" },
    { value: "3", label: "targets, one kernel" },
] as const;

export default function MosPage() {
    return (
        <ComingSoon>
            <Panel>
                <p className="deck-label mb-3 flex items-center gap-2">
                    <i className="bg-red size-1.5 rounded-full" />
                    Coming shortly · private alpha
                </p>
                <h1 className="text-hero mb-3 max-w-[18ch]">
                    The robotics simulator that <em className="text-blue not-italic">runs everywhere</em>.
                </h1>
                <p className="text-fg-muted max-w-[62ch] text-[14px]">
                    A robotics simulation platform with a portable dynamics kernel — the same
                    physics in a browser, on a CPU, and on a GPU, with the divergence measured and
                    published.
                </p>
                <div className="mt-5 max-w-[460px]">
                    <WaitlistForm source="mos" product="mos" cta="Get Early Access" />
                </div>
            </Panel>

            <Panel>
                <h2 className="text-[clamp(1.15rem,2.4vw,1.9rem)] font-extrabold leading-snug tracking-[-0.025em]">
                    &ldquo;Train a robot policy in a browser tab — no install, no NVIDIA card.&rdquo;
                </h2>
            </Panel>

            <div className="grid gap-3.5 lg:grid-cols-2">
                <Panel label="One kernel, three targets">
                    <h2 className="text-h2 mb-2">MDK — the MOS Dynamics Kernel</h2>
                    <p className="text-fg-muted text-[13.5px]">
                        One Rust kernel: Featherstone articulated-body dynamics, canonical PD motors,
                        penalty ground contact. Compiled to browser WASM, native CPU, and a wgpu
                        compute shader. Native and WASM are built from the same sources, so they
                        agree by construction.
                    </p>
                    <ul className="mt-4 grid gap-2 sm:grid-cols-3">
                        {[
                            ["Browser", "WASM, ~426 KB"],
                            ["CPU", "native"],
                            ["GPU", "wgpu compute"],
                        ].map(([k, v]) => (
                            <li key={k} className="border-line bg-sunk rounded-[var(--radius-md)] border p-3">
                                <b className="block text-[13px] font-bold">{k}</b>
                                <span className="deck-label mt-1 block">{v}</span>
                            </li>
                        ))}
                    </ul>
                </Panel>

                <Panel label="Verified, not asserted">
                    <h2 className="text-h2 mb-2">The error bars are printed.</h2>
                    <p className="text-fg-muted mb-4 text-[13.5px]">
                        Conformance against a MuJoCo oracle, policy goldens checked to 1e-5, and
                        CPU-to-GPU divergence published per adapter.
                    </p>
                    <Metrics items={VERIFIED} />
                    <Quote className="mt-4">
                        <p className="text-fg-muted text-[13px]">
                            &ldquo;Where the physics approximates, the error bars are printed rather
                            than argued away.&rdquo;
                        </p>
                    </Quote>
                </Panel>
            </div>

            <Panel label="What you get">
                <div className="grid gap-3.5 sm:grid-cols-3">
                    {[
                        ["Browser simulator", "Babylon.js rendering with the WASM kernel underneath, stepping at 240 Hz."],
                        ["In-tab training", "Multi-environment PPO on your own WebGPU. Skills: walking and recovery."],
                        ["Research-grade locomotion", "DCM, CPG, Raibert, IK and PD balance. Robots: biped-v1 (10 DOF), humanoid-v1 (24 DOF)."],
                    ].map(([t, b]) => (
                        <div key={t} className="border-line bg-sunk rounded-[var(--radius-md)] border p-4">
                            <h3 className="text-h3 font-bold">{t}</h3>
                            <p className="text-fg-muted mt-1.5 text-[13px]">{b}</p>
                        </div>
                    ))}
                </div>
            </Panel>

            {/* The honest status block is a feature here: it is the same "publish
                the error bars" posture as the product itself. */}
            <Panel label="Where MOS is today">
                <p className="text-fg-muted max-w-[70ch] text-[13.5px]">
                    Alpha, and proprietary. MOS has never been run on physical hardware — the
                    hardware abstraction, real-time and kernel layers are groundwork, not shipped
                    capability — so there is no sim-to-real transfer claim here, only the
                    preparation for one. We compare on portability, not on throughput.
                </p>
            </Panel>

            <section className="border-line bg-solid shadow-[var(--shadow-deck)] rounded-[var(--radius-lg)] border px-6 py-10 text-center [background:radial-gradient(70%_120%_at_50%_0%,var(--color-red-soft),transparent_68%),var(--color-solid)]">
                <h2 className="text-[clamp(1.3rem,3vw,2rem)] font-extrabold tracking-[-0.03em]">
                    Get Early Access
                </h2>
                <p className="text-fg-muted mx-auto mt-2.5 max-w-[46ch] text-sm">
                    We&apos;ll email you when MOS opens up.
                </p>
                <div className="mx-auto mt-5 max-w-[470px]">
                    <WaitlistForm source="mos" product="mos" size="hero" cta="Get Early Access" />
                </div>
                <p className="text-fg-dim mt-6 text-[12.5px]">
                    Built by 1 Martian Way, alongside{" "}
                    <Link href="/magy" className="text-blue hover:underline">Magy</Link>.
                    {/* Martian OS unlinked: its stated specs are unverified. */}
                </p>
            </section>
        </ComingSoon>
    );
}
