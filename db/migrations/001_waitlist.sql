-- Launch waitlist capture for Magy (and future 1MW products).
--
-- Lives in its own `onemw` database rather than inside `magy`. Magy's migrator
-- runs sqlx::migrate! and warns on checksum mismatch for every applied
-- migration on every boot; a table created there by a different application is
-- invisible to that tracking, i.e. permanent schema drift with no owner. A
-- separate database also isolates launch-day write bursts from the agent
-- runtime's hot tables and makes pg_dump/restore granular.
--
-- TWO TABLES ON PURPOSE:
--   waitlist_signups — the deduplicated LIST. One row per human. This is what
--                      you export and mail.
--   waitlist_events  — the append-only LOG. One row per HTTP submission,
--                      including duplicates, rejections and mail failures.
--
-- The log is what makes "we never lost a signup" auditable rather than hopeful:
-- if a list row is missing, the event row says why.
--
-- No raw IPs are stored anywhere. ip_hash is sha256(ip || pepper), so
-- rate-limiting and abuse forensics still work but a database leak is not a
-- leak of visitor IP addresses.

CREATE EXTENSION IF NOT EXISTS pgcrypto;

CREATE TABLE IF NOT EXISTS waitlist_signups (
    id                   BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    email                TEXT        NOT NULL,          -- as typed, for display
    email_norm           TEXT        NOT NULL,          -- lower(trim(email)); the dedupe key
    email_domain         TEXT        NOT NULL,
    product              TEXT        NOT NULL DEFAULT 'magy',
    source               TEXT        NOT NULL DEFAULT 'footer',
    source_path          TEXT,
    referrer             TEXT,
    utm_source           TEXT,
    utm_medium           TEXT,
    utm_campaign         TEXT,
    utm_term             TEXT,
    utm_content          TEXT,
    user_agent           TEXT,
    ip_hash              TEXT,
    -- Consent copy is stored VERBATIM, not by reference: the wording on the page
    -- will change, and a consent record that points at mutable copy is not a
    -- consent record.
    consent_text         TEXT        NOT NULL,
    consent_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    verified_at          TIMESTAMPTZ,
    verify_token         TEXT UNIQUE DEFAULT encode(gen_random_bytes(16), 'hex'),
    unsubscribed_at      TIMESTAMPTZ,
    unsubscribe_token    TEXT        NOT NULL UNIQUE
                                     DEFAULT encode(gen_random_bytes(16), 'hex'),
    confirmation_sent_at TIMESTAMPTZ,
    confirmation_error   TEXT,
    is_disposable        BOOLEAN     NOT NULL DEFAULT false,
    mx_ok                BOOLEAN,
    signup_count         INT         NOT NULL DEFAULT 1,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS waitlist_signups_email_norm_uniq
    ON waitlist_signups (email_norm);
CREATE INDEX IF NOT EXISTS waitlist_signups_created_idx
    ON waitlist_signups (created_at DESC);
CREATE INDEX IF NOT EXISTS waitlist_signups_product_idx
    ON waitlist_signups (product, created_at DESC);
-- Partial: the confirmation-retry sweep only ever scans un-mailed rows.
CREATE INDEX IF NOT EXISTS waitlist_signups_unmailed_idx
    ON waitlist_signups (created_at)
    WHERE confirmation_sent_at IS NULL;

CREATE TABLE IF NOT EXISTS waitlist_events (
    id         BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    signup_id  BIGINT REFERENCES waitlist_signups(id) ON DELETE SET NULL,
    email_norm TEXT        NOT NULL,
    -- submit | duplicate | verify | unsubscribe | email_sent | email_failed
    -- | rejected | replayed | contact
    kind       TEXT        NOT NULL,
    detail     JSONB       NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS waitlist_events_email_idx
    ON waitlist_events (email_norm, created_at DESC);
CREATE INDEX IF NOT EXISTS waitlist_events_kind_idx
    ON waitlist_events (kind, created_at DESC);
-- Backs the DB-side rate limit, which survives container restarts in a way the
-- in-process token bucket cannot.
CREATE INDEX IF NOT EXISTS waitlist_events_iphash_idx
    ON waitlist_events ((detail ->> 'ip_hash'), created_at DESC);
