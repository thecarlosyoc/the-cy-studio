// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxt/fonts', '@vercel/analytics'],
  app: {
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
    domains: ['nwqhdeuewgrclroyebzq.supabase.co']
  },
  runtimeConfig: {
    sessionSecret: '',
    resendApiKey: '',
    contactToEmail: 'thecarlosyoc@gmail.com'
  }
})