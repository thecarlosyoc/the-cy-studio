// app/data/quote.ts
// Qué significa "pequeño / mediano / grande" en cada servicio del cotizador (/quote).
// Las horas de cada tamaño viven en server/utils/quotePricing.ts; si cambias el
// alcance aquí, revisa las horas allá. Las claves son los slugs de app/data/services.ts.
import type { LocalizedText } from '#shared/types/content'
import type { QuoteSize } from '#shared/types/quote'

export const QUOTE_SCOPES: Record<string, Record<QuoteSize, LocalizedText>> = {
  'product-design': {
    s: { es: 'Un flujo o MVP de hasta 10 pantallas', en: 'One flow or an MVP of up to 10 screens' },
    m: { es: 'Una app o plataforma de 10 a 25 pantallas', en: 'An app or platform with 10 to 25 screens' },
    l: { es: 'Un producto completo de más de 25 pantallas, con roles', en: 'A full product with 25+ screens and user roles' },
  },
  'design-system': {
    s: { es: 'Tokens y los componentes básicos', en: 'Tokens and the core components' },
    m: { es: 'Librería completa en Figma con variantes y documentación', en: 'Full Figma library with variants and docs' },
    l: { es: 'Librería completa, también en código', en: 'Full library, in code as well' },
  },
  'ux-audit': {
    s: { es: 'Un flujo clave (registro, compra, onboarding)', en: 'One key flow (sign-up, checkout, onboarding)' },
    m: { es: 'El producto principal, de 3 a 5 flujos', en: 'The core product, 3 to 5 flows' },
    l: { es: 'Todo el producto, con accesibilidad a fondo', en: 'The whole product, with an in-depth accessibility review' },
  },
  'landing-page': {
    s: { es: 'Página corta: oferta, beneficios y contacto', en: 'Short page: offer, benefits and contact' },
    m: { es: 'Página completa con testimonios, preguntas y formulario', en: 'Full page with testimonials, FAQ and a form' },
    l: { es: 'Página larga con animaciones y versión en inglés', en: 'Long page with animations and an English version' },
  },
  website: {
    s: { es: 'Hasta 5 páginas', en: 'Up to 5 pages' },
    m: { es: 'De 6 a 10 páginas, con blog o portafolio', en: '6 to 10 pages, with a blog or portfolio' },
    l: { es: 'Más de 10 páginas, en dos idiomas, con panel a medida', en: '10+ pages, in two languages, with a custom panel' },
  },
  frontend: {
    s: { es: 'Unas cuantas pantallas o una landing', en: 'A few screens or a landing page' },
    m: { es: 'Un sitio o módulo de 10 a 20 pantallas', en: 'A site or module with 10 to 20 screens' },
    l: { es: 'Una aplicación completa', en: 'A full application' },
  },
  'brand-identity': {
    s: { es: 'Logotipo, paleta y tipografía', en: 'Logo, palette and typography' },
    m: { es: 'Identidad con aplicaciones clave', en: 'Identity with key applications' },
    l: { es: 'Identidad completa con manual de marca', en: 'Full identity with brand guidelines' },
  },
  'social-content': {
    s: { es: '8 publicaciones al mes', en: '8 posts a month' },
    m: { es: '12 publicaciones al mes, con carruseles', en: '12 posts a month, with carousels' },
    l: { es: '20 publicaciones al mes, con posts animados', en: '20 posts a month, with animated posts' },
  },
  motion: {
    s: { es: 'Una pieza de hasta 15 segundos', en: 'One piece up to 15 seconds' },
    m: { es: 'Una pieza de hasta 30 segundos, en 9:16 y 4:5', en: 'One piece up to 30 seconds, in 9:16 and 4:5' },
    l: { es: 'Un video de lanzamiento de hasta 60 segundos', en: 'A launch video up to 60 seconds' },
  },
  'ui-motion': {
    s: { es: 'Microinteracciones de una pantalla o flujo', en: 'Micro-interactions for one screen or flow' },
    m: { es: 'Transiciones y estados de todo un sitio', en: 'Transitions and states across a whole site' },
    l: { es: 'Sistema de movimiento para un producto completo', en: 'A motion system for a full product' },
  },
}
