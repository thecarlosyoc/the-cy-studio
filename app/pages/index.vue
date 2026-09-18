<script setup lang="ts">
import gsap from 'gsap'
import { dict } from '~/data/i18n'

const lang = useLang()
const t = useT()

// SEO copy is always the Spanish dictionary: there is no locale routing, so 'es'
// is the site's effective default language.
const seoTitle = 'the CY studio — Diseño de producto y marca'
const seoDescription = dict.es.homeDedico
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

const digitalProducts = computed(() => workItems.value?.filter((i) => i.type === 'product') ?? [])
const brandingProjects = computed(() => workItems.value?.filter((i) => i.type === 'brand') ?? [])

// Marquees run on GSAP (not pure CSS) so they can: pause on touch, not just
// mouse hover, and speed up briefly while the page is being scrolled — a
// small "alive" touch matching the rest of the site's scroll-reactive motion.
const productsTrackRef = ref<HTMLElement | null>(null)
const brandsTrackRef = ref<HTMLElement | null>(null)

let productsTween: gsap.core.Tween | undefined
let brandsTween: gsap.core.Tween | undefined
let velocityDecayTimer: ReturnType<typeof setTimeout> | undefined
let cleanupMarquees: (() => void) | undefined

function setupMarquees() {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  const tracks = [productsTrackRef.value, brandsTrackRef.value].filter((el): el is HTMLElement => !!el)
  if (!tracks.length) return

  // Cards grew (180/240 -> 220/300/360 + wider gap), so the belt covers more
  // px per loop than before. Duration is bumped proportionally (28 -> 36) to
  // keep px/s — and so the perceived speed — roughly where it was.
  if (productsTrackRef.value) {
    productsTween = gsap.fromTo(
      productsTrackRef.value,
      { xPercent: 0 },
      { xPercent: -50, duration: 36, ease: 'none', repeat: -1 },
    )
  }
  if (brandsTrackRef.value) {
    brandsTween = gsap.fromTo(
      brandsTrackRef.value,
      { xPercent: -50 },
      { xPercent: 0, duration: 36, ease: 'none', repeat: -1 },
    )
  }

  const tweens = () => [productsTween, brandsTween].filter((tw): tw is gsap.core.Tween => !!tw)
  const pause = () => tweens().forEach((tw) => tw.pause())
  const resume = () => tweens().forEach((tw) => tw.resume())

  // Same pause-off-screen pattern as GalleryGrid's video autoplay gate: a
  // track scrolled out of view keeps running otherwise, wasting cycles the
  // user never sees.
  const offscreen = new Set<HTMLElement>(tracks)
  const trackForTween = (tw: gsap.core.Tween) =>
    tw === productsTween ? productsTrackRef.value : brandsTrackRef.value
  const visibilityObserver = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement
        if (entry.isIntersecting) offscreen.delete(el)
        else offscreen.add(el)
      }
      tweens().forEach((tw) => {
        const el = trackForTween(tw)
        if (el && offscreen.has(el)) tw.pause()
        else tw.resume()
      })
    },
    { threshold: 0 },
  )
  tracks.forEach((el) => visibilityObserver.observe(el))

  function boostSpeed() {
    tweens().forEach((tw) => {
      gsap.killTweensOf(tw)
      gsap.to(tw, { timeScale: 2.2, duration: 0.15, ease: 'power2.out' })
    })
    clearTimeout(velocityDecayTimer)
    velocityDecayTimer = setTimeout(() => {
      tweens().forEach((tw) => gsap.to(tw, { timeScale: 1, duration: 0.8, ease: 'power2.out' }))
    }, 120)
  }

  tracks.forEach((el) => {
    el.addEventListener('mouseenter', pause)
    el.addEventListener('mouseleave', resume)
    el.addEventListener('touchstart', pause, { passive: true })
    el.addEventListener('touchend', resume)
    // focusin/focusout bubble (unlike focus/blur) so this delegates from the
    // track to every card link — tabbing onto a card must stop the belt
    // moving under it, same as hover/touch.
    el.addEventListener('focusin', pause)
    el.addEventListener('focusout', resume)
  })
  window.addEventListener('scroll', boostSpeed, { passive: true })

  cleanupMarquees = () => {
    window.removeEventListener('scroll', boostSpeed)
    visibilityObserver.disconnect()
    tracks.forEach((el) => {
      el.removeEventListener('mouseenter', pause)
      el.removeEventListener('mouseleave', resume)
      el.removeEventListener('touchstart', pause)
      el.removeEventListener('touchend', resume)
      el.removeEventListener('focusin', pause)
      el.removeEventListener('focusout', resume)
    })
    clearTimeout(velocityDecayTimer)
    productsTween?.kill()
    brandsTween?.kill()
  }
}

onMounted(setupMarquees)
onUnmounted(() => cleanupMarquees?.())
</script>

<template>
  <div class="bg-paper">
    <HomeHero />

    <div class="flex flex-col">
      <section class="px-6 md:px-16 py-32 md:py-48">
        <CoreReveal>
          <p class="font-display font-bold text-[40px] md:text-[64px] leading-[1.1] tracking-tight text-ink text-left w-full break-words">
            {{ t('homeDedico') }}
          </p>
        </CoreReveal>
      </section>

      <section class="px-6 md:px-16 pb-32 md:pb-48">
        <CoreReveal>
          <p class="font-display font-normal text-[32px] md:text-[48px] leading-[1.15] text-ink text-right w-full break-words">
            {{ t('homeDescubre') }}
          </p>
          <p class="mt-4 font-mono text-[11px] tracking-[.16em] uppercase text-ink-soft text-right">
            {{ t('scroll') }} ↓
          </p>
        </CoreReveal>
      </section>

      <section class="px-6 md:px-16 pb-20 md:pb-28">
        <CoreReveal>
          <div class="text-center">
            <h2 class="font-display font-bold text-[40px] md:text-[64px] leading-tight text-ink break-words">{{ t('homeProductsTitle') }}</h2>
            <p class="text-ink-soft mt-2">{{ t('homeProductsIntro') }}</p>
          </div>
        </CoreReveal>

        <div class="mt-12 md:mt-16 overflow-hidden">
          <div ref="productsTrackRef" class="flex gap-6 w-max">
            <CardProduct
              v-for="(p, i) in [...digitalProducts, ...digitalProducts]"
              :key="`${p.slug}-${i}`"
              :title="p.title[lang]"
              :image="getCoverImage(p.gallery)?.url"
              :video="getCoverVisual(p.visuals)"
              :to="`/work/${p.slug}`"
              class="w-[220px] md:w-[300px] xl:w-[360px]"
            />
          </div>
        </div>
      </section>

      <section v-if="brandingProjects.length" class="px-6 md:px-16 py-20 md:py-28">
        <CoreReveal>
          <div class="text-center">
            <h2 class="font-display font-bold text-[40px] md:text-[64px] leading-tight text-ink break-words">{{ t('homeBrandingTitle') }}</h2>
            <p class="text-ink-soft mt-2">{{ t('homeBrandingIntro') }}</p>
          </div>
        </CoreReveal>

        <div class="mt-12 md:mt-16 overflow-hidden">
          <div ref="brandsTrackRef" class="flex gap-6 w-max">
            <CardProduct
              v-for="(p, i) in [...brandingProjects, ...brandingProjects]"
              :key="`${p.slug}-${i}`"
              :title="p.title[lang]"
              :image="getCoverImage(p.gallery)?.url"
              :video="getCoverVisual(p.visuals)"
              :to="`/work/${p.slug}`"
              class="w-[220px] md:w-[300px] xl:w-[360px]"
            />
          </div>
        </div>
      </section>

      <section class="px-6 md:px-16 pb-16">
        <CoreReveal>
          <HomeCta />
        </CoreReveal>
      </section>
    </div>
  </div>
</template>