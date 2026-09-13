<!-- app/components/nav/Dock.vue -->
<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <div
    class="fixed bottom-0 left-0 w-full z-50 flex items-center justify-center gap-1.5 px-6 py-4"
    style="background: linear-gradient(0deg, rgba(18, 17, 14, 0.07) 0%, rgba(255, 255, 255, 0) 100%);"
  >
    <CoreControl
      to="/about"
      :variant="route.path === '/about' ? 'solid' : 'soft'"
    >
      Sobre mi
    </CoreControl>
    <CoreDot />
    <CoreControl
      to="/work"
      :variant="route.path === '/work' ? 'solid' : 'soft'"
    >
      Trabajo
    </CoreControl>
  </div>
</template>