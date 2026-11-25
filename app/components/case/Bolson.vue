<!-- app/components/case/Bolson.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

defineProps<{ bolson: typeof paymentsScenes.bolson }>()
const lang = useLang()
</script>

<template>
  <CaseScene id="case-bolson" :tag="bolson.tag[lang]" :title="bolson.title[lang]" :line="bolson.line[lang]">
    <ol class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      <li v-for="(s, i) in bolson.stages" :key="i" class="flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-white/[.08]">
        <div class="p-5">
          <p class="font-mono text-[11px] uppercase tracking-[.16em] text-cobalt dark:text-ink-soft">{{ String(i + 1).padStart(2, '0') }} · {{ s.role[lang] }}</p>
          <p class="mt-2 font-display text-lg font-bold leading-snug text-ink">{{ s.text[lang] }}</p>
        </div>
        <div class="mt-auto bg-ink/5"><CaseShot :img="s.image" sizes="sm:100vw md:50vw lg:290px xl:290px xxl:290px" /></div>
      </li>
    </ol>

    <ul class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
      <li v-for="p in bolson.paths" :key="p.kind.es" class="flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-white/[.08]">
        <div class="p-6">
          <p class="font-mono text-[11px] uppercase tracking-[.16em] text-cobalt dark:text-ink-soft">{{ p.kind[lang] }}</p>
          <p class="mt-2 font-display text-xl font-bold leading-snug text-ink">{{ p.text[lang] }}</p>
        </div>
        <div class="mt-auto bg-ink/5"><CaseShot :img="p.image" sizes="sm:100vw md:50vw lg:590px xl:590px xxl:590px" /></div>
      </li>
    </ul>

    <ul class="mt-8 flex flex-wrap gap-2">
      <li v-for="r in bolson.rules" :key="r.es" class="rounded-full border border-ink/20 px-4 py-2 font-display text-sm font-medium text-ink">{{ r[lang] }}</li>
    </ul>
    <p class="mt-6 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ bolson.count[lang] }}</p>
  </CaseScene>
</template>
