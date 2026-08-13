# 1martianway.com production image.
#
# Runs `next start` with full node_modules rather than `output: "standalone"`.
# Standalone's file tracing has sharp-related edge cases that are not worth
# discovering during launch week; the extra image size is free on a box with
# 84 GB spare. Revisit post-launch.
#
# Native arm64 — build on the target box (or an arm64 runner). An emulated
# amd64 -> arm64 Next build is 10-20x slower and will time out.
#
# ── PACKAGE MANAGER ────────────────────────────────────────────────────────
# bun installs; NODE runs. Yarn is gone entirely — yarn.lock and .yarnrc.yml
# are deleted and bun.lock is the only lockfile.
#
# The split is deliberate rather than half-done. Installing with bun is what
# removes yarn and it is the fast part. Keeping node for `next build` and
# `next start` changes NOTHING about the runtime that is already proven in
# production — and scripts/deploy.sh stops and removes the old container
# BEFORE its health check, so a runtime that fails to boot is a staging
# outage, not a failed build. That is not a risk worth taking to save a base
# image. Moving the runtime to bun is a separate change that wants its own
# verification.

FROM oven/bun:1-debian AS deps
WORKDIR /app
# bun.lock is the lockfile of record. --frozen-lockfile is the equivalent of
# yarn's --immutable: it fails rather than silently resolving a drifted tree,
# which is exactly how the yarn.lock/bun.lock mismatch was caught.
COPY package.json bun.lock ./
RUN bun install --frozen-lockfile

FROM node:22-bookworm-slim AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_APP_VERSION=dev
ARG NEXT_PUBLIC_BUILD_DATE=unknown
ARG NEXT_PUBLIC_BUILD_SHA=dev
# Analytics. NEXT_PUBLIC_* is inlined into the client bundle at BUILD time, so
# this cannot come from --env-file at run time the way UMAMI_HOST does: the
# <Script> tag in layout.tsx is gated on it and would never render.
# Empty default = no tracker, which is the correct behaviour for any build
# that has not been given an id.
ARG NEXT_PUBLIC_UMAMI_ID=
# UMAMI_HOST is needed at BUILD time even though it is not a NEXT_PUBLIC_ var:
# next.config.js's rewrites() is evaluated by `next build` and frozen into
# .next/routes-manifest.json. `next start` reads that manifest and never calls
# rewrites() again, so supplying this only at run time produces an empty
# rewrite table and /js/mw.js 404s while every env var looks correctly set.
ARG UMAMI_HOST=
ENV NEXT_PUBLIC_APP_VERSION=$NEXT_PUBLIC_APP_VERSION \
    NEXT_PUBLIC_BUILD_DATE=$NEXT_PUBLIC_BUILD_DATE \
    NEXT_PUBLIC_BUILD_SHA=$NEXT_PUBLIC_BUILD_SHA \
    NEXT_PUBLIC_UMAMI_ID=$NEXT_PUBLIC_UMAMI_ID \
    UMAMI_HOST=$UMAMI_HOST \
    NEXT_TELEMETRY_DISABLED=1
# The binary directly, not a package script — there is no package manager in
# this stage to run one.
RUN ./node_modules/.bin/next build

FROM node:22-bookworm-slim
WORKDIR /app
RUN apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app ./
# HOSTNAME=0.0.0.0 is required or kamal-proxy cannot reach the container.
ENV NODE_ENV=production \
    PORT=3004 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1
EXPOSE 3004
CMD ["./node_modules/.bin/next", "start"]
