<!-- app/components/core/Fact.vue -->
<script setup lang="ts">
// Big figure under a hairline. `hero` = 24 px lead, no caption; `terms` = 40 px lead + caption.
// `index` staggers the reveal by 60 ms.
withDefaults(defineProps<{ lead: string; caption?: string; size?: 'hero' | 'terms'; index?: number }>(), { size: 'hero' })
</script>

<template>
  <li>
    <CoreReveal class="flex flex-col gap-3 border-t border-ink/15 pt-4" :style="{ transitionDelay: `${(index ?? 0) * 60}ms` }">
      <p
        class="font-display font-bold tabular-nums text-ink"
        :class="size === 'hero' ? 'text-2xl' : 'text-[40px] leading-tight'"
      >
        {{ lead }}
      </p>
      <p v-if="caption" class="text-base text-ink-soft">{{ caption }}</p>
    </CoreReveal>
  </li>
</template>
