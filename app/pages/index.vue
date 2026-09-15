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

  if (productsTrackRef.value) {
    productsTween = gsap.fromTo(
      productsTrackRef.value,
      { xPercent: 0 },
      { xPercent: -50, duration: 28, ease: 'none', repeat: -1 },
    )
  }
  if (brandsTrackRef.value) {
    brandsTween = gsap.fromTo(
      brandsTrackRef.value,
      { xPercent: -50 },
      { xPercent: 0, duration: 28, ease: 'none', repeat: -1 },
    )
  }

  const tweens = () => [productsTween, brandsTween].filter((tw): tw is gsap.core.Tween => !!tw)
  const pause = () => tweens().forEach((tw) => tw.pause())
  const resume = () => tweens().forEach((tw) => tw.resume())

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
  })
  window.addEventListener('scroll', boostSpeed, { passive: true })

  cleanupMarquees = () => {
    window.removeEventListener('scroll', boostSpeed)
    tracks.forEach((el) => {
      el.removeEventListener('mouseenter', pause)
      el.removeEventListener('mouseleave', resume)
      el.removeEventListener('touchstart', pause)
      el.removeEventListener('touchend', resume)
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

      <section class="px-6 md:px-16 pb-16">
        <CoreReveal>
          <div class="text-center">
            <h2 class="font-display font-bold text-[40px] md:text-[64px] leading-tight text-ink break-words">{{ t('homeProductsTitle') }}</h2>
            <p class="text-ink-soft mt-2">{{ t('homeProductsIntro') }}</p>
          </div>
        </CoreReveal>

        <div class="mt-10 overflow-hidden">
          <div ref="productsTrackRef" class="flex gap-4 w-max">
            <CardProduct
              v-for="(p, i) in [...digitalProducts, ...digitalProducts]"
              :key="`${p.slug}-${i}`"
              :title="p.title[lang]"
              :image="getCoverImage(p.gallery)?.url"
              :to="`/work/${p.slug}`"
              class="w-[180px] md:w-[240px]"
            />
          </div>
        </div>
      </section>

      <section class="px-6 md:px-16 py-16">
        <CoreReveal>
          <div class="text-center">
            <h2 class="font-display font-bold text-[40px] md:text-[64px] leading-tight text-ink break-words">{{ t('homeBrandingTitle') }}</h2>
            <p class="text-ink-soft mt-2">{{ t('homeBrandingIntro') }}</p>
          </div>
        </CoreReveal>

        <div class="mt-10 overflow-hidden">
          <div ref="brandsTrackRef" class="flex gap-4 w-max">
            <CardProduct
              v-for="(p, i) in [...brandingProjects, ...brandingProjects]"
              :key="`${p.slug}-${i}`"
              :title="p.title[lang]"
              :image="getCoverImage(p.gallery)?.url"
              :to="`/work/${p.slug}`"
              class="w-[180px] md:w-[240px]"
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