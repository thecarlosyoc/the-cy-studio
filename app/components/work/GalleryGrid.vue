<!-- app/components/work/GalleryGrid.vue -->
<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger'

defineProps<{
  images: string[]
}>()

const ROW_HEIGHT = 10 // px, unidad base de fila
const GAP = 16 // px, debe coincidir con el gap-4 de Tailwind

function onImageLoad(e: Event) {
  const img = e.target as HTMLImageElement
  const cell = img.parentElement as HTMLElement
  const renderedHeight = img.getBoundingClientRect().height
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
      class="overflow-hidden"
    >
      <img
        :src="img"
        :alt="`Imagen del proyecto ${i + 1}`"
        class="w-full h-auto block object-cover rounded-2xl"
        @load="onImageLoad"
      />
    </div>
  </div>
</template>