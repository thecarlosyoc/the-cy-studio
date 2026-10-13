<!-- app/components/admin/Checkbox.vue -->
<script setup lang="ts">
import { CheckboxIndicator, CheckboxRoot } from 'reka-ui'

defineProps<{
  modelValue: boolean
  label?: string
  loading?: boolean
  error?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <CheckboxRoot
    :model-value="modelValue"
    :disabled="loading"
    :aria-label="label"
    :aria-busy="loading || undefined"
    :aria-invalid="error || undefined"
    :title="label"
    class="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors disabled:cursor-default data-[state=checked]:bg-ink data-[state=checked]:border-ink data-[state=unchecked]:bg-paper data-[state=unchecked]:border-ink/30 data-[state=unchecked]:hover:border-ink/50"
    :class="[error && 'ring-2 ring-red-600', loading && 'animate-pulse opacity-60']"
    @update:model-value="emit('update:modelValue', $event === true)"
  >
    <CheckboxIndicator>
      <svg width="12" height="12" viewBox="0 0 20 20" fill="none">
        <path d="M4 10L8 14L16 6" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </CheckboxIndicator>
  </CheckboxRoot>
</template>
