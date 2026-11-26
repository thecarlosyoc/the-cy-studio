<!-- app/components/core/CheckItem.vue -->
<script setup lang="ts">
// Deliverable with a checkmark that draws itself (ring from 12 o'clock, then the tick)
// when the enclosing <details> opens. `index` staggers the delay. Reduced motion: drawn, no transition.
defineProps<{ label: string; index?: number }>()
</script>

<template>
  <li class="flex gap-3" :style="{ '--i': index ?? 0 }">
    <svg viewBox="0 0 16 16" class="mt-[2px] size-4 shrink-0 text-cobalt" fill="none" aria-hidden="true" focusable="false">
      <circle class="cy-check-ring" cx="8" cy="8" r="7.25" stroke="currentColor" stroke-width="1.5" pathLength="1" />
      <path class="cy-check-tick" d="M5 8.25l2 2 4-4.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" pathLength="1" />
    </svg>
    <span class="text-sm text-ink">{{ label }}</span>
  </li>
</template>

<style scoped>
.cy-check-ring {
  transform: rotate(-90deg);
  transform-origin: center;
}
.cy-check-ring,
.cy-check-tick {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}
:global(details[open] .cy-check-ring),
:global(.is-visible .svc-card .cy-check-ring) {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 0.5s cubic-bezier(0.23, 1, 0.32, 1) calc(0.35s + var(--i) * 0.06s);
}
:global(details[open] .cy-check-tick),
:global(.is-visible .svc-card .cy-check-tick) {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 0.3s cubic-bezier(0.23, 1, 0.32, 1) calc(0.6s + var(--i) * 0.06s);
}
@media (prefers-reduced-motion: reduce) {
  .cy-check-ring,
  .cy-check-tick {
    stroke-dashoffset: 0;
    transition: none !important;
  }
}
</style>
