<!-- app/components/core/Control.vue -->
<script setup lang="ts">
const props = defineProps<{
  variant?: 'soft' | 'solid' | 'outline' | 'link'
  to?: string
  disabled?: boolean
  type?: 'button' | 'submit'
}>()

// `solid` doubles as this app's "active/selected" state everywhere it's
// used (current nav section, active filter tab, admin type toggle) — bold
// is reserved for it so the weight change carries that meaning, instead of
// every button looking bold regardless of state.
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'solid':
      return 'font-bold bg-ink text-paper hover:bg-ink-soft'
    case 'outline':
      return 'font-medium bg-transparent text-ink border border-ink hover:bg-ink/5'
    case 'link':
      return 'font-medium bg-transparent text-ink px-0 py-0 rounded-none hover:underline'
    case 'soft':
    default:
      return 'font-medium bg-ink/5 text-ink hover:bg-ink/10'
  }
})
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="[
      'font-body rounded-full px-6 py-3 transition-colors duration-150 inline-block cursor-pointer select-none',
      variantClasses,
    ]"
  >
    <slot />
  </NuxtLink>
  <button
    v-else
    :type="type ?? 'button'"
    :disabled="disabled"
    :class="[
      'font-body rounded-full px-6 py-3 transition-colors duration-150 inline-block cursor-pointer select-none',
      'disabled:opacity-40 disabled:cursor-not-allowed',
      variantClasses,
    ]"
  >
    <slot />
  </button>
</template>