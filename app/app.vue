<!-- app/app.vue -->
<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger'

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

// Canonical al dominio propio (el alias de vercel.app no compite en Google) y una URL por
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

// Datos estructurados del sitio: quién es la persona detrás y qué sitio es. Los casos
// (work/[slug].vue) enlazan a este Person por su @id como creador.
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
                  '@id': `${ORIGIN}/#person`,
                  name: 'Carlos Yoc',
                  jobTitle: t('heroSignRole'),
                  url: `${ORIGIN}/about`,
                  email: 'mailto:hola@thecystudio.com',
                  address: { '@type': 'PostalAddress', addressCountry: 'GT' },
                  sameAs: ['https://www.linkedin.com/in/carlosyoc'],
                },
                {
                  '@type': 'WebSite',
                  '@id': `${ORIGIN}/#website`,
                  name: 'the CY studio',
                  url: `${ORIGIN}/`,
                  inLanguage: ['es', 'en'],
                  publisher: { '@id': `${ORIGIN}/#person` },
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

onMounted(() => {
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }
  window.addEventListener('load', () => ScrollTrigger.refresh())
})
</script>

<template>
  <div class="bg-paper min-h-screen" style="overflow-x: clip;">
    <NavNavbar />
    <div :class="isAdminRoute || route.path === '/' ? '' : 'pb-28 md:pb-0'">
      <main>
        <NuxtPage />
      </main>
      <SiteFooter v-show="!isAdminRoute && route.path !== '/'" class="mx-6 mb-10 md:mx-16" />
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