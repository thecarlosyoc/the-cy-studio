<!-- app/components/card/Product.vue -->
<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { GalleryVisual } from '#shared/types/content'

const t = useT()

defineProps<{
  title: string
  image: string
  to: string
  // Explicit video cover (admin-picked). Falls back to the static `image`
  // when absent — most projects don't have one.
  video?: GalleryVisual
}>()

function onImageLoad() {
  ScrollTrigger.refresh()
}
</script>

<template>
  <NuxtLink
    :to="to"
    :data-cursor="t('viewProject')"
    class="block aspect-square shrink-0 overflow-hidden rounded-[28px] shadow-sm shadow-ink/10 transition-transform duration-200 hover:scale-[1.02]"
  >
    <CoreCoverMedia v-if="video" :video="video" :poster="image" :alt="title" />
    <NuxtImg
      v-else-if="image"
      :src="image"
      :alt="title"
      sizes="sm:220px md:300px xl:360px"
      width="420"
      height="420"
      format="webp"
      loading="lazy"
      class="h-full w-full object-cover"
      @load="onImageLoad"
    />
    <div v-else class="flex h-full w-full items-center justify-center bg-ink/5 text-ink-soft text-xs text-center px-4">
      {{ t('noPhoto') }}
    </div>
  </NuxtLink>
</template>