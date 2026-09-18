<!-- app/components/nav/Dock.vue -->
<script setup lang="ts">
const route = useRoute()
const t = useT()
</script>

<template>
  <div
    class="md:hidden fixed bottom-0 left-0 w-full z-40 pointer-events-none"
    style="height: 140px; background: linear-gradient(180deg, rgb(var(--color-paper) / 0) 0%, rgb(var(--color-paper) / 0.9) 60%, rgb(var(--color-paper) / 1) 100%);"
  />

  <div
    class="md:hidden fixed bottom-0 left-0 w-full z-50 flex items-center justify-center gap-1.5 px-6 pt-4"
    style="padding-bottom: calc(env(safe-area-inset-bottom) + 16px);"
  >
    <CoreControl to="/about" :variant="route.path === '/about' ? 'solid' : 'soft'">
      {{ t('about') }}
    </CoreControl>
    <CoreDot />
    <CoreControl to="/work" :variant="route.path === '/work' ? 'solid' : 'soft'">
      {{ t('work') }}
    </CoreControl>
  </div>
</template>