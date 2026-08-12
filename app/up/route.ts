import { NextResponse } from "next/server";

// Health check target for kamal-proxy (--health-check-path /up).
//
// Deliberately does NOT touch the database. kamal-proxy pulls the container out
// of rotation when this fails, so a transient Postgres blip must not take the
// marketing site offline — the pages are static and serve fine without it.
// Database liveness gets its own probe once the waitlist lands.
export const dynamic = "force-dynamic";

export function GET() {
    return NextResponse.json(
        {
            status: "ok",
            sha: process.env.NEXT_PUBLIC_BUILD_SHA ?? "dev",
            version: process.env.NEXT_PUBLIC_APP_VERSION ?? "dev",
        },
        { headers: { "cache-control": "no-store" } }
    );
}
