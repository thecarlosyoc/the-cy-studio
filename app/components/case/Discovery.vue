<!-- app/components/case/Discovery.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

defineProps<{ discovery: typeof paymentsScenes.discovery }>()
const lang = useLang()
</script>

<template>
  <CaseScene id="case-discovery" :tag="discovery.tag[lang]" :title="discovery.title[lang]" :line="discovery.line[lang]">
    <div role="list" class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Staggered reveal: CoreReveal's own transition, delayed per card (skipped by CoreReveal itself with reduced motion). -->
      <CoreReveal v-for="(f, i) in discovery.findings" :key="i" :style="{ transitionDelay: `${(i % 3) * 90}ms` }">
        <div role="listitem" class="flex h-full min-h-[150px] flex-col justify-between gap-6 rounded-2xl bg-white p-6 dark:bg-white/[.08]">
          <span class="font-mono text-[11px] uppercase tracking-[.16em] text-cobalt dark:text-ink-soft">{{ String(i + 1).padStart(2, '0') }}</span>
          <p class="font-display text-xl font-medium leading-snug text-ink">{{ f[lang] }}</p>
        </div>
      </CoreReveal>
    </div>
  </CaseScene>
</template>
