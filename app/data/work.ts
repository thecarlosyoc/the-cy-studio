export interface WorkItem {
  slug: string
  type: 'product' | 'brand'
  title: string
  description: string
  cardImage: string
  role: string[]
  tools: string[]
  context: string
  date: string
  gallery: string[]
}

export const workItems: WorkItem[] = [
  {
    slug: 'proyecto-1',
    type: 'product',
    title: 'Nombre Producto',
    description: 'Descripción del producto, puede ir a dos lineas si es necesario.',
    cardImage: '/images/placeholder-1.png',
    role: ['Product Designer', 'Branding', 'Webflow Developer'],
    tools: ['Figma', 'Clickup', 'Notion', 'Figjam'],
    context: 'Contexto claro del proyecto.',
    date: 'Febrero',
    gallery: ['/images/placeholder-1.png', '/images/placeholder-1.png', '/images/placeholder-1.png'],
  },
  {
    slug: 'proyecto-2',
    type: 'product',
    title: 'Nombre Producto',
    description: 'Descripción del producto, puede ir a dos lineas si es necesario.',
    cardImage: '/images/placeholder-1.png',
    role: ['Product Designer', 'Branding', 'Webflow Developer'],
    tools: ['Figma', 'Clickup', 'Notion', 'Figjam'],
    context: 'Contexto claro del proyecto.',
    date: 'Febrero',
    gallery: ['/images/placeholder-1.png', '/images/placeholder-1.png', '/images/placeholder-1.png'],
  },
  {
    slug: 'proyecto-3',
    type: 'product',
    title: 'Nombre Producto',
    description: 'Descripción del producto, puede ir a dos lineas si es necesario.',
    cardImage: '/images/placeholder-1.png',
    role: ['Product Designer', 'Branding', 'Webflow Developer'],
    tools: ['Figma', 'Clickup', 'Notion', 'Figjam'],
    context: 'Contexto claro del proyecto.',
    date: 'Febrero',
    gallery: ['/images/placeholder-1.png', '/images/placeholder-1.png', '/images/placeholder-1.png'],
  },
  {
    slug: 'marca-1',
    type: 'brand',
    title: 'Nombre Marca',
    description: 'Descripción de la marca, puede ir a dos lineas si es necesario.',
    cardImage: '/images/placeholder-1.png',
    role: ['Brand Designer'],
    tools: ['Figma', 'Illustrator'],
    context: 'Contexto claro del proyecto.',
    date: 'Marzo',
    gallery: ['/images/placeholder-1.png', '/images/placeholder-1.png', '/images/placeholder-1.png'],
  },
  {
    slug: 'marca-2',
    type: 'brand',
    title: 'Nombre Marca',
    description: 'Descripción de la marca, puede ir a dos lineas si es necesario.',
    cardImage: '/images/placeholder-1.png',
    role: ['Brand Designer'],
    tools: ['Figma', 'Illustrator'],
    context: 'Contexto claro del proyecto.',
    date: 'Marzo',
    gallery: ['/images/placeholder-1.png', '/images/placeholder-1.png', '/images/placeholder-1.png'],
  },
]