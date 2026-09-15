<!-- app/components/work/GalleryGrid.vue -->
<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { GalleryImage } from '#shared/types/content'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const props = defineProps<{
  images: GalleryImage[]
  // Fuerza el layout de 2 columnas (mobile) sin importar el viewport real del
  // navegador — para previsualizarlo, p. ej., desde el panel de admin.
  mobilePreview?: boolean
}>()

const ROW_HEIGHT = 10 // px, unidad base de fila
const GAP = 16 // px, debe coincidir con el gap-4 de Tailwind

const SIZES_BY_SPAN: Record<number, string> = {
  1: 'sm:50vw md:33vw lg:33vw 2xl:33vw',
  2: 'sm:100vw md:66vw lg:66vw 2xl:66vw',
  3: 'sm:100vw md:100vw lg:100vw 2xl:100vw',
}

// col-span-{1,2,3}: Tailwind classes literales para que el JIT las detecte.
// El grid de mobile solo tiene 2 columnas (grid-cols-2), así que una imagen
// de 3 columnas se clampea explícitamente a col-span-2 ahí; el navegador NO
// hace este clamp solo porque el grid tenga menos columnas explícitas.
// En mobilePreview no podemos depender del prefijo `md:` (el navegador puede
// seguir siendo desktop-width), así que ahí se clampea siempre a mano.
function colSpanClass(colSpan: number): string {
  if (props.mobilePreview) return colSpan === 1 ? '' : 'col-span-2'
  if (colSpan === 3) return 'col-span-2 md:col-span-3'
  if (colSpan === 2) return 'col-span-2'
  return ''
}

// Guardamos las celdas por índice en lugar de leer `event.target`:
// <NuxtImg> emite `load` como evento de componente y, cuando la imagen ya
// está completa al hidratar, lo hace con un `new Event('load')` sintético
// cuyo `target` es null. Medimos siempre el <img> real dentro de la celda.
const cells = ref<(HTMLElement | null)[]>([])

// El optimizador de imágenes (ipx) a veces se queda colgado en el primer
// acceso — cold start de la función serverless u origen de Supabase Storage
// lento — sin disparar `error` (solo tarda mucho, o nunca resuelve). Por eso
// el reintento no depende solo de `@error`: si una imagen no cargó dentro de
// TIMEOUT_MS también se reintenta sola, sin que el usuario tenga que recargar.
const MAX_RETRIES = 2
const TIMEOUT_MS = 6000
const loaded = ref<boolean[]>([])
const retryCount = ref<number[]>([])
const timeoutHandles: ReturnType<typeof setTimeout>[] = []

function srcFor(i: number, url: string): string {
  const n = retryCount.value[i]
  return n ? `${url}?retry=${n}` : url
}

function armTimeout(i: number) {
  clearTimeout(timeoutHandles[i])
  timeoutHandles[i] = setTimeout(() => retry(i), TIMEOUT_MS)
}

function retry(i: number) {
  if (loaded.value[i]) return
  const n = retryCount.value[i] ?? 0
  if (n >= MAX_RETRIES) return
  retryCount.value[i] = n + 1
  armTimeout(i)
}

function setCell(el: Element | ComponentPublicInstance | null, i: number) {
  cells.value[i] = el as HTMLElement | null
  if (el && !loaded.value[i]) armTimeout(i)
}

function onImageError(i: number) {
  retry(i)
}

// La altura deseada se calcula del ancho actual de la celda por la relación de
// aspecto natural de la imagen — no de `img.getBoundingClientRect().height` —
// porque la imagen se rellena de forma absoluta dentro de la celda (ver
// template) y por lo tanto ya no tiene una altura propia que medir: leerla
// habría sido circular (la altura de la celda dependería de la altura de la
// imagen, que a su vez depende de la altura de la celda).
function measureSpan(i: number) {
  const cell = cells.value[i]
  if (!cell) return

  const img = cell.querySelector('img')
  if (!img?.naturalWidth || !img.naturalHeight) return

  const cellWidth = cell.getBoundingClientRect().width
  if (!cellWidth) return

  const targetHeight = cellWidth * (img.naturalHeight / img.naturalWidth)
  const span = Math.round((targetHeight + GAP) / (ROW_HEIGHT + GAP))
  cell.style.gridRowEnd = `span ${span}`
}

function onImageLoad(i: number) {
  loaded.value[i] = true
  clearTimeout(timeoutHandles[i])
  measureSpan(i)
  ScrollTrigger.refresh()
}

onBeforeUnmount(() => {
  for (const handle of timeoutHandles) clearTimeout(handle)
})

// Al alternar mobilePreview, el ancho de cada celda cambia (2 vs 3 columnas)
// y con él la altura renderizada de las imágenes ya cargadas — hay que
// remedir todo después de que el navegador aplique las nuevas clases.
watch(
  () => props.mobilePreview,
  async () => {
    await nextTick()
    for (let i = 0; i < props.images.length; i++) measureSpan(i)
    ScrollTrigger.refresh()
  },
)
</script>

<template>
  <div :class="mobilePreview ? 'max-w-[390px] mx-auto' : ''">
    <div
      class="grid grid-cols-2 gap-4"
      :class="mobilePreview ? '' : 'md:grid-cols-3'"
      style="grid-auto-flow: dense;"
      :style="{ gridAutoRows: `${ROW_HEIGHT}px` }"
    >
      <div
        v-for="(img, i) in images"
        :key="i"
        :ref="(el) => setCell(el, i)"
        :class="['relative overflow-hidden rounded-2xl md:rounded-3xl', colSpanClass(img.colSpan)]"
      >
        <div
          class="absolute inset-0 bg-ink/5 transition-opacity duration-300 pointer-events-none"
          :class="loaded[i] ? 'opacity-0' : 'opacity-100'"
        />
        <CoreReveal>
          <NuxtImg
            :src="srcFor(i, img.url)"
            :alt="`Imagen del proyecto ${i + 1}`"
            :sizes="SIZES_BY_SPAN[img.colSpan]"
            format="webp"
            loading="lazy"
            class="absolute inset-0 w-full h-full object-cover"
            @load="onImageLoad(i)"
            @error="onImageError(i)"
          />
        </CoreReveal>
      </div>
    </div>
  </div>
</template>
