<!-- app/components/core/SegmentedControl.vue -->
<script setup lang="ts" generic="T extends string">
// Sliding-pill toggle (2+ options, single active value). The pill is one
// absolutely-positioned element measured against whichever button is
// active — not per-option elements — so it can glide between them instead
// of just swapping color. Ref: beui.dev/components/motion/tabs (pill
// variant), ported to plain CSS transitions since this repo has no
// Framer Motion equivalent; GSAP is available but a transform/width
// transition is native and simpler for a two-property glide.
//
// Generic over T (not just string) so callers with a narrow union ref
// (e.g. ref<'work' | 'about'>) keep type-checked v-model instead of
// widening to plain string.
//
// Behaviour (roving focus, arrow keys, radio semantics) comes from Reka UI's
// RadioGroup; this file only owns the look and the pill glide.
// States: default, `loading` (busy, non-interactive), `error` (red ring),
// empty (no options → placeholder), overflow (container scrolls, labels
// never wrap).
import { RadioGroupItem, RadioGroupRoot } from 'reka-ui'

const props = defineProps<{
  modelValue: T
  options: { value: T; label: string }[]
  ariaLabel: string
  loading?: boolean
  error?: boolean
}>()
defineEmits<{ 'update:modelValue': [value: T] }>()

// RadioGroupRoot is a component; its root element is what we measure.
const rootRef = ref<{ $el: HTMLElement } | null>(null)
const containerRef = computed(() => rootRef.value?.$el ?? null)
const itemRefs = ref<{ $el: HTMLElement }[]>([])
const pillRect = ref({ x: 0, width: 0 })
// False until the first real measurement lands, so the pill doesn't glide
// in from the top-left corner on initial mount/hydration.
const ready = ref(false)

function measure() {
  const idx = props.options.findIndex((o) => o.value === props.modelValue)
  const el = itemRefs.value[idx]?.$el
  if (!el) return
  // offsetLeft is relative to the scrolling container's content, so the pill
  // stays aligned when the overflow state scrolls.
  pillRect.value = { x: el.offsetLeft, width: el.offsetWidth }
}

const pillStyle = computed(() => ({
  transform: `translateX(${pillRect.value.x}px)`,
  width: `${pillRect.value.width}px`,
  transitionDuration: ready.value ? undefined : '0ms',
}))

watch(() => props.modelValue, () => nextTick(measure))

// Catches label width changes from anything other than modelValue
// (language switch, font load, viewport reflow at breakpoints).
let ro: ResizeObserver | null = null
onMounted(async () => {
  await nextTick()
  measure()
  requestAnimationFrame(() => {
    ready.value = true
  })
  ro = new ResizeObserver(() => measure())
  if (containerRef.value) ro.observe(containerRef.value)
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <RadioGroupRoot
    v-if="options.length"
    ref="rootRef"
    :model-value="modelValue"
    :aria-label="ariaLabel"
    :aria-busy="loading || undefined"
    :aria-invalid="error || undefined"
    :disabled="loading"
    orientation="horizontal"
    class="relative inline-flex max-w-full gap-1 overflow-x-auto rounded-full border border-transparent bg-ink/5 p-1 dark:border-white/[.16] dark:bg-white/[.13]"
    :class="[error && 'ring-2 ring-red-600', loading && 'animate-pulse opacity-60']"
    @update:model-value="$emit('update:modelValue', $event as T)"
  >
    <span
      class="cy-segmented__pill absolute inset-y-1 left-0 rounded-full bg-ink/80"
      :style="pillStyle"
      aria-hidden="true"
    />
    <RadioGroupItem
      v-for="opt in options"
      :key="opt.value"
      ref="itemRefs"
      :value="opt.value"
      class="relative z-10 inline-flex shrink-0 items-center whitespace-nowrap rounded-full h-11 md:h-9 px-5 md:px-4 font-display text-[14px] md:text-[15px] leading-none tracking-[-.01em] font-medium transition-colors duration-150 disabled:cursor-default"
      :class="modelValue === opt.value ? 'text-paper' : 'text-ink hover:bg-ink/5 dark:hover:bg-white/[.08]'"
    >
      <slot name="option" :option="opt">{{ opt.label }}</slot>
    </RadioGroupItem>
  </RadioGroupRoot>
  <div
    v-else
    class="inline-flex h-[52px] items-center rounded-full bg-ink/5 px-5 font-mono text-[12px] uppercase tracking-[.16em] text-ink-soft dark:bg-white/[.13]"
    role="status"
  >
    <slot name="empty">—</slot>
  </div>
</template>

<style scoped>
.cy-segmented__pill {
  transition-property: transform, width;
  transition-duration: 240ms;
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}

@media (prefers-reduced-motion: reduce) {
  .cy-segmented__pill {
    transition: none;
  }
}
</style>
