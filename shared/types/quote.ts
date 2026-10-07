// Tipos del cotizador público (/quote). El cliente manda el alcance; el servidor
// calcula el rango (las horas y tarifas no viajan al navegador).

// Tamaño del alcance por servicio. Qué significa cada uno, en shared/data/quote.ts.
export type QuoteSize = 's' | 'm' | 'l'

// 'gt' cotiza en GTQ + IVA 12 %; 'abroad' en USD sin IVA (exportación de servicios).
export type QuoteRegion = 'gt' | 'abroad'

export type QuoteTiming = 'flexible' | 'month' | 'urgent'

export type QuoteStatus = 'new' | 'contacted' | 'demo' | 'won' | 'lost'

export interface QuoteItemInput {
  slug: string
  size: QuoteSize
}

export interface QuoteRequestBody {
  items: QuoteItemInput[]
  region: QuoteRegion
  timing: QuoteTiming
  brief?: string
  name: string
  email: string
  whatsapp?: string
  business?: string
  lang: 'es' | 'en'
  website?: string // honeypot: real users never fill this
}

export interface QuoteEstimate {
  currency: 'GTQ' | 'USD'
  min: number
  max: number
  // Solo GTQ: el rango va antes de IVA y la cotización formal lo desglosa.
  plusVat: boolean
  // Partes del total, en el mismo orden que `items`.
  items: { slug: string; size: QuoteSize; min: number; max: number }[]
}

export interface QuoteResponse {
  ref: string
  estimate: QuoteEstimate
  /** Se envió el resumen al correo del cliente. */
  emailed?: boolean
}

export interface QuoteRequestAdmin {
  id: string
  ref: string
  createdAt: string
  status: QuoteStatus
  name: string
  email: string
  whatsapp: string | null
  business: string | null
  region: QuoteRegion
  timing: QuoteTiming
  brief: string | null
  lang: 'es' | 'en'
  estimate: QuoteEstimate
}
