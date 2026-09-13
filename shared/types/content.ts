export interface LocalizedText {
  es: string
  en: string
}

export type WorkType = 'product' | 'brand'

export interface WorkItem {
  slug: string
  type: WorkType
  title: LocalizedText
  description: LocalizedText
  role: LocalizedText[]
  tools: string[]
  context: LocalizedText
  date: LocalizedText
  gallery: string[]
}

export interface AboutSection {
  label: LocalizedText
  heading?: LocalizedText
  paragraphs: LocalizedText[]
  ctaLabel?: LocalizedText
  ctaTo?: string
}
