@AGENTS.md

## Working in this repo

- No `bun t` / no test suite in this repo — typecheck via `bunx tsc --noEmit` directly.
- Deploys are manual only: `scripts/deploy.sh` (defaults to staging; `HOSTS=prod` for prod). No CI/CD auto-deploy in this repo.
- The live `1martianway.com`/`www.1martianway.com` are served by a Vercel project wired to a *different* GitHub repo (`karanmartian/1mwapp`) — pushing this repo's `origin` (`idrlmartian/1mwapp`) does not touch it.
- This repo only serves the Magy *marketing* page, at the path `www.1martianway.com/magy`. The product itself is a separate live app in a different codebase — don't assume it doesn't exist just because this repo has no reference to it. Ask for the host rather than guessing: **this repo is PUBLIC and Google-indexed**, so naming an unlisted internal hostname here publishes it. That is not hypothetical — a disclosure audit on 2026-08-26 found this line was the single public pointer to that host anywhere on the internet, while the host itself had zero search results and zero Wayback snapshots.
- Brand/visual assets (logo, icons, OG image, backdrops) are code-generated via `scripts/*.mjs` (sharp + SVG) — see `scripts/generate-brand-assets.mjs`. Don't hand-edit the PNGs/ICO.
