<!-- app/components/nav/Dock.vue -->
<script setup lang="ts">
const route = useRoute()
const t = useT()
const onCobalt = useNavTone(() => window.innerHeight - 40)
</script>

<template>
  <!-- Franja sólida en el borde inferior (sin degradado): Safari tiñe su barra con el
       elemento fijo que toca ese borde; sin ella toma el cobalto de la foto de /about. -->
  <div
    class="md:hidden fixed bottom-0 left-0 z-40 h-4 w-full bg-paper pointer-events-none"
    :class="onCobalt && 'nav-on-cobalt'"
    aria-hidden="true"
  />

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