#!/usr/bin/env bash
#
# Single-command deploy for 1martianway.com.
#
# Mirrors the proven pattern from ~/repos/idrl/scripts/manual-deploy.sh:
# git pull -> docker build -> container swap -> health check -> tag.
#
# GitHub Actions is NOT wired for this repo (0 runners, 0 workflow runs as of
# 2026-08-12), so this script is the canonical deploy path, not a workaround.
#
# Usage (from the local dev machine):
#   bash scripts/deploy.sh                 # deploy master + register STAGING vhost
#   REF=my-branch bash scripts/deploy.sh   # deploy any branch/tag to staging
#   HOSTS=prod bash scripts/deploy.sh      # deploy + register PRODUCTION vhosts
#   HOSTS=none bash scripts/deploy.sh      # deploy only, touch no vhost
#
# Staging can run a branch on purpose: it is how a change gets looked at on real
# TLS before master moves. Production should only ever be deployed from master.
#
# On vhost registration timing: kamal-proxy's `default` service catches `*` ->
# localhost:3000 (the IDRL site) with TLS disabled, so the production vhost must
# exist before DNS points here or visitors get IDRL over a broken TLS handshake.
# But registering it long before DNS means repeated ACME failures, and Let's
# Encrypt caps failed validations at 5/hour/hostname. So register production
# vhosts ~1-2 minutes ahead of the DNS flip, not days ahead.
#
# Requires: SSH alias `idrl`, passwordless sudo for docker on the remote.

set -euo pipefail

HOST="${DEPLOY_HOST:-idrl}"
HOSTS="${HOSTS:-staging}"
REF="${REF:-master}"

if [ "$HOSTS" = "prod" ] && [ "$REF" != "master" ]; then
  echo "Refusing to deploy a non-master ref to production (REF=$REF)." >&2
  exit 2
fi

echo "==> Deploying 1mwapp to ${HOST} (ref: ${REF}, vhost mode: ${HOSTS})..."

ssh "$HOST" bash -s -- "$HOSTS" "$REF" <<'REMOTE'
set -euo pipefail
export PATH="$HOME/.bun/bin:$HOME/.local/bin:/usr/local/bin:/usr/bin:$PATH"

VHOST_MODE="$1"
REF="$2"
PORT=3004
NAME=1mwapp

cd ~/repos/1mwapp

git fetch origin --tags --prune
if [ "$REF" = "master" ]; then
  git checkout master && git pull --ff-only origin master
else
  # detached HEAD on the exact commit, so a staging deploy can never
  # accidentally advance a local branch on the box
  git checkout --detach "origin/$REF" 2>/dev/null || git checkout --detach "$REF"
fi
echo "Deploying ref: $REF"

LATEST_TAG=$(git describe --tags --abbrev=0 2>/dev/null || echo "v0.0.0")
MAJOR=$(echo "$LATEST_TAG" | sed 's/v//' | cut -d. -f1)
MINOR=$(echo "$LATEST_TAG" | sed 's/v//' | cut -d. -f2)
PATCH=$(echo "$LATEST_TAG" | sed 's/v//' | cut -d. -f3)
NEW_VERSION="v${MAJOR}.${MINOR}.$((PATCH + 1))"
BUILD_DATE=$(TZ='Asia/Kolkata' date '+%Y-%m-%d %H:%M:%S IST')
BUILD_SHA=$(git rev-parse --short HEAD)

echo "Version: $NEW_VERSION ($BUILD_SHA) built $BUILD_DATE"

LOGPATH=$(sudo docker inspect --format='{{.LogPath}}' "$NAME" 2>/dev/null) \
  && sudo truncate -s 0 "$LOGPATH" 2>/dev/null || true

# Postgres shares this disk. If root fills, Postgres stops accepting writes and
# takes magy, agentbooks and the waitlist down together — so prune before build.
USED=$(df / | awk 'NR==2 {gsub(/%/,""); print $5}')
echo "Root disk used: ${USED}%"
if [ "$USED" -gt 85 ]; then
  echo "Disk above 85%, pruning Docker before build..."
  sudo docker image prune -a -f || true
  sudo docker builder prune --all --reserved-space 5368709120 -f || true
  df -h /
fi

# Checked BEFORE the build, not after: a missing env file used to be discovered
# only once the image had already been built, wasting the whole build.
# --network host matches every other app on this box (and is why kamal targets
# are all localhost:PORT). --memory caps blast radius if the app leaks.
# Secrets live in a 0600 file on the host, never in the image and never in git.
# DATABASE_URL points at 127.0.0.1:5432 — the container is --network host, so
# Postgres is reachable on loopback with no Docker networking at all.
ENV_FILE=/home/ubuntu/.config/1mwapp/env
if [ ! -f "$ENV_FILE" ]; then
  echo "!! $ENV_FILE missing — the waitlist would fall back to disk on every signup." >&2
  exit 1
fi

# Refuse to deploy without the secrets that have committed dev fallbacks.
#
# IP_HASH_PEPPER and FORM_HMAC_SECRET both fall back to constants that are IN
# THE REPO. Unset, they don't break anything visibly — they just quietly make
# the controls fake: a public pepper makes sha256(ip) reversible by rainbow
# table (the IPv4 space is 4 billion hashes), and a public form secret lets
# anyone mint valid anti-bot tokens. That is a failure you cannot see by
# looking at the site, so it gets caught here instead.
#
# Checked before the old container is stopped, so a miss is a refused deploy
# rather than an outage.
for required in IP_HASH_PEPPER FORM_HMAC_SECRET; do
  if ! grep -qE "^${required}=.+" "$ENV_FILE"; then
    echo "!! $required missing from $ENV_FILE — refusing to deploy." >&2
    echo "   Generate one with: openssl rand -hex 32" >&2
    exit 1
  fi
done

# The Umami site id is a BUILD input, unlike every other value in the env file.
# NEXT_PUBLIC_* is inlined into the client bundle by `next build`, so passing it
# only via --env-file would leave the tracker permanently unrendered — which is
# exactly the shape of bug where analytics silently reports nothing.
# UMAMI_HOST is a build input too, for a different reason: rewrites() runs
# during `next build` and is frozen into .next/routes-manifest.json, which
# `next start` only reads. Passing it at run time alone yields an empty rewrite
# table and a 404 on /js/mw.js while the env looks perfectly correct.
UMAMI_ID=$(sed -n 's/^NEXT_PUBLIC_UMAMI_ID=//p' "$ENV_FILE" | tail -1)
UMAMI_HOST=$(sed -n 's/^UMAMI_HOST=//p' "$ENV_FILE" | tail -1)
if [ -z "$UMAMI_ID" ] || [ -z "$UMAMI_HOST" ]; then
  echo "note: UMAMI_HOST/NEXT_PUBLIC_UMAMI_ID unset in $ENV_FILE — building without analytics."
fi

sudo docker build \
  --provenance=false \
  --build-arg NEXT_PUBLIC_APP_VERSION="$NEW_VERSION" \
  --build-arg NEXT_PUBLIC_BUILD_DATE="$BUILD_DATE" \
  --build-arg NEXT_PUBLIC_BUILD_SHA="$BUILD_SHA" \
  --build-arg NEXT_PUBLIC_UMAMI_ID="$UMAMI_ID" \
  --build-arg UMAMI_HOST="$UMAMI_HOST" \
  -t "${NAME}:latest" .

sudo docker stop "$NAME" 2>/dev/null || true
sudo docker rm "$NAME" 2>/dev/null || true

# /data is a HOST volume: the NDJSON signup fallback must survive a deploy, and
# anything written inside the image is destroyed when the container is replaced.
mkdir -p /home/ubuntu/data/1mwapp

sudo docker run -d --name "$NAME" --network host --restart always --init \
  --memory=2g \
  --env-file "$ENV_FILE" \
  -e NODE_ENV=production -e PORT=$PORT -e HOSTNAME=0.0.0.0 -e TZ=Asia/Kolkata \
  -e SITE_URL=https://www.1martianway.com \
  -e WAITLIST_FALLBACK_DIR=/data \
  -e TRUST_PROXY_HEADERS=1 \
  -e NEXT_PUBLIC_APP_VERSION="$NEW_VERSION" \
  -e NEXT_PUBLIC_BUILD_SHA="$BUILD_SHA" \
  -e NEXT_PUBLIC_UMAMI_ID="$UMAMI_ID" \
  -v /home/ubuntu/data/1mwapp:/data \
  "${NAME}:latest"

echo "Waiting 15s for container startup..."
sleep 15

HEALTHY=false
for i in 1 2 3 4; do
  STATUS=$(curl -s -o /dev/null -w "%{http_code}" --max-time 10 "http://localhost:${PORT}/up" || echo "000")
  echo "Health check $i/4: HTTP $STATUS"
  if [ "$STATUS" = "200" ]; then HEALTHY=true; break; fi
  sleep 5
done

if [ "$HEALTHY" != "true" ]; then
  echo "!! Health check FAILED. Container logs:"
  sudo docker logs --tail 60 "$NAME" || true
  exit 1
fi

case "$VHOST_MODE" in
  staging)
    echo "Registering STAGING vhost 1mw.karmasteels.com -> localhost:${PORT}"
    sudo docker exec kamal-proxy kamal-proxy deploy 1mwapp-stage \
      --target "localhost:${PORT}" --host 1mw.karmasteels.com \
      --tls --health-check-path /up --deploy-timeout 120s
    ;;
  prod)
    echo "Registering PRODUCTION vhosts -> localhost:${PORT}"
    # Two services, both --tls: the apex needs its own cert so the app-level
    # apex->www 308 can be served over HTTPS. HSTS (max-age=63072000, inherited
    # from Vercel) means a missing apex cert is a hard TLS error, not a warning.
    sudo docker exec kamal-proxy kamal-proxy deploy 1mw-www \
      --target "localhost:${PORT}" --host www.1martianway.com \
      --tls --health-check-path /up --deploy-timeout 120s
    sudo docker exec kamal-proxy kamal-proxy deploy 1mw-apex \
      --target "localhost:${PORT}" --host 1martianway.com \
      --tls --health-check-path /up --deploy-timeout 120s
    ;;
  none) echo "Skipping vhost registration." ;;
  *) echo "Unknown vhost mode: $VHOST_MODE" >&2; exit 2 ;;
esac

if [ "$REF" = "master" ]; then
  git tag -a "$NEW_VERSION" -m "Deploy $NEW_VERSION ($BUILD_SHA)" 2>/dev/null || true
  git push origin "$NEW_VERSION" 2>/dev/null || true
fi

echo "==> Deployed $NEW_VERSION ($BUILD_SHA) on port ${PORT}"
sudo docker exec kamal-proxy kamal-proxy list || true
REMOTE
