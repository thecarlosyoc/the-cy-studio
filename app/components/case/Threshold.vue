<!-- app/components/case/Threshold.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

// Opener of the product part: a dark band in the page flow (not pinned) with the accounting screen
// under one line. The screen settles from 1.18 to 1 while the band crosses the viewport; without
// scroll-driven animations or with reduced motion it is a still band.
defineProps<{ threshold: typeof paymentsScenes.threshold }>()
const lang = useLang()
</script>

<template>
  <div class="relative z-40 overflow-hidden bg-[#12110e]" data-nav-tone="image">
    <div class="case-threshold-zoom absolute inset-0">
      <CaseShot :img="threshold.image" framed sizes="sm:200vw md:100vw lg:100vw xl:100vw xxl:100vw" />
    </div>
    <!-- Ink veil: the screen becomes the surface the line is read on. Fixed colours, as over a photo. -->
    <div class="absolute inset-0 bg-[#12110e]/85" aria-hidden="true" />
    <div class="relative flex min-h-[60svh] items-center justify-center px-6 py-24 md:min-h-[70svh]">
      <p class="max-w-4xl text-balance text-center font-display text-[32px] font-normal leading-[1.1] text-[#f1efea] md:text-[48px]">
        <template v-for="(part, k) in threshold.line[lang].split('*')" :key="k"><strong v-if="k % 2" class="font-bold">{{ part }}</strong><template v-else>{{ part }}</template></template>
      </p>
    </div>
  </div>
</template>

<style scoped>
@keyframes case-threshold-zoom {
  from { transform: scale(1.18); }
  to { transform: scale(1); }
}
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .case-threshold-zoom {
      animation: case-threshold-zoom linear both;
      animation-timeline: view(block);
      animation-range: cover;
    }
  }
}
</style>
