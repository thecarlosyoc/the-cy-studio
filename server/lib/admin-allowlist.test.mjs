// node --test server/lib/admin-allowlist.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { isAdminUserId } from './admin-allowlist.mjs'

const ADMIN = '7c1d2e3f-4a5b-4c6d-8e7f-9a0b1c2d3e4f'
const OTHER = '0b3f8a52-1c4e-4d7a-9e21-5a6b7c8d9e0f'

test('admits a user on the list', () => {
  assert.equal(isAdminUserId(ADMIN, ADMIN), true)
  assert.equal(isAdminUserId(ADMIN, `${OTHER},${ADMIN}`), true)
  assert.equal(isAdminUserId(ADMIN, ` ${OTHER} ,\n ${ADMIN} `), true)
  assert.equal(isAdminUserId(ADMIN, ADMIN.toUpperCase()), true)
})

test('refuses a user not on the list', () => {
  assert.equal(isAdminUserId(OTHER, ADMIN), false)
  // A prefix or a substring of an allowed ID is not that ID.
  assert.equal(isAdminUserId(ADMIN.slice(0, 8), ADMIN), false)
  assert.equal(isAdminUserId(ADMIN, `${ADMIN}x`), false)
})

test('denies everyone when the list is missing or empty', () => {
  for (const list of [undefined, null, '', ' ', ',', ' , \n ', 42, {}]) {
    assert.equal(isAdminUserId(ADMIN, list), false, `list ${JSON.stringify(list)}`)
  }
})

test('denies a missing or empty user ID, even against a sloppy list', () => {
  for (const id of [undefined, null, '', ' ', 42]) {
    assert.equal(isAdminUserId(id, `${ADMIN},,`), false, `id ${JSON.stringify(id)}`)
    assert.equal(isAdminUserId(id, ' , '), false, `id ${JSON.stringify(id)}`)
  }
})

test('has no wildcard', () => {
  assert.equal(isAdminUserId(ADMIN, '*'), false)
  assert.equal(isAdminUserId(ADMIN, '.*'), false)
})
