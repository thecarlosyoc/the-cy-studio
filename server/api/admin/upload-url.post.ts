import { randomUUID } from 'node:crypto'
import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import type { GalleryVisualFormat } from '#shared/types/content'

// Mismo permitido que el proxy anterior (video: primario/fallback; imagen:
// galería/póster), ampliado con las extensiones que dejan pasar los pickers del
// admin (accept="image/*" / "video/*"): fotos iPhone (.heic/.heif), .mov, .m4v…
// El `format` se deriva solo para webm/mp4; el resto de archivos no llevan.
const FORMAT_BY_EXT: Record<string, GalleryVisualFormat | undefined> = {
  webm: 'webm',
  mp4: 'mp4', // video → format
  // imágenes
  jpg: undefined,
  jpeg: undefined,
  png: undefined,
  webp: undefined,
  gif: undefined,
  avif: undefined,
  svg: undefined,
  heic: undefined,
  heif: undefined,
  // otros videos que el picker permite subir
  mov: undefined,
  m4v: undefined,
  ogv: undefined,
  ogg: undefined,
  m4a: undefined,
}

// Emite un URL de subida firmado para que el navegador suba el archivo directo
// a Cloudflare R2 sin pasar por la función de Vercel — un proxy server-side
// re-subiendo el body completo corta en ~4.5MB con un 413 (límite duro de
// Vercel). La auth admin queda igual (requireAdminSession).
//
// R2 en vez de Supabase Storage desde 2026-09-22: egress $0 siempre, el
// origen del problema de cuota excedida. cache-control va firmado en la URL
// (el cliente debe mandar el header exacto) — paths son randomUUID, nunca se
// pisan, así que cachear "para siempre" es seguro.
export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const { filename } = await readBody<{ filename?: string }>(event)
  const ext = filename?.split('.').pop()?.toLowerCase() || 'bin'
  if (!(ext in FORMAT_BY_EXT)) {
    throw createError({ statusCode: 400, statusMessage: `Extensión no permitida: ${ext}` })
  }

  const path = `${randomUUID()}.${ext}`

  const signedUrl = await getSignedUrl(
    useR2(),
    new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: path,
      CacheControl: 'public, max-age=31536000, immutable',
    }),
    { expiresIn: 300 }
  )

  return {
    signedUrl,
    publicUrl: `${R2_PUBLIC_URL}/${path}`,
    format: FORMAT_BY_EXT[ext],
  }
})