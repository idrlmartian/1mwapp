"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { AGENTS } from "@/app/lib/constants";

/*
  The Cortex graph.

  Hand-rolled 3D projection on a 2D canvas — no three.js, no react-three-fiber.
  That is a deliberate trade, not a shortcut. The magyverse app renders this with
  r3f (components/cortex/CortexUniverse.tsx, ~1,180 lines), but porting that here
  means three + fiber + drei on the page whose job is converting: roughly
  200-250KB gzipped against a site whose heaviest dependency today is Tailwind.
  A rotating point cloud with depth cueing needs none of it.

  ── HONESTY, and this is the part to read before editing the copy ──
  The graph below is SEEDED AND SYNTHETIC. It is shaped like a real Cortex — a
  sphere of entities, PageRank-weighted radii, per-agent lenses re-centring the
  weights — but it is not anyone's data.

  So the section copy must not claim it is. Do NOT write "rendered from a real
  Cortex export" until `NODES` is actually fed by one. The honest phrasing lives
  in magy/page.tsx and says the shape is illustrative while the mechanism is
  real, which is true and still worth saying.

  Replacing it is a data change, not a rewrite: export cortex_entity +
  cortex_fact from a DEMO workspace (never a real one — those rows carry
  canonical_name, aliases like "ankita@…" and LLM-written summaries of somebody's
  mail) to static JSON, and hand it in as a prop.
*/

/** Deterministic, so every visitor and every re-render sees the same graph. */
function rng(seed: number) {
    let s = seed >>> 0;
    return () => (s = (s * 1664525 + 1013904223) >>> 0) / 4294967296;
}

const TYPES = [
    { t: "person", c: "zara" },
    { t: "project", c: "kai" },
    { t: "doc", c: "juno" },
    { t: "topic", c: "nova" },
    { t: "org", c: "luna" },
    { t: "event", c: "aria" },
] as const;

const NAMES = [
    "magy-parse", "Cortex", "worktree lease", "BGE-M3", "MagyVerse", "navmesh",
    "PR #482", "PageRank", "hyperedge", "agent lens", "Postgres", "NATS",
    "scene.json", "embodiment", "Telegram", "cron", "skills", "TaskScope",
    "BM25", "episode", "dedup", "community", "briefing", "router",
];

type Node = {
    x: number; y: number; z: number;
    type: string; token: string; pr: number; name: string; aff: number[];
};

const N = 46;

const NODES: Node[] = (() => {
    const r = rng(70131);
    const out: Node[] = [];
    for (let i = 0; i < N; i++) {
        const ty = TYPES[(r() * TYPES.length) | 0];
        // Fibonacci shell with jitter: readable depth, no clumping at the poles.
        const u = (i + 0.5) / N;
        const phi = Math.acos(1 - 2 * u);
        const th = Math.PI * (1 + Math.sqrt(5)) * i;
        const rad = 0.62 + r() * 0.38;
        out.push({
            x: Math.cos(th) * Math.sin(phi) * rad,
            y: Math.cos(phi) * rad * 0.78,
            z: Math.sin(th) * Math.sin(phi) * rad,
            type: ty.t,
            token: ty.c,
            pr: 0.18 + Math.pow(r(), 2.4) * 0.82,
            name: NAMES[i % NAMES.length] + (i >= NAMES.length ? ` ·${1 + ((i / NAMES.length) | 0)}` : ""),
            aff: AGENTS.map(() => r()),
        });
    }
    return out;
})();

const EDGES: [number, number][] = (() => {
    const r = rng(9317);
    const out: [number, number][] = [];
    for (let i = 0; i < N; i++)
        for (let j = i + 1; j < N; j++) {
            const d = Math.hypot(NODES[i].x - NODES[j].x, NODES[i].y - NODES[j].y, NODES[i].z - NODES[j].z);
            if (d < 0.62 && r() < 0.5) out.push([i, j]);
        }
    return out;
})();

export default function CortexGraph() {
    const cv = useRef<HTMLCanvasElement>(null);
    const wrap = useRef<HTMLDivElement>(null);
    const [lens, setLens] = useState<number | null>(null);
    const [hover, setHover] = useState<{ i: number; x: number; y: number } | null>(null);

    // Refs, not state: these change every frame and must not re-render React.
    const rot = useRef({ x: -0.22, y: 0.5 });
    const drag = useRef<{ x: number; y: number; rx: number; ry: number } | null>(null);
    const lensRef = useRef<number | null>(null);
    const hoverRef = useRef(-1);
    const proj = useRef<{ i: number; x: number; y: number; z: number; p: number }[]>([]);

    lensRef.current = lens;
    hoverRef.current = hover?.i ?? -1;

    const weight = useCallback((n: Node) => {
        const l = lensRef.current;
        return l === null ? n.pr : n.pr * 0.3 + n.aff[l] * 0.7;
    }, []);

    useEffect(() => {
        const c = cv.current;
        if (!c) return;
        const ctx = c.getContext("2d");
        if (!ctx) return;

        const css = (n: string) => getComputedStyle(document.documentElement).getPropertyValue(n).trim();
        const still = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        let raf = 0;

        const draw = () => {
            const dpr = Math.min(devicePixelRatio || 1, 2);
            const w = c.clientWidth || 560;
            const h = Math.round(w * 0.78);
            if (c.width !== w * dpr || c.height !== h * dpr) {
                c.width = w * dpr;
                c.height = h * dpr;
                c.style.height = `${h}px`;
            }
            ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
            ctx.clearRect(0, 0, w, h);

            if (!still && !drag.current) rot.current.y += 0.0022;

            const cx = w / 2, cy = h / 2;
            const scale = Math.min(w, h) * 0.38;
            const FOV = 2.6;
            const cyr = Math.cos(rot.current.y), syr = Math.sin(rot.current.y);
            const cxr = Math.cos(rot.current.x), sxr = Math.sin(rot.current.x);

            const P = NODES.map((n, i) => {
                let x = n.x * cyr - n.z * syr;
                let z = n.x * syr + n.z * cyr;
                const y = n.y * cxr - z * sxr;
                z = n.y * sxr + z * cxr;
                const p = FOV / (FOV - z);
                return { i, x: cx + x * scale * p, y: cy + y * scale * p, z, p };
            });
            proj.current = P;

            const hot = hoverRef.current;
            const line = css("--color-line-hi") || "#333";
            const warm = css("--color-warm") || "#fab387";
            const fg = css("--color-fg") || "#fff";

            for (const [a, b] of EDGES) {
                const A = P[a], B = P[b];
                const near = hot === a || hot === b;
                ctx.globalAlpha = near ? 0.85 : 0.07 + ((A.z + B.z) / 2 + 1) * 0.1;
                ctx.strokeStyle = near ? warm : line;
                ctx.lineWidth = near ? 1.5 : 1;
                ctx.beginPath();
                ctx.moveTo(A.x, A.y);
                ctx.lineTo(B.x, B.y);
                ctx.stroke();
            }

            // Painter's algorithm — far to near, so nearer nodes occlude.
            for (const pt of [...P].sort((a, b) => a.z - b.z)) {
                const n = NODES[pt.i];
                const r = (2.2 + weight(n) * 8.5) * pt.p;
                const col = css(`--color-${n.token}`) || "#6ea8ff";
                const depth = 0.3 + (pt.z + 1) * 0.35;
                const isHot = hot === pt.i;

                ctx.fillStyle = col;
                ctx.globalAlpha = (isHot ? 0.34 : 0.15) * depth;
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, r * 2.5, 0, 7);
                ctx.fill();

                ctx.globalAlpha = isHot ? 1 : Math.min(1, 0.42 + depth * 0.62);
                ctx.beginPath();
                ctx.arc(pt.x, pt.y, r, 0, 7);
                ctx.fill();

                if (isHot) {
                    ctx.globalAlpha = 1;
                    ctx.strokeStyle = fg;
                    ctx.lineWidth = 1.5;
                    ctx.beginPath();
                    ctx.arc(pt.x, pt.y, r + 3.5, 0, 7);
                    ctx.stroke();
                }
            }
            ctx.globalAlpha = 1;
            raf = requestAnimationFrame(draw);
        };

        raf = requestAnimationFrame(draw);
        return () => cancelAnimationFrame(raf);
    }, [weight]);

    const pick = (e: React.PointerEvent) => {
        if (drag.current) return;
        const c = cv.current;
        if (!c) return;
        const rect = c.getBoundingClientRect();
        const mx = e.clientX - rect.left, my = e.clientY - rect.top;
        let best = -1, bd = 20;
        for (const pt of proj.current) {
            const d = Math.hypot(pt.x - mx, pt.y - my);
            const r = (2.2 + weight(NODES[pt.i]) * 8.5) * pt.p + 5;
            if (d < r && d < bd) { bd = d; best = pt.i; }
        }
        setHover(best < 0 ? null : { i: best, x: mx, y: my });
    };

    return (
        <div ref={wrap} className="border-line from-canvas-2 to-sunk relative overflow-hidden rounded-[var(--radius-md)] border bg-gradient-to-br">
            <canvas
                ref={cv}
                className="block w-full cursor-grab touch-none active:cursor-grabbing"
                onPointerDown={(e) => {
                    drag.current = { x: e.clientX, y: e.clientY, rx: rot.current.x, ry: rot.current.y };
                    e.currentTarget.setPointerCapture(e.pointerId);
                    setHover(null);
                }}
                onPointerMove={(e) => {
                    const d = drag.current;
                    if (d) {
                        rot.current.y = d.ry + (e.clientX - d.x) * 0.008;
                        rot.current.x = Math.max(-1.2, Math.min(1.2, d.rx + (e.clientY - d.y) * 0.006));
                    } else pick(e);
                }}
                onPointerUp={() => { drag.current = null; }}
                onPointerLeave={() => { drag.current = null; setHover(null); }}
            />

            {/* The lens toggle IS the section's argument: one graph, eight views. */}
            <div className="absolute left-3 top-3 flex max-w-[calc(100%-24px)] flex-wrap gap-1.5">
                <LensButton on={lens === null} token="dim" onClick={() => setLens(null)}>
                    Global
                </LensButton>
                {AGENTS.map((a, i) => (
                    <LensButton key={a.id} on={lens === i} token={a.token} onClick={() => setLens(i)}>
                        {a.name}
                    </LensButton>
                ))}
            </div>

            {hover && (
                <div
                    className="border-line-hi bg-solid shadow-[var(--shadow-deck)] pointer-events-none absolute z-10 max-w-[200px] rounded-[var(--radius-sm)] border px-2.5 py-1.5"
                    style={{ left: Math.min(hover.x + 14, (wrap.current?.clientWidth ?? 400) - 210), top: hover.y + 14 }}
                >
                    <b className="block text-[12px]">{NODES[hover.i].name}</b>
                    <span className="text-fg-dim font-mono text-[10px]">
                        {NODES[hover.i].type} · pagerank {weight(NODES[hover.i]).toFixed(2)}
                    </span>
                </div>
            )}

            <p className="deck-label pointer-events-none absolute bottom-3 right-3 text-[10.5px]">drag to rotate</p>
        </div>
    );
}

function LensButton({
    on, token, onClick, children,
}: {
    on: boolean; token: string; onClick: () => void; children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            style={{ ["--dot" as string]: `var(--color-${token})` }}
            className={`border-line-hi inline-flex items-center gap-1.5 rounded-[var(--radius-capsule)] border px-2.5 py-1 text-[10.5px] backdrop-blur-md transition-colors ${
                on
                    ? "bg-solid text-fg border-[var(--dot)] font-bold"
                    : "bg-solid/70 text-fg-muted hover:text-fg"
            }`}
        >
            <i className="size-1.5 shrink-0 rounded-full bg-[var(--dot)]" />
            {children}
        </button>
    );
}
