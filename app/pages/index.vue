<script setup lang="ts">
import type { WorkItem } from '#shared/types/content'
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

const { data: workItems } = await useFetch<WorkItem[]>('/api/work')

const digitalProducts = computed(() => workItems.value?.filter((i) => i.type === 'product') ?? [])
const brandingProjects = computed(() => workItems.value?.filter((i) => i.type === 'brand') ?? [])
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
          <div class="marquee flex gap-4 w-max">
            <CardProduct
              v-for="(p, i) in [...digitalProducts, ...digitalProducts]"
              :key="`${p.slug}-${i}`"
              :title="p.title[lang]"
              :image="p.gallery[0]"
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
          <div class="marquee marquee-reverse flex gap-4 w-max">
            <CardProduct
              v-for="(p, i) in [...brandingProjects, ...brandingProjects]"
              :key="`${p.slug}-${i}`"
              :title="p.title[lang]"
              :image="p.gallery[0]"
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

<style>
@keyframes marquee-scroll {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}
.marquee {
  animation: marquee-scroll 28s linear infinite;
}
.marquee-reverse {
  animation-direction: reverse;
}
.marquee:hover {
  animation-play-state: paused;
}
@media (prefers-reduced-motion: reduce) {
  .marquee {
    animation: none;
  }
}
</style>