<!-- app/components/services/Hero.vue -->
<script setup lang="ts">
import { SERVICES } from '#shared/data/services'

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
  <header class="flex flex-col gap-10 px-6 py-12 md:px-16 md:py-16">
    <CoreSectionHead level="h1" :eyebrow="t('servicesTitle')" :intro="t('servicesIntro')">
      {{ t('servicesHeroTitle') }}
    </CoreSectionHead>
    <div>
      <CoreControl variant="solid" to="/quote">{{ t('quoteCta') }}</CoreControl>
    </div>
    <ul class="grid grid-cols-2 gap-6 md:grid-cols-4">
      <CoreFact v-for="(f, i) in facts" :key="i" :lead="f" :index="i" />
    </ul>
  </header>
</template>
