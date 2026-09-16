import { randomUUID } from 'node:crypto'
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

// Emite un URL de subida firmado para que el navegador suba el archivo directo a
// Supabase Storage sin pasar por la función de Vercel — el proxy anterior
// re-uploadaba el body completo (readMultipartFormData) y Vercel corta el
// request en ~4.5MB con un 413. La auth admin queda igual (requireAdminSession).
export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const { filename } = await readBody<{ filename?: string }>(event)
  const ext = filename?.split('.').pop()?.toLowerCase() || 'bin'
  if (!(ext in FORMAT_BY_EXT)) {
    throw createError({ statusCode: 400, statusMessage: `Extensión no permitida: ${ext}` })
  }

  const path = `${randomUUID()}.${ext}`
  const storage = useSupabase().storage.from('work-images')

  const { data, error } = await storage.createSignedUploadUrl(path, { upsert: false })
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  const { data: pub } = storage.getPublicUrl(path)
  return {
    signedUrl: data.signedUrl,
    publicUrl: pub.publicUrl,
    format: FORMAT_BY_EXT[ext],
  }
})