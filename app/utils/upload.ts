import type { GalleryVisualFormat } from '#shared/types/content'

// Subida directa al bucket público `work-images`. El servidor solo emite un URL
// firmado (/api/admin/upload-url) y el PUT va del navegador a Supabase Storage
// sin pasar por la función de Vercel — el proxy anterior moría con 413 en
// archivos > ~4.5MB (límite duro del cuerpo de las funciones serverless).
export async function uploadToBucket(file: File): Promise<{ url: string; format?: GalleryVisualFormat }> {
  const { signedUrl, publicUrl, format } = await $fetch<{
    signedUrl: string
    publicUrl: string
    format?: GalleryVisualFormat
  }>('/api/admin/upload-url', { method: 'POST', body: { filename: file.name } })

  const res = await fetch(signedUrl, {
    method: 'PUT',
    // Sin esto Supabase sirve cache-control: no-cache — cada visita re-descarga
    // el archivo completo del origin (video/foto), sin que Cloudflare (delante
    // de Storage) ni el navegador lo cacheen. Un año, los assets son inmutables
    // por diseño: cada subida genera un path nuevo (randomUUID), nunca se pisa.
    headers: { 'content-type': file.type, 'x-upsert': 'false', 'cache-control': 'max-age=31536000' },
    body: file,
  })
  if (!res.ok) throw new Error(`Subida a storage falló (${res.status})`)

  return { url: publicUrl, format }
}