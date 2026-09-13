<!-- app/pages/index.vue -->
<script setup lang="ts">
const lang = ref<'es' | 'en'>('es')
</script>

<template>
  <div class="bg-paper">
    <HomeHero />

    <section class="px-6 md:px-12 py-24 md:py-40 max-w-3xl mx-auto text-center">
      <CoreReveal>
        <p class="font-display font-semibold text-2xl md:text-4xl text-ink leading-snug">
          Me dedico a diseñar productos, marcas y experiencias donde el detalle y la funcionalidad realmente importan.
        </p>
      </CoreReveal>
    </section>

    <section class="px-6 md:px-12 py-16 max-w-2xl mx-auto text-center">
      <CoreReveal>
        <p class="font-display font-semibold text-lg md:text-2xl text-ink">
          Descubre como ayudo a las empresas a tener éxito en proyectos como:
        </p>
      </CoreReveal>
    </section>

    <section class="px-6 md:px-12 py-16">
      <CoreReveal>
        <h2 class="font-display font-semibold text-2xl text-ink text-center">Productos Digitales</h2>
        <p class="text-ink-soft text-center mt-2">Productos digitales creados para el usuario.</p>
      </CoreReveal>
      <!-- Card/Product va aquí — pendiente de construir -->
    </section>

    <section class="px-6 md:px-12 py-16">
      <CoreReveal>
        <h2 class="font-display font-semibold text-2xl text-ink text-center">Branding</h2>
        <p class="text-ink-soft text-center mt-2">Construyendo lenguaje visual para marcas.</p>
      </CoreReveal>
      <!-- Card/Brand va aquí — pendiente de construir -->
    </section>
  </div>
</template>