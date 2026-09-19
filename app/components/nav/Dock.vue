<!-- app/components/nav/Dock.vue -->
<script setup lang="ts">
const route = useRoute()
const t = useT()
const tone = useNavTone(() => window.innerHeight - 40)
// La franja de la zona segura mira el borde mismo: cambia en cuanto el contenido llega al borde.
const edgeTone = useNavTone(() => window.innerHeight - 2)
</script>

<template>
  <!-- Safari iOS 26 tiñe su barra inferior con el elemento fijo opaco pegado al borde: hero = tinta,
       al cubrirlo el contenido = paper. Solo la zona segura, la foto sigue visible por encima. -->
  <div
    aria-hidden="true"
    data-nav-chrome
    class="md:hidden fixed bottom-0 left-0 w-full z-40 bg-paper pointer-events-none"
    :class="edgeTone && `nav-on-${edgeTone}`"
    style="height: max(env(safe-area-inset-bottom), 2px);"
  />
  <div
    data-nav-chrome
    class="md:hidden fixed bottom-0 left-0 w-full z-50 flex items-center justify-center gap-1.5 px-6 pt-4"
    :class="tone && `nav-on-${tone}`"
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