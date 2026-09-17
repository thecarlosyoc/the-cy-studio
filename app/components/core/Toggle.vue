<!-- app/components/core/Toggle.vue -->
<template>
  <div class="inline-flex items-center gap-2 font-body text-sm">
    <span :class="modelValue === 'es' ? 'text-ink font-semibold' : 'text-ink-soft'">ES</span>

    <button
      type="button"
      role="switch"
      :aria-checked="modelValue === 'en'"
      :aria-label="modelValue === 'es' ? 'Switch to English' : 'Cambiar a español'"
      class="relative w-10 h-6 rounded-full bg-ink transition-colors duration-150 before:absolute before:-inset-x-1 before:-inset-y-2.5 before:content-['']"
      @click="toggle"
    >
      <span
        class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-paper transition-transform duration-150"
        :class="modelValue === 'en' ? 'translate-x-4' : 'translate-x-0'"
      />
    </button>

    <span :class="modelValue === 'en' ? 'text-ink font-semibold' : 'text-ink-soft'">EN</span>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  modelValue: 'es' | 'en'
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: 'es' | 'en'): void
}>()

function toggle() {
  emit('update:modelValue', props.modelValue === 'es' ? 'en' : 'es')
}
</script>