<!-- app/components/services/FaqItem.vue -->
<script setup lang="ts">
// One FAQ question: compact disclosure, no `name`, so several can stay open.
defineProps<{ question: string; answer: string }>()
</script>

<template>
  <CoreDisclosure size="compact">
    <template #header>
      <h3 class="font-display text-lg font-bold text-ink">{{ question }}</h3>
    </template>
    <p class="pb-4 pr-14 text-base text-ink-soft md:pr-0">{{ answer }}</p>
  </CoreDisclosure>
</template>
