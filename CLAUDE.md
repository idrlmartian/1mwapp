@AGENTS.md

## Working in this repo

- No `bun t` / no test suite in this repo — typecheck via `bunx tsc --noEmit` directly.
- Deploys are manual only: `scripts/deploy.sh` (defaults to staging; `HOSTS=prod` for prod). No CI/CD auto-deploy in this repo.
- **Corrected 2026-09-01: the live `1martianway.com`/`www.1martianway.com` are served by the `idrl` box via `kamal-proxy`** (`1mw-apex`/`1mw-www` vhosts → `localhost:3004`), deployed from *this* repo by `scripts/deploy.sh HOSTS=prod`. The previous note here — that a Vercel project on a different GitHub repo (`karanmartian/1mwapp`) served those domains and this repo's `origin` push didn't touch them — was stale by the time it was checked; whatever Vercel project exists is not what DNS points at. Confirmed by running a prod deploy and observing `kamal-proxy list` show both hosts routed to this app's container.
- This repo only serves the Magy *marketing* page, at the path `www.1martianway.com/magy`. The product itself is a separate live app in a different codebase — don't assume it doesn't exist just because this repo has no reference to it. Ask for the host rather than guessing: **this repo is PUBLIC and Google-indexed**, so naming an unlisted internal hostname here publishes it. That is not hypothetical — a disclosure audit on 2026-08-26 found this line was the single public pointer to that host anywhere on the internet, while the host itself had zero search results and zero Wayback snapshots.
- Brand/visual assets (logo, icons, OG image, backdrops) are code-generated via `scripts/*.mjs` (sharp + SVG) — see `scripts/generate-brand-assets.mjs`. Don't hand-edit the PNGs/ICO.
