<!-- app/components/case/Close.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

defineProps<{
  close: typeof paymentsScenes.close
  footnote: string
  demoUrl?: string
  // `label` is the mono line above the title: «Siguiente caso», or «Más trabajo» when this is the last case.
  next: { label: string; title: string; to: string }
  no: string
}>()
const lang = useLang()
const t = useT()
</script>

<template>
  <CaseScene id="case-close" :no="no" :tag="close.tag[lang]" :title="close.title[lang]">
    <ol class="grid grid-cols-1 gap-4 md:grid-cols-2">
      <li v-for="(l, i) in close.learnings" :key="i" class="flex items-baseline gap-5 rounded-2xl bg-white p-6 dark:bg-white/[.08]">
        <span class="shrink-0 font-mono text-[11px] uppercase tracking-[.16em] text-cobalt dark:text-ink-soft">{{ String(i + 1).padStart(2, '0') }}</span>
        <p class="font-display text-xl font-medium leading-snug text-ink">{{ l[lang] }}</p>
      </li>
    </ol>

    <CoreControl v-if="demoUrl" :to="demoUrl" target="_blank" rel="noopener" variant="solid" class="mt-8" :aria-label="t('viewDemo')">
      <CoreSwapLabel :text="t('viewDemo')" icon-position="end">
        <template #icon>
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
            <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </template>
      </CoreSwapLabel>
    </CoreControl>

    <NuxtLink
      :to="next.to"
      class="group mt-12 flex items-end justify-between gap-6 rounded-3xl bg-cobalt p-8 text-paper focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper md:p-12"
    >
      <span>
        <span class="block font-mono text-[11px] uppercase tracking-[.16em]">{{ next.label }}</span>
        <span class="mt-3 block font-display text-[28px] font-bold leading-tight md:text-[44px]">{{ next.title }}</span>
      </span>
      <svg class="shrink-0 transition-transform duration-200 group-hover:translate-x-1 motion-reduce:transition-none" width="32" height="32" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
        <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </NuxtLink>

    <p class="mt-10 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ footnote }}</p>
  </CaseScene>
</template>
