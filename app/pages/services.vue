<script setup lang="ts">
import { SERVICES } from '~/data/services'
import type { Service } from '#shared/types/content'

const { $track: track } = useNuxtApp()

const t = useT()
const lang = useLang()

const seoTitle = () => `${t('servicesTitle')} — the CY studio`
const seoDescription = () => t('servicesIntro')
const seoImage = await useOgImage('home')

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

// Mismo orden que el sitio: producto primero, marca después.
const groups = computed(() => [
  { type: 'product', title: t('homeProductsTitle'), intro: t('homeProductsIntro') },
  { type: 'brand', title: t('homeBrandingTitle'), intro: t('homeBrandingIntro') },
].map((g) => ({ ...g, items: SERVICES.filter((s) => s.type === g.type) })))

// Número fijo por servicio (01–08) para que el mismo número sirva en piezas de redes.
const number = (s: Service) => String(SERVICES.indexOf(s) + 1).padStart(2, '0')

function whatsappHref(s: Service) {
  const message = t('servicesWhatsappPrefill').replace('{service}', s.title[lang.value])
  return `https://wa.me/50245858629?text=${encodeURIComponent(message)}`
}

// Catálogo para buscadores: los servicios cuelgan del mismo Person que define app.vue. Sin precios.
const ORIGIN = 'https://www.thecystudio.com'
useHead({
  script: () => [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'OfferCatalog',
        name: t('servicesTitle'),
        url: `${ORIGIN}/services${lang.value === 'en' ? '?lang=en' : ''}`,
        itemListElement: SERVICES.map((s) => ({
          '@type': 'Offer',
          itemOffered: {
            '@type': 'Service',
            name: s.title[lang.value],
            description: s.summary[lang.value],
            provider: { '@id': `${ORIGIN}/#person` },
            areaServed: 'Worldwide',
          },
        })),
      }),
    },
  ],
})
</script>

<template>
  <div class="bg-paper min-h-screen pt-28 md:pt-32 pb-24">
    <div class="px-6 md:px-12 max-w-6xl mx-auto w-full">
      <header class="max-w-3xl">
        <h1 class="font-display font-bold text-[40px] md:text-[64px] leading-tight text-ink">
          {{ t('servicesTitle') }}
        </h1>
        <p class="mt-4 md:mt-6 text-ink-soft text-lg">
          {{ t('servicesIntro') }}
        </p>
      </header>

      <section
        v-for="group in groups"
        :key="group.type"
        :aria-labelledby="`services-${group.type}`"
        class="mt-16 md:mt-24"
      >
        <CoreReveal>
          <h2 :id="`services-${group.type}`" class="font-display font-bold text-[28px] md:text-[40px] leading-tight text-ink">
            {{ group.title }}
          </h2>
          <p class="mt-2 text-ink-soft text-base md:text-lg">{{ group.intro }}</p>
        </CoreReveal>

        <ul class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <li v-for="s in group.items" :key="s.slug">
            <CoreReveal>
              <!-- El id es el ancla para compartir un servicio: /services#brand-identity -->
              <article
                :id="s.slug"
                class="flex h-full scroll-mt-28 flex-col rounded-[28px] border border-ink/15 p-6 md:p-8"
              >
                <p class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">
                  {{ number(s) }}
                </p>
                <h3 class="mt-3 font-display font-bold text-2xl text-ink">
                  {{ s.title[lang] }}
                </h3>
                <p class="mt-2 text-ink-soft">{{ s.summary[lang] }}</p>
  
                <h4 class="mt-6 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">
                  {{ t('servicesDeliverables') }}
                </h4>
                <ul class="mt-3 space-y-2 text-ink">
                  <li v-for="d in s.deliverables" :key="d.es" class="flex gap-3">
                    <span aria-hidden="true" class="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-cobalt" />
                    <span>{{ d[lang] }}</span>
                  </li>
                </ul>
  
                <dl class="mt-6 grid grid-cols-1 sm:grid-cols-[auto_1fr] gap-x-6 gap-y-3 border-t border-ink/15 pt-6">
                  <dt class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft sm:pt-[3px]">
                    {{ t('servicesTimeline') }}
                  </dt>
                  <dd class="text-ink">{{ s.timeline[lang] }}</dd>
                  <dt class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft sm:pt-[3px]">
                    {{ t('servicesIdealFor') }}
                  </dt>
                  <dd class="text-ink">{{ s.idealFor[lang] }}</dd>
                </dl>
  
                <div class="mt-auto pt-8">
                  <CoreControl
                    variant="soft"
                    :to="whatsappHref(s)"
                    target="_blank"
                    rel="noopener noreferrer"
                    @click="track('service_quote_clicked', { service: s.slug, lang })"
                  >
                    {{ t('servicesQuote') }}
                  </CoreControl>
                </div>
              </article>
            </CoreReveal>
          </li>
        </ul>
      </section>

      <CoreReveal class="mt-16 md:mt-24">
        <section aria-labelledby="services-how" class="max-w-3xl">
          <h2 id="services-how" class="font-display font-bold text-[28px] md:text-[40px] leading-tight text-ink">
            {{ t('servicesHowTitle') }}
          </h2>
          <p class="mt-4 text-ink-soft text-base md:text-lg">{{ t('servicesHowText') }}</p>
        </section>
      </CoreReveal>

      <div class="mt-12">
        <HomeCta />
      </div>
    </div>
  </div>
</template>
