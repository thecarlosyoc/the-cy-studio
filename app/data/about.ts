// app/data/about.ts
export interface LocalizedText {
  es: string
  en: string
}

export interface AboutSectionData {
  label: LocalizedText
  heading?: LocalizedText
  paragraphs: LocalizedText[]
  ctaLabel?: LocalizedText
  ctaTo?: string
}

export const aboutSections: AboutSectionData[] = [
  {
    label: { es: 'Quién soy', en: 'Who I am' },
    paragraphs: [
      {
        es: 'Soy Carlos Yoc, diseñador UX/UI enfocado en producto digital, marca y desarrollo front-end desde hace 8 años.',
        en: "I'm Carlos Yoc, a UX/UI designer focused on digital product, branding, and front-end development for 8 years.",
      },
      {
        es: 'Desde el inicio me ha apasionado entender el oficio completo — no me quedé solo en la interfaz. Pasé por marketing digital, después por diseño de producto, y en el camino aprendí a implementar lo que diseño con código limpio y responsivo. Cada etapa me enseñó una parte del mismo problema.',
        en: "From the start I've been passionate about understanding the whole craft — I never stayed only in the interface. I went through digital marketing, then product design, and along the way learned to implement what I design with clean, responsive code. Each stage taught me a part of the same problem.",
      },
      {
        es: 'Soy de Guatemala y sigo trabajando desde acá. Hoy diseño experiencias digitales en Funtec, dentro de Fundación Génesis Empresarial, y en paralelo tomo proyectos freelance donde puedo construir sistemas de principio a fin.',
        en: "I'm from Guatemala and still work from here. Today I design digital experiences at Funtec, within Fundación Génesis Empresarial, and in parallel I take freelance projects where I can build systems end to end.",
      },
      {
        es: 'Ahora estoy construyendo mi propio portafolio — un espacio donde el sistema, la marca y el código conviven bajo un mismo criterio.',
        en: "Right now I'm building my own portfolio — a space where the system, the brand, and the code live under the same criteria.",
      },
    ],
  },
  {
    label: { es: 'Approach', en: 'Approach' },
    paragraphs: [
      {
        es: 'Empiezo con poco contexto a propósito. Primero miro el producto desde los ojos de quien lo va a usar, y después desde adentro — entendiendo el negocio, la audiencia, y el problema real detrás del brief.',
        en: "I start with little context on purpose. I first look at the product through the eyes of whoever will use it, then from the inside — understanding the business, the audience, and the real problem behind the brief.",
      },
      {
        es: 'Desde ahí ayudo a definir la dirección. No para que las cosas se vean mejor, sino para que funcionen mejor — y eso incluye pensar en cómo se van a construir, no solo en cómo se van a ver.',
        en: "From there I help define the direction. Not so things look better, but so they work better — and that includes thinking about how they'll be built, not just how they'll look.",
      },
      {
        es: 'Me gusta trabajar cerca de quien va a implementar la idea, porque muchas veces soy yo mismo. Mi rol no es solo ejecutar: es traer claridad, criterio, y elevar el resultado final.',
        en: "I like working close to whoever will implement the idea, because often that's me. My role isn't just to execute: it's to bring clarity, judgment, and elevate the final result.",
      },
    ],
  },
  {
    label: { es: 'Filosofía', en: 'Philosophy' },
    heading: { es: 'Diseño que respira.', en: 'Design that breathes.' },
    paragraphs: [
      {
        es: 'No sigo tendencias por seguirlas — las uso cuando tienen sentido para el problema que tengo enfrente. Mi objetivo siempre es crear algo con identidad propia, algo que se sostenga sin necesitar explicación.',
        en: "I don't follow trends for the sake of it — I use them when they make sense for the problem at hand. My goal is always to create something with its own identity, something that holds up without needing explanation.",
      },
      {
        es: 'Todo proyecto, sin importar el tamaño, merece el mismo nivel de cuidado: algo pensado, bien construido, hecho para durar en el tiempo — no solo en el primer render.',
        en: "Every project, no matter the size, deserves the same level of care: something thought through, well built, made to last — not just in the first render.",
      },
      {
        es: 'Diseño que respira. Cada elemento tiene una razón de estar ahí, y el sistema detrás existe para que esa razón no se pierda con el tiempo.',
        en: "Design that breathes. Every element has a reason to be there, and the system behind it exists so that reason doesn't get lost over time.",
      },
    ],
    ctaLabel: { es: 'Conoce mi trabajo', en: 'See my work' },
    ctaTo: '/work',
  },
]