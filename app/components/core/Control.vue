<!-- app/components/core/Control.vue -->
<script setup lang="ts">
const props = defineProps<{
  variant?: 'soft' | 'solid' | 'outline' | 'link'
  to?: string
  disabled?: boolean
  type?: 'button' | 'submit'
  // Backdrop blur is physically justified only where content scrolls behind
  // a floating control — Navbar and Dock. Everywhere else (work filters,
  // the admin type toggle, modal buttons...) there's nothing moving behind
  // the control, so the blur was a dead compositing cost. Callers opt in
  // explicitly; `solid` ignores this entirely, see below.
  glass?: boolean
}>()

// `solid` doubles as this app's "active/selected" state everywhere it's
// used (current nav section, active filter tab, admin type toggle) — bold
// is reserved for it so the weight change carries that meaning, instead of
// every button looking bold regardless of state. text-paper on bg-ink/80
// clears WCAG AA (~9:1 at rest, ~5:1 on hover) even composited over the
// lightest bg-paper backdrop in the app. It never gets `backdrop-filter`:
// its own background is opaque, so blurring what's behind it is a no-op
// that still forces a compositing layer.
//
// `soft`/`outline` only pick up `backdrop-blur-md backdrop-saturate-150`
// when the caller passes `glass` (Navbar/Dock do). Tint values are
// unchanged either way — `soft`'s bg-ink/5 (dark: bg-white/[.13], matching
// Figma's dark nav/pill spec) already cleared contrast review before glass
// existed; the blur only adds the frosted read on top of it.
const variantClasses = computed(() => {
  const glass = props.glass ? 'backdrop-blur-md backdrop-saturate-150' : ''
  switch (props.variant) {
    case 'solid':
      return 'font-bold bg-ink/80 text-paper hover:bg-ink-soft/80'
    case 'outline':
      return ['font-medium bg-transparent text-ink border border-ink hover:bg-ink/5', glass].filter(Boolean).join(' ')
    case 'link':
      // Underline is unconditional again: `link` never carries relevo (see
      // Navbar/Dock — navigation stays plain color-hover), so there's no
      // longer a case where a static underline would sit under characters
      // moving independently above it. The old `underline` prop existed only
      // to resolve that conflict; with the conflict gone, the prop is dead
      // and was removed rather than kept "for later".
      return 'font-medium bg-transparent text-ink px-0 py-0 rounded-none hover:underline'
    case 'soft':
    default:
      // dark:bg-white/[.13] + dark:border-white/[.16] match Figma's dark nav/pill
      // spec directly — the automatic ink/paper inversion alone only gets bg-ink/5
      // to a 5% white tint in dark, visibly weaker than the ~13% Figma designed.
      return [
        'font-medium bg-ink/5 dark:bg-white/[.13] text-ink border border-transparent dark:border-white/[.16] hover:bg-ink/10 dark:hover:bg-white/[.18]',
        glass,
      ].filter(Boolean).join(' ')
  }
})
</script>

<template>
  <NuxtLink
    v-if="to"
    :to="to"
    :class="[
      // `group/control` (Tailwind's named-group syntax) carries no styling of
      // its own — it's the hook CoreSwapLabel (rendered inside the default
      // slot, a separate component) uses to read this element's :hover state
      // across the component boundary (focus-visible no longer drives the
      // swap at all, see SwapLabel.vue). Named so it only ever reacts to this
      // root, not to some ancestor's plain `.group` (home/Cta.vue,
      // card/Work.vue, contact.vue all use that for unrelated hover
      // treatments). The same class is added by hand to the few raw
      // (non-CoreControl) buttons/links that also host a CoreSwapLabel — the
      // work/[slug] FAB pair and its 404 CTA — so the selector reaches them
      // too. Icon-only navigation (carousel arrows) and plain nav links
      // (breadcrumb, Navbar/Dock) don't carry CoreSwapLabel any more, but
      // keep the class anyway since it costs nothing and some already relied
      // on it for the hover-guard pattern.
      // `transition-colors` (Tailwind) only ever puts color/background-
      // color/border-color/text-decoration-color/fill/stroke on the
      // transitioned-property list — box-shadow (what `ring-*` draws the
      // focus ring with) was never in it, so the ring already appears
      // instantly with no separate override needed. That IS 'transition:
      // none en :focus-visible' (Biblia, 'Foco consistente') for this
      // property; the 150ms color-hover keeps running normally while
      // focused. A blanket `focus-visible:transition-none` was tried here
      // first and reverted — Tailwind's `transition-none` sets
      // transition-property to `none` for ALL properties, which at equal-ish
      // specificity beat `transition-colors` while focus-visible was active
      // and silently killed the 150ms color step the Biblia requires to keep
      // running during focus. Verified via computed style, see report.
      'group/control font-body rounded-full px-6 py-3 transition-colors duration-150 inline-block cursor-pointer select-none whitespace-nowrap',
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
      'group/control font-body rounded-full px-6 py-3 transition-colors duration-150 inline-block cursor-pointer select-none whitespace-nowrap',
      'focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper',
      props.variant === 'solid' ? 'disabled:cursor-not-allowed' : 'disabled:opacity-40 disabled:cursor-not-allowed',
      variantClasses,
    ]"
  >
    <slot />
  </button>
</template>