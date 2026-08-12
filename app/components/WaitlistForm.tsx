"use client";

import { useEffect, useRef, useState } from "react";
import type { SignupSource } from "@/app/lib/waitlist";

type Status = "idle" | "sending" | "done" | "already" | "error";

type Props = {
    source: SignupSource;
    /** `composer` keeps the app's composer shape; `hero` is a standalone block. */
    size?: "composer" | "hero";
    cta?: string;
    placeholder?: string;
    product?: "magy" | "mos" | "toowl";
    className?: string;
};

const DONE_MESSAGE: Record<"done" | "already", string> = {
    done: "You're in. Check your inbox — we sent a confirmation.",
    already: "You're already on the list. Nothing more to do.",
};

export default function WaitlistForm({
    source,
    size = "composer",
    cta = "Get Early Access",
    placeholder = "you@company.com",
    product = "magy",
    className = "",
}: Props) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);
    // Issued server-side; the endpoint verifies an HMAC over it and rejects
    // anything submitted in under 2s (bot) or older than 24h (stale page).
    const token = useRef("");

    useEffect(() => {
        let cancelled = false;
        fetch("/api/waitlist/token")
            .then((r) => r.json())
            .then((d) => {
                if (!cancelled) token.current = d.t ?? "";
            })
            .catch(() => {});
        return () => {
            cancelled = true;
        };
    }, []);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (status === "sending") return;
        setStatus("sending");
        setError(null);

        const form = e.currentTarget;
        const params = new URLSearchParams(window.location.search);

        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    email,
                    source,
                    product,
                    t: token.current,
                    company: (form.elements.namedItem("company") as HTMLInputElement)?.value ?? "",
                    path: window.location.pathname,
                    referrer: document.referrer || null,
                    utm_source: params.get("utm_source"),
                    utm_medium: params.get("utm_medium"),
                    utm_campaign: params.get("utm_campaign"),
                    utm_term: params.get("utm_term"),
                    utm_content: params.get("utm_content"),
                }),
            });
            const data = await res.json().catch(() => ({}));

            if (!res.ok) {
                setStatus("error");
                setError(
                    data?.error === "invalid_email"
                        ? "That email doesn't look right."
                        : data?.error === "rate_limited"
                          ? "Too many tries. Give it a minute."
                          : "That didn't go through. Try again in a moment?"
                );
                return;
            }
            setStatus(data.status === "already_subscribed" ? "already" : "done");
            setEmail("");
        } catch {
            setStatus("error");
            setError("That didn't go through. Try again in a moment?");
        }
    }

    if (status === "done" || status === "already") {
        return (
            <div
                role="status"
                aria-live="polite"
                className={`border-line bg-sunk flex items-center gap-3 rounded-[var(--radius-md)] border px-4 py-3.5 ${className}`}
            >
                <span
                    aria-hidden
                    className="bg-good grid size-5 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
                >
                    ✓
                </span>
                <p className="text-fg-muted text-[13px]">{DONE_MESSAGE[status]}</p>
            </div>
        );
    }

    const hero = size === "hero";

    return (
        <div className={className}>
            <form onSubmit={onSubmit} noValidate>
                {/* Honeypot — hidden from people and from screen readers, but a naive
                    bot fills every field it finds. A filled value returns 200 and
                    silently drops, so the bot never learns it was caught. */}
                <div aria-hidden className="absolute size-0 overflow-hidden opacity-0">
                    <label htmlFor={`company-${source}`}>Company</label>
                    <input id={`company-${source}`} name="company" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div
                    className={`border-line-hi bg-canvas focus-within:border-red focus-within:shadow-[0_0_0_3px_var(--color-red-soft)] flex gap-2 rounded-[11px] border p-1.5 transition-[border-color,box-shadow] max-[430px]:flex-col ${
                        hero ? "sm:p-2" : ""
                    }`}
                >
                    {/* A caret, not a send arrow — it says "typable" while the labelled
                        red button says "this submits". It fades once you start. */}
                    <span
                        aria-hidden
                        className="text-red animate-blink flex items-center pl-2.5 font-mono text-sm [:focus-within>&]:opacity-0 max-[430px]:hidden"
                    >
                        ▍
                    </span>

                    <label htmlFor={`email-${source}`} className="sr-only">
                        Email address
                    </label>
                    <input
                        id={`email-${source}`}
                        name="email"
                        type="email"
                        inputMode="email"
                        autoComplete="email"
                        required
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder={placeholder}
                        aria-invalid={status === "error" || undefined}
                        // The wrapper already shows focus; suppressing the global ring
                        // here avoids a ring drawn inside a ring.
                        className={`text-fg placeholder:text-fg-dim min-w-0 flex-1 border-0 bg-transparent px-1 outline-none focus-visible:shadow-none ${
                            hero ? "py-3 text-[15px]" : "py-2.5 text-sm"
                        }`}
                    />
                    <button
                        type="submit"
                        disabled={status === "sending"}
                        className={`bg-red hover:bg-red-hover shadow-[var(--shadow-cta)] shrink-0 rounded-[var(--radius-md)] font-bold text-white transition-colors disabled:opacity-60 max-[430px]:w-full ${
                            hero ? "px-6 py-3.5 text-[15px]" : "px-5 py-3 text-sm"
                        }`}
                    >
                        {status === "sending" ? "…" : cta}
                    </button>
                </div>
            </form>

            <p
                role={error ? "alert" : undefined}
                className={`mt-2.5 text-[11.5px] ${error ? "text-red" : "text-fg-dim"}`}
            >
                {error ?? "One email. No spam, unsubscribe any time."}
            </p>
        </div>
    );
}
