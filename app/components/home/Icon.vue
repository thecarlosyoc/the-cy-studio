<!-- app/components/home/Icon.vue -->
<script setup lang="ts">
// Iconos de trazo lineal (1.5, redondeado): mismo lenguaje que la flecha diagonal del CTA.
defineProps<{ name: 'design' | 'build' | 'undo' | 'bolt' | 'repeat' }>()

const PATHS = {
  design: 'M12 3l9 5-9 5-9-5 9-5zM3 13l9 5 9-5',
  build: 'M8 8l-4 4 4 4M16 8l4 4-4 4M13.5 6l-3 12',
  undo: 'M9 14L4 9l5-5M4 9h10a6 6 0 010 12h-3',
  bolt: 'M13 3L5 13h6l-1 8 8-10h-6l1-8z',
  repeat: 'M17 2l4 4-4 4M3 11V9a3 3 0 013-3h15M7 22l-4-4 4-4M21 13v2a3 3 0 01-3 3H3',
} as const
</script>

<template>
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" focusable="false">
    <path :d="PATHS[name]" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
  </svg>
</template>
