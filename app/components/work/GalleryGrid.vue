<!-- app/components/work/GalleryGrid.vue -->
<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

defineProps<{
  images: string[]
}>()

const ROW_HEIGHT = 10 // px, unidad base de fila
const GAP = 16 // px, debe coincidir con el gap-4 de Tailwind

// Guardamos las celdas por índice en lugar de leer `event.target`:
// <NuxtImg> emite `load` como evento de componente y, cuando la imagen ya
// está completa al hidratar, lo hace con un `new Event('load')` sintético
// cuyo `target` es null. Medimos siempre el <img> real dentro de la celda.
const cells = ref<(HTMLElement | null)[]>([])

function setCell(el: Element | ComponentPublicInstance | null, i: number) {
  cells.value[i] = el as HTMLElement | null
}

function onImageLoad(i: number) {
  const cell = cells.value[i]
  if (!cell) return

  const img = cell.querySelector('img')
  if (!img) return

  const renderedHeight = img.getBoundingClientRect().height
  if (!renderedHeight) return

  const span = Math.round((renderedHeight + GAP) / (ROW_HEIGHT + GAP))
  cell.style.gridRowEnd = `span ${span}`
  ScrollTrigger.refresh()
}
</script>

<template>
  <div
    class="grid grid-cols-2 md:grid-cols-3 gap-4"
    style="grid-auto-flow: dense;"
    :style="{ gridAutoRows: `${ROW_HEIGHT}px` }"
  >
    <div
      v-for="(img, i) in images"
      :key="i"
      :ref="(el) => setCell(el, i)"
      class="overflow-hidden"
    >
      <CoreReveal>
        <NuxtImg
          :src="img"
          :alt="`Imagen del proyecto ${i + 1}`"
          sizes="sm:50vw md:33vw lg:33vw 2xl:33vw"
          format="webp"
          loading="lazy"
          class="w-full h-auto block object-cover rounded-2xl"
          @load="onImageLoad(i)"
        />
      </CoreReveal>
    </div>
  </div>
</template>
