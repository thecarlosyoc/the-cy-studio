// shared/data/services.ts
// Catálogo de servicios del studio. Fuente única para /services, /services.json, las piezas
// de redes (catálogo sin precio) y, más adelante, para el cotizador: este enlaza
// cada precio por `slug`, así que no cambies un slug ya publicado.
// El orden del arreglo define el número de cada servicio (01, 02…) en la web y en redes.
import type { Service } from '#shared/types/content'

export const SERVICES: Service[] = [
  {
    slug: 'product-design',
    pillar: 'product',
    title: { es: 'Diseño de producto digital', en: 'Digital product design' },
    summary: {
      es: 'Diseño tu app o plataforma web completa: desde el flujo hasta cada pantalla y sus estados.',
      en: 'I design your full app or web platform: from the flow down to every screen and its states.',
    },
    deliverables: [
      { es: 'Flujos de usuario y arquitectura de la información', en: 'User flows and information architecture' },
      { es: 'Interfaz en Figma con todos los estados', en: 'Figma interface with every state' },
      { es: 'Prototipo navegable para validar', en: 'Clickable prototype for validation' },
      { es: 'Entrega lista para desarrollo', en: 'Developer-ready handoff' },
    ],
    timeline: { es: '4 a 8 semanas', en: '4 to 8 weeks' },
    idealFor: {
      es: 'Equipos que lanzan un producto nuevo o rediseñan uno que ya usan sus clientes.',
      en: 'Teams launching a new product or redesigning one their customers already use.',
    },
  },
  {
    slug: 'design-system',
    pillar: 'product',
    title: { es: 'Sistema de diseño', en: 'Design system' },
    summary: {
      es: 'Ordeno las reglas de color, tipografía, espacio y componentes para que tu producto crezca sin perder coherencia.',
      en: 'I set the rules for color, type, spacing and components so your product grows without losing coherence.',
    },
    deliverables: [
      { es: 'Design tokens (color, tipografía, espacio)', en: 'Design tokens (color, type, spacing)' },
      { es: 'Librería de componentes en Figma con variantes', en: 'Figma component library with variants' },
      { es: 'Documentación de uso y estados', en: 'Usage and state documentation' },
      { es: 'Opcional: los mismos componentes en código', en: 'Optional: the same components in code' },
    ],
    timeline: { es: '3 a 6 semanas', en: '3 to 6 weeks' },
    idealFor: {
      es: 'Productos que crecieron rápido y hoy tienen pantallas que no se parecen entre sí.',
      en: 'Products that grew fast and now have screens that no longer match.',
    },
  },
  {
    slug: 'ux-audit',
    pillar: 'product',
    title: { es: 'Auditoría UX/UI', en: 'UX/UI audit' },
    summary: {
      es: 'Reviso tu producto y te entrego qué falla, por qué y en qué orden arreglarlo.',
      en: "I review your product and tell you what's failing, why, and in what order to fix it.",
    },
    deliverables: [
      { es: 'Revisión de flujos y usabilidad', en: 'Flow and usability review' },
      { es: 'Revisión de accesibilidad', en: 'Accessibility review' },
      { es: 'Informe priorizado con capturas', en: 'Prioritized report with screenshots' },
      { es: 'Sesión para revisar los hallazgos', en: 'Walkthrough session of the findings' },
    ],
    timeline: { es: '1 a 2 semanas', en: '1 to 2 weeks' },
    idealFor: {
      es: 'Productos en uso donde la gente se pierde, abandona o se queja.',
      en: 'Live products where people get lost, drop off or complain.',
    },
  },
  {
    slug: 'landing-page',
    pillar: 'web',
    title: { es: 'Landing page de venta', en: 'Sales landing page' },
    summary: {
      es: 'Una sola página con un solo objetivo: que te escriban o te compren.',
      en: 'One page with one goal: getting people to message you or buy.',
    },
    deliverables: [
      { es: 'Estructura y textos pensados para vender', en: 'Structure and copy built to sell' },
      { es: 'Diseño responsivo para móvil y desktop', en: 'Responsive design for mobile and desktop' },
      { es: 'Desarrollo en código, carga rápida', en: 'Hand-built code that loads fast' },
      { es: 'Botón a WhatsApp y analítica conectados', en: 'WhatsApp button and analytics connected' },
    ],
    timeline: { es: '1 a 2 semanas', en: '1 to 2 weeks' },
    idealFor: {
      es: 'Lanzamientos, campañas con pauta y servicios que se venden por WhatsApp.',
      en: 'Launches, paid campaigns and services sold over WhatsApp.',
    },
  },
  {
    slug: 'website',
    pillar: 'web',
    title: { es: 'Sitio web a medida', en: 'Custom website' },
    summary: {
      es: 'Diseño y programo tu sitio, en español e inglés, con un panel para que lo actualices tú.',
      en: 'I design and build your site, in Spanish and English, with a panel so you can update it yourself.',
    },
    deliverables: [
      { es: 'Diseño responsivo para móvil y desktop', en: 'Responsive design for mobile and desktop' },
      { es: 'Desarrollo en código, sin plantillas ni plugins', en: 'Hand-built code, no templates or plugins' },
      { es: 'Panel para editar contenido', en: 'Content editing panel' },
      { es: 'SEO base, analítica y publicación', en: 'Base SEO, analytics and launch' },
    ],
    timeline: { es: '3 a 6 semanas', en: '3 to 6 weeks' },
    idealFor: {
      es: 'Marcas, estudios y profesionales que necesitan un sitio propio que no dependa de una plantilla.',
      en: 'Brands, studios and professionals who need a site of their own, not a template.',
    },
  },
  {
    slug: 'frontend',
    pillar: 'web',
    title: { es: 'Implementación front-end', en: 'Front-end implementation' },
    summary: {
      es: 'Llevo un diseño existente a producción, tal como se diseñó, con componentes reutilizables.',
      en: 'I take an existing design to production, exactly as designed, with reusable components.',
    },
    deliverables: [
      { es: 'Componentes reutilizables en código', en: 'Reusable components in code' },
      { es: 'Interfaz responsiva e interacciones', en: 'Responsive interface and interactions' },
      { es: 'Accesibilidad revisada (contraste, teclado)', en: 'Accessibility checked (contrast, keyboard)' },
      { es: 'QA visual contra el diseño', en: 'Visual QA against the design' },
    ],
    timeline: { es: 'Según el alcance', en: 'Depends on scope' },
    idealFor: {
      es: 'Equipos con el diseño listo y sin alguien de front-end que lo cuide hasta el final.',
      en: 'Teams with the design ready and no front-end person to see it through.',
    },
  },
  {
    slug: 'brand-identity',
    pillar: 'brand',
    title: { es: 'Identidad de marca', en: 'Brand identity' },
    summary: {
      es: 'Defino cómo se ve tu marca y dejo las reglas escritas para que se use igual en todas partes.',
      en: 'I define how your brand looks and write down the rules so it’s used the same way everywhere.',
    },
    deliverables: [
      { es: 'Logotipo y sus variantes', en: 'Logo and its variants' },
      { es: 'Paleta de color y tipografía', en: 'Color palette and typography' },
      { es: 'Aplicaciones clave (redes, papelería)', en: 'Key applications (social, stationery)' },
      { es: 'Manual de marca', en: 'Brand guidelines' },
    ],
    timeline: { es: '3 a 5 semanas', en: '3 to 5 weeks' },
    idealFor: {
      es: 'Negocios que empiezan, o que crecieron más rápido que su marca.',
      en: 'Businesses that are starting out, or that outgrew their brand.',
    },
  },
  {
    slug: 'social-content',
    pillar: 'brand',
    title: { es: 'Contenido para redes', en: 'Social media content' },
    summary: {
      es: 'Diseño tus publicaciones del mes con un sistema de plantillas, para que tu marca se vea igual en cada post.',
      en: 'I design your monthly posts on a template system, so your brand looks consistent in every post.',
    },
    deliverables: [
      { es: 'Plantillas en Figma para tu marca', en: 'Figma templates for your brand' },
      { es: 'Posts estáticos y carruseles', en: 'Static posts and carousels' },
      { es: 'Posts animados', en: 'Animated posts' },
      { es: 'Cantidad de piezas fija por mes', en: 'Fixed number of pieces per month' },
    ],
    timeline: { es: 'Mensual', en: 'Monthly' },
    idealFor: {
      es: 'Marcas que publican cada semana y quieren verse consistentes.',
      en: 'Brands that post every week and want to look consistent.',
    },
  },
  {
    slug: 'motion',
    pillar: 'motion',
    title: { es: 'Piezas de motion', en: 'Motion pieces' },
    summary: {
      es: 'Animo videos cortos para lanzar un producto o una campaña, en los formatos de cada red.',
      en: 'I animate short videos to launch a product or a campaign, in each platform’s formats.',
    },
    deliverables: [
      { es: 'Guion y storyboard', en: 'Script and storyboard' },
      { es: 'Video de lanzamiento', en: 'Launch video' },
      { es: 'Versiones para reels (9:16) y feed (4:5)', en: 'Reel (9:16) and feed (4:5) versions' },
      { es: 'Portadas animadas', en: 'Animated covers' },
    ],
    timeline: { es: '1 a 3 semanas por pieza', en: '1 to 3 weeks per piece' },
    idealFor: {
      es: 'Lanzamientos de producto y campañas que necesitan llamar la atención en segundos.',
      en: 'Product launches and campaigns that need to catch attention in seconds.',
    },
  },
  {
    slug: 'ui-motion',
    pillar: 'motion',
    title: { es: 'Motion para interfaces', en: 'Interface motion' },
    summary: {
      es: 'Agrego movimiento a tu web o app para guiar a la gente: transiciones, respuestas al tocar y estados de carga.',
      en: 'I add motion to your website or app to guide people: transitions, tap feedback and loading states.',
    },
    deliverables: [
      { es: 'Mapa de interacciones por pantalla', en: 'Interaction map per screen' },
      { es: 'Prototipo de movimiento', en: 'Motion prototype' },
      { es: 'Implementación en código', en: 'Implementation in code' },
      { es: 'Versión sin movimiento para quien la prefiera', en: 'Reduced-motion version for those who prefer it' },
    ],
    timeline: { es: '1 a 3 semanas', en: '1 to 3 weeks' },
    idealFor: {
      es: 'Sitios y productos que funcionan, pero se sienten rígidos.',
      en: 'Sites and products that work but feel stiff.',
    },
  },
]
