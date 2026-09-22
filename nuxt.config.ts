// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxt/fonts', '@vercel/analytics'],
  css: ['~/assets/css/main.css'],
  app: {
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      // No locale routing exists, so 'es' is the site's effective default language.
      htmlAttrs: { lang: 'es' },
      // Fallback only: every public page sets its own full title via useSeoMeta.
      // Deliberately no titleTemplate — page titles already carry the studio name.
      title: 'the CY studio',
      // viewport-fit=cover: el contenido llega bajo las barras de Safari iOS (env(safe-area-inset-*) ya se respeta en Navbar y Dock).
      meta: [{ name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' }],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },
  image: {
    // Allow the ipx provider to optimize remote images. work-images vive en
    // Cloudflare R2 desde 2026-09-22 (egress $0); el dominio de Supabase se
    // deja por si queda algo viejo cacheado apuntando ahí.
    domains: ['nwqhdeuewgrclroyebzq.supabase.co', 'pub-3d0f1818e475433b912be4f25d1c87dc.r2.dev'],
    // Los defaults de @nuxt/image llegan a 1536 px. Se amplían xxl/2xl para que las fotos
    // a pantalla completa (about) no se estiren en desktop ni en pantallas retina.
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1920, '2xl': 2560 },
    // Sin esto el provider de Vercel sirve q=100 (peso máximo, sin ganancia visual).
    // 82 es el punto donde JPEG/WebP siguen siendo indistinguibles a simple vista
    // pero pesan 30-50% menos — no es "comprimir hasta que se note", es cortar
    // bytes que el ojo no puede ver.
    quality: 82,
  },
  fonts: {
    // Without this, @nuxt/fonts' default weight ("400 700", a variable-font
    // range) silently collapses to just 400 for families with no variable
    // instance — every font-bold/font-semibold/font-medium in the app was
    // rendering unstyled because the 600/700 files were never fetched.
    families: [
      { name: 'Space Grotesk', weights: [400, 600, 700] },
      { name: 'Inter', weights: [400, 500] },
      { name: 'Space Mono', weights: [400, 700] },
    ],
  },
  runtimeConfig: {
    sessionSecret: ''
  }
})