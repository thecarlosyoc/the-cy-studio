# the-cy-studio

Shared contract for every agent working in this repo (Claude Code, Antigravity/agy, Gemini CLI). Design language and DB rules live in `CLAUDE.md`.

## Stack

- Nuxt 4 on Cloudflare Workers (`nitro.preset: 'cloudflare_module'`, `wrangler.toml`), Tailwind via `@nuxtjs/tailwindcss`, Supabase.
- Vercel is retired. Do not add `vercel.json` or Vercel-specific config.
- Marketing site: standard Nuxt layout (`app/components`, `app/composables`, `app/pages`, `server/`). No DDD/hexagonal tree; that lives in `cy-platform`.

## UI

- Follow the design language in `CLAUDE.md` (tokens, control heights, `solid`/`soft` semantics, ES + EN copy via `app/data/i18n.ts`).
- Read `CLAUDE.md` before building or auditing UI.

## Database migrations

- A migration is `supabase/migrations/<timestamp>_<name>.sql` (`supabase migration new <name>`); the migrations are the schema, there is no `schema.sql`. Any other file name stops the build.
- Carlos applies it to production with `supabase db push --linked` before the PR merges, so it must work with the code that is live. Never apply one with the Supabase MCP `apply_migration` or the SQL editor: they record another version and the build then sees the file as pending.
- A migration that is applied is never edited; a change is a new file. The build compares versions, not contents, so an edit to an applied file would pass unseen.
- The build enforces the order: `npm run build` runs `scripts/check-migrations.mjs` first, and every Workers Builds build (previews too) fails closed while a migration of its commit is not applied in production, so the previous version stays live.
- The check reads production with the build secret `MIGRATION_CHECK_DB_URL` (role `migration_check`, which can only read the migration versions), set in Cloudflare under Settings > Builds > Variables and secrets in both tabs, Production and Previews Base. A Preview copies the base when it is created: a branch whose Preview is older than the secret fails with "is not set" until it is pushed under a new name.

## Commands

- Lint / test: none configured, except the deploy gate's self-check: `node --test scripts/check-migrations.test.mjs`.

## Agents and branches

- Claude Code implements and reviews. Gemini (via `agy`) plans and generates in bulk.
- `main` is updated through PRs; Claude merges its own once checks pass. Stage explicit paths, never `git add .`.
- Authorship goes in a `Co-Authored-By:` trailer.
