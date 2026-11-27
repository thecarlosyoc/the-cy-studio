<!-- app/app.vue -->
<script setup lang="ts">
const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

// Defense in depth alongside robots.txt: the admin panel must never be indexed.
// Done here rather than in the `admin` middleware so /admin/login (which has no
// middleware) is covered too.
useSeoMeta({
  robots: () => (isAdminRoute.value ? 'noindex, nofollow' : null),
})

// Color de la barra del navegador: mismo paper que el fondo, claro y oscuro. Fijo: el hero mobile
// ya no llega a los bordes, así que las barras de Safari iOS siempre quedan sobre paper.
useHead({
  meta: [
    { name: 'theme-color', content: '#F1EFEA', media: '(prefers-color-scheme: light)' },
    { name: 'theme-color', content: '#12110E', media: '(prefers-color-scheme: dark)' },
  ],
})

// Canonical al dominio propio (el alias workers.dev no compite en Google) y una URL por
// idioma: español sin parámetro, inglés con ?lang=en, enlazadas con hreflang.
const ORIGIN = 'https://www.thecystudio.com'
const lang = useLang()
const t = useT()
const router = useRouter()
const urlFor = (l: 'es' | 'en') => `${ORIGIN}${route.path}${l === 'en' ? '?lang=en' : ''}`
useHead({
  htmlAttrs: { lang },
  link: () => [
    { rel: 'canonical', href: urlFor(lang.value) },
    ...(isAdminRoute.value
      ? []
      : [
          { rel: 'alternate', hreflang: 'es', href: urlFor('es') },
          { rel: 'alternate', hreflang: 'en', href: urlFor('en') },
          { rel: 'alternate', hreflang: 'x-default', href: urlFor('es') },
        ]),
  ],
})

// Datos estructurados del sitio: la persona, el studio y el sitio, enlazados por @id. Los casos
// (work/[slug].vue) y /services enlazan a este Person por su @id.
// sameAs: solo perfiles que el sitio ya enlaza (navbar y footer). El studio no tiene perfiles propios aún.
const PERSON_ID = `${ORIGIN}/#person`
const STUDIO_ID = `${ORIGIN}/#studio`
useHead({
  script: () =>
    isAdminRoute.value
      ? []
      : [
          {
            type: 'application/ld+json',
            innerHTML: JSON.stringify({
              '@context': 'https://schema.org',
              '@graph': [
                {
                  '@type': 'Person',
                  '@id': PERSON_ID,
                  name: 'Carlos Yoc',
                  jobTitle: t('heroSignRole'),
                  url: `${ORIGIN}/about`,
                  email: 'mailto:hola@thecystudio.com',
                  address: { '@type': 'PostalAddress', addressCountry: 'GT' },
                  worksFor: { '@id': STUDIO_ID },
                  sameAs: ['https://www.linkedin.com/in/carlosyoc'],
                },
                {
                  '@type': 'ProfessionalService',
                  '@id': STUDIO_ID,
                  name: 'the CY studio',
                  url: `${ORIGIN}/`,
                  logo: `${ORIGIN}/apple-touch-icon.png`,
                  image: `${ORIGIN}/apple-touch-icon.png`,
                  description: t('homeSeoDescription'),
                  email: 'mailto:hola@thecystudio.com',
                  telephone: '+50252128955',
                  address: { '@type': 'PostalAddress', addressCountry: 'GT' },
                  areaServed: [{ '@type': 'Country', name: 'Guatemala' }, 'Worldwide'],
                  founder: { '@id': PERSON_ID },
                  employee: { '@id': PERSON_ID },
                  hasOfferCatalog: {
                    '@type': 'OfferCatalog',
                    name: t('servicesIdxLabel'),
                    url: `${ORIGIN}/services`,
                    itemListElement: (['servicesPillarProduct', 'servicesPillarWeb', 'servicesPillarBrand', 'servicesPillarMotion'] as const).map((k) => ({
                      '@type': 'Offer',
                      itemOffered: { '@type': 'Service', name: t(k) },
                    })),
                  },
                },
                {
                  '@type': 'WebSite',
                  '@id': `${ORIGIN}/#website`,
                  name: 'the CY studio',
                  url: `${ORIGIN}/`,
                  inLanguage: ['es', 'en'],
                  publisher: { '@id': STUDIO_ID },
                },
              ],
            }).replace(/</g, '\\u003c'),
          },
        ],
})

// El switch y los enlaces internos no llevan ?lang: la URL sigue al idioma activo.
// (ponytail: los <a> del HTML del servidor apuntan a la versión en español; Google
// descubre el inglés por hreflang y el sitemap.)
watch(
  [lang, () => route.query.lang],
  ([l, q]) => {
    const want = l === 'en' ? 'en' : undefined
    if (q !== want) router.replace({ query: { ...route.query, lang: want } })
  },
)
// The home and /services close with the cobalt band, which carries its own footer.
const ownsFooter = computed(() => route.name === 'index' || route.name === 'services')
</script>

<template>
  <div class="bg-paper min-h-screen" style="overflow-x: clip;">
    <NavNavbar />
    <div :class="isAdminRoute || ownsFooter ? '' : 'pb-28 md:pb-0'">
      <main>
        <NuxtPage />
      </main>
      <SiteFooter v-if="!isAdminRoute && !ownsFooter" class="mx-6 mb-10 md:mx-16" />
    </div>
    <NavDock v-if="!isAdminRoute" />
    <CoreCursor v-if="!isAdminRoute" />
    <PageLoading v-if="!isAdminRoute" />
    <SiteSplash v-if="!isAdminRoute" />
  </div>
</template>

<style>
:root {
  --navbar-height: 96px;
}

.page-enter-active {
  transition:
    opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1),
    transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: opacity, transform;
}
.page-enter-from {
  opacity: 0;
  transform: translateY(20px) scale(0.985);
}
.page-leave-active {
  transition:
    opacity 0.16s ease-out,
    transform 0.16s ease-out;
  will-change: opacity, transform;
}
.page-leave-from {
  opacity: 1;
  transform: none;
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }
  .page-enter-from,
  .page-leave-to {
    opacity: 0;
    transform: none;
  }
}
</style>