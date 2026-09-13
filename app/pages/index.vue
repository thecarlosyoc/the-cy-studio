<!-- app/pages/index.vue -->
<script setup lang="ts">
import { workItems } from '~/data/work'

const lang = ref<'es' | 'en'>('es')

const digitalProducts = computed(() => workItems.filter((i) => i.type === 'product'))
const brandingProjects = computed(() => workItems.filter((i) => i.type === 'brand'))
</script>

<template>
  <div class="bg-paper">
    <HomeHero />

    <section class="px-6 md:px-12 pb-6 md:pb-8">
      <CoreReveal>
        <p class="font-display font-bold text-[40px] md:text-[64px] text-ink leading-[1.1] tracking-tight max-w-4xl text-left">
          Me dedico a diseñar productos, marcas y experiencias donde el detalle y la funcionalidad realmente importan.
        </p>
      </CoreReveal>
    </section>

    <section class="px-6 md:px-12 pb-16">
      <CoreReveal>
        <p class="font-display font-medium text-[clamp(1.2rem,2.4vw,1.7rem)] text-ink leading-snug max-w-xl ml-auto text-right">
          Descubre como ayudo a las empresas a tener éxito en proyectos como:
        </p>
      </CoreReveal>
    </section>

    <section class="px-6 md:px-12 py-16">
      <CoreReveal>
        <h2 class="font-display font-semibold text-2xl text-ink text-center">Productos Digitales</h2>
        <p class="text-ink-soft text-center mt-2">Productos digitales creados para el usuario.</p>
      </CoreReveal>

      <div class="mt-10 flex md:grid md:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide">
        <CardProduct
          v-for="p in digitalProducts"
          :key="p.slug"
          :title="p.title"
          :image="p.cardImage"
          :to="`/work/${p.slug}`"
          class="w-[45%] md:w-auto snap-start"
        />
      </div>
    </section>

    <section class="px-6 md:px-12 py-16">
      <CoreReveal>
        <h2 class="font-display font-semibold text-2xl text-ink text-center">Branding</h2>
        <p class="text-ink-soft text-center mt-2">Construyendo lenguaje visual para marcas.</p>
      </CoreReveal>

      <div class="mt-10 flex md:grid md:grid-cols-5 gap-4 overflow-x-auto md:overflow-visible snap-x snap-mandatory scrollbar-hide">
        <CardProduct
          v-for="p in brandingProjects"
          :key="p.slug"
          :title="p.title"
          :image="p.cardImage"
          :to="`/work/${p.slug}`"
          class="w-[45%] md:w-auto snap-start"
        />
      </div>
    </section>

    <section class="px-6 md:px-12 py-16 md:py-24">
      <CoreReveal>
        <HomeCta />
      </CoreReveal>
    </section>
  </div>
</template>