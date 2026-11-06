// app/data/muebleros-images.ts
// Única fuente de rutas de imagen de /muebleros. Cambiar a fotos reales = reemplazar el JPEG
// con el mismo nombre de slot y, si hace falta, ajustar width/height/focus/alt aquí.
// Las proporciones de recorte (4:3, 1:1) viven en los componentes.
export type LocalizedText = { es: string; en: string }
export type MbSlot = 'hero-sala' | 'p-sala' | 'p-comedor' | 'p-ropero' | 'p-cama' | 'p-recamara' | 'p-mesa' | 'taller'
type Entry = { src: string; width: number; height: number; alt: LocalizedText; focus: string }

const e = (slot: MbSlot, es: string, en: string, focus = '50% 50%'): Entry => ({
  src: `/images/muebleros/${slot}.jpg`, width: 1024, height: 1024, alt: { es, en }, focus,
})

export const mbImages: Record<MbSlot, Entry> = {
  'hero-sala': e('hero-sala', 'Sala de pino y cedro en una sala de exhibición', 'Pine and cedar living room set in a showroom', '50% 78%'),
  'p-sala': e('p-sala', 'Sala de 3 piezas en pino', 'Three-piece pine sofa set'),
  'p-comedor': e('p-comedor', 'Comedor de cedro con seis sillas', 'Cedar dining set with six chairs'),
  'p-ropero': e('p-ropero', 'Ropero de pino de cuatro puertas', 'Four-door pine wardrobe'),
  'p-cama': e('p-cama', 'Cama matrimonial de cedro', 'Double cedar bed'),
  'p-recamara': e('p-recamara', 'Juego de recámara en pino', 'Pine bedroom set'),
  'p-mesa': e('p-mesa', 'Mesa redonda de cedro', 'Round cedar table'),
  'taller': e('taller', 'Banco de carpintero con una pata de silla de cedro', "Carpenter's bench with a cedar chair leg"),
}
