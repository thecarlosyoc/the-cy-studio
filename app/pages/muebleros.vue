<script setup lang="ts">
const { $track: track } = useNuxtApp()
const t = useT()
const lang = useLang()
const route = useRoute()

const seoTitle = () => `${t('mbSeoTitle')} — the CY studio`
const seoDescription = () => t('mbSub')
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

const whatsappHref = computed(() => `https://wa.me/50252128955?text=${encodeURIComponent(t('mbWhatsappPrefill'))}`)
const onWhatsapp = (position: 'hero' | 'catalog' | 'final') => track('whatsapp_clicked', { lang: lang.value, from: 'muebleros', position })

// La tarjeta del puesto apunta a /muebleros?src=<puesto>: se mide cuántas visitas trae cada una.
onMounted(() => {
  const src = route.query.src
  if (typeof src === 'string' && src) track('muebleros_visit', { lang: lang.value, src })
})

const steps = ['mbStep1', 'mbStep2', 'mbStep3'] as const
const solve = ['mbSolve1', 'mbSolve2', 'mbSolve3', 'mbSolve4'] as const
const tagClass = 'font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft'
const h2Class = 'font-display font-bold text-[28px] md:text-[40px] leading-tight text-ink'
</script>

<template>
  <div class="bg-paper min-h-screen pt-24 md:pt-32 pb-20 overflow-x-clip">
    <div class="px-6 md:px-12 max-w-6xl mx-auto w-full">
      <header class="grid gap-6 md:grid-cols-2 md:items-center md:gap-12">
        <div>
          <p :class="tagClass">{{ t('mbTag') }}</p>
          <h1 class="mt-3 font-display font-bold text-[36px] md:text-[56px] leading-[1.05] text-ink">{{ t('mbTitle') }}</h1>
          <p class="mt-3 md:mt-5 text-ink-soft text-base md:text-lg">{{ t('mbSub') }}</p>
          <div class="mt-5 flex flex-col sm:flex-row gap-2">
            <CoreControl variant="solid" :to="whatsappHref" target="_blank" rel="noopener" @click="onWhatsapp('hero')">
              {{ t('mbCtaPrimary') }}
            </CoreControl>
            <CoreControl variant="soft" to="#demo">{{ t('mbCtaSecondary') }}</CoreControl>
          </div>
        </div>
        <div class="aspect-[4/3] md:aspect-square w-full md:max-w-[520px] md:justify-self-end overflow-hidden rounded-3xl [&>picture]:block [&>picture]:h-full">
          <MueblerosPhoto slot="hero-sala" sizes="335px md:520px" eager />
        </div>
      </header>

      <section id="demo" class="mt-16 md:mt-24 scroll-mt-24">
        <h2 :class="[h2Class, 'text-center md:text-left']">{{ t('mbDemoTitle') }}</h2>
        <div class="mt-8 grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
          <MueblerosLiveDemo />
          <div>
            <ul class="divide-y divide-ink/15 border-y border-ink/15">
              <li v-for="key in solve" :key="key" class="py-3 font-display text-lg md:text-xl text-ink">{{ t(key) }}</li>
            </ul>
            <p class="mt-4 text-ink-soft text-base md:text-lg">{{ t('mbFel') }}</p>
          </div>
        </div>
      </section>
      <section class="mt-20 md:mt-28">
        <p :class="tagClass">{{ t('mbCatTag') }}</p>
        <h2 :class="[h2Class, 'mt-3']">{{ t('mbCatTitle') }}</h2>
        <p class="mt-3 max-w-2xl text-ink-soft text-base md:text-lg">{{ t('mbCatText') }}</p>
        <div class="mt-8"><MueblerosCatalogMock :href="whatsappHref" @whatsapp="onWhatsapp('catalog')" /></div>
      </section>

      <section class="mt-20 md:mt-28 grid gap-8 md:grid-cols-2 md:items-center md:gap-12">
        <div class="aspect-[4/3] w-full overflow-hidden rounded-3xl [&>picture]:block [&>picture]:h-full">
          <MueblerosPhoto slot="taller" sizes="335px md:520px" />
        </div>
        <div>
          <h2 :class="h2Class">{{ t('mbWhoTitle') }}</h2>
          <p class="mt-3 text-ink text-base md:text-lg">{{ t('mbWho1') }}</p>
          <p class="mt-3 text-ink-soft text-base md:text-lg">{{ t('mbWho2') }}</p>
          <h3 class="mt-8 font-display font-bold text-xl text-ink">{{ t('mbStepsTitle') }}</h3>
          <ol class="mt-3 divide-y divide-ink/15 border-y border-ink/15">
            <li v-for="(key, i) in steps" :key="key" class="flex gap-3 py-3">
              <span :class="[tagClass, 'pt-1']">{{ i + 1 }}</span>
              <span class="font-display text-lg text-ink">{{ t(key) }}</span>
            </li>
          </ol>
          <p class="mt-4 font-display text-ink">{{ t('mbLaunch') }}</p>
        </div>
      </section>

      <section class="mt-20 md:mt-28 rounded-3xl border border-ink/15 p-8 md:p-12 text-center">
        <h2 :class="h2Class">{{ t('mbFinalTitle') }}</h2>
        <div class="mt-6 flex justify-center">
          <CoreControl variant="solid" :to="whatsappHref" target="_blank" rel="noopener" @click="onWhatsapp('final')">
            {{ t('mbCtaPrimary') }}
          </CoreControl>
        </div>
        <p class="mt-5 font-display text-lg tabular-nums text-ink">{{ t('mbPhone') }}</p>
        <p class="mt-1 text-ink-soft">{{ t('mbFinalSign') }}</p>
      </section>
    </div>
  </div>
</template>
