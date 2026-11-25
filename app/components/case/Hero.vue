<!-- app/components/case/Hero.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

defineProps<{ hero: typeof paymentsScenes.hero }>()
const lang = useLang()
const reduced = useReducedMotion()
const t = useT()
const video = ref<HTMLVideoElement | null>(null)
const playing = ref(false)
onMounted(() => {
  if (!reduced.value && window.matchMedia('(min-width: 768px)').matches) video.value?.play().catch(() => {})
})
// Reduced motion switched on mid-visit: stop the loop.
watch(reduced, (r) => { if (r) video.value?.pause() })
function toggle() {
  const v = video.value
  if (v) (v.paused ? v.play().catch(() => {}) : v.pause())
}
</script>

<template>
  <CaseScene id="case-hero" level="h1" :tag="hero.tag[lang]" :title="hero.title[lang]" :line="hero.line[lang]">
    <dl class="grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4">
      <div v-for="f in hero.facts" :key="f.label.es">
        <dt class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ f.label[lang] }}</dt>
        <dd class="mt-2 text-base text-ink">{{ f.value[lang] }}</dd>
      </div>
    </dl>

    <div class="mt-10 overflow-hidden rounded-3xl bg-cobalt">
      <!-- The loop already carries the cobalt and the screens; the poster is its frame at 4 s.
           Autoplay only from 768 px up and without reduced motion; otherwise the poster waits for the play button. -->
      <div v-if="hero.video" class="relative">
        <div role="img" :aria-label="hero.poster.alt[lang]">
        <video
          ref="video"
          class="block aspect-video w-full"
          muted
          loop
          playsinline
          preload="metadata"
          aria-hidden="true"
          :poster="hero.poster.src"
          @play="playing = true"
          @pause="playing = false"
        >
          <source :src="hero.video" type="video/mp4">
        </video>
        </div>
        <button
          type="button"
          :aria-label="playing ? t('casePause') : t('casePlay')"
          class="absolute bottom-3 right-3 flex h-11 w-11 items-center justify-center rounded-full bg-ink/80 text-paper transition-colors hover:bg-ink focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-cobalt md:h-9 md:w-9"
          @click="toggle"
        >
          <svg v-if="playing" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><rect x="3" y="2" width="3.5" height="12" rx="1" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" /></svg>
          <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M4 2.5v11l9-5.5z" /></svg>
        </button>
      </div>
      <!-- No video: poster screen centered, the two side screens peeking behind it. -->
      <div v-else class="relative flex aspect-[4/3] items-center justify-center overflow-hidden md:aspect-video">
        <CaseShot :img="hero.sidePosters[0]" class="absolute left-0 top-1/2 w-1/2 -translate-x-1/4 -translate-y-1/2 rounded-lg opacity-90" sizes="sm:50vw md:30vw lg:400px xl:400px xxl:400px" />
        <CaseShot :img="hero.sidePosters[1]" class="absolute right-0 top-1/2 w-1/2 translate-x-1/4 -translate-y-1/2 rounded-lg opacity-90" sizes="sm:50vw md:30vw lg:400px xl:400px xxl:400px" />
        <CaseShot :img="hero.poster" eager class="relative z-10 w-[80%] rounded-xl shadow-2xl md:w-[62%]" />
      </div>
    </div>
  </CaseScene>
</template>
