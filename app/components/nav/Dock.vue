<!-- app/components/nav/Dock.vue -->
<script setup lang="ts">
const route = useRoute()
const t = useT()
const onCobalt = useNavTone(() => window.innerHeight - 40)
</script>

<template>
  <div
    class="md:hidden fixed bottom-0 left-0 w-full z-50 flex items-center justify-center gap-1.5 px-6 pt-4"
    :class="onCobalt && 'nav-on-cobalt'"
    style="padding-bottom: calc(env(safe-area-inset-bottom) + 16px);"
  >
    <!-- Navegación, no CTA: solo paso de color 150ms (Biblia, presupuesto de
         novedad) — sin CoreSwapLabel, igual criterio que Navbar.vue. -->
    <CoreControl to="/about" :variant="route.path === '/about' ? 'solid' : 'soft'" glass :aria-label="t('about')">
      {{ t('about') }}
    </CoreControl>
    <NavDot />
    <CoreControl to="/work" :variant="route.path === '/work' ? 'solid' : 'soft'" glass :aria-label="t('work')">
      {{ t('work') }}
    </CoreControl>
  </div>
</template>