<!-- app/components/services/PillarBand.vue -->
<script setup lang="ts">
import type { GalleryVisual } from '#shared/types/content'

// Full-width media band that opens an area chapter, then its header (eyebrow, title, intro) and the
// case link. The media is the area's real case and covers the band (object-cover, no crop: the
// 1280 px sources pixelate when zoomed, Carlos 2026-11-17). The `media` slot replaces it (Web).
const props = defineProps<{
  eyebrow: string
  title: string
  intro: string
  caseLabel: string
  caseTo?: string
  titleId: string
  poster?: string
  posterAlt: string
  video?: GalleryVisual
}>()

const t = useT()

// WCAG 2.2.2: the video plays on its own for more than 5 s, so it carries a pause control.
// Reduced motion: the video never plays (poster only) and the control is not needed.
// The label follows the video's real state (play/pause events), not the click.
const paused = ref(false)
const playing = ref(false)
const reduced = ref(true)
const media = ref<{ resume: () => void } | null>(null)
const canPause = computed(() => !!props.video && !reduced.value)
let motionMql: MediaQueryList | undefined
const syncReduced = () => (reduced.value = !!motionMql?.matches)
onMounted(() => {
  motionMql = window.matchMedia('(prefers-reduced-motion: reduce)')
  syncReduced()
  motionMql.addEventListener('change', syncReduced)
})
onBeforeUnmount(() => motionMql?.removeEventListener('change', syncReduced))
function togglePlayback() {
  if (playing.value) {
    paused.value = true
  } else {
    paused.value = false
    media.value?.resume()
  }
}
</script>

<template>
  <div class="flex flex-col gap-10 pb-10">
    <div v-if="poster || video || $slots.media" class="relative aspect-video w-full overflow-hidden bg-ink/10 md:aspect-auto md:h-[560px]">
      <CoreReveal>
        <div class="svc-band-media absolute inset-0">
          <slot name="media">
          <div class="absolute inset-0">
            <CoreCoverMedia
              v-if="video"
              ref="media"
              :video="video"
              :poster="poster ?? ''"
              :alt="posterAlt"
              :paused="paused"
              :hover-pause="false"
              :poster-width="1280"
              @playing="playing = $event"
            />
            <NuxtImg v-else :src="poster" :alt="posterAlt" loading="lazy" sizes="sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw" class="h-full w-full object-cover" />
          </div>
          </slot>
        </div>
      </CoreReveal>
      <CoreControl
        v-if="canPause"
        variant="soft"
        class="!bg-paper/90 hover:!bg-paper absolute bottom-4 right-6 z-10"
        @click="togglePlayback"
      >
        {{ playing ? t('servicesVideoPause') : t('servicesVideoPlay') }}
      </CoreControl>
    </div>

    <div class="flex flex-col items-start gap-6 px-6 md:flex-row md:items-end md:justify-between md:px-16">
      <CoreSectionHead class="flex-1" :eyebrow="eyebrow" :intro="intro" :title-id="titleId">{{ title }}</CoreSectionHead>
      <CoreControl v-if="caseTo" variant="link" :to="caseTo">{{ caseLabel }}</CoreControl>
    </div>
  </div>
</template>

<style scoped>
/* On reveal the media settles from 1.04 to 1. */
.svc-band-media {
  transform: scale(1.04);
  transition: transform 1.2s cubic-bezier(0.23, 1, 0.32, 1) 0.1s;
}
.is-visible .svc-band-media {
  transform: none;
}
@media (prefers-reduced-motion: reduce) {
  .svc-band-media {
    transform: none;
    transition: none;
  }
}
</style>
