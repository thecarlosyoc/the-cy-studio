import type { LocalizedText, WorkItem, AboutSection, WorkType } from '#shared/types/content'

export interface WorkItemRow {
  id: string
  slug: string
  type: WorkType
  order: number
  title_es: string
  title_en: string
  description_es: string
  description_en: string
  role: LocalizedText[]
  tools: string[]
  context_es: string
  context_en: string
  date_es: string
  date_en: string
  gallery: string[]
}

export interface AboutSectionRow {
  id: string
  order: number
  label_es: string
  label_en: string
  heading_es: string | null
  heading_en: string | null
  paragraphs: LocalizedText[]
  cta_label_es: string | null
  cta_label_en: string | null
  cta_to: string | null
}

export function toWorkItem(row: WorkItemRow): WorkItem {
  return {
    slug: row.slug,
    type: row.type,
    title: { es: row.title_es, en: row.title_en },
    description: { es: row.description_es, en: row.description_en },
    role: row.role,
    tools: row.tools,
    context: { es: row.context_es, en: row.context_en },
    date: { es: row.date_es, en: row.date_en },
    gallery: row.gallery,
  }
}

export function toAboutSection(row: AboutSectionRow): AboutSection {
  return {
    label: { es: row.label_es, en: row.label_en },
    heading: row.heading_es && row.heading_en ? { es: row.heading_es, en: row.heading_en } : undefined,
    paragraphs: row.paragraphs,
    ctaLabel: row.cta_label_es && row.cta_label_en ? { es: row.cta_label_es, en: row.cta_label_en } : undefined,
    ctaTo: row.cta_to ?? undefined,
  }
}
