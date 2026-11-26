<!-- app/components/case/Threshold.vue -->
<script setup lang="ts">
import type { ThresholdScene } from '#shared/types/caseStudy'

// Opener of the product part: a full-viewport stage that stays on screen for a short stretch of scroll
// while three moments play in order: the accounting screen clear and whole, the ink veil coming in over
// it, then the line. Pure CSS tied to the scroll (sticky stage inside a track with a named view
// timeline); scrolling back reverses it. Without scroll-driven animations, with reduced motion or under
// 768 px it is one still 100svh band with the veil on and the line visible.
defineProps<{ scene: ThresholdScene }>()
const lang = useLang()
</script>

<template>
  <div class="case-threshold-track relative z-40 overflow-clip">
    <div class="case-threshold-sticky relative overflow-hidden bg-[#12110e]" data-nav-tone="image">
      <div class="case-threshold-zoom absolute inset-0">
        <!-- The screen covers the band (about 107 vw on a 16:10 window, 372 vw on a phone) and starts at 1.12 zoom:
             `sizes` asks for that width so a 2x screen gets 2 image px per CSS px. -->
        <CaseShot :img="scene.image" framed sizes="sm:250vw md:120vw lg:120vw xl:120vw xxl:120vw" />
      </div>
      <!-- A shade under the fixed nav: while the screen is still clear (and light), the nav's light text keeps its contrast. -->
      <div class="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#12110e]/80 via-[#12110e]/45 to-transparent" aria-hidden="true" />
      <!-- Ink veil: the screen becomes the surface the line is read on. Fixed colours, as over a photo. -->
      <div class="case-threshold-veil absolute inset-0 bg-[#12110e]/85" aria-hidden="true" />
      <div class="absolute inset-0 flex items-center justify-center px-6">
        <p class="case-threshold-line max-w-4xl text-balance text-center font-display text-[32px] font-normal leading-[1.1] text-[#f1efea] md:text-[48px]">
          <template v-for="(part, k) in scene.line[lang].split('*')" :key="k"><strong v-if="k % 2" class="font-bold">{{ part }}</strong><template v-else>{{ part }}</template></template>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.case-threshold-sticky { height: 100svh; }

@keyframes case-threshold-zoom {
  from { transform: scale(1.12); }
  to { transform: scale(1); }
}
/* 0-25% the screen alone; 25-60% the veil comes in; 60-80% the line. */
@keyframes case-threshold-veil {
  0%, 25% { opacity: 0; }
  60%, 100% { opacity: 1; }
}
@keyframes case-threshold-line {
  0%, 60% { opacity: 0; transform: translateY(16px); }
  80%, 100% { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: no-preference) and (min-width: 768px) {
  @supports (animation-timeline: view()) {
    .case-threshold-track { height: 220svh; view-timeline: --case-threshold block; }
    /* dvh while it sticks: with the browser bar hidden a 100svh stage would leave a strip of page under it. */
    .case-threshold-sticky { position: sticky; top: 0; height: 100dvh; }
    .case-threshold-zoom { animation: case-threshold-zoom linear both; }
    .case-threshold-veil { animation: case-threshold-veil linear both; }
    .case-threshold-line { animation: case-threshold-line linear both; }
    .case-threshold-zoom,
    .case-threshold-veil,
    .case-threshold-line {
      animation-timeline: --case-threshold;
      animation-range: contain;
    }
  }
}
</style>
