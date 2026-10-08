<script setup lang="ts">
import { SERVICES } from '#shared/data/services'
import { SERVICE_SHOWCASE } from '#shared/data/servicesShowcase'
import type { Service, ServicePillar } from '#shared/types/content'

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

// Casos publicados: cada pilar muestra uno como ejemplo real (shared/data/servicesShowcase.ts).
// Si /api/work falla, la página sigue igual, solo sin ejemplos.
const { data: workItems } = await useWorkItems()

// `work`: solo en los pilares cuyo filtro de /work tiene casos de ese tipo (web no tiene uno propio).
const groups = computed(() => ([
  { pillar: 'product', title: t('servicesPillarProduct'), intro: t('servicesPillarProductIntro'), work: '/work' },
  { pillar: 'web', title: t('servicesPillarWeb'), intro: t('servicesPillarWebIntro') },
  { pillar: 'brand', title: t('servicesPillarBrand'), intro: t('servicesPillarBrandIntro'), work: '/work?type=brand' },
  { pillar: 'motion', title: t('servicesPillarMotion'), intro: t('servicesPillarMotionIntro') },
] as { pillar: ServicePillar; title: string; intro: string; work?: string }[])
  .map((g) => ({ ...g, items: SERVICES.filter((s) => s.pillar === g.pillar), example: exampleFor(g.pillar) })))

// Ejemplo listo para pintar: de un caso de /work o propio (ver servicesShowcase.ts).
function exampleFor(pillar: ServicePillar) {
  const sc = SERVICE_SHOWCASE[pillar]
  const note = sc.note[lang.value]
  if (!sc.work) {
    if (!sc.image || !sc.title || !sc.to) return undefined
    return { title: sc.title[lang.value], note, image: sc.image, to: sc.to, ctaLabel: t('servicesSeeSite'), trackId: pillar }
  }
  const item = workItems.value?.find((w) => w.slug === sc.work)
  if (!item) return undefined
  // Visual de portada o, si el caso no marcó uno, el más ancho del mosaico.
  const video = sc.media === 'video'
    ? getCoverVisual(item.visuals) ?? [...item.visuals].filter((v) => v.url).sort((a, b) => (b.colSpan ?? 1) - (a.colSpan ?? 1))[0]
    : undefined
  return {
    title: item.title[lang.value],
    note,
    image: getCoverImage(item.gallery)?.url ?? '',
    video,
    to: `/work/${item.slug}`,
    ctaLabel: t('servicesSeeCase'),
    demoUrl: item.demoUrl,
    trackId: item.slug,
  }
}

const terms = computed(() => [t('servicesTerm1'), t('servicesTerm2'), t('servicesTerm3'), t('servicesTerm4')])

const tagClass = 'font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft'

// CTA flotante: visible solo entre el botón del encabezado y el CTA final.
const headerCtaEl = ref<HTMLElement | null>(null)
const endCtaEl = ref<HTMLElement | null>(null)
const headerOut = ref(false)
const endIn = ref(false)
const showFloat = computed(() => headerOut.value && !endIn.value)
let floatObserver: IntersectionObserver | undefined
onMounted(() => {
  floatObserver = new IntersectionObserver((entries) => {
    for (const e of entries) {
      // "Fuera" solo cuando quedó arriba; al cargar la página más abajo también cuenta.
      if (e.target === headerCtaEl.value) headerOut.value = !e.isIntersecting && e.boundingClientRect.top < 0
      else endIn.value = e.isIntersecting
    }
  // El Navbar fijo tapa los primeros ~80px: bajo él, el botón ya no está "a la vista".
  }, { rootMargin: '-80px 0px 0px 0px' })
  if (headerCtaEl.value) floatObserver.observe(headerCtaEl.value)
  if (endCtaEl.value) floatObserver.observe(endCtaEl.value)
})
onUnmounted(() => floatObserver?.disconnect())

// Número fijo por servicio (01, 02…) para que el mismo número sirva en piezas de redes.
const number = (s: Service) => String(SERVICES.indexOf(s) + 1).padStart(2, '0')

// WhatsApp Business del studio (+502 5212 8955), el mismo de /contact.
function whatsappHref(s: Service) {
  const message = t('servicesWhatsappPrefill').replace('{service}', s.title[lang.value])
  return `https://wa.me/50252128955?text=${encodeURIComponent(message)}`
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
        <div ref="headerCtaEl" class="mt-6">
          <CoreControl variant="solid" to="/quote">{{ t('quoteCta') }}</CoreControl>
        </div>
      </header>

      <section
        v-for="group in groups"
        :key="group.pillar"
        :aria-labelledby="`services-${group.pillar}`"
        class="mt-16 md:mt-24"
      >
        <CoreReveal class="flex flex-wrap items-end justify-between gap-x-6 gap-y-4">
          <div>
            <h2 :id="`services-${group.pillar}`" class="font-display font-bold text-[28px] md:text-[40px] leading-tight text-ink">
              {{ group.title }}
            </h2>
            <p class="mt-2 text-ink-soft text-base md:text-lg">{{ group.intro }}</p>
          </div>
          <CoreControl v-if="group.work" variant="link" :to="group.work">
            {{ t('servicesSeeWork') }}
          </CoreControl>
        </CoreReveal>

        <!--
          Desktop: el ejemplo a la izquierda, fijo mientras pasan las tarjetas a la derecha.
          Móvil: el ejemplo arriba y las tarjetas debajo.
        -->
        <div class="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-8">
          <div v-if="group.example" class="lg:sticky lg:top-28 lg:self-start">
            <CoreReveal>
              <ServicesShowcase v-bind="group.example" />
            </CoreReveal>
          </div>

          <ul class="space-y-4" :class="{ 'lg:col-span-2': !group.example }">
            <li v-for="s in group.items" :key="s.slug">
              <CoreReveal>
                <!--
                  El id es el ancla para compartir un servicio: /services#brand-identity.
                  Motion (ver estilos): al entrar en pantalla, las palomitas de "Qué recibes" se
                  dibujan una tras otra; con puntero fino, el hover (o el foco dentro) llena la
                  tarjeta de cobalto tenue desde abajo, el mismo estado que "elegido" en /quote.
                -->
                <article
                  :id="s.slug"
                  class="svc-card relative isolate scroll-mt-28 overflow-hidden rounded-[24px] border border-ink/15 p-5 md:p-6"
                >
                  <!-- En móvil el tiempo va arriba del título para que este no se parta en tres líneas. -->
                  <div class="flex flex-col-reverse items-start gap-3 sm:flex-row sm:justify-between sm:gap-4">
                    <h3 class="font-display font-bold text-xl md:text-[22px] leading-tight text-ink">
                      <span :class="[tagClass, 'mr-2 align-[3px]']">{{ number(s) }}</span>{{ s.title[lang] }}
                    </h3>
                    <p class="shrink-0 rounded-full border border-ink/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[.16em] text-ink">
                      <span class="sr-only">{{ t('servicesTimeline') }}: </span>{{ s.timeline[lang] }}
                    </p>
                  </div>
                  <p class="mt-2 text-ink-soft">{{ s.summary[lang] }}</p>
                  <ServicesMotionDemo v-if="s.slug === 'ui-motion'" class="mt-4" />

                  <h4 class="sr-only">{{ t('servicesDeliverables') }}</h4>
                  <ul class="mt-4 grid grid-cols-1 gap-x-6 gap-y-2 text-sm text-ink sm:grid-cols-2">
                    <li v-for="(d, i) in s.deliverables" :key="d.es" class="flex gap-2.5" :style="{ '--i': i }">
                      <svg viewBox="0 0 16 16" class="mt-[2px] h-4 w-4 shrink-0 text-cobalt" fill="none" aria-hidden="true" focusable="false">
                        <circle class="svc-check-ring" cx="8" cy="8" r="7.25" stroke="currentColor" stroke-width="1.5" pathLength="1" />
                        <path class="svc-check-tick" d="M5 8.25l2 2 4-4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" pathLength="1" />
                      </svg>
                      <span>{{ d[lang] }}</span>
                    </li>
                  </ul>

                  <p class="mt-4 text-sm text-ink-soft">
                    <span class="font-medium text-ink">{{ t('servicesIdealFor') }}:</span> {{ s.idealFor[lang] }}
                  </p>

                  <div class="mt-5 flex flex-wrap items-center gap-x-6 gap-y-3">
                    <CoreControl
                      variant="soft"
                      :to="`/quote?service=${s.slug}`"
                      @click="track('service_estimate_clicked', { service: s.slug, lang })"
                    >
                      <CoreSwapLabel :text="t('quoteCta')" icon-position="end">
                        <template #icon>
                          <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
                            <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                          </svg>
                        </template>
                      </CoreSwapLabel>
                    </CoreControl>
                    <CoreControl
                      variant="link"
                      class="underline decoration-ink/30 underline-offset-4 hover:decoration-ink"
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
        </div>
      </section>

      <CoreReveal class="mt-16 md:mt-24">
        <section aria-labelledby="services-how" class="max-w-3xl">
          <h2 id="services-how" class="font-display font-bold text-[28px] md:text-[40px] leading-tight text-ink">
            {{ t('servicesHowTitle') }}
          </h2>
          <p class="mt-4 text-ink-soft text-base md:text-lg">{{ t('servicesHowText') }}</p>
          <ul class="mt-6 space-y-3 text-ink text-base md:text-lg">
            <li v-for="term in terms" :key="term" class="flex gap-3">
              <span aria-hidden="true" class="mt-[11px] h-1.5 w-1.5 shrink-0 rounded-full bg-cobalt" />
              <span>{{ term }}</span>
            </li>
          </ul>
        </section>
      </CoreReveal>

      <div ref="endCtaEl" class="mt-12">
        <HomeCta />
      </div>
    </div>

    <!--
      CTA flotante: aparece cuando el botón del encabezado sale de pantalla y se va cuando
      llega el CTA final, para no repetir dos llamadas a la vez. Solo desde lg: en móvil
      tapaba la lista de entregables justo sobre el Dock, y cada tarjeta ya trae su propio
      "Calcula un estimado".
    -->
    <div
      class="svc-float fixed bottom-10 right-10 z-30 hidden lg:block"
      :class="{ 'is-on': showFloat }"
      :inert="!showFloat"
    >
      <CoreControl variant="solid" to="/quote" @click="track('services_float_cta_clicked', { lang })">
        <CoreSwapLabel :text="t('quoteCta')" icon-position="end">
          <template #icon>
            <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
              <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
          </template>
        </CoreSwapLabel>
      </CoreControl>
    </div>
  </div>
</template>

<style scoped>
/* Hover y foco: tinte cobalto que sube desde abajo (solo transform) y borde cobalto. */
.svc-card {
  transition: border-color 0.2s ease;
}
.svc-card::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  /* Filo cobalto arriba para que se lea que el relleno "sube"; es estático, no se anima. */
  background: rgb(var(--color-cobalt) / 0.07);
  box-shadow: inset 0 1px 0 rgb(var(--color-cobalt) / 0.25);
  transform: scaleY(0);
  transform-origin: bottom;
  transition: transform 0.5s cubic-bezier(0.23, 1, 0.32, 1);
}
.svc-card:focus-within {
  border-color: rgb(var(--color-cobalt));
}
.svc-card:focus-within::before {
  transform: none;
}
@media (hover: hover) and (pointer: fine) {
  .svc-card:hover {
    border-color: rgb(var(--color-cobalt));
  }
  .svc-card:hover::before {
    transform: none;
    transition-duration: 0.25s;
  }
}

/* Entrada: cada palomita se dibuja (aro desde las 12 y luego trazo) cuando CoreReveal muestra la tarjeta. */
.svc-check-ring {
  transform: rotate(-90deg);
  transform-origin: center;
}
.svc-check-ring,
.svc-check-tick {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}
.is-visible .svc-check-ring {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 0.5s cubic-bezier(0.23, 1, 0.32, 1) calc(0.35s + var(--i) * 0.06s);
}
.is-visible .svc-check-tick {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 0.3s cubic-bezier(0.23, 1, 0.32, 1) calc(0.6s + var(--i) * 0.06s);
}

.svc-float {
  opacity: 0;
  transform: translateY(12px);
  pointer-events: none;
  transition: opacity 0.2s ease-out, transform 0.3s cubic-bezier(0.23, 1, 0.32, 1);
}
.svc-float.is-on {
  opacity: 1;
  transform: none;
  pointer-events: auto;
}

@media (prefers-reduced-motion: reduce) {
  /* Reducido no es cero: el relleno aparece con un fundido corto en vez de subir. */
  .svc-card::before {
    transform: none;
    opacity: 0;
    transition: opacity 0.15s ease;
  }
  .svc-card:hover::before,
  .svc-card:focus-within::before {
    opacity: 1;
  }
  .svc-check-ring,
  .svc-check-tick {
    stroke-dashoffset: 0;
    transition: none !important;
  }
  .svc-float {
    transform: none;
  }
}
</style>
