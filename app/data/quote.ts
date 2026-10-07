// app/data/quote.ts
// Qué significa "pequeño / mediano / grande" en cada servicio del cotizador (/quote),
// y cuánto toma cada tamaño.
// Las horas de cada tamaño viven en server/utils/quotePricing.ts; si cambias el
// alcance aquí, revisa las horas allá. Las claves son los slugs de app/data/services.ts.
import type { LocalizedText } from '#shared/types/content'
import type { QuoteSize } from '#shared/types/quote'

// Tiempo por tamaño: reemplaza el rango general del servicio en /services.
const w = (from: number, to?: number): LocalizedText =>
  to
    ? { es: `${from} a ${to} semanas`, en: `${from} to ${to} weeks` }
    : { es: `${from} semana`, en: `${from} week${from === 1 ? '' : 's'}` }
const MONTHLY: LocalizedText = { es: 'Entrega mensual', en: 'Delivered monthly' }

export const QUOTE_SCOPES: Record<string, Record<QuoteSize, { scope: LocalizedText; time: LocalizedText }>> = {
  'product-design': {
    s: { scope: { es: 'Un flujo o MVP de hasta 10 pantallas', en: 'One flow or an MVP of up to 10 screens' }, time: w(3, 4) },
    m: { scope: { es: 'Una app o plataforma de 10 a 25 pantallas', en: 'An app or platform with 10 to 25 screens' }, time: w(5, 7) },
    l: { scope: { es: 'Un producto completo de más de 25 pantallas, con roles', en: 'A full product with 25+ screens and user roles' }, time: w(8, 12) },
  },
  'design-system': {
    s: { scope: { es: 'Tokens y los componentes básicos', en: 'Tokens and the core components' }, time: w(2, 3) },
    m: { scope: { es: 'Librería completa en Figma con variantes y documentación', en: 'Full Figma library with variants and docs' }, time: w(4, 6) },
    l: { scope: { es: 'Librería completa, también en código', en: 'Full library, in code as well' }, time: w(6, 9) },
  },
  'ux-audit': {
    s: { scope: { es: 'Un flujo clave (registro, compra, onboarding)', en: 'One key flow (sign-up, checkout, onboarding)' }, time: w(1) },
    m: { scope: { es: 'El producto principal, de 3 a 5 flujos', en: 'The core product, 3 to 5 flows' }, time: w(1, 2) },
    l: { scope: { es: 'Todo el producto, con accesibilidad a fondo', en: 'The whole product, with an in-depth accessibility review' }, time: w(2, 3) },
  },
  'landing-page': {
    s: { scope: { es: 'Página corta: oferta, beneficios y contacto', en: 'Short page: offer, benefits and contact' }, time: w(1) },
    m: { scope: { es: 'Página completa con testimonios, preguntas y formulario', en: 'Full page with testimonials, FAQ and a form' }, time: w(1, 2) },
    l: { scope: { es: 'Página larga con animaciones y versión en inglés', en: 'Long page with animations and an English version' }, time: w(2, 3) },
  },
  website: {
    s: { scope: { es: 'Hasta 5 páginas', en: 'Up to 5 pages' }, time: w(2, 3) },
    m: { scope: { es: 'De 6 a 10 páginas, con blog o portafolio', en: '6 to 10 pages, with a blog or portfolio' }, time: w(4, 6) },
    l: { scope: { es: 'Más de 10 páginas, en dos idiomas, con panel a medida', en: '10+ pages, in two languages, with a custom panel' }, time: w(6, 10) },
  },
  frontend: {
    s: { scope: { es: 'Unas cuantas pantallas o una landing', en: 'A few screens or a landing page' }, time: w(1, 2) },
    m: { scope: { es: 'Un sitio o módulo de 10 a 20 pantallas', en: 'A site or module with 10 to 20 screens' }, time: w(3, 5) },
    l: { scope: { es: 'Una aplicación completa', en: 'A full application' }, time: w(6, 10) },
  },
  'brand-identity': {
    s: { scope: { es: 'Logotipo, paleta y tipografía', en: 'Logo, palette and typography' }, time: w(2, 3) },
    m: { scope: { es: 'Identidad con aplicaciones clave', en: 'Identity with key applications' }, time: w(3, 4) },
    l: { scope: { es: 'Identidad completa con manual de marca', en: 'Full identity with brand guidelines' }, time: w(4, 6) },
  },
  'social-content': {
    s: { scope: { es: '8 publicaciones al mes', en: '8 posts a month' }, time: MONTHLY },
    m: { scope: { es: '12 publicaciones al mes, con carruseles', en: '12 posts a month, with carousels' }, time: MONTHLY },
    l: { scope: { es: '20 publicaciones al mes, con posts animados', en: '20 posts a month, with animated posts' }, time: MONTHLY },
  },
  motion: {
    s: { scope: { es: 'Una pieza de hasta 15 segundos', en: 'One piece up to 15 seconds' }, time: w(1) },
    m: { scope: { es: 'Una pieza de hasta 30 segundos, en 9:16 y 4:5', en: 'One piece up to 30 seconds, in 9:16 and 4:5' }, time: w(1, 2) },
    l: { scope: { es: 'Un video de lanzamiento de hasta 60 segundos', en: 'A launch video up to 60 seconds' }, time: w(2, 3) },
  },
  'ui-motion': {
    s: { scope: { es: 'Microinteracciones de una pantalla o flujo', en: 'Micro-interactions for one screen or flow' }, time: w(1) },
    m: { scope: { es: 'Transiciones y estados de todo un sitio', en: 'Transitions and states across a whole site' }, time: w(2, 3) },
    l: { scope: { es: 'Sistema de movimiento para un producto completo', en: 'A motion system for a full product' }, time: w(3, 5) },
  },
}
