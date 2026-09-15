<!-- app/components/admin/VisibilitySwitch.vue -->
<script setup lang="ts">
defineProps<{
  modelValue: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
}>()
</script>

<template>
  <button
    type="button"
    role="switch"
    :aria-checked="modelValue"
    :title="modelValue ? 'Visible · clic para ocultar' : 'Oculto · clic para mostrar'"
    class="relative w-10 h-6 rounded-full transition-colors duration-150 shrink-0"
    :class="modelValue ? 'bg-ink' : 'bg-ink/20'"
    @click="emit('update:modelValue', !modelValue)"
  >
    <span
      class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-paper transition-transform duration-150"
      :class="modelValue ? 'translate-x-4' : 'translate-x-0'"
    />
  </button>
</template>
