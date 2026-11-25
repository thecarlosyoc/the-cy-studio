// AWS Signature V4 query presigning with Web Crypto only, so it runs the same on
// Cloudflare Workers and in Node. Replaces @aws-sdk/s3-request-presigner, whose
// S3Client dies in Workers with "fp is not a function" in getRuntimeConfig
// (the SDK loads its Node runtime config inside the Worker bundle).
// Spec: https://docs.aws.amazon.com/AmazonS3/latest/API/sigv4-query-string-auth.html

const enc = new TextEncoder()

const hex = buf => [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('')
const sha256 = async data => hex(await crypto.subtle.digest('SHA-256', enc.encode(data)))
async function hmac(key, data) {
  const k = await crypto.subtle.importKey('raw', typeof key === 'string' ? enc.encode(key) : key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign'])
  return crypto.subtle.sign('HMAC', k, enc.encode(data))
}

// RFC 3986 encoding as SigV4 wants it (encodeURIComponent leaves !'()* alone).
const uriEncode = s => encodeURIComponent(s).replace(/[!'()*]/g, c => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)

/**
 * @param {{ method: string, host: string, path: string, region: string, service: string,
 *   accessKeyId: string, secretAccessKey: string, expires: number, date?: Date,
 *   headers?: Record<string, string> }} o  `headers` are signed besides `host`; the client
 *   must send them with exactly these values.
 * @returns {Promise<string>} the presigned https URL
 */
export async function presignUrl(o) {
  const amzDate = (o.date ?? new Date()).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '')
  const day = amzDate.slice(0, 8)
  const scope = `${day}/${o.region}/${o.service}/aws4_request`

  // host last so a `host` in o.headers can never diverge from the URL; values trimmed and inner whitespace collapsed (SigV4 Trimall).
  const headers = { ...Object.fromEntries(Object.entries(o.headers ?? {}).map(([k, v]) => [k.toLowerCase(), String(v).trim().replace(/\s+/g, ' ')])), host: o.host }
  const names = Object.keys(headers).sort()
  const signedHeaders = names.join(';')

  const query = {
    'X-Amz-Algorithm': 'AWS4-HMAC-SHA256',
    'X-Amz-Credential': `${o.accessKeyId}/${scope}`,
    'X-Amz-Date': amzDate,
    'X-Amz-Expires': String(o.expires),
    'X-Amz-SignedHeaders': signedHeaders,
  }
  const canonicalQuery = Object.keys(query).sort().map(k => `${uriEncode(k)}=${uriEncode(query[k])}`).join('&')
  const canonicalUri = o.path.split('/').map(uriEncode).join('/')
  const canonicalHeaders = names.map(n => `${n}:${headers[n]}\n`).join('')

  const canonicalRequest = [o.method, canonicalUri, canonicalQuery, canonicalHeaders, signedHeaders, 'UNSIGNED-PAYLOAD'].join('\n')
  const stringToSign = ['AWS4-HMAC-SHA256', amzDate, scope, await sha256(canonicalRequest)].join('\n')

  let key = await hmac(`AWS4${o.secretAccessKey}`, day)
  for (const part of [o.region, o.service, 'aws4_request']) key = await hmac(key, part)
  const signature = hex(await hmac(key, stringToSign))

  return `https://${o.host}${canonicalUri}?${canonicalQuery}&X-Amz-Signature=${signature}`
}
