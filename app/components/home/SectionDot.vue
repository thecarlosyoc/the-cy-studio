<!-- app/components/home/SectionDot.vue -->
<script setup lang="ts">
// Punto-eyebrow de una sección. Pasivo: HomeGuideDot le pone `data-shown`
// cuando su sección está en pantalla y el punto ya llegó volando desde el nav.
defineProps<{ onCobalt?: boolean }>()
</script>

<template>
  <span
    data-section-dot
    aria-hidden="true"
    class="block h-2 w-2 scale-0 rounded-full opacity-0 transition-[opacity,transform] duration-200 ease-out data-[shown]:scale-100 data-[shown]:opacity-100 motion-reduce:transition-none"
    :class="onCobalt ? 'bg-paper' : 'bg-cobalt'"
  />
</template>
