// Self-check of the deploy gate: node --test scripts/check-migrations.test.mjs
import assert from 'node:assert/strict'
import { readdirSync } from 'node:fs'
import { test } from 'node:test'
import { findPending, parseTarget, PROJECT_REF, readLocal, readRemote } from './check-migrations.mjs'

const pooled = `postgresql://migration_check.${PROJECT_REF}:s3cret@aws-0-us-east-1.pooler.supabase.com:5432/postgres`

test('a file the Supabase CLI would skip is an error, not a silent pass', () => {
  const { byVersion, invalid } = readLocal(['20260922161321_baseline.sql', '2026-09-14-add-long-description.sql', 'notes.md', '20260922161321_twice.sql'])
  assert.deepEqual([...byVersion], [['20260922161321', '20260922161321_baseline.sql']])
  assert.deepEqual(invalid, ['2026-09-14-add-long-description.sql', 'notes.md', '20260922161321_twice.sql'])
})

test('the migrations of this repo are all named for the CLI', () => {
  const { byVersion, invalid } = readLocal(readdirSync(new URL('../supabase/migrations/', import.meta.url)))
  assert.deepEqual(invalid, [])
  assert.ok(byVersion.size > 0)
})

test('pending is what this commit carries and production lacks, oldest first', () => {
  const { byVersion } = readLocal(['20261201000000_b.sql', '20260922161321_baseline.sql', '20261101000000_a.sql'])
  assert.deepEqual(findPending(byVersion, ['20260922161321']), ['20261101000000_a.sql', '20261201000000_b.sql'])
  assert.deepEqual(findPending(byVersion, []), ['20260922161321_baseline.sql', '20261101000000_a.sql', '20261201000000_b.sql'])
})

test('a version production has and this commit lacks is not pending', () => {
  const { byVersion } = readLocal(['20260922161321_baseline.sql'])
  assert.deepEqual(findPending(byVersion, ['20260922161321', '20270101000000']), [])
})

test('the secret must be the connection string of the role migration_check of this project', () => {
  assert.deepEqual(parseTarget(pooled), { password: 's3cret' })
  assert.deepEqual(parseTarget(`postgres://migration_check:p%40ss@db.${PROJECT_REF}.supabase.co:5432/postgres`), { password: 'p@ss' })
  const refused = /not the connection string of the role migration_check/
  assert.throws(() => parseTarget('postgresql://migration_check.ewfovheaqvxgapkegrqn:s3cret@aws-0-us-east-1.pooler.supabase.com:5432/postgres'), refused)
  // The strings the Supabase dashboard offers to copy use `postgres`: right project, a role that reads everything.
  assert.throws(() => parseTarget(pooled.replace('migration_check.', 'postgres.')), refused)
  assert.throws(() => parseTarget(pooled.replace('migration_check.', 'supabase_read_only_user.')), refused)
  assert.throws(() => parseTarget(`postgresql://postgres:s3cret@db.${PROJECT_REF}.supabase.co:5432/postgres`), refused)
  assert.throws(() => parseTarget('postgresql://migration_check:s3cret@db.ewfovheaqvxgapkegrqn.supabase.co:5432/postgres'), refused)
  assert.throws(() => parseTarget(`${pooled}?user=postgres.${PROJECT_REF}`), /query string/)
  assert.throws(() => parseTarget(`${pooled}?options=-c%20role%3Dpostgres`), /query string/)
  assert.throws(() => parseTarget(`https://${PROJECT_REF}.supabase.co`), /not a postgresql/)
  assert.throws(() => parseTarget('not a url'), /not a connection string/)
  assert.throws(() => parseTarget(pooled.replace(':s3cret', '')), /no password/)
})

test('an answer that is not a list of numeric versions is refused', () => {
  assert.deepEqual(readRemote([{ version: '20260922161321' }]), ['20260922161321'])
  assert.deepEqual(readRemote([]), [])
  assert.throws(() => readRemote(undefined), /not a list/)
  assert.throws(() => readRemote([{ version: null }]), /numeric version/)
  assert.throws(() => readRemote([{ name: 'baseline' }]), /numeric version/)
})
