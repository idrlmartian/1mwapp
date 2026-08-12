import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";

// GET for the link in the email body; POST for Gmail/Yahoo one-click
// (List-Unsubscribe-Post: List-Unsubscribe=One-Click), which they now expect
// from bulk senders and which measurably reduces spam complaints.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

async function unsubscribe(token: string | null) {
    if (!token || !sql) return false;
    try {
        const rows = await sql`
            UPDATE waitlist_signups
               SET unsubscribed_at = COALESCE(unsubscribed_at, now())
             WHERE unsubscribe_token = ${token}
         RETURNING id, email_norm`;
        if (!rows.length) return false;
        await sql`INSERT INTO waitlist_events (kind, email_norm, signup_id, detail)
                  VALUES ('unsubscribe', ${rows[0].email_norm}, ${rows[0].id}, '{}'::jsonb)`
            .catch(() => {});
        return true;
    } catch {
        return false;
    }
}

export async function GET(req: Request) {
    const base = process.env.SITE_URL ?? "https://www.1martianway.com";
    const done = await unsubscribe(new URL(req.url).searchParams.get("t"));
    return NextResponse.redirect(`${base}/?unsub=${done ? "ok" : "invalid"}`);
}

export async function POST(req: Request) {
    const done = await unsubscribe(new URL(req.url).searchParams.get("t"));
    return NextResponse.json({ ok: done }, { status: done ? 200 : 400 });
}
