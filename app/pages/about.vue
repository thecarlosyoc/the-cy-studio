<script setup lang="ts">
import type { AboutSection } from '#shared/types/content'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lang = useLang()
const t = useT()

const seoTitle = `${t('about')} — the CY studio`
const seoDescription = t('aboutHeroText')
const seoImage = await useOgImage('about')

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
const photoText1Ref = ref<HTMLElement | null>(null)
const photoText2Ref = ref<HTMLElement | null>(null)
let photoSt: ScrollTrigger | undefined

function setupPhotoScroll() {
  if (!photoTrackRef.value || !photoImgRef.value) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  gsap.set(photoImgRef.value, { scale: 1.18 })
  // Two lines share the held photo: the first fades out as the second fades in.
  // Without motion both show statically (see the reduced-motion CSS below).
  const [t1, t2] = [photoText1Ref.value, photoText2Ref.value]
  const setT1 = t1 ? gsap.quickSetter(t1, 'opacity') : null
  const setT1y = t1 ? gsap.quickSetter(t1, 'y', 'px') : null
  const setT2 = t2 ? gsap.quickSetter(t2, 'opacity') : null
  const setT2y = t2 ? gsap.quickSetter(t2, 'y', 'px') : null
  if (t1 && t2) gsap.set([t1, t2], { opacity: 0, y: 12 })
  const ramp = (p: number, a: number, b: number) => Math.min(Math.max((p - a) / (b - a), 0), 1)

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
      const in1 = ramp(self.progress, 0.08, 0.22)
      const out1 = ramp(self.progress, 0.45, 0.55)
      const in2 = ramp(self.progress, 0.5, 0.62)
      setT1?.(in1 - out1)
      setT1y?.(12 * (1 - in1) - 12 * out1)
      setT2?.(in2)
      setT2y?.(12 * (1 - in2))
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
      class="about-photo-track relative -mx-6 md:-mx-32 overflow-clip bg-paper"
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
        <div class="about-photo-texts absolute inset-0 grid place-items-center px-6 text-center font-display font-normal text-[32px] md:text-[40px] leading-[1.1] text-white [text-shadow:0_2px_24px_rgb(0_0_0/0.35)]">
          <p ref="photoText1Ref" class="col-start-1 row-start-1 max-w-4xl md:max-w-none md:whitespace-nowrap">
            <template v-for="(part, i) in t('aboutPhotoText1').split('*')" :key="i"><strong v-if="i % 2" class="font-bold">{{ part }}</strong><template v-else>{{ part }}</template></template>
          </p>
          <p ref="photoText2Ref" class="col-start-1 row-start-1 max-w-4xl md:max-w-none md:whitespace-nowrap">
            <template v-for="(part, i) in t('aboutPhotoText2').split('*')" :key="i"><strong v-if="i % 2" class="font-bold">{{ part }}</strong><template v-else>{{ part }}</template></template>
          </p>
        </div>
        <div
          class="absolute inset-0 pointer-events-none"
          style="background: linear-gradient(180deg, rgb(var(--color-paper)) 0%, rgb(var(--color-paper) / 0) 35%);"
        />
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

    <section class="px-6 md:px-12 pb-16 md:pb-24 max-w-4xl mx-auto">
      <CoreReveal>
        <HomeCta />
      </CoreReveal>
    </section>
  </div>
</template>

<style scoped>
.about-photo-track { height: 300vh; }
.about-photo-sticky { position: sticky; top: 0; height: 100vh; }

@media (prefers-reduced-motion: reduce) {
  .about-photo-track { height: 100vh; }
  .about-photo-sticky { position: static; height: 100vh; }
  .about-photo-texts { display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 1rem; }
}
</style>