import { randomUUID } from 'node:crypto'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { GalleryVisualFormat } from '#shared/types/content'

// Mismo permitido que el proxy anterior (video: primario/fallback; imagen:
// galería/póster), ampliado con las extensiones que dejan pasar los pickers del
// admin (accept="image/*" / "video/*"): fotos iPhone (.heic/.heif), .mov, .m4v…
// El Content-Type sale de la extensión, no de `file.type`: el navegador a veces
// lo manda vacío (.heic) y así el servidor decide qué tipo queda en el bucket.
const TYPE_BY_EXT: Record<string, string> = {
  // video con `format` (primario/fallback)
  webm: 'video/webm',
  mp4: 'video/mp4',
  // imágenes
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  png: 'image/png',
  webp: 'image/webp',
  gif: 'image/gif',
  avif: 'image/avif',
  svg: 'image/svg+xml',
  heic: 'image/heic',
  heif: 'image/heif',
  // otros videos que el picker permite subir
  mov: 'video/quicktime',
  m4v: 'video/x-m4v',
  ogv: 'video/ogg',
  ogg: 'video/ogg',
  m4a: 'audio/mp4',
}

const CACHE_CONTROL = 'public, max-age=31536000, immutable'

// Emite un URL de subida firmado para que el navegador suba el archivo directo
// a Cloudflare R2 sin pasar por la función de Vercel — un proxy server-side
// re-subiendo el body completo corta en ~4.5MB con un 413 (límite duro de
// Vercel). La auth admin queda igual (requireAdminSession).
//
// R2 en vez de Supabase Storage desde 2026-09-22: egress $0 siempre, el
// origen del problema de cuota excedida. content-type y cache-control van
// firmados (signableHeaders): sin eso la firma solo cubre `host` y R2 acepta
// cualquier tipo y guarda solo el cache-control que el cliente quiera mandar.
// El cliente debe mandar exactos los valores devueltos o R2 responde 403.
// Paths son randomUUID, nunca se pisan, así que cachear "para siempre" es seguro.
export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const { filename } = await readBody<{ filename?: string }>(event)
  const ext = filename?.split('.').pop()?.toLowerCase() || 'bin'
  const contentType = Object.hasOwn(TYPE_BY_EXT, ext) ? TYPE_BY_EXT[ext] : undefined
  if (!contentType) {
    throw createError({ statusCode: 400, statusMessage: `Extensión no permitida: ${ext}` })
  }

  const path = `${randomUUID()}.${ext}`

  const signedUrl = await getSignedUrl(
    useR2(),
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: path,
      ContentType: contentType,
      CacheControl: CACHE_CONTROL,
    }),
    { expiresIn: 300, signableHeaders: new Set(['content-type', 'cache-control']) }
  )

  return {
    signedUrl,
    publicUrl: `${R2_PUBLIC_URL}/${path}`,
    format: ext === 'webm' || ext === 'mp4' ? (ext as GalleryVisualFormat) : undefined,
    contentType,
    cacheControl: CACHE_CONTROL,
  }
})