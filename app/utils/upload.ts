import type { GalleryVisualFormat } from '#shared/types/content'

// Subida directa al bucket público `work-images` en Cloudflare R2. El servidor
// solo emite un URL firmado (/api/admin/upload-url) y el PUT va del navegador
// directo a R2, sin pasar por la función de Vercel — un proxy server-side
// re-subiendo el body completo corta en ~4.5MB con un 413 (límite duro de
// Vercel).
export async function uploadToBucket(file: File): Promise<{ url: string; format?: GalleryVisualFormat }> {
  const { signedUrl, publicUrl, format, contentType, cacheControl } = await $fetch<{
    signedUrl: string
    publicUrl: string
    format?: GalleryVisualFormat
    contentType: string
    cacheControl: string
  }>('/api/admin/upload-url', { method: 'POST', body: { filename: file.name } })

  const res = await fetch(signedUrl, {
    method: 'PUT',
    // content-type y cache-control deben coincidir EXACTO con lo firmado en el
    // servidor (van dentro de la firma SigV4 del URL) o R2 rechaza el PUT con 403.
    headers: { 'content-type': contentType, 'cache-control': cacheControl },
    body: file,
  })
  if (!res.ok) throw new Error(`Subida a storage falló (${res.status})`)

  return { url: publicUrl, format }
}