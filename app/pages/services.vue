<script setup lang="ts">
import { SERVICES } from '#shared/data/services'
import type { DictKey } from '~/data/i18n'
import { SERVICE_SHOWCASE } from '#shared/data/servicesShowcase'

const t = useT()
const lang = useLang()

const seoTitle = () => `${t('servicesTitle')} — the CY studio`
const seoDescription = () => `${t('servicesHeroTitle')} ${t('servicesIntro')}`
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

// Casos publicados de /work: cada capítulo abre con uno real (shared/data/servicesShowcase.ts).
// Si /api/work falla, la página sigue igual, solo sin el activo.
const { data: workItems } = await useWorkItems()
const caseOf = (pillar: 'product' | 'brand' | 'motion') => workItems.value?.find((w) => w.slug === SERVICE_SHOWCASE[pillar].work)

// Producto: still image, the full 3.0 s frame (the video is near-blank for ~2 s per loop).
const brandCase = computed(() => caseOf('brand'))
const motionCase = computed(() => caseOf('motion'))
const motionVideo = computed(() => {
  const item = motionCase.value
  return item ? getCoverVisual(item.visuals) ?? [...item.visuals].filter((v) => v.url).sort((a, b) => (b.colSpan ?? 1) - (a.colSpan ?? 1))[0] : undefined
})

const chapters = computed(() => ([
  { id: 'product', n: '01', idx: t('servicesIdxProduct'), title: t('servicesPillarProduct'), intro: t('servicesPillarProductIntro'), caseLabel: t('servicesSeeCase'), caseTo: caseOf('product') ? `/work/${SERVICE_SHOWCASE.product.work}` : undefined, poster: '/images/services/payments-credits-poster.webp', alt: caseOf('product')?.title[lang.value] ?? t('servicesPillarProduct') },
  { id: 'web', n: '02', idx: t('servicesIdxWeb'), title: t('servicesPillarWeb'), intro: t('servicesPillarWebIntro'), caseLabel: t('servicesSeeWebCase'), caseTo: '/muebleros', alt: t('servicesPillarWeb') },
  { id: 'brand', n: '03', idx: t('servicesIdxBrand'), title: t('servicesPillarBrand'), intro: t('servicesPillarBrandIntro'), caseLabel: t('servicesSeeCase'), caseTo: brandCase.value ? `/work/${SERVICE_SHOWCASE.brand.work}` : undefined, poster: getCoverImage(brandCase.value?.gallery ?? [])?.url, alt: brandCase.value?.title[lang.value] ?? t('servicesPillarBrand') },
  { id: 'motion', n: '04', idx: t('servicesIdxMotion'), title: t('servicesPillarMotion'), intro: t('servicesPillarMotionIntro'), caseLabel: t('servicesSeeCase'), caseTo: motionCase.value ? `/work/${SERVICE_SHOWCASE.motion.work}` : undefined, poster: '/images/services/carbon-footprint-poster.webp', alt: motionCase.value?.title[lang.value] ?? t('servicesPillarMotion'), video: motionVideo.value },
]).map((c) => ({ ...c, rows: SERVICES.filter((s) => s.pillar === c.id) })))

const terms = computed(() => [1, 2, 3, 4].map((n) => ({ lead: t(`servicesTermLead${n}` as DictKey), caption: t(`servicesTerm${n}` as DictKey) })))
const faqs = computed(() => [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ q: t(`servicesFaq${n}Q` as DictKey), a: t(`servicesFaq${n}A` as DictKey) })))

// WhatsApp Business del studio (+502 5212 8955), el mismo de /contact.
const whatsapp = computed(() => `https://wa.me/50252128955?text=${encodeURIComponent(t('whatsappPrefill'))}`)

// /services#<slug> (social pieces, /quote): bring that service's column into view, the page and the
// rail at once (scrollIntoView moves both; scroll-margin and the rail's scroll-padding keep it clear of
// the nav and the gutter). Runs on load and on every hash change; :target marks the column.
const route = useRoute()
function openFromHash() {
  let id: string
  try {
    id = decodeURIComponent(location.hash.slice(1))
  } catch {
    return
  }
  const el = id ? document.getElementById(id) : null
  if (!el?.classList.contains('svc-card')) return
  requestAnimationFrame(() => el.scrollIntoView({ block: 'start', inline: 'start' }))
}
onMounted(openFromHash)
watch(() => route.hash, () => nextTick(openFromHash))

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
  <div class="bg-paper min-h-screen pt-[59px] md:pt-[68px]">
    <ServicesHero />
    <ServicesAreas :areas="chapters" />

    <ServicesRail :chapters="chapters" />

    <ServicesThreshold :line="t('servicesThresholdLine')" />

    <section aria-labelledby="services-how" class="flex flex-col gap-10 px-6 pb-24 md:pt-28 md:gap-16 md:px-16 md:pb-[152px]">
      <CoreSectionHead title-id="services-how" end-on-desktop>{{ t('servicesFlowTitle') }}</CoreSectionHead>
      <HomeProcessRail prefix="servicesFlow" />
    </section>

    <section aria-labelledby="services-terms" class="flex flex-col gap-10 px-6 pb-24 md:gap-16 md:px-16 md:pb-32">
      <CoreSectionHead title-id="services-terms" :intro="t('servicesTermsIntro')">{{ t('servicesTermsTitle') }}</CoreSectionHead>
      <ul class="grid grid-cols-1 gap-6 md:grid-cols-4">
        <CoreFact v-for="(f, i) in terms" :key="i" size="terms" :lead="f.lead" :caption="f.caption" :index="i" />
      </ul>
    </section>

    <section aria-labelledby="services-faq" class="grid grid-cols-1 gap-10 px-6 pb-24 md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-16 md:px-16 md:pb-32">
      <CoreSectionHead title-id="services-faq">{{ t('servicesFaqTitle') }}</CoreSectionHead>
      <div class="flex flex-col items-start gap-6">
        <ul class="w-full border-t border-ink/15">
          <li v-for="(f, i) in faqs" :key="i"><ServicesFaqItem :question="f.q" :answer="f.a" /></li>
        </ul>
        <CoreControl variant="link" :to="whatsapp" target="_blank" rel="noopener noreferrer">{{ t('servicesFaqMore') }}</CoreControl>
      </div>
    </section>

    <HomeCtaBand
      :title="t('servicesCloseTitle')"
      :text="t('servicesCloseText')"
      :button-label="t('quoteCta')"
      button-to="/quote"
      :secondary-label="t('servicesCloseWhatsapp')"
      :secondary-href="whatsapp"
      compact
    />
  </div>
</template>

