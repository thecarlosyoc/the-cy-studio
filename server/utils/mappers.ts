import type { LocalizedText, WorkItem, AboutSection, WorkItemAdmin, AboutSectionAdmin, WorkType, GalleryImage, GalleryVisual } from '#shared/types/content'

export interface WorkItemRow {
  id: string
  slug: string
  type: WorkType
  order: number
  title_es: string
  title_en: string
  description_es: string
  description_en: string
  long_description_es: string
  long_description_en: string
  role: LocalizedText[]
  tools: string[]
  context_es: string
  context_en: string
  date_es: string
  date_en: string
  gallery: GalleryImage[]
  visuals: GalleryVisual[]
  hidden: boolean
  updated_at: string
  updated_by: string | null
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
    longDescription: { es: row.long_description_es, en: row.long_description_en },
    role: row.role,
    tools: row.tools,
    context: { es: row.context_es, en: row.context_en },
    date: { es: row.date_es, en: row.date_en },
    gallery: row.gallery,
    visuals: row.visuals ?? [],
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

export function toWorkItemAdmin(row: WorkItemRow): WorkItemAdmin {
  return {
    id: row.id,
    order: row.order,
    hidden: row.hidden,
    updatedAt: row.updated_at,
    updatedBy: row.updated_by,
    ...toWorkItem(row),
  }
}

export function toAboutSectionAdmin(row: AboutSectionRow): AboutSectionAdmin {
  return { id: row.id, order: row.order, ...toAboutSection(row) }
}

export function fromWorkItemInput(input: Partial<WorkItem>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (input.slug !== undefined) row.slug = input.slug
  if (input.type !== undefined) row.type = input.type
  if (input.title !== undefined) {
    row.title_es = input.title.es
    row.title_en = input.title.en
  }
  if (input.description !== undefined) {
    row.description_es = input.description.es
    row.description_en = input.description.en
  }
  if (input.longDescription !== undefined) {
    row.long_description_es = input.longDescription.es
    row.long_description_en = input.longDescription.en
  }
  if (input.role !== undefined) row.role = input.role
  if (input.tools !== undefined) row.tools = input.tools
  if (input.context !== undefined) {
    row.context_es = input.context.es
    row.context_en = input.context.en
  }
  if (input.date !== undefined) {
    row.date_es = input.date.es
    row.date_en = input.date.en
  }
  if (input.gallery !== undefined) row.gallery = input.gallery
  if (input.visuals !== undefined) row.visuals = input.visuals
  return row
}

export function fromAboutSectionInput(input: Partial<AboutSection>): Record<string, unknown> {
  const row: Record<string, unknown> = {}
  if (input.label !== undefined) {
    row.label_es = input.label.es
    row.label_en = input.label.en
  }
  if (input.heading !== undefined) {
    row.heading_es = input.heading?.es ?? null
    row.heading_en = input.heading?.en ?? null
  }
  if (input.paragraphs !== undefined) row.paragraphs = input.paragraphs
  if (input.ctaLabel !== undefined) {
    row.cta_label_es = input.ctaLabel?.es ?? null
    row.cta_label_en = input.ctaLabel?.en ?? null
  }
  if (input.ctaTo !== undefined) row.cta_to = input.ctaTo ?? null
  return row
}
