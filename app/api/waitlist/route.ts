import { appendFile, mkdir } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { NextResponse } from "next/server";
import { hasDb, sql } from "@/app/lib/db";
import { sendConfirmation, sendSignupFallback } from "@/app/lib/email";
import { clientIp, rateLimit } from "@/app/lib/rate-limit";
import {
    CONSENT_TEXT,
    checkMx,
    hashIp,
    originAllowed,
    validateEmail,
    verifyFormToken,
} from "@/app/lib/waitlist";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/*
  Candidate directories for the disk fallback, tried in order.

  /data is the Kamal host volume mounted into the container. It is the one we
  want — it survives a deploy, whereas anything inside the image is destroyed
  when the container is replaced. But if the volume ever fails to mount (a
  deploy misconfiguration, or simply running outside Docker), falling straight
  through to "all persistence failed" would lose a signup for a reason that has
  nothing to do with the database. So: try the volume, then the OS temp dir.
  A signup in the wrong directory is recoverable; a lost one is not.
*/
const FALLBACK_DIRS = [
    process.env.WAITLIST_FALLBACK_DIR,
    "/data",
    path.join(tmpdir(), "1mwapp"),
].filter(Boolean) as string[];
const MAX_BODY = 4096;

async function appendFallback(line: string): Promise<string | null> {
    for (const dir of FALLBACK_DIRS) {
        try {
            await mkdir(dir, { recursive: true });
            const file = path.join(dir, "waitlist-fallback.ndjson");
            await appendFile(file, line, "utf8");
            return file;
        } catch {
            /* try the next candidate */
        }
    }
    return null;
}

// Above this many inserts per minute site-wide, stop sending confirmations but
// KEEP PERSISTING. A flood must not burn the daily SMTP quota, and the list is
// what matters — the mail can be replayed later.
const CONFIRM_BREAKER_PER_MIN = 300;
let confirmWindow = { start: Date.now(), count: 0 };

function breakerOpen() {
    const now = Date.now();
    if (now - confirmWindow.start > 60_000) confirmWindow = { start: now, count: 0 };
    confirmWindow.count += 1;
    return confirmWindow.count > CONFIRM_BREAKER_PER_MIN;
}

/*
  A daily ceiling as well as the per-minute breaker.

  300/min alone is not a bound worth having: sustained, it authorises 18,000
  confirmation emails an hour to addresses an attacker chose. Every one that
  bounces is scored against the AWS ACCOUNT, which also carries
  droneracingindia.com's live transactional mail — so the realistic damage
  from waitlist bots is not junk rows, it is pausing IDRL's email.

  A bot pacing itself just under the per-minute limit is the case the burst
  breaker cannot see, which is exactly why this one is counted in the database
  rather than in memory: it survives a container restart, so restarting the
  app cannot be used to reset the budget. waitlist_events already carries a
  (kind, created_at DESC) index, so this is an index-only range count.
*/
const CONFIRM_CAP_PER_DAY = 2000;

async function dailyCapReached(): Promise<boolean> {
    if (!sql) return false;
    try {
        const [r] = await sql`SELECT count(*)::int AS n FROM waitlist_events
                              WHERE kind = 'email_sent'
                                AND created_at > now() - interval '24 hours'`;
        return (r?.n ?? 0) >= CONFIRM_CAP_PER_DAY;
    } catch {
        // Fail open. If counting is broken we would rather send than silently
        // withhold a real person's confirmation; the burst breaker still caps
        // the rate, and a database this broken would not have produced a
        // verify token to send in the first place.
        return false;
    }
}

/*
  Whether to WITHHOLD the confirmation email. The signup row is always kept —
  this decides sending only, never acceptance. That split is the point: it
  severs bot -> bounce -> account reputation without ever rejecting a human,
  and it mirrors how IDRL treats a low reCAPTCHA score (flag, don't block).

  mxOk is `boolean | null` and the difference matters. `false` means the domain
  definitively has no MX. `null` means the LOOKUP failed — a 2.5s timeout or
  transient DNS — so treating it as suspicious would withhold confirmations
  from real signups during exactly the spike this was built for. Only an
  explicit false suppresses.
*/
async function suppressReason(sig: {
    mxOk: boolean | null;
    disposable: boolean;
}): Promise<string | null> {
    if (sig.mxOk === false) return "mx_missing";
    if (sig.disposable) return "disposable_domain";
    if (breakerOpen()) return "burst_breaker";
    if (await dailyCapReached()) return "daily_cap";
    return null;
}

const ok = (body: Record<string, unknown>) => NextResponse.json({ ok: true, ...body });

type JsonDetail = Record<string, string | number | boolean | null>;

async function logEvent(kind: string, emailNorm: string, detail: JsonDetail) {
    if (!sql) return;
    try {
        await sql`INSERT INTO waitlist_events (kind, email_norm, detail)
                  VALUES (${kind}, ${emailNorm}, ${sql.json(detail)})`;
    } catch {
        /* never let telemetry break a signup */
    }
}

export async function POST(req: Request) {
    // ── cheap rejections first: no I/O ──────────────────────────────────────
    if (!originAllowed(req.headers)) {
        return NextResponse.json({ ok: false, error: "bad_origin" }, { status: 403 });
    }

    const len = Number(req.headers.get("content-length") ?? 0);
    if (len > MAX_BODY) {
        return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
    }

    let body: Record<string, unknown>;
    try {
        body = await req.json();
    } catch {
        return NextResponse.json({ ok: false, error: "bad_json" }, { status: 400 });
    }

    const ip = clientIp(req.headers);
    const ipHash = hashIp(ip);

    // Honeypot. Return 200 — never tell a bot it failed, or it learns to adapt.
    if (typeof body.company === "string" && body.company.trim() !== "") {
        await logEvent("rejected", "", { reason: "honeypot", ip_hash: ipHash });
        return ok({ status: "subscribed" });
    }

    if (!verifyFormToken(body.t)) {
        await logEvent("rejected", "", { reason: "bad_form_token", ip_hash: ipHash });
        return ok({ status: "subscribed" });
    }

    const burst = rateLimit(`w:m:${ipHash}`, { capacity: 3, refillPerSec: 3 / 60 });
    const hourly = rateLimit(`w:h:${ipHash}`, { capacity: 10, refillPerSec: 10 / 3600 });
    if (!burst.ok || !hourly.ok) {
        await logEvent("rejected", "", { reason: "rate_limited", ip_hash: ipHash });
        return NextResponse.json(
            { ok: false, error: "rate_limited" },
            { status: 429, headers: { "retry-after": String(Math.max(burst.retryAfter, hourly.retryAfter)) } }
        );
    }

    // ── validate ────────────────────────────────────────────────────────────
    const v = validateEmail(body.email);
    if (!v.ok) {
        return NextResponse.json({ ok: false, error: "invalid_email" }, { status: 400 });
    }

    // Flag, never reject: transient DNS would otherwise silently drop real
    // signups during exactly the spike this was built for.
    const mxOk = await checkMx(v.domain);

    const str = (k: string) =>
        typeof body[k] === "string" ? (body[k] as string).slice(0, 500) : null;

    const row = {
        email: v.email,
        email_norm: v.norm,
        email_domain: v.domain,
        product: str("product") ?? "magy",
        source: str("source") ?? "footer",
        source_path: str("path"),
        referrer: str("referrer"),
        utm_source: str("utm_source"),
        utm_medium: str("utm_medium"),
        utm_campaign: str("utm_campaign"),
        utm_term: str("utm_term"),
        utm_content: str("utm_content"),
        user_agent: (req.headers.get("user-agent") ?? "").slice(0, 500) || null,
        ip_hash: ipHash,
        consent_text: CONSENT_TEXT,
        is_disposable: v.disposable,
        mx_ok: mxOk,
    };

    // ── persist. THIS is the resilience story ───────────────────────────────
    // Postgres -> fsync'd NDJSON on a host volume -> email-of-last-resort.
    // A signup is lost only if the database is down AND the disk is unwritable,
    // at which point the site is down anyway.
    // Optimistic default. `inserted` only becomes false on a REAL Postgres
    // duplicate — otherwise a first-time signer during a database outage would
    // be told "you're already on the list", which is both wrong and confusing.
    let inserted = true;
    let verifyToken: string | null = null;
    let unsubToken: string | null = null;
    let stored = false;

    if (hasDb && sql) {
        try {
            const [r] = await sql`
                INSERT INTO waitlist_signups ${sql(row)}
                ON CONFLICT (email_norm) DO UPDATE SET
                    signup_count = waitlist_signups.signup_count + 1,
                    updated_at   = now(),
                    -- back-fill only what was NULL: first-touch attribution is
                    -- the useful one, so never overwrite it.
                    utm_source   = COALESCE(waitlist_signups.utm_source,   EXCLUDED.utm_source),
                    utm_medium   = COALESCE(waitlist_signups.utm_medium,   EXCLUDED.utm_medium),
                    utm_campaign = COALESCE(waitlist_signups.utm_campaign, EXCLUDED.utm_campaign),
                    referrer     = COALESCE(waitlist_signups.referrer,     EXCLUDED.referrer)
                RETURNING id, verify_token, unsubscribe_token,
                          confirmation_sent_at, (xmax = 0) AS inserted`;
            stored = true;
            inserted = r.inserted === true;
            verifyToken = r.verify_token;
            unsubToken = r.unsubscribe_token;
            await logEvent(inserted ? "submit" : "duplicate", v.norm, {
                source: row.source,
                ip_hash: ipHash,
                signup_id: r.id,
            });
            // Only mail on a genuine first insert, or if a previous send failed.
            // Otherwise someone mashing Subscribe five times gets five emails
            // and reports us as spam.
            if (!inserted && r.confirmation_sent_at) {
                verifyToken = null;
            }
        } catch (err) {
            console.error("[waitlist] db write failed", err);
        }
    }

    if (!stored) {
        const written = await appendFallback(
            JSON.stringify({ ...row, at: new Date().toISOString() }) + "\n"
        );
        if (written) {
            stored = true;
            console.warn(`[waitlist] stored via NDJSON fallback -> ${written}`);
        } else {
            console.error("[waitlist] every fallback directory was unwritable");
        }
    }

    if (!stored) {
        try {
            await sendSignupFallback(row);
            stored = true;
            console.warn("[waitlist] stored via email-of-last-resort");
        } catch (err) {
            console.error("[waitlist] ALL persistence failed", err);
            return NextResponse.json({ ok: false, error: "server" }, { status: 500 });
        }
    }

    // ── respond NOW; mail afterwards, failure-tolerant ──────────────────────
    // Fire-and-forget is safe here in a way it never was on serverless: this is
    // a long-lived Node process, so the promise actually runs to completion.
    if (verifyToken && unsubToken) {
        const base = process.env.SITE_URL ?? "https://www.1martianway.com";
        const verifyUrl = `${base}/api/waitlist/verify?t=${verifyToken}`;
        const unsubUrl = `${base}/api/waitlist/unsubscribe?t=${unsubToken}`;
        // The gate runs inside the fire-and-forget path, after the response has
        // gone out, so the daily-cap query costs the visitor nothing.
        void (async () => {
            const withheld = await suppressReason({ mxOk, disposable: v.disposable });
            if (withheld) {
                // Logged rather than silent: a suppressed confirmation is
                // indistinguishable from a delivery failure by looking at the
                // signup row, and the previous breaker dropped mail with no
                // record at all.
                console.warn(`[waitlist] confirmation withheld (${withheld})`);
                await logEvent("email_suppressed", v.norm, { reason: withheld });
                return;
            }
            try {
                await sendConfirmation(v.email, verifyUrl, unsubUrl);
                if (sql) {
                    await sql`UPDATE waitlist_signups SET confirmation_sent_at = now(),
                              confirmation_error = NULL WHERE email_norm = ${v.norm}`;
                }
                await logEvent("email_sent", v.norm, {});
            } catch (err) {
                const msg = String((err as Error)?.message ?? err).slice(0, 300);
                console.error("[waitlist] confirmation send failed", msg);
                if (sql) {
                    await sql`UPDATE waitlist_signups SET confirmation_error = ${msg}
                              WHERE email_norm = ${v.norm}`.catch(() => {});
                }
                await logEvent("email_failed", v.norm, { error: msg });
            }
        })();
    }

    return ok({ status: inserted ? "subscribed" : "already_subscribed" });
}
