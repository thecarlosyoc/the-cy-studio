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
const onWhatsapp = (position: 'hero' | 'final') => track('whatsapp_clicked', { lang: lang.value, from: 'muebleros', position })

// La tarjeta del puesto apunta a /muebleros?src=<puesto>: se mide cuántas visitas trae cada una.
onMounted(() => {
  const src = route.query.src
  if (typeof src === 'string' && src) track('muebleros_visit', { lang: lang.value, src })
})

const solve = [1, 2, 3, 4] as const
const steps = ['mbStep1', 'mbStep2', 'mbStep3'] as const
const tagClass = 'font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft'
const h2Class = 'font-display font-bold text-[28px] md:text-[40px] leading-tight text-ink'
</script>

<template>
  <div class="bg-paper min-h-screen pt-24 md:pt-32 pb-20 overflow-x-clip">
    <div class="px-6 md:px-12 max-w-6xl mx-auto w-full">
      <header class="max-w-3xl">
        <p :class="tagClass">{{ t('mbTag') }}</p>
        <h1 class="mt-3 font-display font-bold text-[36px] md:text-[64px] leading-[1.05] text-ink">{{ t('mbTitle') }}</h1>
        <p class="mt-3 md:mt-5 text-ink-soft text-base md:text-lg">{{ t('mbSub') }}</p>
        <div class="mt-5 flex flex-col sm:flex-row gap-2">
          <CoreControl variant="solid" :to="whatsappHref" target="_blank" rel="noopener" @click="onWhatsapp('hero')">
            {{ t('mbCtaPrimary') }}
          </CoreControl>
          <CoreControl variant="soft" to="#demo">{{ t('mbCtaSecondary') }}</CoreControl>
        </div>
      </header>

      <section id="demo" class="mt-16 md:mt-24 scroll-mt-24">
        <h2 :class="[h2Class, 'text-center']">{{ t('mbDemoTitle') }}</h2>
        <div class="mt-8"><MueblerosLiveDemo /></div>
      </section>

      <section class="mt-20 md:mt-28">
        <h2 :class="h2Class">{{ t('mbSolveTitle') }}</h2>
        <ul class="mt-8 grid gap-3 md:grid-cols-2">
          <li v-for="n in solve" :key="n" class="rounded-3xl bg-ink/5 p-6">
            <h3 class="font-display font-bold text-xl text-ink">{{ t(`mbSolve${n}Title`) }}</h3>
            <p class="mt-2 text-ink-soft">{{ t(`mbSolve${n}Text`) }}</p>
          </li>
        </ul>
        <p class="mt-5 font-display text-ink">{{ t('mbFel') }}</p>
      </section>

      <section class="mt-20 md:mt-28">
        <h2 :class="h2Class">{{ t('mbScaleTitle') }}</h2>
        <div class="mt-8 grid gap-3 md:grid-cols-2">
          <div class="rounded-3xl border border-ink/15 p-6">
            <h3 class="font-display font-bold text-xl text-ink">{{ t('mbScaleOneTitle') }}</h3>
            <p class="mt-2 text-ink-soft">{{ t('mbScaleOneText') }}</p>
          </div>
          <div class="rounded-3xl border border-ink/15 p-6">
            <h3 class="font-display font-bold text-xl text-ink">{{ t('mbScaleManyTitle') }}</h3>
            <p class="mt-2 text-ink-soft">{{ t('mbScaleManyText') }}</p>
          </div>
        </div>
      </section>

      <section class="mt-20 md:mt-28 grid gap-8 md:grid-cols-2 md:items-center">
        <div>
          <h2 :class="h2Class">{{ t('mbCatTitle') }}</h2>
          <p class="mt-4 text-ink-soft text-base md:text-lg">{{ t('mbCatText') }}</p>
        </div>
        <MueblerosCatalogMock />
      </section>

      <section class="mt-20 md:mt-28">
        <h2 :class="h2Class">{{ t('mbStepsTitle') }}</h2>
        <ol class="mt-8 grid gap-3 md:grid-cols-3">
          <li v-for="(key, i) in steps" :key="key" class="rounded-3xl bg-ink/5 p-6">
            <p :class="tagClass">{{ i + 1 }}</p>
            <p class="mt-3 font-display text-lg text-ink">{{ t(key) }}</p>
          </li>
        </ol>
        <p class="mt-5 font-display text-ink">{{ t('mbLaunch') }}</p>
      </section>

      <section class="mt-20 md:mt-28 rounded-3xl bg-ink/5 p-8 md:p-12 text-center">
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
