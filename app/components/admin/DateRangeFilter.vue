<!-- app/components/admin/DateRangeFilter.vue -->
<script setup lang="ts">
import { PopoverContent, PopoverPortal, PopoverRoot, PopoverTrigger } from 'reka-ui'

const from = defineModel<string>('from', { default: '' })
const to = defineModel<string>('to', { default: '' })

// Popover positioning, outside click, Escape and focus return come from Reka UI.
// States: default, empty (no dates → icon only), `loading` (trigger disabled),
// error (explicit prop or from > to), overflow (long label truncates).

const props = defineProps<{
  loading?: boolean
  error?: boolean
}>()

const open = ref(false)
const invalid = computed(() => props.error || (!!from.value && !!to.value && from.value > to.value))

const label = computed(() => {
  const fmt = (d: string) => new Date(d).toLocaleDateString('es', { day: 'numeric', month: 'short' })
  if (from.value && to.value) return `${fmt(from.value)} – ${fmt(to.value)}`
  if (from.value) return `Desde ${fmt(from.value)}`
  if (to.value) return `Hasta ${fmt(to.value)}`
  return null
})

function clear() {
  from.value = ''
  to.value = ''
}
</script>

<template>
  <PopoverRoot v-model:open="open">
    <PopoverTrigger
      :disabled="loading"
      :aria-busy="loading || undefined"
      :aria-invalid="invalid || undefined"
      class="flex max-w-full items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm transition-colors disabled:cursor-default"
      :class="[
        label ? 'bg-ink/10 text-ink' : 'bg-ink/5 text-ink-soft hover:bg-ink/10',
        invalid && 'ring-2 ring-red-600',
        loading && 'animate-pulse opacity-60',
      ]"
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" class="shrink-0" aria-hidden="true">
        <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.5" />
        <path d="M3 8H17M6 2V5M14 2V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      <span v-if="label" class="truncate">{{ label }}</span>
      <span v-else class="sr-only">Filtrar por fecha</span>
    </PopoverTrigger>

    <PopoverPortal>
      <PopoverContent
        align="end"
        :side-offset="8"
        aria-label="Filtrar por fecha"
        class="z-50 w-64 rounded-2xl border border-ink/10 bg-paper p-4 shadow-lg"
      >
        <div class="space-y-3">
          <label class="block text-xs text-ink-soft">
            Desde
            <input
              v-model="from"
              type="date"
              class="mt-1 w-full rounded-lg bg-ink/5 px-2.5 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
          </label>
          <label class="block text-xs text-ink-soft">
            Hasta
            <input
              v-model="to"
              type="date"
              class="mt-1 w-full rounded-lg bg-ink/5 px-2.5 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
          </label>
        </div>
        <p v-if="invalid" role="alert" class="mt-3 text-xs text-red-600">La fecha inicial es posterior a la final.</p>
        <button v-if="from || to" type="button" class="mt-3 text-xs text-ink-soft hover:text-ink underline" @click="clear">
          Limpiar fechas
        </button>
      </PopoverContent>
    </PopoverPortal>
  </PopoverRoot>
</template>
