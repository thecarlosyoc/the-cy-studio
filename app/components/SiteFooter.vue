<!-- app/components/SiteFooter.vue -->
<script setup lang="ts">
// Una línea, sin bloque propio. `onCobalt` para cuando vive dentro de la banda cobalto del inicio.
defineProps<{ onCobalt?: boolean }>()
const year = new Date().getFullYear()
const t = useT()
// The two links are interactive: Control-style (display Medium 14/15, 44/36 hit area), not the 11 px tag.
// On cobalt paper/85 is 5.68:1 (paper/70 was 4.27:1).
const link = 'inline-flex h-11 items-center font-display text-[14px] font-medium normal-case leading-none tracking-[-.01em] transition-colors duration-200 md:h-9 md:text-[15px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4'
</script>

<template>
  <footer
    class="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t pt-6 font-mono text-[11px] uppercase tracking-[.16em]"
    :class="onCobalt ? 'border-paper/25 text-paper/85' : 'border-ink/15 text-ink-soft'"
  >
    <span>© {{ year }} the CY studio · Guatemala</span>
    <!-- El Dock móvil solo tiene dos pastillas; Servicios llega a móvil por aquí. -->
    <span class="flex items-center gap-6">
      <NuxtLink
        to="/services"
        :class="[link, onCobalt ? 'text-paper/85 hover:text-paper outline-paper' : 'hover:text-ink outline-cobalt']"
      >{{ t('services') }}</NuxtLink>
      <a
        href="https://www.linkedin.com/in/carlosyoc"
        target="_blank"
        rel="noopener noreferrer"
        :class="[link, onCobalt ? 'text-paper/85 hover:text-paper outline-paper' : 'hover:text-ink outline-cobalt']"
      >LinkedIn</a>
    </span>
  </footer>
</template>
