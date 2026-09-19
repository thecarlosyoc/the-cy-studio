// Slots de foto administrables (clave estable, nunca posicional) y su encuadre.
// El encuadre real vive en main.css como `--pos-*` y manda sobre el recorte de la imagen subida.
export const PHOTO_KEYS = ['about', 'home', 'hero'] as const
export type PhotoKey = (typeof PHOTO_KEYS)[number]

export const PHOTO_SLOTS: Record<PhotoKey, { label: string; hint: string; altKey?: string }> = {
  hero: {
    label: 'Inicio — retrato del hero',
    hint: 'Retrato a sangre, es el LCP de la inicio. Horizontal, mínimo 2400 × 1600 px. Deja aire sobre la cabeza y el tercio inferior sin detalle: ahí va el nombre.',
    altKey: 'heroPortraitAlt',
  },
  home: {
    label: 'Inicio — sección Sobre mí',
    hint: 'Foto de la mitad izquierda de la sección. Vertical, mínimo 1200 × 1500 px. Sujeto descentrado a la izquierda: el corte de la mitad debe caer sobre el fondo, no sobre el hombro.',
    altKey: 'homeAboutAlt',
  },
  about: {
    label: 'Sobre mí — retrato de /about',
    hint: 'Foto ancha a pantalla completa. Horizontal 3:2, mínimo 2400 × 1600 px.',
  },
}
