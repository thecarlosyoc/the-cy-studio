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
const props = defineProps<{
  modelValue: T
  options: { value: T; label: string }[]
  ariaLabel: string
}>()
defineEmits<{ 'update:modelValue': [value: T] }>()

const containerRef = ref<HTMLElement | null>(null)
const buttonRefs = ref<HTMLElement[]>([])
const pillRect = ref({ x: 0, width: 0 })
// False until the first real measurement lands, so the pill doesn't glide
// in from the top-left corner on initial mount/hydration.
const ready = ref(false)

function measure() {
  const idx = props.options.findIndex((o) => o.value === props.modelValue)
  const el = buttonRefs.value[idx]
  const container = containerRef.value
  if (!el || !container) return
  const containerRect = container.getBoundingClientRect()
  const elRect = el.getBoundingClientRect()
  pillRect.value = { x: elRect.left - containerRect.left, width: elRect.width }
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
  ro.observe(containerRef.value!)
})
onBeforeUnmount(() => ro?.disconnect())
</script>

<template>
  <div
    ref="containerRef"
    class="relative inline-flex gap-1 rounded-full border border-transparent bg-ink/5 p-1 dark:border-white/[.16] dark:bg-white/[.13]"
    role="group"
    :aria-label="ariaLabel"
  >
    <span
      class="cy-segmented__pill absolute inset-y-1 left-0 rounded-full bg-ink/80"
      :style="pillStyle"
      aria-hidden="true"
    />
    <button
      v-for="opt in options"
      :key="opt.value"
      ref="buttonRefs"
      type="button"
      class="relative z-10 rounded-full px-6 py-3 font-medium transition-colors duration-150"
      :class="modelValue === opt.value ? 'text-paper' : 'text-ink hover:bg-ink/5 dark:hover:bg-white/[.08]'"
      :aria-pressed="modelValue === opt.value"
      @click="$emit('update:modelValue', opt.value)"
    >
      <slot name="option" :option="opt">{{ opt.label }}</slot>
    </button>
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
