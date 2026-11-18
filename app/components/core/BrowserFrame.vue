<!-- app/components/core/BrowserFrame.vue -->
<script setup lang="ts">
// Browser window around a real page capture: hairline, three accent dots, host as a mono tag.
// Not interactive (the link to the page lives outside the frame). The size comes from the parent.
defineProps<{ url: string }>()
</script>

<template>
  <div class="flex flex-col overflow-hidden rounded-2xl border border-ink/15 bg-paper">
    <div class="flex items-center gap-6 border-b border-ink/15 px-4 py-3">
      <span class="flex gap-2" aria-hidden="true"><CoreDot /><CoreDot /><CoreDot /></span>
      <span class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ url }}</span>
    </div>
    <div class="min-h-0 flex-1 bg-ink/5"><slot /></div>
  </div>
</template>
