"use client";

import { useEffect, useRef, useState } from "react";
import { HERO, WORLD } from "@/app/lib/constants";

/*
  The world pane.

  Load order is the whole point, and it is deliberately conservative:

    1. The poster paints immediately as a CSS background. It is the LCP element.
       The <video> ships with NO src at all, so it requests nothing.
    2. After window.load — never before — a gate decides whether this visitor
       should get video: desktop viewport, motion allowed, not data-saving, not
       2g. MOBILE NEVER DOWNLOADS IT. That single rule removes ~1 MB from the
       devices furthest from a single Mumbai origin with no CDN.
    3. Only if the gate passes do <source> children get attached and load()
       called. On `canplay` the video cross-fades over the poster.

  play() is caught and ignored: iOS Low Power Mode, Android data-saver and some
  managed browsers reject autoplay even for muted inline video. The poster is
  the design, so a rejection is a non-event rather than a broken hero.
*/

type Props = { className?: string };

export default function VideoBackdrop({ className = "" }: Props) {
    const ref = useRef<HTMLVideoElement>(null);
    const [state, setState] = useState<"poster" | "playing">("poster");

    useEffect(() => {
        const video = ref.current;
        if (!video) return;

        const conn = (navigator as Navigator & { connection?: { saveData?: boolean; effectiveType?: string } })
            .connection;

        const allowed =
            window.matchMedia("(min-width: 768px)").matches &&
            window.matchMedia("(prefers-reduced-motion: no-preference)").matches &&
            !conn?.saveData &&
            !/(^|-)2g$/.test(conn?.effectiveType ?? "");

        if (!allowed) return;

        let cancelled = false;

        const attach = () => {
            if (cancelled || video.dataset.attached) return;
            video.dataset.attached = "1";

            // webm first: VP9/AV1 is materially smaller on dark, low-detail
            // footage. Safari falls through to the mp4.
            for (const [src, type] of [
                [HERO.webm, "video/webm"],
                [HERO.mp4, "video/mp4"],
            ]) {
                const source = document.createElement("source");
                source.src = src;
                source.type = type;
                video.appendChild(source);
            }
            video.load();
            video.addEventListener(
                "canplay",
                () => {
                    if (cancelled) return;
                    setState("playing");
                    void video.play().catch(() => {});
                },
                { once: true }
            );
        };

        const schedule = () => {
            const idle = (window as Window & { requestIdleCallback?: (cb: () => void, o?: object) => number })
                .requestIdleCallback;
            idle ? idle(attach, { timeout: 2000 }) : setTimeout(attach, 400);
        };

        if (document.readyState === "complete") schedule();
        else window.addEventListener("load", schedule, { once: true });

        // Stop decoding once the hero is off screen — worth 5-8% CPU across the
        // rest of the page, which matters on the phones that did get video.
        const io = new IntersectionObserver(
            ([entry]) => {
                if (!video.dataset.attached) return;
                entry.isIntersecting ? void video.play().catch(() => {}) : video.pause();
            },
            { threshold: 0 }
        );
        io.observe(video);

        const onVisibility = () => {
            if (document.hidden) video.pause();
            else if (video.dataset.attached) void video.play().catch(() => {});
        };
        document.addEventListener("visibilitychange", onVisibility);

        return () => {
            cancelled = true;
            io.disconnect();
            window.removeEventListener("load", schedule);
            document.removeEventListener("visibilitychange", onVisibility);
        };
    }, []);

    return (
        <div className={`world relative overflow-hidden ${className}`} data-state={state}>
            {/* Poster as a background rather than an <img>: it must cover, and it
                must not be a second element competing to be the LCP candidate. */}
            <div
                className="world-poster absolute inset-0 bg-[#0b0d12] bg-[38%_42%] bg-cover bg-no-repeat transition-opacity duration-[var(--dur-slow)] ease-[var(--ease-out-expo)]"
                style={{ backgroundImage: `image-set(url(${HERO.poster}) type("image/avif"), url(${HERO.posterFallback}) type("image/jpeg"))` }}
            />
            <video
                ref={ref}
                muted
                loop
                playsInline
                preload="none"
                aria-hidden
                tabIndex={-1}
                disableRemotePlayback
                className="world-video absolute inset-0 size-full object-cover opacity-0 transition-opacity duration-[var(--dur-slow)] ease-[var(--ease-out-expo)]"
            />

            <span className="border-line-hi text-fg absolute left-4 top-4 z-2 inline-flex items-center gap-2 rounded-[var(--radius-capsule)] border bg-[rgb(11_13_18/0.62)] px-3 py-1.5 font-mono text-[10.5px] font-semibold uppercase tracking-[0.12em] text-[#c9d3e4] backdrop-blur-md">
                <i className="bg-blue size-1.5 rounded-full" />
                Magyverse · live
            </span>

            <p className="absolute bottom-4 left-4 z-2 hidden gap-4 font-mono text-[10px] font-semibold uppercase tracking-[0.15em] text-[#7d8aa2] sm:flex">
                <span>{WORLD.dims}</span>
                <span>{WORLD.zones}</span>
            </p>
        </div>
    );
}
