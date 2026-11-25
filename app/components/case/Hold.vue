<!-- app/components/case/Hold.vue -->
<script setup lang="ts">
// Pinned scene: a full-height stage stays on screen while the reader scrolls through `steps` stretches
// of `step` each, and `active` says which one the page is in. Scrolling is the only input; a label may
// call `go(i)` as a shortcut.
// The pinned layout only exists after hydration, on a viewport wide and tall enough and without reduced
// motion. Everywhere else (server HTML, phones, reduced motion) the `stacked` slot renders a plain list,
// so no step is ever hidden behind scripts.
// `step`: scroll distance of one step (CSS length). The default suits a step with something to watch.
const props = withDefaults(defineProps<{ steps: number; step?: string }>(), { step: '60svh' })
const reduced = useReducedMotion()

const ready = ref(false)
const active = ref(0)
const root = ref<HTMLElement | null>(null)

let seen: IntersectionObserver | undefined
let fits: MediaQueryList | undefined
let frame = 0
const sync = () => { ready.value = !!fits?.matches && !reduced.value }

// The hold is one viewport plus `steps` stretches tall, so a stretch is what is left divided by `steps`.
const stretch = (el: HTMLElement) => (el.offsetHeight - window.innerHeight) / props.steps
// The step is read from geometry: how far the top of the hold is above the viewport, in stretches.
// Exact through reversals and jumps (Home, End, an anchor); before the hold sticks it is the first
// step, after it lets go the last one.
function read() {
  frame = 0
  const el = root.value
  if (el) active.value = Math.min(props.steps - 1, Math.max(0, Math.floor(-el.getBoundingClientRect().top / stretch(el))))
}
// One rect read per frame, and only while the hold is on screen.
const onScroll = () => { frame ||= requestAnimationFrame(read) }
function stop() {
  seen?.disconnect()
  window.removeEventListener('scroll', onScroll)
  cancelAnimationFrame(frame)
  frame = 0
}

onMounted(() => {
  fits = window.matchMedia('(min-width: 768px) and (min-height: 620px)')
  fits.addEventListener('change', sync)
  sync()
})
watch(reduced, sync)
// The pinned layout renders with `ready`: watch it once it is in the DOM.
watch(ready, (on) => {
  stop()
  if (!on || !root.value) return
  seen = new IntersectionObserver(([e]) => {
    window.removeEventListener('scroll', onScroll)
    if (e?.isIntersecting) window.addEventListener('scroll', onScroll, { passive: true })
    read()
  })
  seen.observe(root.value)
}, { flush: 'post' })
onUnmounted(() => {
  stop()
  fits?.removeEventListener('change', sync)
})

// Shortcut for a step label: scroll to where that step begins (a few pixels in, clear of the boundary),
// so anything tied to the scroll inside the step starts from its rest position.
function go(i: number) {
  const el = root.value
  if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY + i * stretch(el) + 8, behavior: 'smooth' })
}
</script>

<template>
  <div v-if="ready" ref="root" class="case-hold relative" :style="{ '--steps': steps, '--active': active, '--hold-step': step }">
    <!-- The fixed nav floats over the page with no surface of its own: the stage starts below it. -->
    <div class="sticky top-0 flex h-svh flex-col px-6 pb-8 pt-[calc(var(--navbar-height)+2.25rem)] md:px-12">
      <div class="mx-auto flex min-h-0 w-full max-w-[1200px] flex-1 flex-col">
        <slot :active="active" :go="go" />
      </div>
    </div>
  </div>
  <slot v-else name="stacked" />
</template>

<style scoped>
/* One viewport for the stage plus one stretch of scroll per step. The named timeline lets anything
   inside the stage follow the hold (the progress line, the sliding table columns). */
.case-hold {
  height: calc(100svh + var(--steps) * var(--hold-step));
  view-timeline: --case-hold block;
}
</style>

<style>
/* Progress line of a hold (any element inside the stage). Without scroll-driven animations it steps
   with `active`; with them it follows the scroll through the whole hold. */
.case-hold-fill {
  transform: scaleX(calc((var(--active) + 1) / var(--steps)));
  transform-origin: left;
  transition: transform 0.3s var(--ease-settle);
}
@keyframes case-hold-fill {
  from { transform: scaleX(0); }
  to { transform: scaleX(1); }
}
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .case-hold-fill {
      animation: case-hold-fill linear both;
      animation-timeline: --case-hold;
      animation-range: contain;
      transition: none;
    }
  }
}
</style>
