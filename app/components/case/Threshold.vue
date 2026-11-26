<!-- app/components/case/Threshold.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

// Opener of the product part, with the mechanics of the /about photo hold: the accounting screen stays
// on screen for 220svh while it settles from 1.18 to 1 and two lines cross over it. Pure CSS, tied to
// the scroll; without scroll-driven animations or with reduced motion it is one still screen with
// both lines stacked.
defineProps<{ threshold: typeof paymentsScenes.threshold }>()
const lang = useLang()
</script>

<template>
  <div class="case-threshold-track relative z-40 overflow-clip">
    <div class="case-threshold-sticky relative overflow-hidden bg-ink" data-nav-tone="image">
      <div class="case-threshold-zoom absolute inset-0">
        <CaseShot :img="threshold.image" framed sizes="sm:200vw md:100vw lg:100vw xl:100vw xxl:100vw" />
      </div>
      <!-- Ink veil: the screen becomes the surface the lines are read on. Fixed colours, as over a photo. -->
      <div class="absolute inset-0 bg-[#12110e]/85" aria-hidden="true" />
      <div class="case-threshold-lines absolute inset-0 flex flex-col items-center justify-center gap-6 px-6 text-center font-display text-[32px] font-normal leading-[1.1] text-[#f1efea] md:text-[48px]">
        <p v-for="(l, i) in threshold.lines" :key="i" class="col-start-1 row-start-1 max-w-4xl text-balance" :class="`case-threshold-line-${i + 1}`">
          <template v-for="(part, k) in l[lang].split('*')" :key="k"><strong v-if="k % 2" class="font-bold">{{ part }}</strong><template v-else>{{ part }}</template></template>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.case-threshold-track { height: 100svh; }
.case-threshold-sticky { height: 100svh; }

@keyframes case-threshold-zoom {
  from { transform: scale(1.18); }
  to { transform: scale(1); }
}
@keyframes case-threshold-line-1 {
  0%, 8% { opacity: 0; transform: translateY(12px); }
  22%, 45% { opacity: 1; transform: translateY(0); }
  55%, 100% { opacity: 0; transform: translateY(-12px); }
}
@keyframes case-threshold-line-2 {
  0%, 50% { opacity: 0; transform: translateY(12px); }
  62%, 100% { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .case-threshold-track { height: 220svh; view-timeline: --case-threshold block; }
    .case-threshold-sticky { position: sticky; top: 0; }
    .case-threshold-lines { display: grid; place-items: center; gap: 0; }

    .case-threshold-zoom { animation: case-threshold-zoom linear both; }
    .case-threshold-line-1 { animation: case-threshold-line-1 linear both; }
    .case-threshold-line-2 { animation: case-threshold-line-2 linear both; }
    .case-threshold-zoom,
    .case-threshold-line-1,
    .case-threshold-line-2 {
      animation-timeline: --case-threshold;
      animation-range: contain;
    }
  }
}
</style>
