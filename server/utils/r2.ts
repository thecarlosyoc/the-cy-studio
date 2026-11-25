import { presignUrl } from '../lib/sigv4.mjs'

// R2 config read per call (never at module load): on Workers the env is bound to the request.
function r2Env() {
  return {
    accountId: process.env.R2_ACCOUNT_ID!,
    accessKeyId: process.env.R2_ACCESS_KEY_ID!,
    secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
    bucket: process.env.R2_BUCKET!,
    publicUrl: process.env.R2_PUBLIC_URL!,
  }
}

export function r2PublicUrl(key: string) {
  return `${r2Env().publicUrl}/${key}`
}

// Presigned PUT straight to R2 (virtual-hosted style, as the AWS SDK did before).
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
