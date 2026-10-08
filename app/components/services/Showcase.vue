<!-- app/components/services/Showcase.vue -->
<script setup lang="ts">
import type { WorkItem } from '#shared/types/content'
import type { ServiceShowcase } from '#shared/data/servicesShowcase'

// Ejemplo real de un pilar en /services: el visual de un caso publicado, qué demuestra
// y cómo verlo completo (o probarlo, si el caso tiene demo en vivo).
const props = defineProps<{
  item: WorkItem
  showcase: ServiceShowcase
}>()

const { $track: track } = useNuxtApp()
const t = useT()
const lang = useLang()

const image = computed(() => getCoverImage(props.item.gallery)?.url ?? '')
// Visual de portada o, si el caso no marcó uno, el más ancho del mosaico.
const video = computed(() => {
  if (props.showcase.media !== 'video') return undefined
  return getCoverVisual(props.item.visuals)
    ?? [...props.item.visuals].filter((v) => v.url).sort((a, b) => (b.colSpan ?? 1) - (a.colSpan ?? 1))[0]
})

const tagClass = 'font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft'
</script>

<template>
  <figure class="overflow-hidden rounded-[28px] border border-ink/15">
    <div class="aspect-[4/3] overflow-hidden bg-ink/5 md:aspect-[2/1]">
      <!-- Al revelarse, el visual se asienta (de 1.04 a 1): movimiento, no decoración extra. -->
      <div class="svc-show-media h-full w-full">
        <CoreCoverMedia v-if="video" :video="video" :poster="image" :alt="item.title[lang]" />
        <NuxtImg
          v-else-if="image"
          :src="image"
          :alt="item.title[lang]"
          sizes="sm:100vw md:1200px"
          format="webp"
          loading="lazy"
          class="h-full w-full object-cover"
        />
      </div>
    </div>
    <figcaption class="flex flex-col gap-5 p-6 md:flex-row md:items-end md:justify-between md:gap-10 md:p-8">
      <div class="min-w-0">
        <p :class="tagClass">{{ t('servicesExample') }} · {{ item.title[lang] }}</p>
        <p class="mt-2 text-ink md:text-lg">{{ showcase.note[lang] }}</p>
      </div>
      <div class="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-3">
        <CoreControl
          variant="soft"
          :to="`/work/${item.slug}`"
          @click="track('services_showcase_clicked', { work: item.slug, lang })"
        >
          <CoreSwapLabel :text="t('servicesSeeCase')" icon-position="end">
            <template #icon>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
                <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </template>
          </CoreSwapLabel>
        </CoreControl>
        <CoreControl
          v-if="item.demoUrl"
          variant="link"
          class="underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          :to="item.demoUrl"
          target="_blank"
          rel="noopener noreferrer"
          @click="track('services_demo_clicked', { work: item.slug, lang })"
        >
          {{ t('servicesTryLive') }}
        </CoreControl>
      </div>
    </figcaption>
  </figure>
</template>

<style scoped>
.svc-show-media {
  transform: scale(1.04);
  transition: transform 1.2s cubic-bezier(0.23, 1, 0.32, 1) 0.1s;
}
.is-visible .svc-show-media {
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .svc-show-media {
    transform: none;
    transition: none;
  }
}
</style>
