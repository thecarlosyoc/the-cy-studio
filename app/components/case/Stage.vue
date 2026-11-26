<!-- app/components/case/Stage.vue -->
<script setup lang="ts">
import type { SceneImage } from '#shared/data/casePaymentsScenes'

// The screens of one step inside a pinned stage. The parent is a size container: every screen takes
// its box from the stage (`img.box`, in % of its width and height), never from its intrinsic size,
// so nothing spills out of a short viewport and nothing shrinks on a 2x screen.
defineProps<{ images: readonly SceneImage[]; column?: boolean }>()
</script>

<template>
  <!-- Screens hang from the top of the stage, right under the text: side by side, or one above the other. -->
  <div class="flex h-full w-full" :class="column ? 'flex-col items-center gap-[2.5cqh]' : 'items-start justify-center gap-[2cqw]'">
    <div
      v-for="img in images"
      :key="img.src"
      class="shrink-0 overflow-hidden rounded-xl bg-white shadow-[0_1px_0_rgb(18_17_14/0.06)] dark:bg-white/[.08]"
      :style="{ width: `min(${img.box?.[0] ?? 100}cqw, ${((img.box?.[1] ?? 100) * img.width / img.height).toFixed(2)}cqh)` }"
    >
      <CaseShot :img="img" />
    </div>
  </div>
</template>
