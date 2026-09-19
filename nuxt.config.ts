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
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'icon', type: 'image/png', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', href: '/apple-touch-icon.png' },
      ],
    },
  },
  image: {
    // Allow the ipx provider to optimize the remote images we upload to
    // Supabase Storage (bucket: work-images). Host is already public.
    domains: ['nwqhdeuewgrclroyebzq.supabase.co'],
    // Los defaults de @nuxt/image llegan a 1536 px. Se amplían xxl/2xl para que las fotos
    // a pantalla completa (about) no se estiren en desktop ni en pantallas retina.
    screens: { xs: 320, sm: 640, md: 768, lg: 1024, xl: 1280, xxl: 1920, '2xl': 2560 },
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