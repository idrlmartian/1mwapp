#!/usr/bin/env node
//
// Drains the NDJSON fallback file into Postgres.
//
// The waitlist endpoint writes here when Postgres is unreachable, so a signup
// is never lost to a database blip. This script is how those rows get home
// once the database is back. It is idempotent: rows already present are folded
// in by the same ON CONFLICT rule the live endpoint uses, and the file is
// rotated (not deleted) so there is always a copy on disk.
//
// Usage, on the box:
//   set -a; . /home/ubuntu/.config/1mwapp/env; set +a
//   node scripts/replay-fallback.mjs [path-to-ndjson]

import { readFile, rename, access } from "node:fs/promises";
import postgres from "postgres";

const FILE = process.argv[2] ?? "/data/waitlist-fallback.ndjson";
const url = process.env.DATABASE_URL;

if (!url) {
    console.error("DATABASE_URL is not set");
    process.exit(1);
}

try {
    await access(FILE);
} catch {
    console.log(`No fallback file at ${FILE} — nothing to replay.`);
    process.exit(0);
}

const sql = postgres(url, { max: 4 });
const lines = (await readFile(FILE, "utf8")).split("\n").filter((l) => l.trim());

let ok = 0;
let failed = 0;

for (const line of lines) {
    let row;
    try {
        row = JSON.parse(line);
    } catch {
        failed++;
        continue;
    }
    const { at, ...cols } = row;
    try {
        const [r] = await sql`
            INSERT INTO waitlist_signups ${sql(cols)}
            ON CONFLICT (email_norm) DO UPDATE SET
                signup_count = waitlist_signups.signup_count + 1,
                updated_at   = now()
            RETURNING id, (xmax = 0) AS inserted`;
        await sql`INSERT INTO waitlist_events (kind, email_norm, signup_id, detail)
                  VALUES ('replayed', ${cols.email_norm}, ${r.id},
                          ${sql.json({ captured_at: at ?? null, inserted: r.inserted === true })})`;
        ok++;
    } catch (err) {
        console.error(`  failed: ${cols.email_norm}`, String(err?.message ?? err));
        failed++;
    }
}

// Rotate rather than delete — if anything above went wrong we still want the
// original addresses on disk.
if (ok > 0) {
    const stamp = new Date().toISOString().replace(/[:.]/g, "-");
    await rename(FILE, `${FILE}.replayed-${stamp}`);
}

console.log(`replayed ${ok} row(s), ${failed} failure(s) from ${FILE}`);
await sql.end();
