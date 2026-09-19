// app/data/copyGroups.ts
// Textos del sitio editables desde el admin, agrupados por bloque del inicio.
// El resto del diccionario (hero, carruseles, conector, contacto…) sigue fijo en i18n.ts.
import type { DictKey } from './i18n'

interface CopyField {
  key: DictKey
  label: string
  multiline?: boolean
}

export interface CopyGroup {
  id: string
  label: string
  description?: string
  fields: CopyField[]
}

const numbered = (prefix: string, count: number, noun: string): CopyField[] =>
  Array.from({ length: count }, (_, i) => i + 1).flatMap((n) => [
    { key: `${prefix}${n}Title` as DictKey, label: `${noun} ${n}: título` },
    { key: `${prefix}${n}Text` as DictKey, label: `${noun} ${n}: texto`, multiline: true },
  ])

export const COPY_GROUPS: CopyGroup[] = [
  { id: 'positioning', label: 'Posicionamiento', fields: [{ key: 'homeDedico', label: 'Frase principal', multiline: true }] },
  {
    id: 'seo',
    label: 'Descripción del enlace',
    description:
      'Es la frase que se ve debajo del nombre de tu sitio en Google y en la vista previa al compartir el link por WhatsApp, LinkedIn o redes. No aparece dentro de la página. Mejor si es breve, de una o dos frases.',
    fields: [{ key: 'homeSeoDescription', label: 'Texto en Google y al compartir el link', multiline: true }],
  },
  {
    id: 'capabilities',
    label: 'Qué hago',
    fields: [
      { key: 'homeCapTitle', label: 'Título de la sección' },
      { key: 'homeCapDesignTitle', label: 'Diseño: título' },
      { key: 'homeCapDesignText', label: 'Diseño: texto', multiline: true },
      { key: 'homeCapBuildTitle', label: 'Implementación: título' },
      { key: 'homeCapBuildText', label: 'Implementación: texto', multiline: true },
    ],
  },
  {
    id: 'process',
    label: 'Cómo trabajo',
    fields: [{ key: 'homeProcessTitle', label: 'Título de la sección' }, ...numbered('homeProcess', 4, 'Paso')],
  },
  {
    id: 'about',
    label: 'Sobre mí (inicio)',
    fields: [
      { key: 'homeAboutText', label: 'Texto', multiline: true },
      { key: 'homeAboutCta', label: 'Texto del botón' },
    ],
  },
  {
    id: 'cta',
    label: 'Cierre: hablemos (banda del inicio, Sobre mí y proyectos)',
    fields: [
      { key: 'ctaTitle', label: 'Título' },
      { key: 'ctaText', label: 'Texto', multiline: true },
    ],
  },
]

export const EDITABLE_COPY_KEYS: string[] = COPY_GROUPS.flatMap((g) => g.fields.map((f) => f.key))
