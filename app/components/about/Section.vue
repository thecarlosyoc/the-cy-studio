<!-- app/components/about/Section.vue -->
<script setup lang="ts">
import gsap from 'gsap'

defineProps<{
  label: string
  heading?: string
  paragraphs: string[]
  ctaLabel?: string
  ctaTo?: string
}>()

// Eyebrow -> heading -> paragraphs cascade in, instead of the whole block
// fading as one flat unit. One-shot on first intersection (like CoreReveal),
// not scroll-scrubbed: this is an entrance, not a scroll-linked effect.
const rootEl = ref<HTMLElement | null>(null)
const eyebrowEl = ref<HTMLElement | null>(null)
const headingEl = ref<HTMLElement | null>(null)
const ctaEl = ref<HTMLElement | null>(null)
const paragraphEls = ref<HTMLElement[]>([])

function setParagraphEl(el: Element | null, i: number) {
  if (el) paragraphEls.value[i] = el as HTMLElement
}

let observer: IntersectionObserver | undefined
let tl: gsap.core.Timeline | undefined

onMounted(() => {
  if (!rootEl.value) return

  const targets = [eyebrowEl.value, headingEl.value, ...paragraphEls.value, ctaEl.value].filter(
    (el): el is HTMLElement => !!el,
  )
  if (!targets.length) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    targets.forEach((el) => {
      el.style.opacity = '1'
      el.style.transform = 'none'
    })
    return
  }

  gsap.set(targets, { opacity: 0, y: 16 })

  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      tl = gsap.timeline()
      if (eyebrowEl.value) tl.to(eyebrowEl.value, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' })
      if (headingEl.value) tl.to(headingEl.value, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.3')
      if (paragraphEls.value.length) {
        tl.to(paragraphEls.value, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out', stagger: 0.1 }, '-=0.25')
      }
      if (ctaEl.value) tl.to(ctaEl.value, { opacity: 1, y: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2')
      observer?.disconnect()
    },
    { threshold: 0.15 },
  )
  observer.observe(rootEl.value)
})

onUnmounted(() => {
  observer?.disconnect()
  tl?.kill()
})
</script>

<template>
  <div ref="rootEl" class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-16 text-left">
    <h2 ref="eyebrowEl" class="font-display font-semibold text-2xl text-cobalt">{{ label }}</h2>

    <div class="max-w-2xl space-y-5">
      <h3 v-if="heading" ref="headingEl" class="font-display font-bold text-2xl text-ink">{{ heading }}</h3>
      <p
        v-for="(p, i) in paragraphs"
        :key="i"
        :ref="(el) => setParagraphEl(el as Element | null, i)"
        class="text-ink-soft text-base md:text-lg leading-relaxed"
      >
        {{ p }}
      </p>

      <div v-if="ctaTo" ref="ctaEl" class="inline-block">
        <CoreControl :to="ctaTo" variant="soft">
          <span class="inline-flex items-center gap-2">
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
              <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            {{ ctaLabel }}
          </span>
        </CoreControl>
      </div>
    </div>
  </div>
</template>