<!-- app/components/nav/Dot.vue -->
<script setup lang="ts">
// Punto entre las pastillas del nav/dock. Cuando el home lo toma prestado
// (HomeGuideDot), su hueco se cierra y las pastillas se acercan; al volver, se abre.
// El punto va centrado en absoluto: su posición no cambia mientras el hueco se mueve.
const mode = useState('guide-mode', () => 'home')
</script>

<template>
  <span
    class="relative h-2 shrink-0 transition-[width,margin] duration-200 ease-out motion-reduce:transition-none"
    :class="mode === 'home' ? 'w-2' : '-mx-[3px] w-0'"
  >
    <CoreDot data-nav-dot class="absolute left-1/2 top-0 -translate-x-1/2" :class="mode !== 'home' && 'invisible'" />
  </span>
</template>
