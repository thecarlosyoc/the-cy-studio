<!-- app/components/card/Product.vue -->
<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const t = useT()

defineProps<{
  title: string
  image: string
  to: string
}>()

function onImageLoad() {
  ScrollTrigger.refresh()
}
</script>

<template>
  <NuxtLink
    :to="to"
    :data-cursor="t('viewProject')"
    class="block aspect-square shrink-0 overflow-hidden shadow-sm shadow-ink/10 transition-transform duration-200 hover:scale-[1.02]"
  >
    <NuxtImg
      v-if="image"
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