#!/usr/bin/env node
// Deploy gate: a build must never be ahead of the production database schema.
//
// Workers Builds publishes every merge to main by itself. If the commit carries a migration that
// production does not have yet, the new code would run against the old schema (dts, 2026-11-10: three
// pending migrations, PostgREST 404, the owner could not save a purchase). This runs before `nuxt build`
// and stops the build while any file in supabase/migrations is not recorded as applied in production,
// so the previous version stays live.
//
// It fails closed: no credential, a database that does not answer, an answer it cannot read or a file
// the Supabase CLI would skip all stop the build. Only "every local version is applied" passes.
//
// The credential is MIGRATION_CHECK_DB_URL, a build secret in Cloudflare: the connection string of the
// role migration_check, which can only read supabase_migrations.schema_migrations(version)
// (supabase/migrations/20261111020124_migration_check_role.sql). Never a Supabase access token and never
// the service-role key: a build must not hold a credential that can write, or that reaches another project.
//
// Self-check: node --test scripts/check-migrations.test.mjs

import { readdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'

export const PROJECT_REF = 'ufekipmnafhenwgblonm'
const VAR = 'MIGRATION_CHECK_DB_URL'
const DIR = fileURLToPath(new URL('../supabase/migrations/', import.meta.url))
const APPLY = 'supabase db push --linked'

// The Supabase CLI applies only <digits>_<name>.sql and skips every other file with a notice. A skipped
// file is a migration nobody applies and no check sees, so here any other name is an error.
const MIGRATION_FILE = /^(\d+)_.+\.sql$/

export function readLocal(files) {
  const byVersion = new Map()
  const invalid = []
  for (const file of files) {
    const version = MIGRATION_FILE.exec(file)?.[1]
    if (!version || byVersion.has(version)) invalid.push(file)
    else byVersion.set(version, file)
  }
  return { byVersion, invalid }
}

// Files of this commit that production has not applied. A version applied in production that this
// commit does not carry is not pending: that is a branch older than main, and its code is behind
// the schema, never ahead of it.
export function findPending(byVersion, remoteVersions) {
  const applied = new Set(remoteVersions)
  return [...byVersion.keys()].filter(version => !applied.has(version)).sort().map(version => byVersion.get(version))
}

// The secret must point at this project and nowhere else: a connection string of another project pasted
// here by mistake would compare this repo against the wrong history.
export function parseTarget(raw) {
  let url
  try {
    url = new URL(raw)
  }
  catch {
    throw new Error(`${VAR} is not a connection string`)
  }
  if (url.protocol !== 'postgresql:' && url.protocol !== 'postgres:') throw new Error(`${VAR} is not a postgresql:// connection string`)
  const user = decodeURIComponent(url.username)
  const pooled = user.endsWith(`.${PROJECT_REF}`)
  const direct = url.hostname === `db.${PROJECT_REF}.supabase.co`
  if (!pooled && !direct) throw new Error(`${VAR} does not point at project ${PROJECT_REF}`)
  if (!url.password) throw new Error(`${VAR} has no password`)
  return { password: decodeURIComponent(url.password) }
}

export function readRemote(rows) {
  if (!Array.isArray(rows)) throw new Error('the database answer is not a list of rows')
  return rows.map((row) => {
    if (typeof row?.version !== 'string' || !/^\d+$/.test(row.version)) throw new Error('the database answer has a row without a numeric version')
    return row.version
  })
}

async function appliedVersions(raw) {
  const { default: postgres } = await import('postgres')
  // ponytail: TLS is required but the server certificate is not verified (Supabase signs the pooler
  // with its own CA). The password never travels (SCRAM) and the answer is a list of public version
  // numbers; pin Supabase's CA with ssl: { ca } if a forged answer ever becomes a real threat.
  const sql = postgres(raw, { ssl: 'require', max: 1, connect_timeout: 10, idle_timeout: 5, prepare: false, onnotice: () => {} })
  try {
    return readRemote(await sql`select version from supabase_migrations.schema_migrations`)
  }
  finally {
    await sql.end({ timeout: 2 }).catch(() => {})
  }
}

function stop(lines) {
  console.error(['', '[check-migrations] BUILD STOPPED', ...lines.map(line => `  ${line}`), ''].join('\n'))
  process.exit(1)
}

async function main() {
  const raw = process.env[VAR]
  // Workers Builds sets CI=true and WORKERS_CI=1 on every build. A build on a developer's machine has
  // neither and publishes nothing, so it is the only case that skips.
  if (!raw && !process.env.CI && !process.env.WORKERS_CI) {
    console.log(`[check-migrations] skipped: not a CI build and ${VAR} is not set`)
    return
  }

  const { byVersion, invalid } = readLocal(readdirSync(DIR))
  if (invalid.length) {
    stop([
      'supabase/migrations has files the Supabase CLI would skip or cannot order:',
      ...invalid.map(file => `- ${file}`),
      'Name every migration <timestamp>_<name>.sql, one version per file (supabase migration new <name>).',
    ])
  }

  if (!raw) stop([`${VAR} is not set, so this build cannot prove that production has every migration.`, 'Add it in Cloudflare: Workers & Pages > the-cy-studio > Settings > Build > Build variables and secrets.'])

  let remote
  let secret = ''
  try {
    secret = parseTarget(raw).password
    const timeout = new Promise((_, reject) => setTimeout(() => reject(new Error('no answer from the database in 20 s')), 20_000).unref())
    remote = await Promise.race([appliedVersions(raw), timeout])
  }
  catch (error) {
    // The message of a driver error can quote what it was given: never print the password.
    let reason = String(error?.message || error)
    for (const part of [secret, encodeURIComponent(secret), raw]) if (part) reason = reason.split(part).join('***')
    stop([`Could not read the migration history of production (${PROJECT_REF}): ${reason}`, 'No proof that the database is up to date, no deploy.'])
  }

  const pending = findPending(byVersion, remote)
  if (pending.length) {
    stop([
      `Production (${PROJECT_REF}) does not have ${pending.length === 1 ? 'this migration' : 'these migrations'} yet:`,
      ...pending.map(file => `- supabase/migrations/${file}`),
      `Apply first, then run this build again: ${APPLY}`,
      'The live site keeps the previous version until then.',
    ])
  }

  const ahead = remote.filter(version => !byVersion.has(version))
  if (ahead.length) console.log(`[check-migrations] note: production has ${ahead.length} newer migration(s) this commit does not carry (${ahead.join(', ')}); the branch is behind main.`)
  console.log(`[check-migrations] ok: production (${PROJECT_REF}) has all ${byVersion.size} migrations of this commit.`)
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch(error => stop([`Unexpected error: ${String(error?.message || error)}`, 'No proof that the database is up to date, no deploy.']))
}
