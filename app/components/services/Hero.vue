<!-- app/components/services/Hero.vue -->
<script setup lang="ts">
import { SERVICES } from '#shared/data/services'

// First screen, the case study's opener: tag, title, line, the one CTA, and four figures under a cobalt
// rule that come in one after the other. Readable without scrolling.
const t = useT()

// 10 and 4 come from the catalog, not typed by hand.
const areas = new Set(SERVICES.map((s) => s.pillar)).size
const facts = computed(() => [
  t('servicesFactServices').replace('{n}', String(SERVICES.length)),
  t('servicesFactAreas').replace('{n}', String(areas)),
  t('servicesFactPrice'),
  t('servicesFactFel'),
])
</script>

<template>
  <header class="px-6 pb-16 pt-12 md:px-16 md:pb-24 md:pt-16">
    <CoreReveal>
      <HomeSectionDot />
      <p class="mt-4 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ t('servicesTitle') }}</p>
      <h1 class="mt-4 max-w-[1100px] break-words font-display text-[40px] font-bold leading-[1.02] tracking-[-.02em] text-ink md:text-[72px]">
        {{ t('servicesHeroTitle') }}
      </h1>
      <p class="mt-5 max-w-[720px] text-lg text-ink-soft md:text-xl">{{ t('servicesHeroLine') }}</p>
      <div class="mt-8">
        <CoreControl variant="solid" to="/quote">{{ t('quoteCta') }}</CoreControl>
      </div>
    </CoreReveal>
    <ul class="mt-12 grid grid-cols-2 gap-x-6 gap-y-8 md:mt-16 md:grid-cols-4">
      <li v-for="(f, i) in facts" :key="i">
        <CoreReveal class="border-t-2 border-cobalt pt-4" :style="{ transitionDelay: `${120 + i * 60}ms` }">
          <p class="font-display text-[28px] font-bold leading-tight text-ink md:text-[40px]">{{ f }}</p>
        </CoreReveal>
      </li>
    </ul>
  </header>
</template>
