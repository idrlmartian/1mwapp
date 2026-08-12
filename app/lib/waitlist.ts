import { createHash, timingSafeEqual, createHmac } from "node:crypto";
import { promises as dns } from "node:dns";

/**
 * The consent wording shown next to every signup field.
 *
 * Stored VERBATIM on each row. This string will change; a consent record that
 * points at mutable page copy is not a consent record. India's DPDP Act 2023
 * applies here, and GDPR for EU visitors.
 */
export const CONSENT_TEXT =
    "By joining the waitlist you agree to receive occasional product updates about Magy from 1 Martian Way Industries. We will never sell or share your email. Unsubscribe any time.";

/** Where a signup came from. Drives per-surface conversion reporting. */
export type SignupSource =
    | "home-hero"
    | "home-demo"
    | "home-final"
    | "magy-hero"
    | "magy-demo"
    | "magy-final"
    | "mos"
    | "toowl"
    | "idrl"
    | "about"
    | "footer"
    | "404";

/** A small, deliberately incomplete list of throwaway domains. */
const DISPOSABLE = new Set([
    "mailinator.com", "guerrillamail.com", "10minutemail.com", "tempmail.com",
    "temp-mail.org", "throwawaymail.com", "yopmail.com", "trashmail.com",
    "sharklasers.com", "getnada.com", "maildrop.cc", "dispostable.com",
    "fakeinbox.com", "mailnesia.com", "mytemp.email", "spamgourmet.com",
    "grr.la", "guerrillamailblock.com", "tempr.email", "emailondeck.com",
    "burnermail.io", "mohmal.com", "moakt.com", "tempmailo.com", "1secmail.com",
]);

// Deliberately permissive: the goal is to reject obvious garbage, not to
// adjudicate RFC 5322. Over-strict validation loses real signups.
const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

export type Validation =
    | { ok: true; email: string; norm: string; domain: string; disposable: boolean }
    | { ok: false; reason: "empty" | "too_long" | "malformed" };

export function validateEmail(raw: unknown): Validation {
    if (typeof raw !== "string") return { ok: false, reason: "empty" };
    const email = raw.trim();
    if (!email) return { ok: false, reason: "empty" };
    if (email.length > 254) return { ok: false, reason: "too_long" };
    if (!EMAIL_RE.test(email)) return { ok: false, reason: "malformed" };

    const norm = email.toLowerCase();
    const domain = norm.slice(norm.lastIndexOf("@") + 1);
    return { ok: true, email, norm, domain, disposable: DISPOSABLE.has(domain) };
}

/**
 * MX lookup with a TTL cache.
 *
 * Three-valued on purpose, and the distinction is load-bearing:
 *
 *   true  — the domain has at least one MX record.
 *   false — the domain DEFINITIVELY has no mail exchanger (NXDOMAIN / no data).
 *   null  — the lookup itself failed: timeout, SERVFAIL, resolver unreachable.
 *
 * Callers must NOT hard-reject on any of these; transient DNS trouble would
 * otherwise silently drop real signups during exactly the traffic spike we
 * built this for. But `false` is safe to treat as a suspicion signal and
 * `null` is not, so they cannot be collapsed.
 *
 * The subtlety that makes this necessary: Node's resolveMx THROWS ENOTFOUND
 * or ENODATA for a domain with no mail exchanger — it does not return an
 * empty array. Catching every error as null therefore made `false` unreachable
 * in practice and recorded a bogus domain identically to a DNS blip.
 */
const mxCache = new Map<string, { ok: boolean; at: number }>();
const MX_TTL = 6 * 60 * 60 * 1000;

// Definitive answers from the resolver: the name resolves, there is just no
// mail exchanger behind it. Anything else is treated as transient.
const MX_ABSENT_CODES = new Set(["ENOTFOUND", "ENODATA", "NOTFOUND"]);

export async function checkMx(domain: string): Promise<boolean | null> {
    const hit = mxCache.get(domain);
    if (hit && Date.now() - hit.at < MX_TTL) return hit.ok;

    const remember = (ok: boolean) => {
        if (mxCache.size > 5000) mxCache.clear();
        mxCache.set(domain, { ok, at: Date.now() });
        return ok;
    };

    try {
        const records = await Promise.race([
            dns.resolveMx(domain),
            new Promise<never>((_, rej) => setTimeout(() => rej(new Error("timeout")), 2500)),
        ]);
        return remember(Array.isArray(records) && records.length > 0);
    } catch (err) {
        const code = (err as NodeJS.ErrnoException)?.code;
        if (code && MX_ABSENT_CODES.has(code)) return remember(false);
        return null; // transient — do not cache, do not treat as suspicious
    }
}

/*
  Dev fallbacks for the two secrets below are constants IN THIS REPO, which
  means that unset in production they don't fail — they quietly make the
  control fake. A public pepper makes sha256(ip) reversible by rainbow table;
  a public form secret lets anyone mint valid anti-bot tokens.

  scripts/deploy.sh refuses to deploy without both, which is the real
  enforcement. This is the second layer, for anything that reaches production
  by another route. It warns once per process rather than throwing: a missing
  pepper is a privacy regression, not a reason to drop a signup on the floor.
*/
const warned = new Set<string>();
function devFallback(name: string, fallback: string): string {
    const v = process.env[name];
    if (v) return v;
    if (process.env.NODE_ENV === "production" && !warned.has(name)) {
        warned.add(name);
        console.error(
            `[security] ${name} is unset in production — falling back to the ` +
                "public value committed in the repo. This control is currently ineffective."
        );
    }
    return fallback;
}

/** sha256(ip || pepper). We never store a raw visitor IP. */
export function hashIp(ip: string): string {
    const pepper = devFallback("IP_HASH_PEPPER", "1mw-dev-pepper");
    return createHash("sha256").update(`${ip}${pepper}`).digest("hex").slice(0, 32);
}

/*
  Signed render timestamp.

  The form embeds `<issuedAt>.<hmac>`. On submit we reject anything faster than
  MIN_FILL_MS (a human cannot read the consent line and type an address in under
  two seconds) or older than MAX_FILL_MS (a stale or replayed page). The HMAC is
  what stops a bot from simply inventing a plausible timestamp.
*/
const MIN_FILL_MS = 2000;
const MAX_FILL_MS = 24 * 60 * 60 * 1000;

function formSecret() {
    return devFallback("FORM_HMAC_SECRET", "1mw-dev-form-secret");
}

export function issueFormToken(now = Date.now()): string {
    const ts = String(now);
    const mac = createHmac("sha256", formSecret()).update(ts).digest("hex").slice(0, 24);
    return `${ts}.${mac}`;
}

export function verifyFormToken(token: unknown, now = Date.now()): boolean {
    if (typeof token !== "string" || !token.includes(".")) return false;
    const [ts, mac] = token.split(".");
    const expected = createHmac("sha256", formSecret()).update(ts).digest("hex").slice(0, 24);
    const a = Buffer.from(mac ?? "", "utf8");
    const b = Buffer.from(expected, "utf8");
    if (a.length !== b.length || !timingSafeEqual(a, b)) return false;

    const issued = Number(ts);
    if (!Number.isFinite(issued)) return false;
    const age = now - issued;
    return age >= MIN_FILL_MS && age <= MAX_FILL_MS;
}

/** Only same-site submissions. Not a security boundary — it kills the lazy 90%. */
export function originAllowed(headers: Headers): boolean {
    const raw = headers.get("origin") ?? headers.get("referer");
    if (!raw) return process.env.NODE_ENV !== "production";
    try {
        const host = new URL(raw).hostname;
        return (
            host === "www.1martianway.com" ||
            host === "1martianway.com" ||
            host === "1mw.karmasteels.com" ||
            host === "localhost" ||
            host === "127.0.0.1"
        );
    } catch {
        return false;
    }
}
