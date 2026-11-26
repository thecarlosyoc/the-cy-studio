<!-- app/components/services/Threshold.vue -->
<script setup lang="ts">
import type { QuoteResponse } from '#shared/types/quote'

// Second pinned moment of /services, the case study's threshold: a quote as the PDF the client gets
// (the real QuotePrintSheet, sheet 1 only, which carries no amounts), an ink veil coming in over it,
// then the line. Live HTML, so it stays sharp at any size. Pure CSS tied to the scroll; scrolling back
// reverses it. Without scroll-driven animations or with reduced motion it is one still band with the
// veil on and the line visible. Not on phones: the page stays within its mobile length target, and
// «Condiciones» already says the same line there.
// ponytail: same keyframes as CaseThreshold, whose props are typed to the payments case; merge the two
// once the case block catalog gives it plain props.
defineProps<{ line: string }>()
const t = useT()

// Sample request for the mockup: two common services, addressed to the visitor. Sheet 1 shows scope
// and time per service, never the amounts, so they stay at zero.
const sample: QuoteResponse = {
  ref: 'CY-1126',
  estimate: {
    currency: 'GTQ',
    min: 0,
    max: 0,
    plusVat: true,
    items: [
      { slug: 'landing-page', size: 'm', min: 0, max: 0 },
      { slug: 'brand-identity', size: 'm', min: 0, max: 0 },
    ],
  },
}
</script>

<template>
  <div class="svc-threshold-track relative hidden overflow-clip md:block">
    <div class="svc-threshold-sticky relative overflow-hidden bg-[#d6d2c9]" data-nav-tone="image">
      <div class="svc-threshold-zoom absolute inset-0 flex items-center justify-center pt-[var(--navbar-height)]">
        <!-- Decorative: the line says it. inert keeps the sheet's links and heading out of reach. -->
        <div class="svc-mock relative" aria-hidden="true" inert>
          <div class="svc-sheet absolute inset-0 translate-x-[12%] translate-y-[2%] rotate-[5deg]" />
          <div class="svc-sheet relative -rotate-[3deg]">
            <QuotePrintSheet :result="sample" :name="t('servicesMockName')" :business="t('servicesMockBusiness')" brief="" proposal-only />
          </div>
        </div>
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
/* One letter sheet is 816 x 1056 px; it scales with the screen height in three steps. */
.svc-mock { width: 816px; height: 1056px; transform: scale(0.5); }
@media (min-height: 820px) { .svc-mock { transform: scale(0.6); } }
@media (min-height: 1000px) { .svc-mock { transform: scale(0.74); } }
.svc-sheet {
  background: #f1efea;
  box-shadow: 0 48px 96px -32px rgb(18 17 14 / 0.45);
}
/* /quote hides its print sheet on screen with a global rule; this one is meant to be seen. */
.svc-mock :deep(.quote-print) { display: block !important; }
.svc-threshold-sticky { height: 100svh; }

@keyframes svc-threshold-zoom {
  from { transform: scale(1.12); }
  to { transform: scale(1); }
}
/* 0-25% the quote alone; 25-60% the veil comes in; 60-80% the line. */
@keyframes svc-threshold-veil {
  0%, 25% { opacity: 0; }
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
