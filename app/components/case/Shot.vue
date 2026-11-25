<!-- app/components/case/Shot.vue -->
<script setup lang="ts">
import type { SceneImage } from '#shared/data/casePaymentsScenes'

// Real screen: optimized image with its own aspect ratio (no width prop on NuxtImg, so the
// screen-prefixed `sizes` drive the srcset; see memory nuxtimg-sizes).
withDefaults(defineProps<{ img: SceneImage; sizes?: string; eager?: boolean }>(), {
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
    class="block h-auto w-full"
    :style="{ aspectRatio: `${img.width} / ${img.height}` }"
  />
</template>
