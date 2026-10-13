<!-- app/components/core/Toggle.vue -->
<template>
  <!-- font-display, como el resto de controles del navbar (CLAUDE.md: Space Grotesk para controles).
       Con Inter, algunos navegadores pintaban "ES/EN" con glifos equivocados ("lə", "lĵ"). -->
  <div class="inline-flex items-center gap-2 font-display text-sm">
    <span
      class="[filter:drop-shadow(0_1px_2px_rgb(var(--color-paper)/0.85))]"
      :class="modelValue === 'es' ? 'text-ink font-semibold' : 'text-ink-soft'"
      >ES</span
    >

    <SwitchRoot
      :model-value="modelValue === 'en'"
      :disabled="loading"
      :aria-busy="loading || undefined"
      :aria-invalid="error || undefined"
      :aria-label="modelValue === 'es' ? 'Switch to English' : 'Cambiar a español'"
      class="relative w-10 h-6 rounded-full bg-ink transition-colors duration-150 before:absolute before:-inset-x-1 before:-inset-y-2.5 before:content-[''] disabled:cursor-default"
      :class="[error && 'ring-2 ring-red-600 ring-offset-2 ring-offset-paper', loading && 'animate-pulse opacity-60']"
      @update:model-value="emit('update:modelValue', $event ? 'en' : 'es')"
    >
      <SwitchThumb
        class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-paper transition-transform duration-150 data-[state=checked]:translate-x-4"
      />
    </SwitchRoot>

    <span
      class="[filter:drop-shadow(0_1px_2px_rgb(var(--color-paper)/0.85))]"
      :class="modelValue === 'en' ? 'text-ink font-semibold' : 'text-ink-soft'"
      >EN</span
    >
  </div>
</template>

<script setup lang="ts">
// Switch semantics, keyboard and focus come from Reka UI; this file owns the look.
import { SwitchRoot, SwitchThumb } from 'reka-ui'

defineProps<{
  modelValue: 'es' | 'en'
  loading?: boolean
  error?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: 'es' | 'en'): void
}>()
</script>