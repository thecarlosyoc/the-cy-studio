<!-- app/components/admin/SearchFilter.vue -->
<script setup lang="ts">
const modelValue = defineModel<string>({ default: '' })

const open = ref(!!modelValue.value)
const inputEl = ref<HTMLInputElement | null>(null)

watch(open, async (isOpen) => {
  if (isOpen) {
    await nextTick()
    inputEl.value?.focus()
  }
})

function handleBlur() {
  if (!modelValue.value) open.value = false
}

function clear() {
  modelValue.value = ''
  open.value = false
}
</script>

<template>
  <button
    v-if="!open"
    type="button"
    aria-label="Buscar"
    class="flex items-center gap-2 rounded-xl px-3.5 py-2.5 text-sm transition-colors"
    :class="modelValue ? 'bg-ink/10 text-ink' : 'bg-ink/5 text-ink-soft hover:bg-ink/10'"
    @click="open = true"
  >
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" class="shrink-0">
      <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5" />
      <path d="M17 17L13.5 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
    <span v-if="modelValue" class="max-w-[8rem] truncate">{{ modelValue }}</span>
  </button>

  <div v-else class="flex w-full items-center gap-2 rounded-xl bg-ink/5 px-3.5 py-2.5 sm:w-64">
    <svg width="16" height="16" viewBox="0 0 20 20" fill="none" class="shrink-0 text-ink-soft">
      <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5" />
      <path d="M17 17L13.5 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
    </svg>
    <input
      ref="inputEl"
      v-model="modelValue"
      type="search"
      placeholder="Buscar por título o slug…"
      class="w-full bg-transparent text-sm text-ink placeholder:text-ink-soft focus:outline-none"
      @blur="handleBlur"
      @keydown.esc="clear"
    />
    <button v-if="modelValue" type="button" aria-label="Limpiar búsqueda" class="shrink-0 text-ink-soft hover:text-ink" @click="clear">
      <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
        <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
      </svg>
    </button>
  </div>
</template>
