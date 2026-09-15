<!-- app/components/admin/DateRangeFilter.vue -->
<script setup lang="ts">
const from = defineModel<string>('from', { default: '' })
const to = defineModel<string>('to', { default: '' })

const open = ref(false)
const rootEl = ref<HTMLElement | null>(null)

const label = computed(() => {
  const fmt = (d: string) => new Date(d).toLocaleDateString('es', { day: 'numeric', month: 'short' })
  if (from.value && to.value) return `${fmt(from.value)} – ${fmt(to.value)}`
  if (from.value) return `Desde ${fmt(from.value)}`
  if (to.value) return `Hasta ${fmt(to.value)}`
  return null
})

function onClickOutside(event: MouseEvent) {
  if (rootEl.value && !rootEl.value.contains(event.target as Node)) open.value = false
}

watch(open, (isOpen) => {
  if (isOpen) document.addEventListener('mousedown', onClickOutside)
  else document.removeEventListener('mousedown', onClickOutside)
})

onBeforeUnmount(() => document.removeEventListener('mousedown', onClickOutside))

function clear() {
  from.value = ''
  to.value = ''
}
</script>

<template>
  <div ref="rootEl" class="relative">
    <button
      type="button"
      class="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm transition-colors"
      :class="label ? 'bg-ink/10 text-ink' : 'bg-ink/5 text-ink-soft hover:bg-ink/10'"
      @click="open = !open"
    >
      <svg width="16" height="16" viewBox="0 0 20 20" fill="none" class="shrink-0">
        <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.5" />
        <path d="M3 8H17M6 2V5M14 2V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
      <span v-if="label">{{ label }}</span>
    </button>

    <div
      v-if="open"
      class="absolute right-0 z-10 mt-2 w-64 rounded-2xl border border-ink/10 bg-paper p-4 shadow-lg"
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
      <button v-if="from || to" type="button" class="mt-3 text-xs text-ink-soft hover:text-ink underline" @click="clear">
        Limpiar fechas
      </button>
    </div>
  </div>
</template>
