<!-- app/components/home/Dedico.vue -->
<script setup lang="ts">
// Declaración de posición: abre la columna que cubre al hero.
const t = useT()
</script>

<template>
  <section id="dedico" class="scroll-mt-20 px-6 md:px-16 pt-24 pb-24 md:pt-40 md:pb-40">
    <p class="dedico font-display font-bold text-ink max-w-[22ch] md:max-w-none">{{ t('homeDedico') }}</p>
  </section>
</template>

<style scoped>
.dedico {
  font-size: clamp(2rem, 3.2vw + 1rem, 4rem);
  line-height: 1.1;
  letter-spacing: -0.03em;
}
</style>
