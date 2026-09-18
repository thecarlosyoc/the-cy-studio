<!-- app/pages/work/[slug].vue -->
<script setup lang="ts">
import type { WorkItem } from '#shared/types/content'
import gsap from 'gsap'
import { dict } from '~/data/i18n'

const route = useRoute()
const lang = useLang()
const t = useT()
const { data: item } = await useFetch<WorkItem>(`/api/work/${route.params.slug}`)

// Meta is derived from the fetched item via getters so it updates as soon as the
// request resolves (it is not available on the first synchronous render).
const toAbsoluteImageUrl = useAbsoluteImageUrl()

const seoTitle = computed(() =>
  item.value?.title?.es ? `${item.value.title.es} — the CY studio` : 'Trabajo — the CY studio'
)
// `description` is the short subtitle; some items leave it blank, so fall back.
const seoDescription = computed(() => item.value?.description?.es?.trim() || dict.es.workIntro)
// Some work items have an empty gallery — fall back to the sitewide default image.
const seoImage = computed(() => toAbsoluteImageUrl(item.value?.gallery?.[0]?.url))

useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogType: 'article',
  ogImage: () => seoImage.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterImage: () => seoImage.value,
})

// Floating "scroll to top" / "back to work" buttons: hidden while actively
// scrolling, shown once scroll is idle — same setTimeout-debounce-on-every-
// event shape as the home marquee's boostSpeed()/velocityDecayTimer, just
// inverted (show on idle instead of decaying a speed boost back to normal).
const SCROLL_TOP_THRESHOLD = 480 // px scrolled before "back to top" is useful
const floatingNavRef = ref<HTMLElement | null>(null)
const showScrollTop = ref(false)
// Reactive (not a closure var): the template also reads this, so a keyboard
// user focused on the scroll-top button doesn't have it yanked out from under
// them the moment their own click scrolls scrollY back under the threshold.
const focusedInside = ref(false)
let reduceMotion = false
// True for the duration of scrollToTop()'s own smooth-scroll. Without this,
// onScroll can't tell that scroll apart from a manual one and hides the nav
// mid-animation — including out from under a click that never moved DOM
// focus (Safari/iOS don't focus a clicked <button>).
let selfScrolling = false
let selfScrollTimer: ReturnType<typeof setTimeout> | undefined
let scrollIdleTimer: ReturnType<typeof setTimeout> | undefined

function setIdleVisible(idle: boolean) {
  if (!floatingNavRef.value || reduceMotion) return
  // A keyboard user tabbed into the nav mid-scroll: keep it fully visible
  // rather than shrinking a control they're actively focused on.
  if (!idle && focusedInside.value) return
  gsap.to(floatingNavRef.value, {
    opacity: idle ? 1 : 0,
    scale: idle ? 1 : 0.9,
    duration: 0.2,
    ease: 'power2.out',
    overwrite: true,
  })
}

function onScroll() {
  const past = window.scrollY > SCROLL_TOP_THRESHOLD
  if (past !== showScrollTop.value) showScrollTop.value = past

  if (reduceMotion || selfScrolling) return
  setIdleVisible(false)
  clearTimeout(scrollIdleTimer)
  scrollIdleTimer = setTimeout(() => setIdleVisible(true), 200)
}

function onFocusIn() {
  focusedInside.value = true
  setIdleVisible(true)
}
function onFocusOut() {
  focusedInside.value = false
}

function endSelfScroll() {
  selfScrolling = false
  clearTimeout(selfScrollTimer)
  window.removeEventListener('scrollend', endSelfScroll)
}

function scrollToTop() {
  selfScrolling = true
  window.scrollTo({ top: 0, behavior: reduceMotion ? 'auto' : 'smooth' })
  // 'scrollend' covers current Chrome/Firefox/Safari 18.2+; the timeout is a
  // fallback for older Safari (harmless if both fire — endSelfScroll is idempotent).
  window.addEventListener('scrollend', endSelfScroll, { once: true })
  clearTimeout(selfScrollTimer)
  selfScrollTimer = setTimeout(endSelfScroll, 700)
}

onMounted(() => {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  showScrollTop.value = window.scrollY > SCROLL_TOP_THRESHOLD
  window.addEventListener('scroll', onScroll, { passive: true })
  floatingNavRef.value?.addEventListener('focusin', onFocusIn)
  floatingNavRef.value?.addEventListener('focusout', onFocusOut)
})
onUnmounted(() => {
  window.removeEventListener('scroll', onScroll)
  window.removeEventListener('scrollend', endSelfScroll)
  floatingNavRef.value?.removeEventListener('focusin', onFocusIn)
  floatingNavRef.value?.removeEventListener('focusout', onFocusOut)
  clearTimeout(scrollIdleTimer)
  clearTimeout(selfScrollTimer)
})
</script>

<template>
  <div v-if="item" class="bg-paper min-h-screen pt-28 md:pt-32 pb-24">
    <div class="px-6 md:px-12 max-w-4xl mx-auto">
      <nav class="flex items-center gap-2 mb-6 text-sm">
        <NuxtLink
          to="/work"
          class="flex items-center gap-1.5 text-ink-soft hover:text-ink transition-colors shrink-0"
        >
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
            <path d="M12 5L7 10L12 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ t('work') }}
        </NuxtLink>
        <span class="text-ink-soft/40 shrink-0" aria-hidden="true">/</span>
        <span class="font-bold text-ink truncate">{{ item.title[lang] }}</span>
      </nav>

      <h1 class="font-display font-bold text-[40px] md:text-[64px] text-ink leading-tight">
        {{ item.title[lang] }}
      </h1>
      <p class="mt-4 text-ink-soft text-lg max-w-2xl">
        {{ item.description[lang] }}
      </p>
      <hr class="mt-8 border-ink/15" />

      <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div class="space-y-8">
          <div>
            <h2 class="font-display font-bold text-sm uppercase tracking-wide text-ink">{{ t('aboutRole') }}</h2>
            <ul class="mt-3 space-y-2">
              <li v-for="(r, i) in item.role" :key="i" class="text-ink-soft">{{ r[lang] }}</li>
            </ul>
          </div>
          <div>
            <h2 class="font-display font-bold text-sm uppercase tracking-wide text-ink">{{ t('aboutTools') }}</h2>
            <ul class="mt-3 space-y-2">
              <li v-for="tool in item.tools" :key="tool" class="text-ink-soft">{{ tool }}</li>
            </ul>
          </div>
          <div>
            <h2 class="font-display font-bold text-sm uppercase tracking-wide text-ink">{{ t('aboutDate') }}</h2>
            <p class="mt-3 text-ink-soft">{{ item.date[lang] }}</p>
          </div>
        </div>

        <div class="space-y-8">
          <div>
            <h2 class="font-display font-bold text-sm uppercase tracking-wide text-ink">{{ t('aboutDescription') }}</h2>
            <p class="mt-3 text-ink-soft">{{ item.longDescription[lang] }}</p>
          </div>
          <div>
            <h2 class="font-display font-bold text-sm uppercase tracking-wide text-ink">{{ t('aboutContext') }}</h2>
            <p class="mt-3 text-ink-soft">{{ item.context[lang] }}</p>
            <CoreControl
              v-if="item.demoUrl"
              :to="item.demoUrl"
              target="_blank"
              rel="noopener"
              variant="solid"
              class="mt-6"
            >
              {{ t('viewDemo') }}
            </CoreControl>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-14 px-6 md:px-12">
      <WorkGalleryGrid :images="item.gallery" :visuals="item.visuals" />
    </div>

    <div class="mt-14 px-6 md:px-12 max-w-4xl mx-auto">
      <CoreReveal>
        <HomeCta />
      </CoreReveal>
    </div>

    <div
      ref="floatingNavRef"
      class="fixed bottom-28 right-6 z-[45] flex flex-row gap-3 md:bottom-10 md:right-10 md:z-30 md:flex-col"
    >
      <button
        type="button"
        :class="[
          'flex h-11 w-11 items-center justify-center rounded-full border border-ink/50 bg-paper/70 backdrop-blur-md backdrop-saturate-150 text-ink shadow-sm transition-colors duration-150 hover:border-ink/60 hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
          showScrollTop || focusedInside ? '' : 'invisible',
        ]"
        :tabindex="showScrollTop || focusedInside ? undefined : -1"
        :aria-label="t('workScrollTop')"
        @click="scrollToTop"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
          <path d="M5 12L10 7L15 12" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </button>

      <NuxtLink
        to="/work"
        class="flex h-11 w-11 items-center justify-center rounded-full border border-ink/50 bg-paper/70 backdrop-blur-md backdrop-saturate-150 text-ink shadow-sm transition-colors duration-150 hover:border-ink/60 hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
        :aria-label="t('workBackToList')"
      >
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
          <path d="M12 5L7 10L12 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </NuxtLink>
    </div>
  </div>

  <div v-else class="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
    <p class="text-ink-soft text-lg">{{ t('notFound') }}</p>
    <NuxtLink to="/work" class="inline-flex items-center gap-1.5 text-ink font-medium hover:text-cobalt transition-colors">
      {{ t('notFoundCta') }}
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none">
        <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </NuxtLink>
  </div>
</template>