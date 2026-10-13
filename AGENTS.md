# the-cy-studio

Shared contract for every agent working in this repo (Claude Code, Antigravity/agy, Gemini CLI). Design language and DB rules live in `CLAUDE.md`.

## Stack

- Nuxt 4 on Cloudflare Workers (`nitro.preset: 'cloudflare_module'`, `wrangler.toml`), Tailwind via `@nuxtjs/tailwindcss`, Supabase.
- Vercel is retired. Do not add `vercel.json` or Vercel-specific config.
- Marketing site: standard Nuxt layout (`app/components`, `app/composables`, `app/pages`, `server/`). No DDD/hexagonal tree; that lives in `cy-platform`.

## UI

- Follow the design language in `CLAUDE.md` (tokens, control heights, `solid`/`soft` semantics, ES + EN copy via `app/data/i18n.ts`).
- Read `CLAUDE.md` before building or auditing UI.

## Commands

- Lint / test: none configured.

## Agents and branches

- Claude Code implements and reviews. Gemini (via `agy`) plans and generates in bulk.
- `main` is updated through PRs; Claude merges its own once checks pass. Stage explicit paths, never `git add .`.
- Authorship goes in a `Co-Authored-By:` trailer.
