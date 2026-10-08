// shared/data/servicesShowcase.ts
// Un ejemplo real por pilar en /services, tomado de los casos publicados en /work (por slug).
// Para cambiar el ejemplo de un pilar, cambia `work`; si el caso se oculta o se borra,
// el bloque simplemente no aparece. `media: 'video'` usa el visual animado del caso
// (el de portada o, si no hay, el más ancho); `image` usa su imagen de portada.
import type { LocalizedText, ServicePillar } from '#shared/types/content'

export interface ServiceShowcase {
  work: string
  media: 'video' | 'image'
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
    work: 'camas-muebles-orrego',
    media: 'image',
    note: {
      es: 'Marca y tienda en línea para una fábrica de camas y muebles.',
      en: 'Brand and online store for a bed and furniture maker.',
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
