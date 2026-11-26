<!-- app/components/services/Threshold.vue -->
<script setup lang="ts">
// Second pinned moment of /services, the case study's threshold: the real estimator (step 1, no
// prices) clear and whole, an ink veil coming in over it, then the line. Pure CSS tied to the scroll;
// scrolling back reverses it. Without scroll-driven animations or with reduced motion it is one still
// band with the veil on and the line visible. Not on phones: the page stays within its mobile length
// target, and «Condiciones» already says the same line there.
// ponytail: same keyframes as CaseThreshold, whose props are typed to the payments case; merge the two
// once the case block catalog gives it plain props.
defineProps<{ src: string; alt: string; line: string }>()
</script>

<template>
  <div class="svc-threshold-track relative hidden overflow-clip md:block">
    <div class="svc-threshold-sticky relative overflow-hidden bg-[#12110e]" data-nav-tone="image">
      <div class="svc-threshold-zoom absolute inset-0">
        <NuxtImg :src="src" :alt="alt" loading="lazy" sizes="sm:200vw md:100vw lg:100vw xl:100vw xxl:100vw" class="h-full w-full object-cover object-left-top" />
      </div>
      <!-- A shade under the fixed nav: while the screen is still clear (and light), the nav's light text keeps its contrast. -->
      <div class="pointer-events-none absolute inset-x-0 top-0 h-36 bg-gradient-to-b from-[#12110e]/80 via-[#12110e]/45 to-transparent" aria-hidden="true" />
      <div class="svc-threshold-veil absolute inset-0 bg-[#12110e]/85" aria-hidden="true" />
      <div class="absolute inset-0 flex items-center justify-center px-6">
        <p class="svc-threshold-line max-w-4xl text-balance text-center font-display text-[32px] font-normal leading-[1.1] text-[#f1efea] md:text-[48px]">
          <template v-for="(part, k) in line.split('*')" :key="k"><strong v-if="k % 2" class="font-bold">{{ part }}</strong><template v-else>{{ part }}</template></template>
        </p>
      </div>
    </div>
  </div>
</template>

<style scoped>
.svc-threshold-sticky { height: 100svh; }

@keyframes svc-threshold-zoom {
  from { transform: scale(1.12); }
  to { transform: scale(1); }
}
/* 0-25% the estimator under a light veil (it is this same site: fully clear it read as a jump to
   /quote); 25-60% the veil closes; 60-80% the line. */
@keyframes svc-threshold-veil {
  0%, 25% { opacity: 0.35; }
  60%, 100% { opacity: 1; }
}
@keyframes svc-threshold-line {
  0%, 60% { opacity: 0; transform: translateY(16px); }
  80%, 100% { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: no-preference) and (min-width: 768px) {
  @supports (animation-timeline: view()) {
    .svc-threshold-track { height: 220svh; view-timeline: --svc-threshold block; }
    .svc-threshold-sticky { position: sticky; top: 0; }
    .svc-threshold-zoom { animation: svc-threshold-zoom linear both; }
    .svc-threshold-veil { animation: svc-threshold-veil linear both; }
    .svc-threshold-line { animation: svc-threshold-line linear both; }
    .svc-threshold-zoom,
    .svc-threshold-veil,
    .svc-threshold-line {
      animation-timeline: --svc-threshold;
      animation-range: contain;
    }
  }
}
</style>
