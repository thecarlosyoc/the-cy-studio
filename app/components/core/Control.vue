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
// every button looking bold regardless of state. It also stays fully opaque
// on purpose: it's the one variant with real, non-glass contrast, and
// backdrop-blur/saturate are no-ops on an opaque background anyway, so it's
// left out of the glass treatment below rather than carrying dead classes.
//
// `soft`/`outline` carry the glassmorphism look the floating work/[slug]
// nav buttons proved out: backdrop-blur-md + backdrop-saturate-150 always
// on (not just on hover) so the tint reads as frosted glass at rest, not
// just a flat translucent fill. `soft` keeps its old rest/hover tint values
// (bg-ink/5 -> bg-ink/10) — that pairing already *is* the "one step darker
// on hover" relationship the floating buttons hover state showed off, it
// just needed the always-on blur to read as glass instead of a flat tint.
// `outline` picks up the same blur since it's also a transparent surface
// over content, but keeps bg-transparent at rest (no tint) so its border
// stays the sole rest-state differentiator from `soft`.
const variantClasses = computed(() => {
  switch (props.variant) {
    case 'solid':
      return 'font-bold bg-ink text-paper hover:bg-ink-soft'
    case 'outline':
      return 'font-medium bg-transparent backdrop-blur-md backdrop-saturate-150 text-ink border border-ink hover:bg-ink/5'
    case 'link':
      return 'font-medium bg-transparent text-ink px-0 py-0 rounded-none hover:underline'
    case 'soft':
    default:
      return 'font-medium bg-ink/5 backdrop-blur-md backdrop-saturate-150 text-ink hover:bg-ink/10'
  }
})
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="[
      'font-body rounded-full px-6 py-3 transition-colors duration-150 inline-block cursor-pointer select-none whitespace-nowrap',
      'focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
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
      'font-body rounded-full px-6 py-3 transition-colors duration-150 inline-block cursor-pointer select-none whitespace-nowrap',
      'focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
      'disabled:opacity-40 disabled:cursor-not-allowed',
      variantClasses,
    ]"
  >
    <slot />
  </button>
</template>