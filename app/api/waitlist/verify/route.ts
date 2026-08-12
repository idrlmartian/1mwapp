import { NextResponse } from "next/server";
import { sql } from "@/app/lib/db";

// Soft double opt-in: everyone is captured on submit, but only rows with
// verified_at set receive later bulk sends. That protects the reputation of the
// domain the founder's real business email depends on, without paying the
// 20-40% list loss that hard double opt-in costs during a launch spike.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: Request) {
    const token = new URL(req.url).searchParams.get("t");
    const base = process.env.SITE_URL ?? "https://www.1martianway.com";

    if (!token || !sql) return NextResponse.redirect(`${base}/?confirm=invalid`);

    try {
        const rows = await sql`
            UPDATE waitlist_signups
               SET verified_at = COALESCE(verified_at, now())
             WHERE verify_token = ${token}
         RETURNING id, email_norm`;
        if (!rows.length) return NextResponse.redirect(`${base}/?confirm=invalid`);

        await sql`INSERT INTO waitlist_events (kind, email_norm, signup_id, detail)
                  VALUES ('verify', ${rows[0].email_norm}, ${rows[0].id}, '{}'::jsonb)`
            .catch(() => {});

        return NextResponse.redirect(`${base}/?confirm=ok`);
    } catch {
        return NextResponse.redirect(`${base}/?confirm=error`);
    }
}
