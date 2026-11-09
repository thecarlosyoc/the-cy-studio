<!-- app/components/home/ProcessRail.vue -->
<script setup lang="ts">
import type { DictKey } from '~/data/i18n'

const t = useT()
const tk = (key: string) => t(key as DictKey)
const steps = [1, 2, 3, 4] as const
</script>

<template>
  <div class="relative">
    <span class="absolute left-0 top-0 h-full w-px bg-ink/15" aria-hidden="true" />
    <span class="process-fill absolute left-0 top-0 h-full w-px origin-top bg-cobalt" aria-hidden="true" />
    <CoreReveal
      v-for="n in steps"
      :key="n"
      class="relative pb-10 pl-8 last:pb-0 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-16 md:pb-14 md:pl-12"
    >
      <span
        class="process-dot absolute -left-[4.5px] top-2 h-2.5 w-2.5 rounded-full border border-cobalt bg-cobalt"
        aria-hidden="true"
      />
      <div>
        <span class="font-mono text-sm tracking-[.16em] text-cobalt">0{{ n }}</span>
        <h3 class="mt-2 font-display font-bold text-2xl md:text-3xl text-ink">{{ tk(`homeProcess${n}Title`) }}</h3>
      </div>
      <p class="mt-3 text-ink-soft text-base md:mt-0 md:pt-7 md:text-lg">{{ tk(`homeProcess${n}Text`) }}</p>
    </CoreReveal>
  </div>
</template>

<style scoped>
/* Static by default: fill complete and every dot lit, for reduced motion and
   for browsers without scroll-driven animations.
   The 35% end inset moves the viewport's bottom edge up to the 65% line. The
   fill's front sits on that line, so each dot lights as it crosses it. */
@keyframes process-fill {
  from { transform: scaleY(0); }
}
@keyframes process-dot {
  from {
    border-color: rgb(var(--color-ink) / 0.25);
    background-color: rgb(var(--color-paper));
  }
}

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .process-fill { animation: process-fill linear both; }
    .process-dot { animation: process-dot linear both; }
    .process-fill,
    .process-dot {
      animation-timeline: view(block 0% 35%);
      animation-range: entry-crossing;
    }
  }
}
</style>
