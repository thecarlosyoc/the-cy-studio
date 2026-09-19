<script setup lang="ts">
import type { AboutSection } from '#shared/types/content'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lang = useLang()
const t = useT()

const seoTitle = `${t('about')} — the CY studio`
const seoDescription = t('aboutHeroText')
const seoImage = useAbsoluteImageUrl()('/images/about.png')

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

const { data: aboutSections } = await useFetch<AboutSection[]>('/api/about')
const { photo } = await useSitePhotos()

// Photo block: same sticky-track + scrub convention as home/Hero.vue (CSS
// `position: sticky` for the hold, ScrollTrigger only drives progress — no
// GSAP `pin`, nothing else in the codebase uses it and sticky is cheaper).
// The image starts zoomed in and scales down to 1 as the track scrolls past,
// so holding + zoom-out reveal read as one continuous gesture instead of a
// static block.
const photoTrackRef = ref<HTMLElement | null>(null)
const photoImgRef = ref<HTMLElement | null>(null)
let photoSt: ScrollTrigger | undefined

function setupPhotoScroll() {
  if (!photoTrackRef.value || !photoImgRef.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.set(photoImgRef.value, { scale: 1.18 })
  // Two scaleX/scaleY quickSetters, not one 'scale' quickSetter: the compound
  // 'scale' alias silently no-ops under gsap.quickSetter in this GSAP build
  // (gsap.set/gsap.to with 'scale' work fine — this is quickSetter-only).
  const setScaleX = gsap.quickSetter(photoImgRef.value, 'scaleX')
  const setScaleY = gsap.quickSetter(photoImgRef.value, 'scaleY')

  photoSt = ScrollTrigger.create({
    trigger: photoTrackRef.value,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    onUpdate: (self) => {
      const s = 1.18 - self.progress * 0.18
      setScaleX(s)
      setScaleY(s)
    },
  })
}

onMounted(() => {
  setupPhotoScroll()
})
onUnmounted(() => {
  photoSt?.kill()
})
</script>

<template>
  <div class="bg-paper">
    <CoreReveal>
      <AboutHero />
    </CoreReveal>

    <div
      ref="photoTrackRef"
      class="about-photo-track relative -mx-6 md:-mx-32 overflow-hidden bg-paper"
      style="width: 100vw; margin-left: calc(-50vw + 50%); margin-right: calc(-50vw + 50%);"
    >
      <!-- bg-paper: Safari tiñe su barra con este bloque; sin fondo propio cae en blanco. -->
      <div class="about-photo-sticky relative overflow-hidden bg-paper">
        <!-- La foto se disuelve en paper abajo: Safari tiñe su barra con lo que ve en el borde inferior. -->
        <div
          ref="photoImgRef"
          class="absolute inset-0"
          style="-webkit-mask-image: linear-gradient(to bottom, #000 78%, transparent 100%); mask-image: linear-gradient(to bottom, #000 78%, transparent 100%);"
        >
          <NuxtImg
            :src="photo('about')"
            alt="Carlos Yoc"
            sizes="sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw"
            densities="1x"
            format="webp"
            class="w-full h-full object-cover"
          />
        </div>
      </div>
    </div>

    <section class="px-6 md:px-32 py-16 md:py-24 space-y-16 md:space-y-24">
      <AboutSection
        v-for="s in aboutSections ?? []"
        :key="s.label.es"
        :label="s.label[lang]"
        :heading="s.heading?.[lang]"
        :paragraphs="s.paragraphs.map((p) => p[lang])"
        :cta-label="s.ctaLabel?.[lang]"
        :cta-to="s.ctaTo"
      />
    </section>

    <section class="px-6 md:px-32 pb-16 md:pb-24">
      <CoreReveal>
        <HomeCta />
      </CoreReveal>
    </section>
  </div>
</template>

<style scoped>
.about-photo-track { height: 115vh; }
.about-photo-sticky { position: sticky; top: 0; height: 100vh; }

@media (prefers-reduced-motion: reduce) {
  .about-photo-track { height: 100vh; }
  .about-photo-sticky { position: static; height: 100vh; }
}
</style>