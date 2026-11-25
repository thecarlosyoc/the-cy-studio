<!-- app/components/case/Scene.vue -->
<script setup lang="ts">
// One scene of the case page: numbered mono tag (`no`, e.g. «03 / 09»), display title, at most one
// short line, then the visual (slot).
const props = defineProps<{ tag: string; title: string; line?: string; id: string; level?: 'h1' | 'h2'; no?: string }>()
</script>

<template>
  <section :aria-labelledby="`${props.id}-title`" class="px-6 py-16 md:px-12 md:py-24">
    <div class="mx-auto max-w-[1200px]">
      <CoreReveal>
        <p class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft"><template v-if="no">{{ no }} · </template>{{ tag }}</p>
        <component
          :is="level ?? 'h2'"
          :id="`${props.id}-title`"
          class="mt-4 max-w-[900px] break-words font-display text-[34px] font-bold leading-[1.05] text-ink md:text-[56px]"
        >
          {{ title }}
        </component>
        <p v-if="line" class="mt-4 max-w-[720px] text-lg text-ink-soft">{{ line }}</p>
      </CoreReveal>
      <div class="mt-10 md:mt-14"><slot /></div>
    </div>
  </section>
</template>
