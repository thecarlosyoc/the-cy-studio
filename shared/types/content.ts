export interface LocalizedText {
  es: string
  en: string
}

export type WorkType = 'product' | 'brand'

export type GalleryColSpan = 1 | 2 | 3

export interface GalleryImage {
  url: string
  colSpan: GalleryColSpan
  isCover?: boolean
}

export type GalleryVisualFormat = 'webm' | 'mp4'

export interface GalleryVisual {
  url: string
  colSpan: GalleryColSpan
  format: GalleryVisualFormat
  mp4Url?: string
  poster?: string
  // Posición del visual dentro del mosaico: cuántas imágenes van antes
  // (0 = primera celda, gallery.length = última). Se clampea al ordenar.
  position?: number
  // Portada del proyecto en las cards públicas (home, /work). Mutuamente
  // excluyente con GalleryImage.isCover: solo un medio (imagen o visual) es
  // portada a la vez.
  isCover?: boolean
}

export interface WorkItem {
  slug: string
  type: WorkType
  title: LocalizedText
  description: LocalizedText
  longDescription: LocalizedText
  role: LocalizedText[]
  tools: string[]
  context: LocalizedText
  date: LocalizedText
  gallery: GalleryImage[]
  // Visuales animados del proyecto: hasta MAX_GALLERY_VISUALS por proyecto.
  // Cada uno lleva su propia `position` (cuántas imágenes van antes en el mosaico).
  visuals: GalleryVisual[]
  // URL de un demo/live para probar el producto. Cuando existe, `/work/[slug]`
  // muestra el botón "See it in action" bajo el contexto.
  demoUrl?: string
}

export interface AboutSection {
  label: LocalizedText
  heading?: LocalizedText
  paragraphs: LocalizedText[]
  ctaLabel?: LocalizedText
  ctaTo?: string
}

export interface WorkItemAdmin extends WorkItem {
  id: string
  order: number
  hidden: boolean
  updatedAt: string
  updatedBy: string | null
}

export interface AboutSectionAdmin extends AboutSection {
  id: string
  order: number
}
