import postgres from "postgres";

/*
  postgres.js rather than `pg` or Drizzle:
   - no native bindings, so it bundles cleanly under Turbopack with no
     serverExternalPackages fiddling;
   - tagged-template queries are parameterised BY CONSTRUCTION, so SQL injection
     is not reachable through ordinary use. That matters more than usual here,
     because /api/waitlist is a public, unauthenticated write endpoint.
   - Drizzle would add a schema DSL, a codegen step and a migration runner for
     two tables. Cost without benefit this week.

  max: 10 is deliberate. This Postgres instance also serves magy, magyverse and
  agentbooks; an unbounded website pool is a good way to exhaust max_connections
  for everyone else on the box.
*/

const g = globalThis as unknown as { __sql?: ReturnType<typeof postgres> };

function create() {
    const url = process.env.DATABASE_URL;
    if (!url) return null;
    return postgres(url, {
        max: 10,
        idle_timeout: 30,
        connect_timeout: 5,
        onnotice: () => {},
    });
}

// Null when DATABASE_URL is unset — callers MUST handle that rather than throw,
// so a missing env var degrades to the file fallback instead of losing signups.
export const sql = g.__sql ?? create();

// Guard against Turbopack HMR leaking a fresh pool on every dev reload.
if (process.env.NODE_ENV !== "production" && sql) g.__sql = sql;

export const hasDb = Boolean(sql);
