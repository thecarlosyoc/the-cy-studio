// shared/data/servicesShowcase.ts
// Un ejemplo real por pilar en /services. Por defecto sale de un caso publicado en /work
// (`work`, por slug): si el caso se oculta o se borra, el bloque simplemente no aparece.
// `media: 'video'` usa el visual animado del caso (el de portada o, si no hay, el más
// ancho); `image` usa su imagen de portada. Sin `work`, el ejemplo es propio: `image`,
// `title` y `to` lo describen (Web usa este mismo sitio, que no tiene caso en /work).
import type { LocalizedText, ServicePillar } from '#shared/types/content'

export interface ServiceShowcase {
  work?: string
  media: 'video' | 'image'
  image?: string
  title?: LocalizedText
  to?: string
  // Qué demuestra el ejemplo de cara al pilar, en una línea.
  note: LocalizedText
}

export const SERVICE_SHOWCASE: Record<ServicePillar, ServiceShowcase> = {
  product: {
    work: 'payments-credits',
    media: 'video',
    note: {
      es: 'Un sistema de pagos y créditos en producción. Puedes probarlo.',
      en: 'A payments and credit system in production. You can try it.',
    },
  },
  web: {
    media: 'image',
    image: '/images/services/thecystudio-home.webp',
    title: { es: 'Este sitio', en: 'This site' },
    to: '/',
    note: {
      es: 'Diseñado y programado a medida, en español e inglés, con su propio panel.',
      en: 'Designed and built to measure, in Spanish and English, with its own admin.',
    },
  },
  brand: {
    work: 'dts-express',
    media: 'image',
    note: {
      es: 'Una identidad en uso desde 2019, de la papelería a los uniformes.',
      en: 'An identity in use since 2019, from stationery to uniforms.',
    },
  },
  motion: {
    work: 'carbon-footprint',
    media: 'video',
    note: {
      es: 'Movimiento que guía dentro de una webapp de huella de carbono.',
      en: 'Motion that guides people inside a carbon footprint web app.',
    },
  },
}
