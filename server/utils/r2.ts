import { presignUrl } from '../lib/sigv4.mjs'

// R2 config read per call (never at module load): on Workers the env is bound to the request.
function r2Env() {
  const env = {
    accountId: process.env.R2_ACCOUNT_ID,
    accessKeyId: process.env.R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    bucket: process.env.R2_BUCKET,
    publicUrl: process.env.R2_PUBLIC_URL,
  }
  const names = { accountId: 'R2_ACCOUNT_ID', accessKeyId: 'R2_ACCESS_KEY_ID', secretAccessKey: 'R2_SECRET_ACCESS_KEY', bucket: 'R2_BUCKET', publicUrl: 'R2_PUBLIC_URL' }
  const missing = Object.entries(names).filter(([k]) => !env[k as keyof typeof env]).map(([, n]) => n)
  if (missing.length) {
    console.error(`R2 not configured, missing: ${missing.join(', ')}`) // names only, never values
    throw createError({ statusCode: 500, statusMessage: 'R2 not configured' })
  }
  return env as Record<keyof typeof env, string>
}

export function r2PublicUrl(key: string) {
  return `${r2Env().publicUrl}/${key}`
}

// Presigned PUT straight to R2 (virtual-hosted style, as the AWS SDK did before; assumes a bucket name without dots).
// `headers` are signed: the browser must send them with exactly these values or R2 answers 403.
export function presignR2Put(key: string, headers: Record<string, string>, expires = 300) {
  const env = r2Env()
  return presignUrl({
    method: 'PUT',
    host: `${env.bucket}.${env.accountId}.r2.cloudflarestorage.com`,
    path: `/${key}`,
    region: 'auto',
    service: 's3',
    accessKeyId: env.accessKeyId,
    secretAccessKey: env.secretAccessKey,
    expires,
    headers,
  })
}
