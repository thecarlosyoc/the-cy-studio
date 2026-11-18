<!-- app/components/core/Disclosure.vue -->
<script setup lang="ts">
// Native <details>/<summary> row with a hairline, a +/x indicator and an animated height.
// `name` groups rows so only one stays open (service rows by area); FAQ passes none.
// The header slot is the summary content; the indicator is absolute on mobile so a row can
// put its own meta line (number, time) beside it and the title below.
withDefaults(defineProps<{ name?: string; id?: string; size?: 'row' | 'compact' }>(), { size: 'row' })
</script>

<template>
  <details :id="id" :name="name" class="cy-disc scroll-mt-32 border-b border-ink/15">
    <summary
      class="cy-disc__summary relative flex cursor-pointer list-none items-center gap-6"
      :class="size === 'compact' ? 'py-4' : 'py-6'"
    >
      <span class="block min-w-0 flex-1"><slot name="header" /></span>
      <span
        aria-hidden="true"
        class="cy-disc__ind absolute right-0 flex size-11 shrink-0 items-center justify-center rounded-full bg-ink/5 text-ink dark:bg-white/[.13] md:static md:size-9"
        :class="size === 'compact' ? 'top-4' : 'top-6'"
      >
        <svg viewBox="0 0 16 16" class="cy-disc__icon size-4" fill="none" focusable="false">
          <path d="M3 8h10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          <path class="cy-disc__v" d="M8 3v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </span>
    </summary>
    <div class="cy-disc__content"><slot /></div>
  </details>
</template>

<style scoped>
.cy-disc {
  transition: border-color 0.15s ease;
  interpolate-size: allow-keywords;
}
.cy-disc__summary::-webkit-details-marker {
  display: none;
}
/* F17: focus ring on the summary, 2px, 4px away from the row. */
.cy-disc__summary:focus-visible {
  outline: 2px solid rgb(var(--color-cobalt));
  outline-offset: 4px;
}
.cy-disc__ind {
  transition: background-color 0.15s ease;
}
.cy-disc__icon {
  transition: transform 0.2s cubic-bezier(0.23, 1, 0.32, 1);
}
.cy-disc[open] .cy-disc__icon {
  transform: rotate(45deg);
}
/* Pressed: line-strong fill, paper glyph. */
.cy-disc__summary:active .cy-disc__ind {
  background-color: rgb(var(--color-ink) / 0.5);
  color: rgb(var(--color-paper));
}
@media (hover: hover) {
  .cy-disc:hover,
  .cy-disc:has(.cy-disc__summary:active) {
    border-color: rgb(var(--color-cobalt));
  }
  .cy-disc__summary:hover .cy-disc__ind {
    background-color: rgb(var(--color-ink) / 0.1);
  }
}
/* Height opens in 300 ms; unsupported browsers just open without it. */
.cy-disc::details-content {
  block-size: 0;
  overflow: clip;
  transition: block-size 0.3s cubic-bezier(0.23, 1, 0.32, 1), content-visibility 0.3s allow-discrete;
}
.cy-disc[open]::details-content {
  block-size: auto;
}
.cy-disc__content {
  opacity: 0;
  transition: opacity 0.2s ease;
}
.cy-disc[open] .cy-disc__content {
  opacity: 1;
}
@media (prefers-reduced-motion: reduce) {
  .cy-disc::details-content,
  .cy-disc__content,
  .cy-disc__icon,
  .cy-disc__ind {
    transition: none;
  }
  /* No spin: the + loses its vertical bar instead. */
  .cy-disc[open] .cy-disc__icon {
    transform: none;
  }
  .cy-disc[open] .cy-disc__v {
    opacity: 0;
  }
}
</style>
