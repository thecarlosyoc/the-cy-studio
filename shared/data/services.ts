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
      es: 'Diseño la UX/UI de tu app o plataforma completa: cómo la usa la gente y cómo se ve cada pantalla.',
      en: 'I design the UX/UI of your whole app or platform: how people use it and how every screen looks.',
    },
    deliverables: [
      { es: 'Mapa de pantallas y recorridos', en: 'Map of screens and user flows' },
      { es: 'Cada pantalla diseñada en Figma, también las de error, sin datos y de carga', en: 'Every screen designed in Figma, including error, no-data and loading screens' },
      { es: 'Prototipo interactivo para probar la app antes de programarla', en: "Clickable prototype to test the app before it's coded" },
      { es: 'Archivos listos para quien programa', en: 'Files ready for developers' },
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
      es: 'Defino las reglas de color, tipografía y componentes para que cada pantalla nueva encaje con las demás.',
      en: 'I set the rules for color, typography and components so every new screen fits with the rest.',
    },
    deliverables: [
      { es: 'Variables de color, tipografía y espaciado (design tokens)', en: 'Color, typography and spacing variables (design tokens)' },
      { es: 'Biblioteca de componentes en Figma, con sus variantes', en: 'Figma component library with variants' },
      { es: 'Guía de cuándo y cómo usar cada componente', en: 'Guide on when and how to use each component' },
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
      { es: 'Revisión de recorridos y facilidad de uso', en: 'Review of user flows and ease of use' },
      { es: 'Revisión de accesibilidad (contraste, tamaño de texto, uso con teclado)', en: 'Accessibility review (contrast, text size, keyboard navigation)' },
      { es: 'Informe priorizado con capturas', en: 'Prioritized report with screenshots' },
      { es: 'Reunión para repasar el informe contigo', en: 'Meeting to walk you through the report' },
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
      { es: 'Estructura y textos pensados para vender', en: 'Structure and text written to sell' },
      { es: 'Diseño para celular y computadora', en: 'Designed for phone and desktop' },
      { es: 'Programada a medida para que cargue rápido', en: 'Custom-coded to load fast' },
      { es: 'Botón de WhatsApp y medición de visitas listos', en: 'WhatsApp button and visitor tracking set up' },
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
      es: 'Diseño tu página web y la programo a medida, en español e inglés, con un panel para que la actualices tú.',
      en: 'I design your website and custom-code it, in Spanish and English, with a panel so you can update it yourself.',
    },
    deliverables: [
      { es: 'Diseño para celular y computadora', en: 'Designed for phone and desktop' },
      { es: 'Programado a medida, sin plantillas ni plugins', en: 'Custom-coded, no templates or plugins' },
      { es: 'Panel para cambiar textos y fotos tú mismo', en: 'Admin panel to change text and photos yourself' },
      { es: 'SEO básico para aparecer en Google, medición de visitas y publicación', en: 'Basic SEO for Google, visitor tracking and launch' },
    ],
    timeline: { es: '3 a 6 semanas', en: '3 to 6 weeks' },
    idealFor: {
      es: 'Marcas, estudios y profesionales que quieren un sitio propio, no una plantilla.',
      en: 'Brands, studios and professionals who need a site of their own, not a template.',
    },
  },
  {
    slug: 'frontend',
    pillar: 'web',
    title: { es: 'Implementación front-end', en: 'Front-end implementation' },
    summary: {
      es: 'Paso tu diseño a código, idéntico a como se aprobó, con componentes reutilizables.',
      en: 'I turn your design into code, exactly as it was approved, with reusable components.',
    },
    deliverables: [
      { es: 'Componentes reutilizables en código', en: 'Reusable components in code' },
      { es: 'Interfaz que se adapta a cada pantalla, con sus interacciones', en: 'Layout that adapts to every screen size, with all its interactions' },
      { es: 'Accesibilidad revisada (contraste, tamaño de texto, uso con teclado)', en: 'Accessibility checked (contrast, text size, keyboard navigation)' },
      { es: 'Revisión visual contra el diseño, pantalla por pantalla', en: 'Visual check against the design, screen by screen' },
    ],
    timeline: { es: 'Según el alcance', en: 'Depends on scope' },
    idealFor: {
      es: 'Equipos con el diseño listo y sin nadie de front-end que lo pase a código.',
      en: 'Teams with the design ready and no front-end developer to code it.',
    },
  },
  {
    slug: 'brand-identity',
    pillar: 'brand',
    title: { es: 'Identidad de marca', en: 'Brand identity' },
    summary: {
      es: 'Diseño tu logotipo, defino cómo se ve tu marca y dejo las reglas escritas para que se use igual en todas partes.',
      en: 'I design your logo, define how your brand looks and write down the rules so it’s used the same way everywhere.',
    },
    deliverables: [
      { es: 'Logotipo y sus variantes', en: 'Logo and its variations' },
      { es: 'Paleta de color y tipografía', en: 'Color palette and typography' },
      { es: 'Tu marca aplicada en redes y papelería', en: 'Your brand applied to social media and stationery' },
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
      es: 'Diseño tus publicaciones de cada mes sobre plantillas de tu marca, para que se reconozca en cada una.',
      en: 'I design your monthly posts on templates made for your brand, so every post is recognizably yours.',
    },
    deliverables: [
      { es: 'Plantillas en Figma para tu marca', en: 'Figma templates for your brand' },
      { es: 'Publicaciones estáticas y carruseles', en: 'Static posts and carousels' },
      { es: 'Publicaciones animadas', en: 'Animated posts' },
      { es: 'Cantidad fija de publicaciones al mes', en: 'Fixed number of posts per month' },
    ],
    timeline: { es: 'Servicio mensual', en: 'Monthly service' },
    idealFor: {
      es: 'Marcas que publican cada semana y quieren verse consistentes.',
      en: 'Brands that post every week and want to look consistent.',
    },
  },
  {
    slug: 'motion',
    pillar: 'motion',
    title: { es: 'Videos animados', en: 'Animated videos' },
    summary: {
      es: 'Motion graphics: videos cortos para lanzar un producto o una campaña, en los formatos de cada red.',
      en: 'Motion graphics: short videos to launch a product or a campaign, sized for each social platform.',
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
      en: 'Product launches and campaigns that need to grab attention in seconds.',
    },
  },
  {
    slug: 'ui-motion',
    pillar: 'motion',
    title: { es: 'Animación para apps y sitios web', en: 'Motion for apps and websites' },
    summary: {
      es: 'Animo tu sitio web o app para guiar a la gente al cambiar de pantalla, al tocar y al cargar.',
      en: 'I animate your website or app to guide people as screens change, when they tap and while things load.',
    },
    deliverables: [
      { es: 'Lista de qué se mueve en cada pantalla y por qué', en: 'List of what moves on each screen, and why' },
      { es: 'Prototipo para ver el movimiento antes de programarlo', en: "Prototype to see the motion before it's coded" },
      { es: 'El movimiento programado en tu sitio web o app', en: 'The motion coded into your website or app' },
      { es: 'Versión con menos movimiento para quien lo prefiera', en: 'Version with less motion for people who prefer it' },
    ],
    timeline: { es: '1 a 3 semanas', en: '1 to 3 weeks' },
    idealFor: {
      es: 'Sitios web y productos que funcionan, pero se sienten rígidos.',
      en: 'Websites and products that work but feel stiff.',
    },
  },
]
