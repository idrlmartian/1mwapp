import { NextResponse } from "next/server";
import { issueFormToken } from "@/app/lib/waitlist";

// Issues the signed render timestamp the form submits back.
//
// It is a separate endpoint rather than embedded in the page HTML so that the
// pages themselves stay statically prerendered — baking a timestamp into static
// HTML would make every visitor share one issue-time, and the freshness check
// would be meaningless.
export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
    return NextResponse.json(
        { t: issueFormToken() },
        { headers: { "cache-control": "no-store" } }
    );
}
