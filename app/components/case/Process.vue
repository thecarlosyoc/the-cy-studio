<!-- app/components/case/Process.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

defineProps<{ process: typeof paymentsScenes.process }>()
const lang = useLang()
</script>

<template>
  <CaseScene id="case-process" :tag="process.tag[lang]" :title="process.title[lang]">
    <ol class="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 md:grid-cols-5">
      <li v-for="(s, i) in process.stages" :key="s.name.es" class="border-t-2 border-cobalt pt-4">
        <span class="font-mono text-[11px] uppercase tracking-[.16em] text-cobalt">{{ String(i + 1).padStart(2, '0') }}</span>
        <h3 class="mt-3 font-display text-xl font-bold text-ink">{{ s.name[lang] }}</h3>
        <p class="mt-2 text-base text-ink-soft">{{ s.text[lang] }}</p>
      </li>
    </ol>

    <ul class="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
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
    <p class="mt-8 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ process.teamNote[lang] }}</p>
  </CaseScene>
</template>
