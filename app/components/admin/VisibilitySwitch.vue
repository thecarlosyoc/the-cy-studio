<!-- app/components/admin/VisibilitySwitch.vue -->
<script setup lang="ts">
import { SwitchRoot, SwitchThumb } from 'reka-ui'

defineProps<{
  modelValue: boolean
  disabled?: boolean
  loading?: boolean
  error?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <SwitchRoot
    :model-value="modelValue"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
    :aria-invalid="error || undefined"
    :title="modelValue ? 'Visible · clic para ocultar' : 'Oculto · clic para mostrar'"
    class="relative w-10 h-6 rounded-full transition-colors duration-150 shrink-0 disabled:opacity-50 disabled:cursor-not-allowed data-[state=checked]:bg-ink data-[state=unchecked]:bg-ink/20"
    :class="[error && 'ring-2 ring-red-600', loading && 'animate-pulse']"
    @update:model-value="emit('update:modelValue', $event)"
  >
    <SwitchThumb
      class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-paper transition-transform duration-150 data-[state=checked]:translate-x-4"
    />
  </SwitchRoot>
</template>
