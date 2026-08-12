/*
  In-process token bucket.

  Now that the site is a long-lived Node process rather than a serverless
  function, in-memory state actually persists between requests — this was not
  possible on Vercel. It is the cheap first layer: it rejects without any I/O.
  The durable second layer is a COUNT over waitlist_events, which survives a
  container restart (see app/api/waitlist/route.ts).
*/

type Bucket = { tokens: number; last: number };
const buckets = new Map<string, Bucket>();

// Bounded so a flood of unique IPs cannot grow the map without limit.
const MAX_KEYS = 20_000;

export function rateLimit(
    key: string,
    { capacity, refillPerSec }: { capacity: number; refillPerSec: number }
): { ok: boolean; retryAfter: number } {
    const now = Date.now();
    let b = buckets.get(key);

    if (!b) {
        if (buckets.size >= MAX_KEYS) {
            // Drop the oldest third rather than clearing everything, so an
            // attacker cannot reset every honest visitor's bucket on demand.
            const cutoff = now - 60_000;
            for (const [k, v] of buckets) if (v.last < cutoff) buckets.delete(k);
            if (buckets.size >= MAX_KEYS) buckets.clear();
        }
        b = { tokens: capacity, last: now };
        buckets.set(key, b);
    }

    const elapsed = (now - b.last) / 1000;
    b.tokens = Math.min(capacity, b.tokens + elapsed * refillPerSec);
    b.last = now;

    if (b.tokens < 1) {
        return { ok: false, retryAfter: Math.ceil((1 - b.tokens) / refillPerSec) };
    }
    b.tokens -= 1;
    return { ok: true, retryAfter: 0 };
}

/**
 * Client IP behind kamal-proxy, and behind Cloudflare once it is in front.
 *
 * kamal-proxy APPENDS the real peer to X-Forwarded-For, so the LEFTMOST entry is
 * attacker-controlled and the RIGHTMOST is the one to trust. IDRL shipped this
 * backwards and ended up blocking 127.0.0.1 in production
 * (idrl/docs/security/HARDENING_2026-05-31.md, finding F1).
 */
export function clientIp(headers: Headers): string {
    const cf = headers.get("cf-connecting-ip");
    if (cf) return cf.trim();

    const xff = headers.get("x-forwarded-for");
    if (xff) {
        const parts = xff.split(",").map((s) => s.trim()).filter(Boolean);
        if (parts.length) return parts[parts.length - 1];
    }
    return headers.get("x-real-ip")?.trim() || "unknown";
}
