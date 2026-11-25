<!-- app/components/case/Process.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

// Role first (the three team cards, the author's own in cobalt), then the five stages in one compact
// row under a line that fills as the row comes up the screen.
defineProps<{ process: typeof paymentsScenes.process; no: string }>()
const lang = useLang()
</script>

<template>
  <CaseScene id="case-process" :no="no" :tag="process.tag[lang]" :title="process.title[lang]">
    <ul class="grid grid-cols-1 gap-4 md:grid-cols-3">
      <li
        v-for="m in process.team"
        :key="m.name.es"
        class="rounded-2xl p-6"
        :class="m.mine ? 'bg-cobalt text-paper' : 'bg-white text-ink dark:bg-white/[.08]'"
      >
        <p class="font-mono text-[11px] uppercase tracking-[.16em]" :class="m.mine ? 'text-paper' : 'text-ink-soft'">{{ m.name[lang] }}</p>
        <p class="mt-3 font-display text-lg font-medium leading-snug">{{ m.text[lang] }}</p>
      </li>
    </ul>
    <p class="mt-6 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ process.teamNote[lang] }}</p>

    <div class="relative mt-12 md:mt-16">
      <span class="absolute inset-x-0 top-0 hidden h-0.5 bg-ink/15 md:block" aria-hidden="true" />
      <span class="case-steps-fill absolute inset-x-0 top-0 hidden h-0.5 origin-left bg-cobalt md:block" aria-hidden="true" />
      <ol class="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-5">
        <li v-for="(s, i) in process.stages" :key="s.name.es" class="border-t-2 border-cobalt pt-4 md:border-t-0 md:pt-5">
          <span class="font-mono text-[11px] uppercase tracking-[.16em] text-cobalt">{{ String(i + 1).padStart(2, '0') }}</span>
          <h3 class="mt-2 font-display text-xl font-bold text-ink">{{ s.name[lang] }}</h3>
          <p class="mt-2 text-base text-ink-soft">{{ s.text[lang] }}</p>
        </li>
      </ol>
    </div>
  </CaseScene>
</template>

<style scoped>
/* Static by default: the line is full. With scroll-driven animations it fills while the row travels
   from the lower part of the screen to its middle. */
@keyframes case-steps-fill {
  from { transform: scaleX(0); }
}
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .case-steps-fill {
      animation: case-steps-fill linear both;
      animation-timeline: view(block);
      animation-range: cover 10% cover 50%;
    }
  }
}
</style>
