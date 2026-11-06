<!-- app/components/muebleros/CatalogMock.vue -->
<script setup lang="ts">
// Maqueta decorativa del catálogo móvil: no es interactiva, por eso va oculta a lectores de pantalla.
const t = useT()
const items = [
  { key: 'mbCatItem1', price: 'Q 3,800', tone: 'bg-ink/10' },
  { key: 'mbCatItem2', price: 'Q 5,200', tone: 'bg-ink/[.07]' },
  { key: 'mbCatItem3', price: 'Q 4,100', tone: 'bg-ink/[.14]' },
] as const
</script>

<template>
  <div aria-hidden="true" class="mx-auto w-full max-w-[300px] rounded-[36px] border-[6px] border-ink bg-paper p-3 select-none">
    <p class="mb-2 inline-block rounded-full border border-ink/15 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[.16em] text-ink">{{ t('mbCatTag') }}</p>
    <ul class="space-y-2">
      <li v-for="it in items" :key="it.key" class="flex items-center gap-3 rounded-2xl bg-ink/5 p-2">
        <span class="h-14 w-14 shrink-0 rounded-xl" :class="it.tone" />
        <span class="min-w-0 flex-1">
          <span class="block truncate font-display text-sm text-ink">{{ t(it.key) }}</span>
          <span class="block text-xs tabular-nums text-ink-soft">{{ t('mbCatFrom') }} {{ it.price }}</span>
        </span>
        <span class="shrink-0 rounded-full bg-ink/80 px-3 py-1.5 font-display text-xs font-bold text-paper">{{ t('mbCatWhatsapp') }}</span>
      </li>
    </ul>
  </div>
</template>
