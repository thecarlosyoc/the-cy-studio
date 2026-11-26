<!-- app/components/case/Shot.vue -->
<script setup lang="ts">
import type { SceneImage } from '#shared/data/casePaymentsScenes'

// Real screen: optimized image with its own aspect ratio (no width prop on NuxtImg, so the
// screen-prefixed `sizes` drive the srcset; see memory nuxtimg-sizes).
// `framed`: the image fills its parent (which clips) and is held on `img.focus`, the part of the
// screen that matters, instead of showing a whole 1920 px screen in a small card.
withDefaults(defineProps<{ img: SceneImage; sizes?: string; eager?: boolean; framed?: boolean }>(), {
  sizes: 'sm:100vw md:100vw lg:1200px xl:1200px xxl:1200px',
})
const lang = useLang()
</script>

<template>
  <NuxtImg
    :src="img.src"
    :alt="img.alt[lang]"
    :sizes="sizes"
    :loading="eager ? 'eager' : 'lazy'"
    format="webp"
    class="block w-full"
    :class="framed ? 'h-full object-cover' : 'h-auto'"
    :style="!framed
      ? { aspectRatio: `${img.width} / ${img.height}` }
      : img.focus && { objectPosition: `${img.focus[0]}% ${img.focus[1]}%`, transformOrigin: `${img.focus[0]}% ${img.focus[1]}%`, transform: `scale(${img.focus[2]})` }"
  />
</template>
