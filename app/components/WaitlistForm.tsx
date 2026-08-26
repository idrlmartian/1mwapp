"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { signupError, signupSubmit, signupSuccess, signupView } from "@/app/lib/analytics";
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
    /**
     * Put the cursor in this field on load. Set it on ONE form per page — the
     * first one — or the last to mount silently wins and focus lands somewhere
     * arbitrary down the page.
     *
     * Honoured on pointer devices only; see the effect for why.
     */
    autoFocus?: boolean;
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
    autoFocus = false,
}: Props) {
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState<Status>("idle");
    const [error, setError] = useState<string | null>(null);
    // Issued server-side; the endpoint verifies an HMAC over it and flags
    // anything submitted in under 2s (bot) or older than 24h (stale page).
    //
    // `tokenAt` is when WE received it, deliberately not the timestamp baked
    // into the token. Our receive time is always LATER than the server's issue
    // time, so an age computed from it is an under-estimate — which is the safe
    // direction for the 2s floor, and it cannot be thrown off by a visitor
    // whose system clock is wrong.
    const token = useRef("");
    const tokenAt = useRef(0);

    // Fires once, when the form actually enters the viewport — the funnel's
    // denominator. Counting renders instead would inflate it on every page that
    // carries a form below the fold.
    const box = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const el = box.current;
        if (!el) return;
        const io = new IntersectionObserver(
            ([e]) => {
                if (e.isIntersecting) {
                    signupView(source);
                    io.disconnect();
                }
            },
            { threshold: 0.4 }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [source]);

    /*
      Autofocus, done by hand rather than with the `autoFocus` attribute.

      THE PAGE MUST NOT MOVE. That is the whole constraint, and preventScroll
      alone did not deliver it — the hero scrolled out of view on load, hiding
      the product name and headline, which is the one thing a visitor has to see
      first. preventScroll is honoured unevenly across engines, and it does
      nothing about scrollable ANCESTORS: /magy's rail is overflow-y:auto, so
      focusing inside it can scroll the rail even when the window holds still.

      So the rule is stronger than "don't scroll": only take focus if the field
      is ALREADY fully in the viewport. If it is off screen, there is no way to
      focus it without moving something, and a convenience is not worth moving
      the page for. preventScroll stays as a second line of defence.

      The other three gates:
        · TOUCH. The attribute fires everywhere, and on a phone focusing an
          input yanks the keyboard over half the screen before a word is read.
        · STOLEN FOCUS. Someone who clicked or tabbed before hydration has
          already chosen where they are; bail rather than snatch it back.
        · One form per page claims this — focus is singular.
    */
    const input = useRef<HTMLInputElement>(null);
    useEffect(() => {
        if (!autoFocus) return;
        if (!window.matchMedia("(pointer: fine)").matches) return;
        const el = input.current;
        if (!el) return;

        const active = document.activeElement;
        if (active && active !== document.body && active !== el) return;

        const r = el.getBoundingClientRect();
        const viewportH = window.innerHeight || document.documentElement.clientHeight;
        const viewportW = window.innerWidth || document.documentElement.clientWidth;
        const fullyVisible = r.top >= 0 && r.left >= 0 && r.bottom <= viewportH && r.right <= viewportW;
        if (!fullyVisible) return;

        el.focus({ preventScroll: true });
    }, [autoFocus]);

    /*
      THE BUTTON YIELDS TO A LONG ADDRESS, AND ONLY THEN.

      "Get Early Access" is ~150px of fixed width, and the field takes what is
      left. `firstname.lastname@somelongcompany.com` does not fit in what is
      left, so it scrolls under its own left edge and the visitor cannot see
      what they typed while typing it — at the exact moment they are checking
      it for a typo.

      Measured, not guessed. `scrollWidth > clientWidth` is the browser telling
      us the text genuinely overflows, so nothing moves for the ordinary
      address that fits, whatever the font or zoom or window width happens to
      be. A character-count threshold would be a guess about all three.

      HYSTERESIS IS THE WHOLE TRICK. Collapsing the button hands ~120px back to
      the field, which usually removes the overflow that triggered it — so a
      naive "collapse while overflowing" oscillates on every keystroke around
      the boundary. Collapse is therefore one-way for the life of one entry and
      is released only when the field is emptied: a state the visitor reaches
      deliberately, never mid-typing.

      TWO STAGES, because one was not enough. Measured on /magy at 1280px:
      the field is 170px inline, and 277px once the button collapses. That
      covers an address up to ~31 characters — `alexander.thompson@techcorp.com`
      fits — but not 39+, where even the collapsed row runs out. So a second
      step drops the button onto its own line and gives the field the whole
      width. Rare, and the alternative is text the visitor cannot read.

      Each step is entered only when the browser says the text still does not
      fit, so nobody pays for a stage they do not need.

      Inline layout only. Under 430px the button already sits full-width on its
      own row, where it is not competing with the field for anything.
    */
    const [fit, setFit] = useState<"full" | "compact" | "stacked">("full");
    useEffect(() => {
        if (email === "") {
            setFit("full");
            return;
        }
        if (fit === "stacked") return;
        const el = input.current;
        if (!el) return;
        if (!window.matchMedia("(min-width: 431px)").matches) return;
        if (el.scrollWidth <= el.clientWidth) return;
        // Still overflowing after the button already gave up its label? Then
        // the row is out of room and only a whole line will do.
        setFit(fit === "full" ? "compact" : "stacked");
    }, [email, fit]);

    /*
      Mirrors MIN_FILL_MS / MAX_FILL_MS in app/lib/waitlist.ts. Duplicated on
      purpose: the server decides, but the client is the only place that can
      guarantee it never posts a token the server is certain to flag.
    */
    const MIN_FILL_MS = 2000;
    const MAX_FILL_MS = 24 * 60 * 60 * 1000;

    const fetchToken = useCallback(async () => {
        const r = await fetch("/api/waitlist/token", { cache: "no-store" });
        const d = await r.json();
        if (typeof d?.t === "string" && d.t.includes(".")) {
            token.current = d.t;
            tokenAt.current = Date.now();
        }
    }, []);

    /*
      Fetch on mount, and RETRY. The previous version had a bare
      `.catch(() => {})`: one flaky request and the form spent the rest of its
      life posting an empty token, which the server then treated as a bot.
      Three tries over ~3.5s covers a transient blip without the visitor ever
      knowing there was one.
    */
    useEffect(() => {
        let cancelled = false;
        (async () => {
            for (let attempt = 0; attempt < 3 && !cancelled; attempt++) {
                try {
                    await fetchToken();
                    if (token.current) return;
                } catch {
                    /* fall through to the retry */
                }
                await new Promise((r) => setTimeout(r, 500 * 2 ** attempt));
            }
        })();
        return () => {
            cancelled = true;
        };
    }, [fetchToken]);

    /*
      Last line of defence, run at submit. Someone who lands and types fast can
      beat the mount fetch; a tab left open overnight carries a token past
      MAX_FILL_MS. Either way, get a good one before posting.

      The wait is the unobvious part: a token fetched *just now* is younger than
      the 2s floor, so posting it immediately would be flagged for being too
      fast. Sitting out the remainder costs at most two seconds, and only on the
      rare path where the mount fetch did not land.
    */
    const ensureToken = useCallback(async () => {
        const stale = Date.now() - tokenAt.current > MAX_FILL_MS;
        if (!token.current || stale) {
            try {
                await fetchToken();
            } catch {
                /* post anyway — the server now persists and flags rather than
                   dropping, so a missing token costs the confirmation email,
                   never the signup itself */
            }
        }
        const age = Date.now() - tokenAt.current;
        if (token.current && age < MIN_FILL_MS) {
            await new Promise((r) => setTimeout(r, MIN_FILL_MS - age));
        }
    }, [fetchToken]);

    async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        if (status === "sending") return;
        setStatus("sending");
        setError(null);
        signupSubmit(source);

        const form = e.currentTarget;
        const params = new URLSearchParams(window.location.search);
        // Read before the await: React pools nothing here, but `form.elements`
        // is only safe to touch while the element is still mounted.
        const honeypot = (form.elements.namedItem("company") as HTMLInputElement)?.value ?? "";

        await ensureToken();

        try {
            const res = await fetch("/api/waitlist", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                    email,
                    source,
                    product,
                    t: token.current,
                    company: honeypot,
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
                signupError(source, data?.error ?? "server");
                setError(
                    data?.error === "invalid_email"
                        ? "That email doesn't look right."
                        : data?.error === "rate_limited"
                          ? "Too many tries. Give it a minute."
                          : "That didn't go through. Try again in a moment?"
                );
                return;
            }
            const dup = data.status === "already_subscribed";
            signupSuccess(source, dup);
            setStatus(dup ? "already" : "done");
            setEmail("");
        } catch {
            setStatus("error");
            signupError(source, "network");
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
        <div ref={box} className={className}>
            <form onSubmit={onSubmit} noValidate>
                {/* Honeypot — hidden from people and from screen readers, but a naive
                    bot fills every field it finds. A filled value returns 200 and
                    silently drops, so the bot never learns it was caught. */}
                <div aria-hidden className="absolute size-0 overflow-hidden opacity-0">
                    <label htmlFor={`company-${source}`}>Company</label>
                    <input id={`company-${source}`} name="company" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div
                    className={`border-line-hi bg-canvas focus-within:border-red focus-within:shadow-[0_0_0_3px_var(--color-red-soft)] [&:focus-within_.caret]:opacity-0 flex gap-2 rounded-[11px] border p-1.5 transition-[border-color,box-shadow] max-[430px]:flex-col ${
                        fit === "stacked" ? "flex-col" : ""
                    } ${hero ? "sm:p-2" : ""}`}
                >
                    {/* The caret is absolutely positioned and takes NO layout space,
                        so it lands on exactly the same x as the input's text origin
                        (both at left-3) and clicking the field produces no jump.

                        It is a painted box, not the ▍ glyph it used to be. A glyph
                        can never line up: it advances the full character width while
                        its ink starts at whatever left side bearing the font chose,
                        so the real caret always sat ~12px to its right. A 2px box
                        starts its ink at its own origin, which is where a browser
                        draws the text caret too.

                        Overlapping the placeholder's first character is correct, not
                        a bug — a native empty input draws its caret in exactly that
                        spot. */}
                    <div className="relative flex min-w-0 flex-1 items-center">
                        <span
                            aria-hidden
                            className={`caret bg-red animate-blink pointer-events-none absolute left-3 top-1/2 w-[2px] -translate-y-1/2 rounded-[1px] max-[430px]:hidden ${
                                hero ? "h-[17px]" : "h-[15px]"
                            }`}
                        />

                        <label htmlFor={`email-${source}`} className="sr-only">
                            Email address
                        </label>
                        <input
                        ref={input}
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
                            // pl-3 must stay in lockstep with the caret's left-3
                            // above: that shared value IS the alignment.
                            className={`text-fg placeholder:text-fg-dim min-w-0 flex-1 border-0 bg-transparent pl-3 pr-0 outline-none focus-visible:shadow-none ${
                                hero ? "py-3 text-[15px]" : "py-2.5 text-sm"
                            }`}
                        />
                    </div>
                    {/* The label is the accessible name whether or not the
                        glyph is showing, so the button never becomes "→" to a
                        screen reader, and a pointer user who wonders what the
                        arrow does gets the same words in a tooltip.

                        `max-[430px]:` overrides put the full label back in the
                        stacked layout: there the button owns a whole row, so
                        the arrow would be shrinking to fit a space nothing else
                        wants. */}
                    <button
                        type="submit"
                        disabled={status === "sending"}
                        aria-label={cta}
                        title={cta}
                        className={`bg-red hover:bg-red-hover shadow-[var(--shadow-cta)] shrink-0 rounded-[var(--radius-md)] font-bold text-white transition-colors disabled:opacity-60 max-[430px]:w-full ${
                            hero ? "py-3.5 text-[15px]" : "py-3 text-sm"
                        } ${fit === "stacked" ? "w-full " : ""}${
                            fit === "compact" ? "px-4 max-[430px]:px-6" : hero ? "px-6" : "px-5"
                        }`}
                    >
                        {status === "sending" ? (
                            "…"
                        ) : fit === "compact" ? (
                            <>
                                <span aria-hidden className="max-[430px]:hidden">
                                    →
                                </span>
                                <span className="hidden max-[430px]:inline">{cta}</span>
                            </>
                        ) : (
                            cta
                        )}
                    </button>
                </div>
            </form>

            <p
                role={error ? "alert" : undefined}
                className={`mt-2.5 text-[11.5px] ${error ? "text-red-ink" : "text-fg-dim"}`}
            >
                {error ?? "One email. No spam, unsubscribe any time."}
            </p>
        </div>
    );
}
