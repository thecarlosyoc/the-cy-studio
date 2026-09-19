<!-- app/components/SiteFooter.vue -->
<script setup lang="ts">
// Una línea, sin bloque propio. `onCobalt` para cuando vive dentro de la banda cobalto del inicio.
defineProps<{ onCobalt?: boolean }>()
const year = new Date().getFullYear()
</script>

<template>
  <footer
    class="flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t pt-6 font-mono text-[11px] uppercase tracking-[.16em]"
    :class="onCobalt ? 'border-paper/25 text-paper/70' : 'border-ink/15 text-ink-soft'"
  >
    <span>© {{ year }} the CY studio · Guatemala</span>
    <a
      href="https://www.linkedin.com/in/carlosyoc"
      target="_blank"
      rel="noopener noreferrer"
      class="transition-colors duration-200"
      :class="onCobalt ? 'hover:text-paper' : 'hover:text-ink'"
    >LinkedIn</a>
  </footer>
</template>
