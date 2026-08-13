"use client";

import { useEffect, useRef, useState } from "react";

/*
  The contact form, restored.

  It existed as a dead `handleSubmit` in app/contact/page.tsx — the <form> JSX
  had been deleted, so /api/contact had no caller at all. Extracting it here
  also lets /contact become a server component, which is the only way that route
  can export metadata.

  `topic` prefixes the email subject so the founder can triage straight from the
  inbox list view, and it is deep-linkable: /contact?topic=licensing.
*/

const TOPICS = [
    { value: "magy", label: "Magy — early access" },
    { value: "press", label: "Press & media" },
    { value: "licensing", label: "Licensing & partnerships" },
    { value: "mos", label: "MOS — robotics simulation" },
    { value: "toowl", label: "Toowl" },
    { value: "idrl", label: "IDRL" },
    { value: "other", label: "Something else" },
] as const;

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState("");
    const [topic, setTopic] = useState<string>("magy");
    const token = useRef("");

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const t = params.get("topic");
        if (t && TOPICS.some((x) => x.value === t)) setTopic(t);

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
        setError("");

        const fd = new FormData(e.currentTarget);
        try {
            const res = await fetch("/api/contact", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    name: fd.get("name"),
                    email: fd.get("email"),
                    org: fd.get("org"),
                    message: fd.get("message"),
                    topic,
                    company: fd.get("company"), // honeypot
                    t: token.current,
                }),
            });
            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                setStatus("error");
                setError(data?.error ?? "That didn't send. Try again in a moment?");
                return;
            }
            setStatus("sent");
        } catch {
            setStatus("error");
            setError("That didn't send. Try again in a moment?");
        }
    }

    if (status === "sent") {
        return (
            <div className="deck-card p-5" role="status" aria-live="polite">
                <h2 className="text-h3 font-bold">Message sent.</h2>
                <p className="text-fg-muted mt-1.5 text-[13.5px]">
                    We read everything that comes to sales@ and reply within one business day.
                </p>
            </div>
        );
    }

    const field =
        "border-line-hi bg-canvas text-fg placeholder:text-fg-dim focus:border-red w-full rounded-[var(--radius-md)] border px-3.5 py-3 text-sm outline-none transition-colors";

    return (
        <form onSubmit={onSubmit} className="deck-card grid gap-3.5 p-5" noValidate>
            <div aria-hidden className="absolute size-0 overflow-hidden opacity-0">
                <label htmlFor="contact-company">Company</label>
                <input id="contact-company" name="company" tabIndex={-1} autoComplete="off" />
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                    <label htmlFor="c-name" className="deck-label mb-1.5 block">Name</label>
                    <input id="c-name" name="name" required className={field} autoComplete="name" />
                </div>
                <div>
                    <label htmlFor="c-email" className="deck-label mb-1.5 block">Email</label>
                    <input id="c-email" name="email" type="email" required className={field} autoComplete="email" />
                </div>
            </div>

            <div className="grid gap-3.5 sm:grid-cols-2">
                <div>
                    <label htmlFor="c-org" className="deck-label mb-1.5 block">
                        Company <span className="text-fg-dim normal-case">— optional</span>
                    </label>
                    <input id="c-org" name="org" className={field} autoComplete="organization" />
                </div>
                <div>
                    <label htmlFor="c-topic" className="deck-label mb-1.5 block">Topic</label>
                    <select
                        id="c-topic"
                        name="topic"
                        value={topic}
                        onChange={(e) => setTopic(e.target.value)}
                        className={field}
                    >
                        {TOPICS.map((t) => (
                            <option key={t.value} value={t.value}>{t.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                <label htmlFor="c-message" className="deck-label mb-1.5 block">Message</label>
                <textarea id="c-message" name="message" required rows={5} className={`${field} resize-y`} />
            </div>

            {error && (
                <p role="alert" className="text-red-ink text-[13px]">{error}</p>
            )}

            <div className="flex flex-wrap items-center gap-3">
                <button
                    type="submit"
                    disabled={status === "sending"}
                    className="bg-red hover:bg-red-hover shadow-[var(--shadow-cta)] rounded-[var(--radius-md)] px-6 py-3 text-sm font-bold text-white transition-colors disabled:opacity-60"
                >
                    {status === "sending" ? "Sending…" : "Send message"}
                </button>
                <span className="text-fg-dim text-[12.5px]">
                    We reply within one business day.
                </span>
            </div>
        </form>
    );
}
