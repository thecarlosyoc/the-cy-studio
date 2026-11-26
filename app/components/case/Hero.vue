<!-- app/components/case/Hero.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'
import type { LocalizedText } from '#shared/types/content'

// First screen: title, facts and the four results, readable without scrolling. Below, the product loop
// goes edge to edge and stays put for one screen while the page (an opaque column, see the page) rises
// over it: the mechanics of the home hero.
// `role` is the work item's role list, the one /work/[slug] shows under the same heading.
const props = defineProps<{ hero: typeof paymentsScenes.hero; role?: LocalizedText[]; no: string }>()
const roleLines = computed(() => (props.role?.length ? props.role : [props.hero.role]))
const lang = useLang()
const t = useT()
const reduced = useReducedMotion()

const video = ref<HTMLVideoElement | null>(null)
const playing = ref(false)
// `stretch` is the part of the scroll where the loop can be seen: the whole band on a phone; from
// 768 px up, the track minus its last screen, when the page column has covered it.
const stretch = ref<HTMLElement | null>(null)
const inView = ref(false)
// `covered`: the stretch has gone past the top. In the pinned layout (768 px up, with motion) the page
// column is then over the loop and its button, and only then does the button leave the tab order; below
// the fold, or in the static layout where nothing covers it, it stays reachable.
const covered = ref(false)
let seen: IntersectionObserver | undefined
onMounted(() => {
  seen = new IntersectionObserver(([e]) => {
    if (!e) return
    inView.value = e.isIntersecting
    covered.value = !e.isIntersecting && e.boundingClientRect.bottom <= 0
  })
  if (stretch.value) seen.observe(stretch.value)
})
onUnmounted(() => seen?.disconnect())
// The loop runs on its own only from 768 px up and without reduced motion (on a phone the poster waits
// for the play button, so 3 MB of video are never fetched unasked). The button overrides either way.
// It never plays where it cannot be seen.
const wide = ref(false)
const choice = ref<'play' | 'pause' | null>(null)
let mq: MediaQueryList | undefined
const onWide = () => { wide.value = !!mq?.matches }
onMounted(() => {
  mq = window.matchMedia('(min-width: 768px)')
  mq.addEventListener('change', onWide)
  onWide()
})
onUnmounted(() => mq?.removeEventListener('change', onWide))
const want = computed(() => (choice.value ? choice.value === 'play' : wide.value && !reduced.value) && inView.value)
watchEffect(() => {
  const v = video.value
  if (!v) return
  if (want.value) v.play().catch(() => {})
  else v.pause()
})
// The click acts on the video itself: a play() the browser refused must be retried by the next click.
function toggle() {
  const v = video.value
  if (!v) return
  choice.value = v.paused ? 'play' : 'pause'
  if (v.paused) v.play().catch(() => {})
  else v.pause()
}
</script>

<template>
  <section aria-labelledby="case-hero-title" class="px-6 pb-14 md:px-12 md:pb-20">
    <div class="mx-auto max-w-[1200px]">
      <p class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ no }} · {{ hero.tag[lang] }}</p>
      <h1 id="case-hero-title" class="mt-4 max-w-[900px] break-words font-display text-[40px] font-bold leading-[1.02] tracking-[-.02em] text-ink md:text-[72px] md:[@media(max-height:800px)]:text-[56px]">
        {{ hero.title[lang] }}
      </h1>
      <p class="mt-5 max-w-[720px] text-lg text-ink-soft md:text-xl">{{ hero.line[lang] }}</p>

      <dl class="mt-10 grid grid-cols-2 gap-x-6 gap-y-6 md:grid-cols-4 md:[@media(max-height:800px)]:mt-7">
        <div>
          <dt class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ t('aboutRole') }}</dt>
          <dd v-for="(r, i) in roleLines" :key="i" class="text-base text-ink" :class="i ? 'mt-1' : 'mt-2'">{{ r[lang] }}</dd>
        </div>
        <div v-for="f in hero.facts" :key="f.label.es">
          <dt class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ f.label[lang] }}</dt>
          <dd class="mt-2 text-base text-ink">{{ f.value[lang] }}</dd>
        </div>
      </dl>

      <dl class="mt-10 grid grid-cols-2 gap-x-6 gap-y-8 md:grid-cols-4 md:[@media(max-height:800px)]:mt-7">
        <div v-for="(s, i) in hero.stats" :key="i" class="flex flex-col border-t-2 border-cobalt pt-4">
          <dt class="text-base text-ink-soft">{{ s.label[lang] }}</dt>
          <dd class="order-first mb-2 font-display text-[40px] font-bold leading-none tabular-nums text-ink md:text-[56px]">
            {{ typeof s.value === 'string' ? s.value : s.value[lang] }}
          </dd>
        </div>
      </dl>
      <p class="mt-6 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ hero.statsNote[lang] }}</p>
    </div>
  </section>

  <div class="case-loop-track relative">
    <div ref="stretch" class="case-loop-stretch pointer-events-none absolute inset-x-0 top-0" aria-hidden="true" />
    <div class="case-loop relative z-[6] overflow-hidden bg-cobalt" data-nav-tone="cobalt">
      <div role="img" :aria-label="hero.poster.alt[lang]" class="h-full">
        <video
          ref="video"
          class="block h-full w-full object-cover"
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
      <!-- WCAG 2.2.2: the loop can always be paused. From 768 px up the button sits at the top, under the
           nav: the page column rises from the bottom and would cover it there first. -->
      <button
        type="button"
        :aria-label="playing ? t('casePause') : t('casePlay')"
        :tabindex="covered && wide && !reduced ? -1 : undefined"
        class="absolute bottom-4 right-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#12110e]/80 text-[#f1efea] transition-colors hover:bg-[#12110e] focus-visible:ring-2 focus-visible:ring-[#f1efea] focus-visible:ring-offset-2 focus-visible:ring-offset-cobalt md:bottom-auto md:right-12 md:top-[calc(var(--navbar-height)+1.5rem)] md:h-9 md:w-9"
        @click="toggle"
      >
        <svg v-if="playing" width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><rect x="3" y="2" width="3.5" height="12" rx="1" /><rect x="9.5" y="2" width="3.5" height="12" rx="1" /></svg>
        <svg v-else width="16" height="16" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true" focusable="false"><path d="M4 2.5v11l9-5.5z" /></svg>
      </button>
    </div>
  </div>
</template>

<style scoped>
/* Static by default (phones, reduced motion): the loop is a 16:9 band in the flow. */
.case-loop { aspect-ratio: 16 / 9; }
.case-loop-stretch { height: 100%; }

/* From 768 px up and with motion: the loop fills the screen and sticks for one extra screen of scroll;
   the page column that follows pulls up over that last screen (`-mt` on the page). */
@media (min-width: 768px) and (prefers-reduced-motion: no-preference) {
  .case-loop-track { height: 250svh; }
  /* 8rem short of the full cover: by then the column is over the button at the top of the loop. */
  .case-loop-stretch { height: calc(150svh - 8rem); }
  .case-loop { position: sticky; top: 0; height: 100svh; aspect-ratio: auto; }
}
</style>
