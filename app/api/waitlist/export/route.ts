import { timingSafeEqual } from "node:crypto";
import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";

// Token-gated CSV export, so the founder can pull the list from a phone.
// The cheaper path (a psql \copy over SSH) still works and needs no code — this
// exists for convenience, not as the system of record.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function tokenOk(given: string | null) {
    const expected = process.env.WAITLIST_EXPORT_TOKEN;
    if (!expected || !given) return false;
    const a = Buffer.from(given);
    const b = Buffer.from(expected);
    return a.length === b.length && timingSafeEqual(a, b);
}

const csvCell = (v: unknown) => {
    if (v === null || v === undefined) return "";
    const s = String(v);
    // Guard against CSV/formula injection when this opens in Excel or Sheets.
    const safe = /^[=+\-@\t\r]/.test(s) ? `'${s}` : s;
    return /[",\n]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe;
};

export async function GET(req: Request) {
    const url = new URL(req.url);
    if (!tokenOk(url.searchParams.get("token"))) {
        return NextResponse.json({ ok: false }, { status: 401 });
    }
    if (!sql) return NextResponse.json({ ok: false, error: "no_db" }, { status: 503 });

    const rows = await sql`
        SELECT email, product, source, utm_source, utm_campaign,
               (verified_at IS NOT NULL) AS verified,
               is_disposable, signup_count, created_at
          FROM waitlist_signups
         WHERE unsubscribed_at IS NULL
      ORDER BY created_at`;

    const cols = [
        "email", "product", "source", "utm_source", "utm_campaign",
        "verified", "is_disposable", "signup_count", "created_at",
    ];
    const body = [
        cols.join(","),
        ...rows.map((r) => cols.map((c) => csvCell((r as Record<string, unknown>)[c])).join(",")),
    ].join("\n");

    return new NextResponse(body, {
        headers: {
            "content-type": "text/csv; charset=utf-8",
            "content-disposition": `attachment; filename="waitlist-${new Date().toISOString().slice(0, 10)}.csv"`,
            "cache-control": "no-store",
            "x-robots-tag": "noindex, nofollow",
        },
    });
}
