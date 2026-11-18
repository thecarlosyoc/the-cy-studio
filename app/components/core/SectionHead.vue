<!-- app/components/core/SectionHead.vue -->
<script setup lang="ts">
// Section opener: dot, mono eyebrow, display title (default slot), intro. Left-aligned only
// (Center/Right variants of the Figma component have no consumer yet).
withDefaults(defineProps<{ level?: 'h1' | 'h2'; eyebrow?: string; intro?: string; titleId?: string }>(), { level: 'h2' })
</script>

<template>
  <CoreReveal>
    <div class="flex flex-col items-start gap-4 text-left">
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
