<!-- app/components/admin/Checkbox.vue -->
<script setup lang="ts">
defineProps<{
  modelValue: boolean
  label?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <button
    type="button"
    role="checkbox"
    :aria-checked="modelValue"
    :aria-label="label"
    :title="label"
    class="flex h-5 w-5 shrink-0 items-center justify-center rounded-md border transition-colors"
    :class="modelValue ? 'bg-ink border-ink' : 'bg-paper border-ink/30 hover:border-ink/50'"
    @click="emit('update:modelValue', !modelValue)"
  >
    <svg v-if="modelValue" width="12" height="12" viewBox="0 0 20 20" fill="none">
      <path d="M4 10L8 14L16 6" stroke="white" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  </button>
</template>
