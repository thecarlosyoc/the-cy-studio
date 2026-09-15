import type { GalleryImage } from '#shared/types/content'

// Fallback: sin isCover marcado explícitamente, la primera imagen es la portada.
export function getCoverImage(gallery: GalleryImage[]): GalleryImage | undefined {
  return gallery.find((img) => img.isCover) ?? gallery[0]
}

// Nombre corto del archivo (último segmento de una URL) para los editores del
// admin — más legible que el URL completo de Supabase Storage.
export function fileNameFromUrl(url: string): string {
  const segment = url.split('/').filter(Boolean).pop() ?? url
  try {
    return decodeURIComponent(segment)
  } catch {
    return segment
  }
}
