<script setup lang="ts">
import type { AboutSection } from '#shared/types/content'

const lang = useLang()
const t = useT()

const seoTitle = () => `${t('about')} — the CY studio`
const seoDescription = () => t('aboutHeroText')
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
</script>

<template>
  <div class="bg-paper">
    <CoreReveal>
      <AboutHero />
    </CoreReveal>

    <div
      class="about-photo-track relative -mx-6 md:-mx-32 overflow-clip bg-paper"
      style="width: 100vw; margin-left: calc(-50vw + 50%); margin-right: calc(-50vw + 50%);"
    >
      <!-- bg-paper: Safari tiñe su barra con este bloque; sin fondo propio cae en blanco. -->
      <div class="about-photo-sticky relative overflow-hidden bg-paper">
        <!-- La foto se disuelve en paper abajo: Safari tiñe su barra con lo que ve en el borde inferior. -->
        <div
          class="about-photo-zoom absolute inset-0"
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
        <div class="about-photo-texts absolute inset-0 flex flex-col items-center justify-center gap-4 px-6 text-center font-display font-normal text-[32px] md:text-[40px] leading-[1.1] text-white [text-shadow:0_2px_24px_rgb(0_0_0/0.35)]">
          <p class="about-photo-text-1 col-start-1 row-start-1 max-w-4xl md:max-w-none md:whitespace-nowrap">
            <template v-for="(part, i) in t('aboutPhotoText1').split('*')" :key="i"><strong v-if="i % 2" class="font-bold">{{ part }}</strong><template v-else>{{ part }}</template></template>
          </p>
          <p class="about-photo-text-2 col-start-1 row-start-1 max-w-4xl md:max-w-none md:whitespace-nowrap">
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
/* Static by default: reduced motion and browsers without scroll-driven
   animations stay here, with the photo at rest and both lines stacked. */
.about-photo-track { height: 100vh; }
.about-photo-sticky { height: 100vh; }

/* The first line fades out as the second fades in, over the held photo.
   Percentages are progress through the 300vh track. */
@keyframes about-photo-zoom {
  from { transform: scale(1.18); }
  to { transform: scale(1); }
}
@keyframes about-photo-text-1 {
  0%, 8% { opacity: 0; transform: translateY(12px); }
  22%, 45% { opacity: 1; transform: translateY(0); }
  55%, 100% { opacity: 0; transform: translateY(-12px); }
}
@keyframes about-photo-text-2 {
  0%, 50% { opacity: 0; transform: translateY(12px); }
  62%, 100% { opacity: 1; transform: translateY(0); }
}

@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .about-photo-track { height: 300vh; view-timeline: --about-photo block; }
    .about-photo-sticky { position: sticky; top: 0; }
    .about-photo-texts { display: grid; place-items: center; gap: 0; }

    .about-photo-zoom { animation: about-photo-zoom linear both; }
    .about-photo-text-1 { animation: about-photo-text-1 linear both; }
    .about-photo-text-2 { animation: about-photo-text-2 linear both; }

    /* `contain` on a track taller than the viewport runs from its top at the
       viewport top to its bottom at the viewport bottom: the hold. */
    .about-photo-zoom,
    .about-photo-text-1,
    .about-photo-text-2 {
      animation-timeline: --about-photo;
      animation-range: contain;
    }
  }
}
</style>
