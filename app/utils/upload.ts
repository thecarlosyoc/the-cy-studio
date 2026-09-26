import type { GalleryVisualFormat } from '#shared/types/content'

// Subida directa al bucket público `work-images` en Cloudflare R2. El servidor
// solo emite un URL firmado (/api/admin/upload-url) y el PUT va del navegador
// directo a R2, sin pasar por la función de Vercel — un proxy server-side
// re-subiendo el body completo corta en ~4.5MB con un 413 (límite duro de
// Vercel).
export async function uploadToBucket(file: File): Promise<{ url: string; format?: GalleryVisualFormat }> {
  const { signedUrl, publicUrl, format } = await $fetch<{
    signedUrl: string
    publicUrl: string
    format?: GalleryVisualFormat
  }>('/api/admin/upload-url', { method: 'POST', body: { filename: file.name } })

  // Un fallo de red o CORS llega como TypeError sin status: se nombra aquí
  // para que el admin no muestre solo el mensaje genérico.
  const res = await fetch(signedUrl, {
    method: 'PUT',
    // cache-control debe coincidir EXACTO con lo firmado en el servidor (va
    // dentro de la firma SigV4 del URL) o R2 rechaza el PUT con 403. Seguro
    // cachear para siempre: paths son randomUUID, nunca se pisan.
    headers: { 'content-type': file.type, 'cache-control': 'public, max-age=31536000, immutable' },
    body: file,
  }).catch(() => {
    throw new Error('No se pudo conectar con R2. Revisa las variables R2_* y el CORS del bucket para este dominio.')
  })
  if (!res.ok) throw new Error(`Subida a storage falló (${res.status})`)

  return { url: publicUrl, format }
}