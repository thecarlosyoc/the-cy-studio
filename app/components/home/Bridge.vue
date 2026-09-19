<!-- app/components/home/Bridge.vue -->
<script setup lang="ts">
// Puente hacia el trabajo. Estático: sin animación de escala.
const t = useT()
</script>

<template>
  <section class="px-6 md:px-16 pb-32 md:pb-48">
    <p class="bridge font-display text-ink md:text-right">{{ t('homeDescubre') }}</p>
  </section>
</template>

<style scoped>
.bridge {
  font-size: clamp(1.5rem, 2vw + 1rem, 3rem);
  line-height: 1.15;
  letter-spacing: -0.02em;
}
</style>
