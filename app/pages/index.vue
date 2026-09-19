<script setup lang="ts">
import gsap from 'gsap'
import type { DictKey } from '~/data/i18n'

const lang = useLang()
const t = useT()
// Claves numeradas del diccionario (homeProcess1Title…): se arman por patrón.
const tk = (key: string) => t(key as DictKey)

// La descripción se edita desde el admin (grupo "Descripción del enlace").
// Sin routing por idioma, los rastreadores reciben el idioma por defecto del sitio.
const seoTitle = 'the CY studio — Diseño de producto y marca'
const seoDescription = () => t('homeSeoDescription')
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
const { photo } = await useSitePhotos()

const digitalProducts = computed(() => workItems.value?.filter((i) => i.type === 'product') ?? [])
const brandingProjects = computed(() => workItems.value?.filter((i) => i.type === 'brand') ?? [])

const capabilities = [
  { key: 'Design', icon: 'design' },
  { key: 'Build', icon: 'build' },
] as const
const process = [1, 2, 3, 4] as const
const principles = [
  { n: 1, icon: 'undo' },
  { n: 2, icon: 'bolt' },
  { n: 3, icon: 'repeat' },
] as const

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
    <HomeGuideDot />
    <HomeHero />

    <div class="flex flex-col">
      <section class="px-6 md:px-16 py-32 md:py-48">
        <CoreReveal>
          <!-- Inicio del recorrido: un punto por sección (HomeSectionDot). -->
          <HomeSectionDot class="mb-6" />
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
        </CoreReveal>
      </section>

      <section class="px-6 md:px-16 pb-20 md:pb-28">
        <CoreReveal>
          <div class="text-center">
            <HomeSectionDot class="mx-auto mb-4" />
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
            <HomeSectionDot class="mx-auto mb-4" />
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

      <section class="px-6 md:px-16 py-20 md:py-28">
        <CoreReveal>
          <HomeSectionDot />
          <h2 class="mt-4 font-display font-bold text-[40px] md:text-[64px] leading-tight text-ink break-words">{{ t('homeCapTitle') }}</h2>
        </CoreReveal>
        <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-6">
          <CoreReveal v-for="c in capabilities" :key="c.key">
            <div class="group h-full rounded-[28px] border border-ink/15 p-8 md:p-10 transition-colors duration-200 hover:border-cobalt">
              <span class="flex h-12 w-12 items-center justify-center rounded-full bg-cobalt/10 text-cobalt transition-colors duration-200 group-hover:bg-cobalt group-hover:text-paper">
                <HomeIcon :name="c.icon" />
              </span>
              <h3 class="mt-6 font-display font-bold text-2xl md:text-3xl text-ink">{{ tk(`homeCap${c.key}Title`) }}</h3>
              <p class="mt-3 text-ink-soft text-base md:text-lg">{{ tk(`homeCap${c.key}Text`) }}</p>
            </div>
          </CoreReveal>
        </div>
      </section>

      <section class="px-6 md:px-16 py-20 md:py-28">
        <CoreReveal>
          <HomeSectionDot class="ml-auto" />
          <h2 class="mt-4 font-display font-bold text-[40px] md:text-[64px] leading-tight text-ink text-right break-words">{{ t('homeProcessTitle') }}</h2>
        </CoreReveal>
        <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-x-16 gap-y-12">
          <CoreReveal v-for="n in process" :key="n">
            <!-- Filete gris con un tramo cobalto al inicio: marca el paso sin añadir peso. -->
            <div class="relative border-t border-ink/15 pt-6 before:absolute before:-top-px before:left-0 before:h-px before:w-16 before:bg-cobalt">
              <span class="font-mono text-sm tracking-[.16em] text-cobalt">0{{ n }}</span>
              <h3 class="mt-3 font-display font-bold text-2xl text-ink">{{ tk(`homeProcess${n}Title`) }}</h3>
              <p class="mt-3 text-ink-soft">{{ tk(`homeProcess${n}Text`) }}</p>
            </div>
          </CoreReveal>
        </div>
      </section>

      <!-- Banda cobalto a todo el ancho: el nav y el dock se adaptan a ella (data-nav-tone). -->
      <section data-nav-tone="cobalt" class="flex min-h-[100svh] items-center bg-cobalt text-paper px-6 md:px-16 py-32 md:py-40">
        <CoreReveal class="w-full">
          <div class="text-center">
            <HomeSectionDot on-cobalt class="mx-auto" />
            <h2 class="mt-4 font-display font-bold text-[40px] md:text-[64px] leading-tight break-words">{{ t('homePrinciplesTitle') }}</h2>
          </div>
          <div class="mt-16 grid grid-cols-1 gap-14 text-center md:mt-24 md:grid-cols-3 md:gap-12">
            <div v-for="p in principles" :key="p.n" class="flex flex-col items-center">
              <span class="flex h-12 w-12 items-center justify-center rounded-full bg-paper/15">
                <HomeIcon :name="p.icon" />
              </span>
              <h3 class="mt-6 font-display font-bold text-3xl md:text-4xl">{{ tk(`homePrinciple${p.n}Title`) }}</h3>
              <p class="mt-4 max-w-sm text-lg md:text-xl text-paper/85">{{ tk(`homePrinciple${p.n}Text`) }}</p>
            </div>
          </div>
        </CoreReveal>
      </section>

      <section class="px-6 md:px-16 py-20 md:py-28">
        <CoreReveal>
          <div class="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
            <div class="relative md:order-2">
              <!-- Marco cobalto desplazado detrás de la foto: acento sutil, sin tapar la imagen. -->
              <div class="absolute inset-0 translate-x-3 translate-y-3 rounded-[28px] border border-cobalt" aria-hidden="true" />
              <div class="relative aspect-[4/5] overflow-hidden rounded-[28px] bg-paper">
                <NuxtImg
                  :src="photo('home')"
                  :alt="t('homeAboutAlt')"
                  sizes="sm:100vw md:50vw"
                  densities="1x"
                  format="webp"
                  loading="lazy"
                  class="w-full h-full object-cover"
                />
              </div>
            </div>
            <div class="md:order-1">
              <HomeSectionDot />
              <p class="mt-4 font-display text-[24px] md:text-[32px] leading-[1.25] text-ink">{{ t('homeAboutText') }}</p>
              <CoreControl to="/about" variant="outline" class="mt-8">{{ t('homeAboutCta') }}</CoreControl>
            </div>
          </div>
        </CoreReveal>
      </section>

      <section class="px-6 md:px-16 pb-16">
        <CoreReveal>
          <HomeCta />
        </CoreReveal>
      </section>
    </div>
  </div>
</template>