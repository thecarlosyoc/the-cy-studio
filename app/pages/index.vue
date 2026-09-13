<script setup lang="ts">
import { workItems } from '~/data/work'

const lang = useLang()
const t = useT()

const digitalProducts = computed(() => workItems.filter((i) => i.type === 'product'))
const brandingProjects = computed(() => workItems.filter((i) => i.type === 'brand'))
</script>

<template>
  <div class="bg-paper">
    <HomeHero />

    <div class="flex flex-col">
      <section class="px-6 md:px-16 py-32 md:py-48">
        <CoreReveal>
          <p class="font-display font-bold text-[64px] leading-[1.1] tracking-tight text-ink text-left w-full">
            {{ t('homeDedico') }}
          </p>
        </CoreReveal>
      </section>

      <section class="px-6 md:px-16 pb-32 md:pb-48">
        <CoreReveal>
          <p class="font-display font-normal text-[48px] leading-[1.15] text-ink text-right w-full">
            {{ t('homeDescubre') }}
          </p>
          <p class="mt-4 font-mono text-[11px] tracking-[.16em] uppercase text-ink-soft text-right">
            {{ t('scroll') }} ↓
          </p>
        </CoreReveal>
      </section>

      <section class="px-6 md:px-16 pb-16">
        <CoreReveal>
          <div class="text-center">
            <h2 class="font-display font-bold text-[64px] leading-tight text-ink">{{ t('homeProductsTitle') }}</h2>
            <p class="text-ink-soft mt-2">{{ t('homeProductsIntro') }}</p>
          </div>
        </CoreReveal>

        <div class="mt-10 flex md:grid md:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide">
          <CardProduct
            v-for="p in digitalProducts"
            :key="p.slug"
            :title="p.title[lang]"
            :image="p.gallery[0]"
            :to="`/work/${p.slug}`"
            class="w-[45%] md:w-auto snap-start"
          />
        </div>
      </section>

      <section class="px-6 md:px-16 py-16">
        <CoreReveal>
          <div class="text-center">
            <h2 class="font-display font-bold text-[64px] leading-tight text-ink">{{ t('homeBrandingTitle') }}</h2>
            <p class="text-ink-soft mt-2">{{ t('homeBrandingIntro') }}</p>
          </div>
        </CoreReveal>

        <div class="mt-10 flex md:grid md:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide">
          <CardProduct
            v-for="p in brandingProjects"
            :key="p.slug"
            :title="p.title[lang]"
            :image="p.gallery[0]"
            :to="`/work/${p.slug}`"
            class="w-[45%] md:w-auto snap-start"
          />
        </div>
      </section>

      <section class="px-6 md:px-16 pb-16">
        <CoreReveal>
          <HomeCta />
        </CoreReveal>
      </section>
    </div>
  </div>
</template>