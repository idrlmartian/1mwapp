"use client";

import { useEffect, useRef } from "react";
import { AGENTS, WORLD } from "@/app/lib/constants";

/*
  The world pane — an ambient view of MagyVerse, drawn.

  This replaces the poster+video backdrop (ui/VideoBackdrop.tsx, now unreferenced
  but kept: the graded poster set in /media and the HERO constant are still
  there, so restoring it is swapping the component back).

  ON HONESTY, since this page is strict about it: an abstract animation is not a
  fake screenshot. The rule that matters here is that nothing DRAWN may be
  labelled as a capture — which is why the demo section still says "the demo is
  coming, a real capture, driven live" and shows an empty slot, and why the
  world sections keep their pending capture slots. This is atmosphere behind the
  copy, carries no caption, and claims nothing.

  Everything is a closed-form function of a seed and a clock — the same property
  the Scale section describes in the real runtime. No state accumulates between
  frames, so the view cannot drift and a resize cannot corrupt it.
*/

/** Deterministic: the crowd is identical for every visitor and every resize. */
function rng(seed: number) {
    let s = seed >>> 0;
    return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

type Walker = { x: number; z: number; token: string; ph: number; sp: number };

const CROWD: Walker[] = (() => {
    const r = rng(20260813);
    const tokens = AGENTS.map((a) => a.token);
    return Array.from({ length: 58 }, () => ({
        x: r(),
        z: r(),
        token: tokens[(r() * tokens.length) | 0],
        ph: r() * Math.PI * 2,
        sp: 0.15 + r() * 0.4,
    }));
})();

export default function WorldCanvas({ className = "" }: { className?: string }) {
    const cv = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        const c = cv.current;
        if (!c) return;
        const ctx = c.getContext("2d");
        if (!ctx) return;

        /*
          Read from the CANVAS, not the document root. `.world` redeclares the
          screen's palette — dark grounds and the neon agent colours in both
          themes — and scoping the lookup here is what lets those win. Reading
          the root would paint light mode's chip-safe darkened agent colours
          onto a dark ground, and the crowd would disappear.
        */
        const css = (n: string) => getComputedStyle(c).getPropertyValue(n).trim();
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let raf = 0;

        const paint = (t: number) => {
            const dpr = Math.min(devicePixelRatio || 1, 2);
            const w = c.clientWidth || 900;
            const h = c.clientHeight || 500;
            if (c.width !== w * dpr || c.height !== h * dpr) {
                c.width = w * dpr;
                c.height = h * dpr;
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

            const g = ctx.createLinearGradient(0, 0, w, h);
            g.addColorStop(0, css("--c-world-3"));
            g.addColorStop(0.55, css("--c-world-1"));
            g.addColorStop(1, css("--c-world-2"));
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);

            // Floor grid, receding to a horizon at 52% height. The vertical lines
            // converge toward the centre and the horizontals bunch with a power
            // curve, which is what sells depth without a real projection.
            const hz = h * 0.52;
            ctx.strokeStyle = css("--c-border-hi");
            ctx.lineWidth = 1;
            ctx.globalAlpha = 0.5;
            for (let i = 0; i <= 22; i++) {
                const x = w * (-0.35 + (i / 22) * 1.7);
                ctx.beginPath();
                ctx.moveTo(w * 0.5 + (x - w * 0.5) * 0.22, hz);
                ctx.lineTo(x, h);
                ctx.stroke();
            }
            for (let i = 1; i <= 11; i++) {
                const y = hz + (h - hz) * Math.pow(i / 11, 2.1);
                ctx.beginPath();
                ctx.moveTo(0, y);
                ctx.lineTo(w, y);
                ctx.stroke();
            }
            ctx.globalAlpha = 1;

            const now = still ? 0 : t / 1000;
            CROWD.map((a) => {
                const drift = Math.sin(now * a.sp + a.ph) * 0.035;
                const y = hz + (h - hz) * Math.pow(a.z, 2.1);
                const spread = 0.1 + a.z * 0.95;
                return {
                    ...a,
                    px: w * (0.5 + (a.x - 0.5) * spread * 1.5 + drift),
                    py: y,
                    s: 0.45 + a.z * 1.5,
                };
            })
                // Painter's algorithm: nearer figures are lower on screen.
                .sort((a, b) => a.py - b.py)
                .forEach((a) => {
                    const col = css(`--c-${a.token}`);
                    ctx.fillStyle = col;
                    ctx.globalAlpha = 0.16 + a.s * 0.3;
                    ctx.beginPath();
                    ctx.ellipse(a.px, a.py + a.s * 7, a.s * 5, a.s * 1.8, 0, 0, 7);
                    ctx.fill();
                    ctx.globalAlpha = 0.5 + a.s * 0.42;
                    ctx.beginPath();
                    ctx.roundRect(a.px - a.s * 2, a.py - a.s * 11, a.s * 4, a.s * 11, a.s * 2);
                    ctx.fill();
                    ctx.beginPath();
                    ctx.arc(a.px, a.py - a.s * 13.5, a.s * 2.5, 0, 7);
                    ctx.fill();
                });
            ctx.globalAlpha = 1;

            // Legibility scrim under the rail. Painted here rather than as a CSS
            // ::after so it composites in the same pass as the crowd — and so it
            // can be skipped outright when the rail is not on top of the world.
            if (window.matchMedia("(min-width: 1001px)").matches) {
                const s = ctx.createLinearGradient(0, 0, w * 0.52, 0);
                s.addColorStop(0, css("--c-bg"));
                s.addColorStop(1, "transparent");
                ctx.globalAlpha = 0.84;
                ctx.fillStyle = s;
                ctx.fillRect(0, 0, w * 0.52, h);
                ctx.globalAlpha = 1;
            }

            raf = requestAnimationFrame(paint);
        };

        raf = requestAnimationFrame(paint);
        const ro = new ResizeObserver(() => {});
        ro.observe(c);
        return () => {
            cancelAnimationFrame(raf);
            ro.disconnect();
        };
    }, []);

    return (
        <div className={`world ${className}`}>
            <canvas ref={cv} className="block size-full" aria-hidden />

            {/*
                Overlay in DOM rather than painted into the canvas, so it stays
                selectable text and scales with the user's font size. Carries the
                world's name and its real dimensions — the same content the old
                poster backdrop had, which would otherwise have been lost in the
                switch. WORLD is verified against worlds/magy/scene.json.
            */}
            {/* Right-aligned, both of them: the rail floats over the LEFT of the
                stage, so anything at left-4 would sit underneath it. */}
            <span className="world-chip absolute right-4 top-4 z-2 inline-flex items-center gap-2 rounded-[var(--radius-capsule)] border px-3 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] backdrop-blur-md">
                <i className="bg-blue size-1.5 rounded-full" />
                MagyVerse
            </span>

            <p className="world-meta absolute bottom-4 right-4 z-2 hidden gap-4 font-mono text-[10.5px] font-semibold uppercase tracking-[0.15em] sm:flex">
                <span>{WORLD.dims}</span>
                <span>{WORLD.zones}</span>
            </p>
        </div>
    );
}
