"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/*
  The contact form, restored.

  It existed as a dead `handleSubmit` in app/contact/page.tsx — the <form> JSX
  had been deleted, so /api/contact had no caller at all. Extracting it here
  also lets /contact become a server component, which is the only way that route
  can export metadata.

  `topic` prefixes the email subject so the founder can triage straight from the
  inbox list view, and it is deep-linkable: /contact?topic=licensing.
*/

/*
  Magy and MOS are not offered here while they are unpublished (2026-08-26) --
  the dropdown defaulted to "Magy — early access", so the first thing anyone
  saw on the contact form was the product we are deliberately not talking
  about. Restore both lines with the rest of the Magy/MOS blocks.

  The server's own TOPICS set in app/api/contact/route.ts deliberately still
  accepts them: it is a validation allowlist, and an unknown topic falls back
  to "other", so leaving it permissive costs nothing and keeps any existing
  /contact?topic=... link working.
*/
const TOPICS = [
    { value: "toowl", label: "toowl" },
    { value: "press", label: "Press & media" },
    { value: "licensing", label: "Licensing & partnerships" },
    { value: "idrl", label: "IDRL" },
    { value: "other", label: "Something else" },
] as const;

type Status = "idle" | "sending" | "sent" | "error";

export default function ContactForm() {
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState("");
    const [topic, setTopic] = useState<string>("toowl");
    /*
      The anti-bot token, fetched with retries and gating submit.

      This was the same single un-retried fetch with a swallowed error that
      WaitlistForm carried until 1a3e116: one blip left `token.current` as "",
      the endpoint answered the empty token with `{message:"Sent"}` so a bot
      would learn nothing, and the sender was shown success.

      It matters MORE here than it did there. A dropped waitlist signup still
      had Postgres, then an NDJSON file on the host volume, then an
      email-of-last-resort behind it. A dropped contact message has none of
      that: no row, no file, no mail. It is simply gone, and the only person
      who knows it existed has been told it arrived.

      Verified against production on 2026-08-27 — POSTing an empty token
      returned 200 {"message":"Sent"} and delivered nothing.
    */
    const token = useRef("");
    const tokenAt = useRef(0);
    const cancelled = useRef(false);
    const [tokenReady, setTokenReady] = useState(false);
    const MAX_FILL_MS = 24 * 60 * 60 * 1000; // mirrors app/lib/waitlist.ts
    const REFRESH_AFTER_MS = 60 * 60 * 1000;

    const refreshToken = useCallback(() => {
        let attempt = 0;
        const load = () => {
            fetch("/api/waitlist/token")
                .then((r) => (r.ok ? r.json() : Promise.reject(new Error(String(r.status)))))
                .then((d: { t?: string }) => {
                    if (cancelled.current) return;
                    if (d?.t) {
                        token.current = d.t;
                        tokenAt.current = Date.now();
                        setTokenReady(true);
                    } else {
                        throw new Error("no token in response");
                    }
                })
                .catch(() => {
                    if (cancelled.current || attempt >= 4) {
                        if (!cancelled.current) {
                            console.warn("[contact] could not obtain a form token; submission is blocked rather than silently dropped");
                        }
                        return;
                    }
                    setTimeout(load, 400 * 2 ** attempt++);
                });
        };
        load();
    }, []);

    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const t = params.get("topic");
        if (t && TOPICS.some((x) => x.value === t)) setTopic(t);

        cancelled.current = false;
        refreshToken();

        // A token also expires. Re-issue EARLY — while the visitor is reading —
        // so it has aged past MIN_FILL_MS by the time they press Send.
        const onVisible = () => {
            if (document.visibilityState !== "visible") return;
            if (Date.now() - tokenAt.current < REFRESH_AFTER_MS) return;
            refreshToken();
        };
        document.addEventListener("visibilitychange", onVisible);

        return () => {
            cancelled.current = true;
            document.removeEventListener("visibilitychange", onVisible);
        };
    }, [refreshToken]);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (status === "sending") return;

        /*
          Refuse rather than POST a token the endpoint will reject. It answers
          a bad token with a fake success, so submitting here would tell the
          sender their message arrived when nothing was sent and nothing was
          kept. An honest error they can retry is the only recoverable outcome.
        */
        const staleToken = Date.now() - tokenAt.current > MAX_FILL_MS;
        if (!tokenReady || !token.current || staleToken) {
            setStatus("error");
            setError("That didn't send. Try again in a moment?");
            if (staleToken) {
                setTokenReady(false);
                refreshToken();
            }
            return;
        }

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
                    // Also gated on the form token: without it the POST is
                    // answered with a fake success and the message is lost.
                    disabled={status === "sending" || !tokenReady}
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
