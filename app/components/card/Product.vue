<!-- app/components/card/Product.vue -->
<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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
    class="block aspect-square w-full shrink-0 overflow-hidden shadow-sm shadow-ink/10 transition-transform duration-200 hover:scale-[1.02]"
  >
    <NuxtImg
      v-if="image"
      :src="image"
      :alt="title"
      width="320"
      height="320"
      format="webp"
      loading="lazy"
      class="h-full w-full object-cover"
      @load="onImageLoad"
    />
  </NuxtLink>
</template>