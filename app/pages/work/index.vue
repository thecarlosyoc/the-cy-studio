<script setup lang="ts">
import gsap from 'gsap'

const lang = useLang()
const t = useT()
const activeType = ref<'product' | 'brand'>('product')

const seoTitle = `${t('workTitle')} — the CY studio`
const seoDescription = t('workIntro')
const seoImage = useAbsoluteImageUrl()()

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: 'website',
  ogImage: seoImage,
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: seoImage,
})

const { data: workItems } = await useWorkItems()

const filteredItems = computed(() =>
  (workItems.value ?? []).filter((item) => item.type === activeType.value),
)

// Duplicate the cards once so the rail can loop seamlessly (same trick as the
// home marquees: content(x) === content(x + half) because the two copies match).
const carouselItems = computed(() => [...filteredItems.value, ...filteredItems.value])

// Desktop pins the section to the viewport. The rail auto-scrolls on GSAP (like
// the home marquee) at a calm pace, pauses while the pointer/keyboard is over a
// product, and each arrow steps manually by wrapping inside the first copy so
// the loop's leg never clamps against the scrollable edges.
const trackRef = ref<HTMLElement | null>(null)
let autoTween: gsap.core.Tween | undefined
let stepTween: gsap.core.Tween | undefined
let hovering = false
let cleanupTrack: (() => void) | undefined
let trackResizeObserver: ResizeObserver | undefined

function buildAutoScroll() {
  const el = trackRef.value
  if (!el) return
  autoTween?.kill()
  autoTween = undefined
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  const half = el.scrollWidth / 2 // one full copy of the duplicated rail
  const maxScroll = el.scrollWidth - el.clientWidth
  if (maxScroll <= 0 || half > maxScroll) return // nothing to scroll: no loop
  // Anchor the leg inside the first copy so from+half never exceeds maxScroll.
  // (ponytail: if the user leaves a manual scroll in the last ≤clientWidth px of
  // copy 1, the clamp re-anchors with a ≤ half-card snap; no scrollLeft leg can
  // start there — rare, only after an exact trackpad stop in that strip.)
  const from = Math.min(el.scrollLeft % half, Math.max(0, half - el.clientWidth))
  autoTween = gsap.fromTo(
    el,
    { scrollLeft: from },
    { scrollLeft: from + half, duration: half / 65, ease: 'none', repeat: -1 },
  )
  if (hovering) autoTween.pause()
}

function scrollByStep(dir: number) {
  const el = trackRef.value
  if (!el) return
  autoTween?.kill()
  autoTween = undefined
  stepTween?.kill()
  stepTween = undefined
  const half = el.scrollWidth / 2
  const maxScroll = el.scrollWidth - el.clientWidth
  if (!half || maxScroll <= 0) return
  const card = el.querySelector('.card-work') as HTMLElement | null
  const step = (card?.offsetWidth ?? 340) + 24
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  // Animate monotonically inside the current copy. Past an edge, hop exactly one
  // copy first — invisible because the content is periodic (≈half). A modulo
  // destination would animate the *numeric* value backwards and rewind the rail.
  let to = el.scrollLeft + dir * step
  if (to >= maxScroll) {
    el.scrollLeft -= half
    to -= half
  } else if (to <= 0) {
    el.scrollLeft += half
    to += half
  }
  stepTween = gsap.to(el, {
    scrollLeft: Math.max(0, Math.min(to, maxScroll)),
    duration: reduce ? 0.001 : 0.55,
    ease: 'power2.out',
    onComplete: () => {
      stepTween = undefined
      buildAutoScroll()
    },
  })
}

onMounted(() => {
  const el = trackRef.value
  if (!el) return
  // Pause while the pointer (or keyboard focus) is inside the rail so manual
  // wheel/tab/wheel work without the tween overwriting position each frame.
  const enter = (e: Event | FocusEvent) => {
    if ((e as FocusEvent).relatedTarget && el.contains((e as FocusEvent).relatedTarget as Node)) return
    hovering = true
    autoTween?.kill()
    autoTween = undefined
    stepTween?.kill()
    stepTween = undefined
  }
  const leave = (e: Event | FocusEvent) => {
    if ((e as FocusEvent).relatedTarget && el.contains((e as FocusEvent).relatedTarget as Node)) return
    hovering = false
    stepTween?.kill()
    stepTween = undefined
    buildAutoScroll() // re-anchors at the current position — never jumps
  }
  el.addEventListener('mouseenter', enter)
  el.addEventListener('mouseleave', leave)
  el.addEventListener('touchstart', enter, { passive: true })
  el.addEventListener('touchend', leave)
  el.addEventListener('focusin', enter)
  el.addEventListener('focusout', leave)
  // Phone portrait mounts with the desktop rail hidden (scrollWidth 0), so
  // buildAutoScroll() no-ops at mount. Rotating to landscape without a reload
  // can cross the md breakpoint with no click/hover to re-trigger it — watch
  // the track's own size so it self-starts (same pattern as GalleryGrid's
  // visualResizeObserver).
  trackResizeObserver = new ResizeObserver(() => buildAutoScroll())
  trackResizeObserver.observe(el)
  cleanupTrack = () => {
    el.removeEventListener('mouseenter', enter)
    el.removeEventListener('mouseleave', leave)
    el.removeEventListener('touchstart', enter)
    el.removeEventListener('touchend', leave)
    el.removeEventListener('focusin', enter)
    el.removeEventListener('focusout', leave)
    trackResizeObserver?.disconnect()
    trackResizeObserver = undefined
  }
  buildAutoScroll()
})

watch(activeType, async () => {
  autoTween?.kill()
  autoTween = undefined
  stepTween?.kill()
  stepTween = undefined
  await nextTick()
  const el = trackRef.value
  if (el) el.scrollLeft = 0
  buildAutoScroll()
})

onUnmounted(() => {
  cleanupTrack?.()
  autoTween?.kill()
  stepTween?.kill()
})
</script>

<template>
  <div class="bg-paper min-h-screen">
    <!-- Phone: full vertical stacked list (<768px) -->
    <div class="md:hidden" style="padding-top: var(--navbar-height);">
      <div class="sticky z-10 bg-paper px-6 pt-6 pb-4" style="top: var(--navbar-height);">
        <h1 class="font-display font-bold text-[40px] text-ink leading-tight">
          {{ t('workTitle') }}
        </h1>
        <p class="mt-4 text-ink-soft text-base">
          {{ t('workIntro') }}
        </p>

        <div class="mt-6 inline-flex gap-1.5 rounded-full bg-ink/5 p-1.5" role="group" :aria-label="t('workFilterLabel')">
          <CoreControl
            :variant="activeType === 'product' ? 'solid' : 'soft'"
            :aria-pressed="activeType === 'product'"
            @click="activeType = 'product'"
          >
            {{ t('workFilterProduct') }}
          </CoreControl>
          <CoreControl
            :variant="activeType === 'brand' ? 'solid' : 'soft'"
            :aria-pressed="activeType === 'brand'"
            @click="activeType = 'brand'"
          >
            {{ t('workFilterBrand') }}
          </CoreControl>
        </div>
      </div>

      <div class="px-6 pt-2 pb-6 space-y-6">
        <CoreReveal v-for="item in filteredItems" :key="item.slug">
          <CardWork
            :title="item.title[lang]"
            :description="item.description[lang]"
            :image="getCoverImage(item.gallery)?.url"
            :to="`/work/${item.slug}`"
          />
        </CoreReveal>
        <div v-if="!filteredItems.length" class="py-16 text-center">
          <p class="text-ink-soft text-base">{{ t('workEmptyBrand') }}</p>
          <CoreControl variant="soft" class="mt-6" @click="activeType = 'product'">
            {{ t('workFilterProduct') }}
          </CoreControl>
        </div>
      </div>
    </div>

    <!-- Tablet + desktop (≥768px): single shared rail. Header sits above the
         track in normal flow up to xl, then becomes a fixed-width sidebar
         beside a viewport-pinned track at xl (≥1280px). One track element in
         the DOM at all times — sizing/layout flips via breakpoint classes,
         not by duplicating the ref-bound element (Vue can't bind trackRef to
         two mounted-at-once nodes). -->
    <div
      class="hidden md:flex flex-col xl:flex-row xl:items-center gap-8 xl:gap-16 px-6 md:px-10 xl:px-16 xl:h-screen xl:overflow-y-auto"
      style="padding-top: var(--navbar-height);"
    >
      <!-- Header: normal top-of-page block until xl, then a top-aligned sidebar -->
      <div class="flex w-full xl:w-[420px] xl:shrink-0 flex-col justify-start pt-8 pb-6 xl:pt-0 xl:pb-0">
        <h1 class="font-display font-bold text-[40px] xl:text-[64px] text-ink leading-tight">
          {{ t('workTitle') }}
        </h1>
        <p class="mt-4 xl:mt-6 text-base xl:text-lg text-ink-soft">
          {{ t('workIntro') }}
        </p>

        <div
          class="mt-6 xl:mt-10 inline-flex gap-1.5 rounded-full bg-ink/5 p-1.5"
          role="group"
          :aria-label="t('workFilterLabel')"
        >
          <CoreControl
            :variant="activeType === 'product' ? 'solid' : 'soft'"
            :aria-pressed="activeType === 'product'"
            @click="activeType = 'product'"
          >
            {{ t('workFilterProduct') }}
          </CoreControl>
          <CoreControl
            :variant="activeType === 'brand' ? 'solid' : 'soft'"
            :aria-pressed="activeType === 'brand'"
            @click="activeType = 'brand'"
          >
            {{ t('workFilterBrand') }}
          </CoreControl>
        </div>
      </div>

      <!-- Track: 320px cards up to xl (1.5-2 preview per screen on tablet), 420px at xl.
           Extra bottom padding (pb-16/20) reserves room for the prev/next pair anchored
           to this wrapper's bottom-left corner, right after the track in DOM order so
           tabbing lands on them right after (not before, and not stranded elsewhere).
           Kept deliberately tight — the xl row is viewport-pinned (xl:h-screen), so
           padding here eats directly into fit on short laptop screens; xl:overflow-y-auto
           on the row above is the safety net if it still doesn't fit. -->
      <div class="relative pt-6 pb-16 xl:pt-10 xl:pb-20 min-w-0 flex-1">
        <div
          v-if="carouselItems.length"
          ref="trackRef"
          class="scrollbar-hide focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-cobalt flex items-start gap-6 overflow-x-auto overscroll-x-contain"
          role="region"
          tabindex="0"
          :aria-label="t('workTrackLabel')"
          @keydown.left.prevent="scrollByStep(-1)"
          @keydown.right.prevent="scrollByStep(1)"
          style="mask-image: linear-gradient(90deg, black 96%, transparent 100%); -webkit-mask-image: linear-gradient(90deg, black 96%, transparent 100%);"
        >
          <CardWork
            v-for="(item, i) in carouselItems"
            :key="`${item.slug}-${i}`"
            :title="item.title[lang]"
            :description="item.description[lang]"
            :image="getCoverImage(item.gallery)?.url"
            :to="`/work/${item.slug}`"
            :loading="i === 0 ? 'eager' : 'lazy'"
            :aria-hidden="i >= filteredItems.length || undefined"
            :tabindex="i >= filteredItems.length ? -1 : undefined"
            compact
            class="card-work w-[320px] xl:w-[420px] shrink-0"
          />
          <!-- trailing zero-width spacer so the flex gap makes total = N·w + N·gap
               and scrollWidth/2 lands exactly on the copy seam (zero drift) -->
          <div aria-hidden="true" class="w-0 shrink-0" />
        </div>
        <div v-else role="status" class="flex flex-col items-center justify-center gap-6 py-16 text-center">
          <p class="text-lg text-ink-soft">{{ t('workEmptyBrand') }}</p>
          <CoreControl variant="soft" @click="activeType = 'product'">
            {{ t('workFilterProduct') }}
          </CoreControl>
        </div>

        <!-- Prev/next: anchored to the track's own bottom-left corner (not the header)
             so they read as attached to the carousel, matching the floating-button
             glass pattern from work/[slug].vue so they stay legible over card imagery. -->
        <div v-if="carouselItems.length" class="absolute bottom-0 left-0 flex items-center gap-2">
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-full border border-ink/50 bg-paper/70 backdrop-blur-md backdrop-saturate-150 text-ink shadow-sm transition-colors duration-150 hover:border-ink/60 hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            :aria-label="t('workPrev')"
            @click="scrollByStep(-1)"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
              <path d="M12.5 15.5 7 10l5.5-5.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
          <button
            type="button"
            class="flex h-11 w-11 items-center justify-center rounded-full border border-ink/50 bg-paper/70 backdrop-blur-md backdrop-saturate-150 text-ink shadow-sm transition-colors duration-150 hover:border-ink/60 hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
            :aria-label="t('workNext')"
            @click="scrollByStep(1)"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
              <path d="M7.5 15.5 13 10 7.5 4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
</style>