// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxt/image', '@nuxt/fonts'],
  image: {
    // Allow the ipx provider to optimize the remote images we upload to
    // Supabase Storage (bucket: work-images). Host is already public.
    domains: ['nwqhdeuewgrclroyebzq.supabase.co']
  },
  runtimeConfig: {
    sessionSecret: ''
  }
})