# 1martianway.com production image.
#
# Runs `next start` with full node_modules rather than `output: "standalone"`.
# Standalone's file tracing has sharp-related edge cases that are not worth
# discovering on a Next.js *beta* during launch week; the extra image size is
# free on a box with 84 GB spare. Revisit post-launch.
#
# Native arm64 — build on the target box (or an arm64 runner). An emulated
# amd64 -> arm64 Next build is 10-20x slower and will time out.

FROM node:22-bookworm-slim AS deps
WORKDIR /app
RUN corepack enable
# .yarnrc.yml MUST be copied before install: it sets `nodeLinker: node-modules`,
# and without it Yarn 4 falls back to PnP and the build fails confusingly.
COPY package.json yarn.lock .yarnrc.yml ./
RUN yarn install --immutable

FROM node:22-bookworm-slim AS builder
WORKDIR /app
RUN corepack enable
COPY --from=deps /app/node_modules ./node_modules
COPY . .
ARG NEXT_PUBLIC_APP_VERSION=dev
ARG NEXT_PUBLIC_BUILD_DATE=unknown
ARG NEXT_PUBLIC_BUILD_SHA=dev
ENV NEXT_PUBLIC_APP_VERSION=$NEXT_PUBLIC_APP_VERSION \
    NEXT_PUBLIC_BUILD_DATE=$NEXT_PUBLIC_BUILD_DATE \
    NEXT_PUBLIC_BUILD_SHA=$NEXT_PUBLIC_BUILD_SHA \
    NEXT_TELEMETRY_DISABLED=1
RUN yarn build

FROM node:22-bookworm-slim
WORKDIR /app
RUN corepack enable \
    && apt-get update \
    && apt-get install -y --no-install-recommends curl \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /app ./
# HOSTNAME=0.0.0.0 is required or kamal-proxy cannot reach the container.
ENV NODE_ENV=production \
    PORT=3004 \
    HOSTNAME=0.0.0.0 \
    NEXT_TELEMETRY_DISABLED=1
EXPOSE 3004
CMD ["yarn", "start"]
