<!-- app/components/muebleros/CatalogMock.vue -->
<script setup lang="ts">
// Catálogo de ejemplo: foto, nombre y botón de WhatsApp. Sin precios.
import type { MbSlot } from '~/data/muebleros-images'
defineProps<{ href: string }>()
const emit = defineEmits<{ whatsapp: [] }>()
const t = useT()
const items = [
  { key: 'mbCatItem1', slot: 'p-sala' },
  { key: 'mbCatItem2', slot: 'p-comedor' },
  { key: 'mbCatItem3', slot: 'p-ropero' },
] as const satisfies readonly { key: string; slot: MbSlot }[]
</script>

<template>
  <ul class="grid gap-4 md:grid-cols-3">
    <li v-for="it in items" :key="it.key" class="flex items-center gap-4 md:flex-col md:items-stretch">
      <div class="aspect-square w-28 shrink-0 overflow-hidden rounded-2xl md:w-full [&>picture]:block [&>picture]:h-full">
        <MueblerosPhoto :slot="it.slot" sizes="112px md:300px" decorative />
      </div>
      <div class="min-w-0 flex-1 md:flex-none">
        <p class="font-display text-lg text-ink">{{ t(it.key) }}</p>
        <CoreControl class="mt-2" variant="soft" :to="href" target="_blank" rel="noopener" @click="emit('whatsapp')">
          {{ t('mbCatWhatsapp') }}
        </CoreControl>
      </div>
    </li>
  </ul>
</template>
