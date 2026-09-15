<!-- app/components/work/GalleryGrid.vue -->
<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import type { GalleryImage, GalleryVisual } from '#shared/types/content'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const props = defineProps<{
  images: GalleryImage[]
  // Hasta MAX_GALLERY_VISUALS visuales; cada uno lleva su propia `position`
  // (cuántas imágenes van antes en el mosaico, 0 = primera celda).
  visuals?: GalleryVisual[]
  // Fuerza el layout de 2 columnas (mobile) sin importar el viewport real del
  // navegador — para previsualizarlo, p. ej., desde el panel de admin.
  mobilePreview?: boolean
}>()

// El mosaico intercala los visuales con las imágenes según visual.position
// (cuántas imágenes van antes; 0 = primera celda). Las imágenes mantienen su
// índice original en `props.images`: los arrays loaded/retryCount/cells
// siguen claves por ese índice, no por posición en la lista renderizada.
// Los visuales llevan su índice en `props.visuals` (`index`) para enganchar
// refs/estado/eventos por visual.
type GridCell =
  | { kind: 'visual'; key: string; colSpan: number; visual: GalleryVisual; index: number }
  | { kind: 'image'; key: string; colSpan: number; index: number; url: string }

const cellsList = computed<GridCell[]>(() => {
  const cells: GridCell[] = props.images.map((img, index) => ({
    kind: 'image',
    key: `image-${index}`,
    colSpan: img.colSpan,
    index,
    url: img.url,
  }))
  if (props.visuals?.length) {
    // Orden estable por position ascendente: los empates conservan el orden en
    // el arreglo. Insertar de izquierda a derecha hace que un visual anterior
    // desplace las imágenes +1, así que el índice se compensa con los ya
    // insertados; `Math.min` evita desbordar cuando hay pocas imágenes.
    const ordered = props.visuals
      .map((v, i) => ({ v, i }))
      .sort((a, b) => (a.v.position ?? 0) - (b.v.position ?? 0) || a.i - b.i)
    let inserted = 0
    for (const { v, i } of ordered) {
      const idx = Math.min((v.position ?? 0) + inserted, cells.length)
      cells.splice(idx, 0, {
        kind: 'visual',
        key: `visual-${i}`,
        colSpan: v.colSpan,
        visual: v,
        index: i,
      })
      inserted++
    }
  }
  return cells
})

const ROW_HEIGHT = 10 // px, unidad base de fila
const GAP = 16 // px, debe coincidir con el gap-4 de Tailwind

const SIZES_BY_SPAN: Record<number, string> = {
  1: 'sm:50vw md:33vw lg:33vw 2xl:33vw',
  2: 'sm:100vw md:66vw lg:66vw 2xl:66vw',
  3: 'sm:100vw md:100vw lg:100vw 2xl:100vw',
}

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
// aspecto natural del medio — no de `getBoundingClientRect().height` — porque
// la imagen/video se rellena de forma absoluta dentro de la celda (ver
// template) y por lo tanto ya no tiene una altura propia que medir: leerla
// habría sido circular (la altura de la celda dependería de la altura del
// medio, que a su vez depende de la altura de la celda).
function measure(cell: HTMLElement, width: number, height: number) {
  const cellWidth = cell.getBoundingClientRect().width
  if (!cellWidth || !width || !height) return
  const targetHeight = cellWidth * (height / width)
  const span = Math.round((targetHeight + GAP) / (ROW_HEIGHT + GAP))
  cell.style.gridRowEnd = `span ${span}`
}

function measureImage(i: number) {
  const cell = cells.value[i]
  if (!cell) return
  const img = cell.querySelector('img')
  if (!img?.naturalWidth || !img.naturalHeight) return
  measure(cell, img.naturalWidth, img.naturalHeight)
}

function onImageLoad(i: number) {
  loaded.value[i] = true
  clearTimeout(timeoutHandles[i])
  measureImage(i)
  ScrollTrigger.refresh()
}

// Estado por visual (hasta MAX_GALLERY_VISUALS). Cada visual tiene su celda,
// su <video>, su skeleton y si ya se arrancó (preload+play) — el arrastre de
// autoplay es por celda, no global.
const visualCells = ref<(HTMLElement | null)[]>([])
const visualVideos = ref<(HTMLVideoElement | null)[]>([])
const visualSkeleton = ref<boolean[]>([])
const visualStarted: boolean[] = []
let visualObserver: IntersectionObserver | null = null
let visualResizeObserver: ResizeObserver | null = null

// Los refs se asignan por índice dentro de `props.visuals`, no por posición
// en la lista renderizada (los visuales pueden reordenarse en el mosaico).
function setVisualCell(el: Element | ComponentPublicInstance | null, i: number) {
  visualCells.value[i] = el as HTMLElement | null
}

function setVideo(el: Element | ComponentPublicInstance | null, i: number) {
  visualVideos.value[i] = el as HTMLVideoElement | null
}

function assignCellRef(el: Element | ComponentPublicInstance | null, cell: GridCell) {
  if (cell.kind === 'visual') setVisualCell(el, cell.index)
  else setCell(el, cell.index)
}

function handleVisualIntersection(entries: IntersectionObserverEntry[]) {
  for (const e of entries) {
    // El target es el <video>; recuperamos el índice por identidad del ref.
    const idx = visualVideos.value.findIndex((v) => v === e.target)
    if (idx === -1) continue
    const video = e.target as HTMLVideoElement
    if (e.isIntersecting) {
      if (!visualStarted[idx]) {
        visualStarted[idx] = true
        video.setAttribute('preload', 'auto')
        video.load()
      }
      video.play().catch(() => {}) // autoplay bloqueado: no romper la página
    } else {
      video.pause()
    }
  }
}

function onVisualMetadata(i: number) {
  const cell = visualCells.value[i]
  const video = visualVideos.value[i]
  if (cell && video?.videoWidth && video.videoHeight) {
    measure(cell, video.videoWidth, video.videoHeight)
    ScrollTrigger.refresh()
  }
}

function onVisualData(i: number) {
  visualSkeleton.value[i] = false
}

// El video no cargó (URL rota, códec con audio, sin fallback mp4…). El
// skeleton se retira y la celda se mide con el póster (si existe) o con 4:3
// por defecto: sin esto la celda colapsaría a la fila base de 10 px del
// mosaico y se deformaría la galería en público.
function onVisualError(i: number) {
  visualSkeleton.value[i] = false
  const cell = visualCells.value[i]
  const video = visualVideos.value[i]
  if (!cell) return
  const posterUrl = video?.poster
  if (posterUrl) {
    const probe = new Image()
    probe.onload = () => {
      measure(cell, probe.naturalWidth, probe.naturalHeight)
      ScrollTrigger.refresh()
    }
    probe.src = posterUrl
  } else {
    measure(cell, 4, 3)
    ScrollTrigger.refresh()
  }
}

function onVisualResize() {
  for (let i = 0; i < visualCells.value.length; i++) {
    const cell = visualCells.value[i]
    const video = visualVideos.value[i]
    if (cell && video?.videoWidth && video.videoHeight) {
      measure(cell, video.videoWidth, video.videoHeight)
    }
  }
  ScrollTrigger.refresh()
}

onMounted(() => {
  if (!visualVideos.value.length) return
  visualObserver = new IntersectionObserver(handleVisualIntersection, { rootMargin: '300px' })
  for (const video of visualVideos.value) if (video) visualObserver.observe(video)

  visualResizeObserver = new ResizeObserver(onVisualResize)
  for (const cell of visualCells.value) if (cell) visualResizeObserver.observe(cell)
})

onBeforeUnmount(() => {
  for (const handle of timeoutHandles) clearTimeout(handle)
  visualObserver?.disconnect()
  visualResizeObserver?.disconnect()
  for (const video of visualVideos.value) video?.pause()
})

// Al alternar mobilePreview, el ancho de cada celda cambia (2 vs 3 columnas)
// y con él la altura renderizada de los medios ya cargados — hay que remedir
// todo después de que el navegador aplique las nuevas clases.
watch(
  () => props.mobilePreview,
  async () => {
    await nextTick()
    for (let i = 0; i < props.images.length; i++) measureImage(i)
    onVisualResize()
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
        v-for="cell in cellsList"
        :key="cell.key"
        :ref="(el) => assignCellRef(el, cell)"
        :class="['relative overflow-hidden rounded-2xl md:rounded-3xl', colSpanClass(cell.colSpan)]"
      >
        <template v-if="cell.kind === 'visual'">
          <div
            class="absolute inset-0 bg-ink/5 transition-opacity duration-300 pointer-events-none"
            :class="visualSkeleton[cell.index] ? 'opacity-100' : 'opacity-0'"
          />
          <video
            :ref="(el) => setVideo(el, cell.index)"
            :poster="cell.visual.poster || undefined"
            autoplay
            muted
            loop
            playsinline
            preload="none"
            class="absolute inset-0 w-full h-full object-cover"
            @loadedmetadata="onVisualMetadata(cell.index)"
            @loadeddata="onVisualData(cell.index)"
            @error="onVisualError(cell.index)"
          >
            <source v-if="cell.visual.format === 'webm'" :src="cell.visual.url" type="video/webm" />
            <source v-if="cell.visual.format === 'mp4'" :src="cell.visual.url" type="video/mp4" />
            <source v-if="cell.visual.mp4Url" :src="cell.visual.mp4Url" type="video/mp4" />
          </video>
        </template>

        <template v-else>
          <div
            class="absolute inset-0 bg-ink/5 transition-opacity duration-300 pointer-events-none"
            :class="loaded[cell.index] ? 'opacity-0' : 'opacity-100'"
          />
          <CoreReveal>
            <NuxtImg
              :src="srcFor(cell.index, cell.url)"
              :alt="`Imagen del proyecto ${cell.index + 1}`"
              :sizes="SIZES_BY_SPAN[cell.colSpan]"
              format="webp"
              loading="lazy"
              class="absolute inset-0 w-full h-full object-cover"
              @load="onImageLoad(cell.index)"
              @error="onImageError(cell.index)"
            />
          </CoreReveal>
        </template>
      </div>
    </div>
  </div>
</template>