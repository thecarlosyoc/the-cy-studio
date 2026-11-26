<!-- app/components/case/Discovery.vue -->
<script setup lang="ts">
import type { DiscoveryScene } from '#shared/types/caseStudy'

defineProps<{ scene: DiscoveryScene; no: string }>()
const lang = useLang()
</script>

<template>
  <CaseScene id="case-discovery" :no="no" :tag="scene.tag[lang]" :title="scene.title[lang]" :line="scene.line[lang]">
    <CoreReveal>
      <p class="mb-8 max-w-[820px] font-display text-2xl font-medium leading-snug text-ink md:mb-10 md:text-[28px]">{{ scene.context[lang] }}</p>
    </CoreReveal>
    <div class="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      <!-- Staggered reveal: CoreReveal's own transition, delayed per card (skipped by CoreReveal itself with reduced motion). -->
      <CoreReveal v-for="(f, i) in scene.findings" :key="i" :style="{ transitionDelay: `${(i % 3) * 90}ms` }">
        <div class="flex h-full min-h-[150px] flex-col justify-between gap-6 rounded-2xl bg-white p-6 dark:bg-white/[.08]">
          <span class="font-mono text-[11px] uppercase tracking-[.16em] text-cobalt dark:text-ink-soft">{{ String(i + 1).padStart(2, '0') }}</span>
          <p class="font-display text-xl font-medium leading-snug text-ink">{{ f[lang] }}</p>
        </div>
      </CoreReveal>
    </div>
  </CaseScene>
</template>
