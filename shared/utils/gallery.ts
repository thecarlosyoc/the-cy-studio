import type { GalleryImage } from '#shared/types/content'

// Fallback: sin isCover marcado explícitamente, la primera imagen es la portada.
export function getCoverImage(gallery: GalleryImage[]): GalleryImage | undefined {
  return gallery.find((img) => img.isCover) ?? gallery[0]
}
