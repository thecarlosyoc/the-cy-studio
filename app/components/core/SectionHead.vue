<!-- app/components/core/SectionHead.vue -->
<script setup lang="ts">
// Section opener: dot, mono eyebrow, display title (default slot), intro. Left-aligned;
// `endOnDesktop` right-aligns from md up ("Como empezamos"). Center has no consumer yet.
withDefaults(defineProps<{ level?: 'h1' | 'h2'; eyebrow?: string; intro?: string; titleId?: string; endOnDesktop?: boolean }>(), { level: 'h2' })
</script>

<template>
  <CoreReveal>
    <div class="flex flex-col items-start gap-4 text-left" :class="{ 'md:items-end md:text-right': endOnDesktop }">
      <HomeSectionDot />
      <p v-if="eyebrow" class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ eyebrow }}</p>
      <component
        :is="level"
        :id="titleId"
        class="break-words font-display text-[40px] font-bold leading-tight text-ink"
        :class="level === 'h1' ? 'md:text-[72px]' : 'md:text-[64px]'"
      >
        <slot />
      </component>
      <p v-if="intro" class="max-w-[720px] text-lg text-ink-soft">{{ intro }}</p>
    </div>
  </CoreReveal>
</template>
