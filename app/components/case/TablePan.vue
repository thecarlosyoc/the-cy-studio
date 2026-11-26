<!-- app/components/case/TablePan.vue -->
<script setup lang="ts">
import type { DecisionsTable } from '#shared/types/caseStudy'

// The summary screen with its three fixed columns. While the hold advances, the other columns slide
// behind them through the three scroll states captured from the real table (start, middle, end).
// Only used inside a pinned stage (a size container); the stacked layout shows `table.still`.
// The three states load eagerly: two of them start clipped, and a lazy image would arrive mid-slide.
// The slide is tuned for exactly three states (checked by assertCaseStudy). Every size comes from the
// captures themselves.
const props = defineProps<{ table: DecisionsTable }>()
const lang = useLang()
// The fixed block and one state share the table width (1383 + 1390 px of the 2x capture on payments).
const tableW = computed(() => props.table.fixed.width + props.table.states[0]!.width)
const FIXED = computed(() => `${(props.table.fixed.width / tableW.value * 100).toFixed(3)}%`)
// Cards strip and table at one width, one above the other: the box the stage fits.
const stackH = computed(() => Math.round(props.table.cards.height + props.table.fixed.height * props.table.cards.width / tableW.value))
</script>

<template>
  <div class="flex h-full w-full flex-col items-center justify-center">
    <!-- Cards strip and table at one width (2816 × 722 together on payments). The captions under it take
         about 5.5rem of the stage height. -->
    <div :style="{ width: `min(100cqw, calc((100cqh - 5.5rem) * ${table.cards.width} / ${stackH}))` }">
      <div class="overflow-hidden rounded-xl border border-ink/10 bg-[#fafafc]">
        <CaseShot :img="table.cards" />
        <div class="relative" :style="{ aspectRatio: `${tableW} / ${table.fixed.height}` }">
          <div class="case-pan-view absolute inset-y-0 right-0" :style="{ left: FIXED }">
            <div class="case-pan-track flex h-full w-[300%]">
              <NuxtImg
                v-for="s in table.states"
                :key="s.src"
                :src="s.src"
                :alt="s.alt[lang]"
                sizes="sm:100vw md:50vw lg:600px xl:600px xxl:600px"
                loading="eager"
                format="webp"
                class="block h-full w-1/3 shrink-0"
              />
            </div>
          </div>
          <!-- The fixed columns, outlined in cobalt, with a soft edge where the rest slides under. -->
          <div class="absolute inset-y-0 left-0 outline outline-2 -outline-offset-2 outline-cobalt" :style="{ width: FIXED }">
            <CaseShot :img="table.fixed" sizes="sm:100vw md:50vw lg:600px xl:600px xxl:600px" />
            <span class="pointer-events-none absolute inset-y-0 left-full w-6 bg-gradient-to-r from-[#12110e]/10 to-transparent" aria-hidden="true" />
          </div>
        </div>
      </div>
      <!-- What each stretch of the slide shows, in words: «Al inicio: saldo inicial, …». -->
      <ol class="mt-4 grid grid-cols-3 gap-x-6" aria-hidden="true">
        <li v-for="(s, i) in table.states" :key="s.src" :class="`case-pan-cap-${i + 1}`">
          <p class="font-mono text-[11px] uppercase tracking-[.16em] text-cobalt">{{ s.alt[lang].split(': ')[0] }}</p>
          <p class="mt-1 text-sm text-ink-soft first-letter:uppercase">{{ s.alt[lang].split(': ')[1] }}</p>
        </li>
      </ol>
    </div>
  </div>
</template>

<style scoped>
/* Static by default: the first state, and the right part scrolls sideways by hand. That is what
   browsers without scroll-driven animations get. */
.case-pan-view {
  overflow-x: auto;
  overflow-y: hidden;
  scroll-snap-type: x mandatory;
}
.case-pan-track > * {
  scroll-snap-align: start;
}
/* Progress through the first two stretches of the hold: rest on each state, slide between them. */
@keyframes case-pan {
  0%, 8% { transform: translateX(0); }
  40%, 55% { transform: translateX(-33.3333%); }
  85%, 100% { transform: translateX(-66.6667%); }
}
/* Each caption is lit while its state rests on screen. */
@keyframes case-pan-cap-1 {
  0%, 12% { opacity: 1; }
  34%, 100% { opacity: 0.4; }
}
@keyframes case-pan-cap-2 {
  0%, 26% { opacity: 0.4; }
  40%, 58% { opacity: 1; }
  74%, 100% { opacity: 0.4; }
}
@keyframes case-pan-cap-3 {
  0%, 66% { opacity: 0.4; }
  85%, 100% { opacity: 1; }
}
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .case-pan-view { overflow: hidden; }
    .case-pan-track { animation: case-pan linear both; }
    .case-pan-cap-1 { animation: case-pan-cap-1 linear both; }
    .case-pan-cap-2 { animation: case-pan-cap-2 linear both; }
    .case-pan-cap-3 { animation: case-pan-cap-3 linear both; }
    .case-pan-track,
    .case-pan-cap-1,
    .case-pan-cap-2,
    .case-pan-cap-3 {
      animation-timeline: --case-hold;
      animation-range: contain 0% contain 40%;
    }
  }
}
</style>
