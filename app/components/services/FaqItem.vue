<!-- app/components/services/FaqItem.vue -->
<script setup lang="ts">
// One FAQ question: compact disclosure, no `name`, so several can stay open.
defineProps<{ question: string; answer: string }>()
</script>

<template>
  <CoreDisclosure size="compact">
    <template #header>
      <h3 class="pr-14 font-display text-lg font-bold text-ink md:pr-0">{{ question }}</h3>
    </template>
    <p class="pb-4 text-base text-ink-soft">{{ answer }}</p>
  </CoreDisclosure>
</template>
