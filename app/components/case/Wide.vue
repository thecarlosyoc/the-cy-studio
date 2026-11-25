<!-- app/components/case/Wide.vue -->
<script setup lang="ts">
import type { SceneImage } from '#shared/data/casePaymentsScenes'

// A capture in the stacked layout. A wide table (more than 3:2) keeps a legible width on a phone and
// the card scrolls sideways, instead of shrinking a 1400 px table into 340 px; a dialog just fits.
defineProps<{ img: SceneImage }>()
</script>

<template>
  <div class="overflow-x-auto rounded-2xl bg-white p-3 dark:bg-white/[.08] md:p-6">
    <CaseShot :img="img" class="rounded-lg" :class="img.width / img.height > 1.5 && 'min-w-[640px] md:min-w-0'" sizes="sm:640px md:100vw lg:1200px xl:1200px xxl:1200px" />
  </div>
</template>
