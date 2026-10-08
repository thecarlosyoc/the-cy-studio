<!-- app/components/services/Showcase.vue -->
<script setup lang="ts">
import type { GalleryVisual } from '#shared/types/content'

// Ejemplo real de un pilar en /services (columna izquierda, fija al hacer scroll en
// desktop): el visual, qué demuestra y cómo verlo completo (o probarlo, si hay demo).
defineProps<{
  title: string
  note: string
  image: string
  video?: GalleryVisual
  to: string
  ctaLabel: string
  demoUrl?: string
  trackId: string
}>()

const { $track: track } = useNuxtApp()
const t = useT()
const lang = useLang()

const tagClass = 'font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft'
</script>

<template>
  <figure class="overflow-hidden rounded-[28px] border border-ink/15">
    <div class="aspect-[4/3] overflow-hidden bg-ink/5">
      <!-- Al revelarse, el visual se asienta (de 1.04 a 1). -->
      <div class="svc-show-media h-full w-full">
        <CoreCoverMedia v-if="video" :video="video" :poster="image" :alt="title" />
        <NuxtImg
          v-else-if="image"
          :src="image"
          :alt="title"
          sizes="sm:100vw lg:480px"
          format="webp"
          loading="lazy"
          class="h-full w-full object-cover object-top"
        />
      </div>
    </div>
    <figcaption class="p-5 md:p-6">
      <p :class="tagClass">{{ t('servicesExample') }} · {{ title }}</p>
      <p class="mt-2 text-ink">{{ note }}</p>
      <div class="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
        <CoreControl variant="soft" :to="to" @click="track('services_showcase_clicked', { work: trackId, lang })">
          <CoreSwapLabel :text="ctaLabel" icon-position="end">
            <template #icon>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
                <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </template>
          </CoreSwapLabel>
        </CoreControl>
        <CoreControl
          v-if="demoUrl"
          variant="link"
          class="underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
          :to="demoUrl"
          target="_blank"
          rel="noopener noreferrer"
          @click="track('services_demo_clicked', { work: trackId, lang })"
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
