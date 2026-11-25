// node --test server/lib/sigv4.test.mjs
import { test } from 'node:test'
import assert from 'node:assert/strict'
import { presignUrl } from './sigv4.mjs'

// AWS's published example for a presigned URL (Authenticating Requests: Using Query
// Parameters, "Example: Presigned URL"): GET examplebucket/test.txt, 24 h.
test('matches the AWS presigned URL example', async () => {
  const url = await presignUrl({
    method: 'GET',
    host: 'examplebucket.s3.amazonaws.com',
    path: '/test.txt',
    region: 'us-east-1',
    service: 's3',
    accessKeyId: 'AKIAIOSFODNN7EXAMPLE',
    secretAccessKey: 'wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY',
    expires: 86400,
    date: new Date('2013-05-24T00:00:00Z'),
  })
  assert.match(url, /X-Amz-Signature=aeeed9bbccd4d02ee5c0109b86d86835f995330da4c265957d157751f604d404$/)
  assert.ok(url.startsWith('https://examplebucket.s3.amazonaws.com/test.txt?X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=AKIAIOSFODNN7EXAMPLE%2F20130524%2Fus-east-1%2Fs3%2Faws4_request'))
})

test('signs extra headers in sorted order next to host', async () => {
  const url = await presignUrl({
    method: 'PUT', host: 'acct.r2.cloudflarestorage.com', path: '/bucket/a b.jpg', region: 'auto', service: 's3',
    accessKeyId: 'k', secretAccessKey: 's', expires: 300, date: new Date('2026-01-01T00:00:00Z'),
    headers: { 'Content-Type': 'image/jpeg', 'Cache-Control': 'public, max-age=31536000, immutable' },
  })
  assert.match(url, /X-Amz-SignedHeaders=cache-control%3Bcontent-type%3Bhost/)
  assert.ok(url.includes('/bucket/a%20b.jpg?'))
})
