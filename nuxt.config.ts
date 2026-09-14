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
    },
  },
  runtimeConfig: {
    sessionSecret: ''
  }
})