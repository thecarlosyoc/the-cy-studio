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

// Producto: still image (the video is near-blank for ~2 s per loop). Crop boxes (x, w of the 1280x720 frame) from Figma.
const PRODUCT_CROP = { desktop: { x: 270, w: 860 }, mobile: { x: 300, w: 700 } }
const brandCase = computed(() => caseOf('brand'))
const motionCase = computed(() => caseOf('motion'))
const motionVideo = computed(() => {
  const item = motionCase.value
  return item ? getCoverVisual(item.visuals) ?? [...item.visuals].filter((v) => v.url).sort((a, b) => (b.colSpan ?? 1) - (a.colSpan ?? 1))[0] : undefined
})

const chapters = computed(() => ([
  { id: 'product', n: '01', idx: t('servicesIdxProduct'), title: t('servicesPillarProduct'), intro: t('servicesPillarProductIntro'), caseLabel: t('servicesSeeCase'), caseTo: caseOf('product') ? `/work/${SERVICE_SHOWCASE.product.work}` : undefined, poster: '/images/services/payments-credits-poster.webp', alt: caseOf('product')?.title[lang.value] ?? t('servicesPillarProduct'), crop: PRODUCT_CROP },
  { id: 'web', n: '02', idx: t('servicesIdxWeb'), title: t('servicesPillarWeb'), intro: t('servicesPillarWebIntro'), caseLabel: t('servicesSeeWebCase'), caseTo: '/muebleros', alt: t('servicesPillarWeb') },
  { id: 'brand', n: '03', idx: t('servicesIdxBrand'), title: t('servicesPillarBrand'), intro: t('servicesPillarBrandIntro'), caseLabel: t('servicesSeeCase'), caseTo: brandCase.value ? `/work/${SERVICE_SHOWCASE.brand.work}` : undefined, poster: getCoverImage(brandCase.value?.gallery ?? [])?.url, alt: brandCase.value?.title[lang.value] ?? t('servicesPillarBrand') },
  { id: 'motion', n: '04', idx: t('servicesIdxMotion'), title: t('servicesPillarMotion'), intro: t('servicesPillarMotionIntro'), caseLabel: t('servicesSeeCase'), caseTo: motionCase.value ? `/work/${SERVICE_SHOWCASE.motion.work}` : undefined, poster: '/images/services/carbon-footprint-poster.webp', alt: motionCase.value?.title[lang.value] ?? t('servicesPillarMotion'), video: motionVideo.value },
]).map((c) => ({ ...c, rows: SERVICES.filter((s) => s.pillar === c.id) })))

const terms = computed(() => [1, 2, 3, 4].map((n) => ({ lead: t(`servicesTermLead${n}` as DictKey), caption: t(`servicesTerm${n}` as DictKey) })))
const faqs = computed(() => [1, 2, 3, 4, 5, 6, 7, 8].map((n) => ({ q: t(`servicesFaq${n}Q` as DictKey), a: t(`servicesFaq${n}A` as DictKey) })))

// WhatsApp Business del studio (+502 5212 8955), el mismo de /contact.
const whatsapp = computed(() => `https://wa.me/50252128955?text=${encodeURIComponent(t('whatsappPrefill'))}`)

// /services#<slug>: Chrome does not open a <details> from the hash, so open the row, then bring it
// under the nav and the sticky index (scroll-margin on the row). Runs on load and on every hash change
// (links, back/forward, router pushes). Opening a row collapses its same-name sibling, so the scroll
// waits for that collapse (the details-content transition) to land on the final position.
const route = useRoute()
function openFromHash() {
  let id: string
  try {
    id = decodeURIComponent(location.hash.slice(1))
  } catch {
    return
  }
  const el = id ? document.getElementById(id) : null
  if (!(el instanceof HTMLDetailsElement)) return
  const collapsing = !!el.name && [...document.querySelectorAll<HTMLDetailsElement>(`details[name="${CSS.escape(el.name)}"][open]`)].some((d) => d !== el)
  el.open = true
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  const go = () => el.scrollIntoView({ block: 'start' })
  if (collapsing && !reduce) setTimeout(go, 320)
  else requestAnimationFrame(go)
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
    <!-- One parent for the index and the chapters: the sticky index releases when the Motion chapter ends. -->
    <div>
    <ServicesPillarIndex />

    <section
      v-for="c in chapters"
      :id="`area-${c.id}`"
      :key="c.id"
      :aria-labelledby="`services-${c.id}`"
      class="scroll-mt-32 pb-24 md:pb-32"
    >
      <ServicesPillarBand
        :eyebrow="`${c.n} / ${c.idx}`"
        :title="c.title"
        :intro="c.intro"
        :case-label="c.caseLabel"
        :case-to="c.caseTo"
        :title-id="`services-${c.id}`"
        :poster="c.poster"
        :poster-alt="c.alt"
        :video="c.video"
        :crop="c.crop"
      >
        <template v-if="c.id === 'web'" #media>
          <!-- Mobile clips the frame like Figma (top-aligned); desktop centers 701x480 in the 560 band. -->
          <CoreBrowserFrame
            url="thecystudio.com/muebleros"
            class="absolute inset-x-6 top-0 aspect-[392/287] md:inset-x-auto md:left-1/2 md:top-10 md:aspect-auto md:h-[480px] md:w-[701px] md:-translate-x-1/2"
          >
            <NuxtImg src="/images/services/muebleros-1440.webp" :alt="c.alt" width="1440" loading="lazy" sizes="100vw md:701px" class="h-full w-full object-cover object-top" />
          </CoreBrowserFrame>
        </template>
      </ServicesPillarBand>
      <ul class="px-6 md:px-16">
        <li v-for="s in c.rows" :key="s.slug"><ServicesRow :service="s" /></li>
      </ul>
    </section>
    </div>

    <section aria-labelledby="services-how" class="flex flex-col gap-10 px-6 pb-24 md:gap-16 md:px-16 md:pb-[152px]">
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

