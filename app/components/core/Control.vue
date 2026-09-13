<!-- app/components/core/Control.vue -->
<template>
  <button
    :class="[
      'font-body font-medium rounded-full px-6 py-3 transition-colors duration-150',
      variantClasses,
    ]"
  >
    <slot />
  </button>
</template>

<script setup lang="ts">
const props = defineProps<{
  variant?: 'soft' | 'solid' | 'outline' | 'link'
}>()

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'solid':
      return 'bg-ink text-paper hover:bg-ink-soft'
    case 'outline':
      return 'bg-transparent text-ink border border-ink hover:bg-ink/5'
    case 'link':
      return 'bg-transparent text-ink px-0 py-0 rounded-none hover:underline'
    case 'soft':
    default:
      return 'bg-ink/5 text-ink hover:bg-ink/10'
  }
})
</script>