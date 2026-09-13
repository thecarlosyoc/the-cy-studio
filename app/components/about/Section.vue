<!-- app/components/about/Section.vue -->
<script setup lang="ts">
defineProps<{
  label: string
  heading?: string
  paragraphs: string[]
  ctaLabel?: string
  ctaTo?: string
}>()
</script>

<template>
  <div class="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-[200px_1fr] gap-4 md:gap-16 text-left">
    <h2 class="font-display font-semibold text-2xl text-cobalt">{{ label }}</h2>

    <div class="max-w-2xl space-y-5">
      <h3 v-if="heading" class="font-display font-bold text-2xl text-ink">{{ heading }}</h3>
      <p
        v-for="(p, i) in paragraphs"
        :key="i"
        class="text-ink-soft text-base md:text-lg leading-relaxed"
      >
        {{ p }}
      </p>

      <CoreControl v-if="ctaTo" :to="ctaTo" variant="soft">
        <span class="inline-flex items-center gap-2">
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
          {{ ctaLabel }}
        </span>
      </CoreControl>
    </div>
  </div>
</template>