<!-- app/components/core/SwapLabel.vue -->
<script setup lang="ts">
// Vertical relevo: on hover, every character (and the icon, if any) is
// replaced by an identical copy that enters from below, full mask height,
// no opacity. Focus never triggers it (see the CSS below).
//
// Split comes from the `text` prop (same string server and client), never
// from reading rendered DOM in onMounted — that pattern causes Nuxt
// hydration mismatches.
//
// The icon, when passed via the `#icon` slot, is one more unit in the same
// center-out cascade, at whichever end `iconPosition` says it sits — but it
// gets its OWN mask (a fixed-size box), never merged into the shared
// word-level mask that holds the characters. Passing an empty `text` with
// only `iconPosition` set (no other unit in the sequence) renders a
// single-unit swap with no cascade — the icon-only FAB/arrow-button case.
const props = withDefaults(
  defineProps<{
    text: string
    iconPosition?: 'start' | 'end'
  }>(),
  { iconPosition: undefined },
)

const letters = computed(() => Array.from(props.text))
const unitCount = computed(() => letters.value.length + (props.iconPosition ? 1 : 0))
const center = computed(() => (unitCount.value - 1) / 2)

// Absolute distance from the word's center, normalized to [0, 1]. Only the
// magnitude matters here — unlike the old horizontal breathing, the swap
// direction (up) is the same for every unit, so no signed offset is needed.
function absOffsetAt(unitIndex: number) {
  if (center.value <= 0) return 0
  return Math.abs(unitIndex - center.value) / center.value
}

function unitStyle(unitIndex: number) {
  return { '--cy-abs-offset': absOffsetAt(unitIndex) }
}

const iconUnitIndex = computed(() => (props.iconPosition === 'start' ? 0 : letters.value.length))
</script>

<template>
  <span class="cy-swap" aria-hidden="true">
    <span v-if="iconPosition === 'start'" :class="['cy-swap__icon-mask', letters.length ? 'cy-swap__icon-mask--start' : '']">
      <span class="cy-swap__track" :style="unitStyle(iconUnitIndex)">
        <span class="cy-swap__row"><slot name="icon" /></span>
        <span class="cy-swap__row"><slot name="icon" /></span>
      </span>
    </span>

    <span v-if="letters.length" class="cy-swap__word">
      <span v-for="(ch, i) in letters" :key="i" class="cy-swap__track" :style="unitStyle(iconPosition === 'start' ? i + 1 : i)">
        <span class="cy-swap__row">{{ ch === ' ' ? ' ' : ch }}</span>
        <span class="cy-swap__row">{{ ch === ' ' ? ' ' : ch }}</span>
      </span>
    </span>

    <span v-if="iconPosition === 'end'" :class="['cy-swap__icon-mask', letters.length ? 'cy-swap__icon-mask--end' : '']">
      <span class="cy-swap__track" :style="unitStyle(iconUnitIndex)">
        <span class="cy-swap__row"><slot name="icon" /></span>
        <span class="cy-swap__row"><slot name="icon" /></span>
      </span>
    </span>
  </span>
</template>

<style>
/*
 * Not `scoped`: the hover trigger lives on the ancestor <button>/<NuxtLink>
 * (CoreControl, or a raw element carrying `group/control` by hand for the
 * icon-only FAB/arrow buttons that don't go through CoreControl) — a
 * different component, so the selector below has to cross that boundary.
 * Vue's scoped-CSS attributes would block a plain descendant combinator from
 * reaching it. Class names are namespaced (cy-swap*) so this stays safe as
 * global CSS.
 *
 * Mask lives at word level (.cy-swap__word) and icon level (.cy-swap__icon-mask)
 * — one overflow:hidden box each, not one per character. Movement lives at
 * character level (.cy-swap__track): each track is a 2-row column, exactly
 * double the mask height, so translateY(-50%) is always exactly one row —
 * no measured pixel values, so it can't drift out of sync with the duplicate.
 *
 * Relevo triggers on real `:hover` only (Round 3 brief): focus gets color +
 * an instant ring from Control.vue, no swap. Entry (hover in) and exit
 * (hover out) both run 200ms ease-out — same curve, no asymmetric
 * ease-in-out on exit. Entry keeps the center-out cascade (delay grows
 * outward, 0-12ms by --cy-abs-offset, hard-capped well under the 300ms
 * ceiling since it's a max edge delay, not a per-character sum — even the
 * longest label in the repo, "See the rest of the work" + icon, tops out at
 * 200ms + 12ms = 212ms). Exit has delay 0 on every character — a hover that
 * leaves mid-cascade must not stagger the return, or a fast in/out reads as
 * broken instead of interruptible (Biblia, "Interrumpibilidad").
 */
.cy-swap {
  display: inline-flex;
  align-items: center;
}

.cy-swap__word {
  display: flex;
  align-items: flex-start;
  overflow: hidden;
  height: 1.6em;
}

.cy-swap__icon-mask {
  display: inline-flex;
  align-items: flex-start;
  overflow: hidden;
  height: 1.6em;
}

.cy-swap__icon-mask--start {
  margin-inline-end: 0.5rem;
}

.cy-swap__icon-mask--end {
  margin-inline-start: 0.5rem;
}

.cy-swap__track {
  display: flex;
  flex-direction: column;
  transform: translateY(0);
  transition: transform 200ms ease-out;
  transition-delay: 0ms;
}

.cy-swap__row {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 1.6em;
  line-height: 1.6em;
}

/*
 * Guarded to real pointers only — on touch, a tap leaves :hover stuck on
 * with no mouseleave to clear it, so the swap would freeze mid-transition
 * until the next unrelated tap. No :focus-visible rule at all (Round 3):
 * keyboard/AT focus gets Control.vue's color-hover + instant ring, never
 * the swap.
 */
@media (hover: hover) and (pointer: fine) {
  .group\/control:hover .cy-swap__track {
    transform: translateY(-50%);
    transition: transform 200ms ease-out;
    transition-delay: calc(var(--cy-abs-offset, 0) * 12ms);
    will-change: transform;
  }
}

@media (prefers-reduced-motion: reduce) {
  .cy-swap__track,
  .group\/control:hover .cy-swap__track {
    transform: none;
    transition: none;
    will-change: auto;
  }
}
</style>
