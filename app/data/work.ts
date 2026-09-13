// app/data/work.ts
export interface LocalizedText {
  es: string
  en: string
}

export interface WorkItem {
  slug: string
  type: 'product' | 'brand'
  title: LocalizedText
  description: LocalizedText
  role: LocalizedText[]
  tools: string[]
  context: LocalizedText
  date: LocalizedText
  gallery: string[]
}

export const workItems: WorkItem[] = [
  {
    slug: 'proyecto-1',
    type: 'product',
    title: { es: 'Nombre Producto', en: 'Product Name' },
    description: {
      es: 'Descripción del producto, puede ir a dos lineas si es necesario.',
      en: 'Product description, can span two lines if needed.',
    },
    role: [
      { es: 'Product Designer', en: 'Product Designer' },
      { es: 'Branding', en: 'Branding' },
      { es: 'Webflow Developer', en: 'Webflow Developer' },
    ],
    tools: ['Figma', 'Clickup', 'Notion', 'Figjam'],
    context: { es: 'Contexto claro del proyecto.', en: 'Clear project context.' },
    date: { es: 'Febrero', en: 'February' },
    gallery: ['/images/placeholder-1.png', '/images/placeholder-1.png', '/images/placeholder-1.png'],
  },
  {
    slug: 'proyecto-2',
    type: 'product',
    title: { es: 'Nombre Producto', en: 'Product Name' },
    description: {
      es: 'Descripción del producto, puede ir a dos lineas si es necesario.',
      en: 'Product description, can span two lines if needed.',
    },
    role: [
      { es: 'Product Designer', en: 'Product Designer' },
      { es: 'Branding', en: 'Branding' },
      { es: 'Webflow Developer', en: 'Webflow Developer' },
    ],
    tools: ['Figma', 'Clickup', 'Notion', 'Figjam'],
    context: { es: 'Contexto claro del proyecto.', en: 'Clear project context.' },
    date: { es: 'Febrero', en: 'February' },
    gallery: ['/images/placeholder-1.png', '/images/placeholder-1.png', '/images/placeholder-1.png'],
  },
  {
    slug: 'proyecto-3',
    type: 'product',
    title: { es: 'Nombre Producto', en: 'Product Name' },
    description: {
      es: 'Descripción del producto, puede ir a dos lineas si es necesario.',
      en: 'Product description, can span two lines if needed.',
    },
    role: [
      { es: 'Product Designer', en: 'Product Designer' },
      { es: 'Branding', en: 'Branding' },
      { es: 'Webflow Developer', en: 'Webflow Developer' },
    ],
    tools: ['Figma', 'Clickup', 'Notion', 'Figjam'],
    context: { es: 'Contexto claro del proyecto.', en: 'Clear project context.' },
    date: { es: 'Febrero', en: 'February' },
    gallery: ['/images/placeholder-1.png', '/images/placeholder-1.png', '/images/placeholder-1.png'],
  },
  {
    slug: 'marca-1',
    type: 'brand',
    title: { es: 'Nombre Marca', en: 'Brand Name' },
    description: {
      es: 'Descripción de la marca, puede ir a dos lineas si es necesario.',
      en: 'Brand description, can span two lines if needed.',
    },
    role: [{ es: 'Brand Designer', en: 'Brand Designer' }],
    tools: ['Figma', 'Illustrator'],
    context: { es: 'Contexto claro del proyecto.', en: 'Clear project context.' },
    date: { es: 'Marzo', en: 'March' },
    gallery: ['/images/placeholder-1.png', '/images/placeholder-1.png', '/images/placeholder-1.png'],
  },
  {
    slug: 'marca-2',
    type: 'brand',
    title: { es: 'Nombre Marca', en: 'Brand Name' },
    description: {
      es: 'Descripción de la marca, puede ir a dos lineas si es necesario.',
      en: 'Brand description, can span two lines if needed.',
    },
    role: [{ es: 'Brand Designer', en: 'Brand Designer' }],
    tools: ['Figma', 'Illustrator'],
    context: { es: 'Contexto claro del proyecto.', en: 'Clear project context.' },
    date: { es: 'Marzo', en: 'March' },
    gallery: ['/images/placeholder-1.png', '/images/placeholder-1.png', '/images/placeholder-1.png'],
  },
]