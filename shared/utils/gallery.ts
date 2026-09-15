import type { GalleryImage } from '#shared/types/content'

// Límite de visuales animados por proyecto (definido con el usuario; soporta
// hasta 3 para varias ideas creativas, no solo el hero animado).
export const MAX_GALLERY_VISUALS = 3

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
