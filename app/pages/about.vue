<script setup lang="ts">
import { aboutSections } from '~/data/about'

const lang = useLang()
</script>

<template>
  <div class="bg-paper">
    <CoreReveal>
      <AboutHero />
    </CoreReveal>

    <CoreReveal>
      <div
        class="relative w-screen h-screen -mx-6 md:-mx-32 overflow-hidden"
        style="width: 100vw; margin-left: calc(-50vw + 50%); margin-right: calc(-50vw + 50%);"
      >
        <img src="/images/about.png" alt="Carlos Yoc" class="w-full h-full object-cover" />
        <div
          class="absolute inset-0 pointer-events-none"
          style="background: linear-gradient(180deg, #1E2BE0 0%, rgba(30, 43, 224, 0) 35%, rgba(30, 43, 224, 0) 65%, #1E2BE0 100%); mix-blend-mode: multiply; opacity: 0.75;"
        />
      </div>
    </CoreReveal>

    <section class="px-6 md:px-32 py-16 md:py-24 space-y-16">
      <CoreReveal v-for="s in aboutSections" :key="s.label.es">
        <AboutSection
          :label="s.label[lang]"
          :heading="s.heading?.[lang]"
          :paragraphs="s.paragraphs.map((p) => p[lang])"
          :cta-label="s.ctaLabel?.[lang]"
          :cta-to="s.ctaTo"
        />
      </CoreReveal>
    </section>

    <section class="px-6 md:px-32 pb-16 md:pb-24">
      <CoreReveal>
        <HomeCta />
      </CoreReveal>
    </section>
  </div>
</template>