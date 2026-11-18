<!-- app/components/services/PillarIndex.vue -->
<script setup lang="ts">
// Sticky area index: a <nav> of anchors (not a radiogroup, WCAG 4.1.2/3.2.2). The current area
// carries aria-current="location" and follows the scroll. Looks like CoreSegmentedControl,
// sliding pill included, but measured from its own anchors.
const AREAS = ['product', 'web', 'brand', 'motion'] as const
type Area = (typeof AREAS)[number]

const t = useT()
const labels = computed<Record<Area, string>>(() => ({
  product: t('servicesIdxProduct'),
  web: t('servicesIdxWeb'),
  brand: t('servicesIdxBrand'),
  motion: t('servicesIdxMotion'),
}))

const active = ref<Area>('product')
const stuck = ref(false)
const sentinel = ref<HTMLElement | null>(null)
const group = ref<HTMLElement | null>(null)
const items = ref<HTMLElement[]>([])
const pill = reactive({ x: 0, w: 0, ready: false })

function measure() {
  const el = items.value[AREAS.indexOf(active.value)]
  if (el) {
    pill.x = el.offsetLeft
    pill.w = el.offsetWidth
  }
}
watch(active, measure)

let io: IntersectionObserver | undefined
let spy: IntersectionObserver | undefined
let ro: ResizeObserver | undefined
onMounted(async () => {
  await nextTick()
  measure()
  requestAnimationFrame(() => (pill.ready = true))
  if (group.value) {
    ro = new ResizeObserver(measure)
    ro.observe(group.value)
  }

  // Stuck = the sentinel above the bar has scrolled under the fixed navbar.
  // Fixed navbar height (59 mobile, 68 desktop; --navbar-height starts at 96 and settles after hydration).
  const navH = window.matchMedia('(min-width: 768px)').matches ? 68 : 59
  io = new IntersectionObserver(
    ([e]) => (stuck.value = !!e && !e.isIntersecting && e.boundingClientRect.top < navH),
    { rootMargin: `-${navH}px 0px 0px 0px` },
  )
  if (sentinel.value) io.observe(sentinel.value)

  // ponytail: one band under nav + bar decides the area; no per-section ratios, no library.
  const inBand = new Set<Area>()
  spy = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) inBand.add(e.target.id as Area)
        else inBand.delete(e.target.id as Area)
      }
      const last = [...AREAS].reverse().find((a) => inBand.has(a))
      if (last) active.value = last
    },
    { rootMargin: '-128px 0px -60% 0px' },
  )
  for (const a of AREAS) {
    const el = document.getElementById(a)
    if (el) spy.observe(el)
  }
})
onBeforeUnmount(() => {
  io?.disconnect()
  spy?.disconnect()
  ro?.disconnect()
})
</script>

<template>
  <div ref="sentinel" aria-hidden="true" class="-mb-px h-px" />
  <nav
    :aria-label="t('servicesIdxLabel')"
    class="sticky top-[59px] md:top-[68px] z-30 flex items-center justify-between gap-6 border-b bg-paper px-6 py-[6.5px] md:px-16"
    :class="stuck ? 'border-ink/15' : 'border-transparent'"
  >
    <div
      ref="group"
      class="relative inline-flex max-w-full gap-1 rounded-full border border-transparent bg-ink/5 p-1 dark:border-white/[.16] dark:bg-white/[.13]"
    >
      <span
        aria-hidden="true"
        class="absolute inset-y-1 left-0 rounded-full bg-ink/80"
        :class="pill.ready ? 'cy-pill' : ''"
        :style="{ width: `${pill.w}px`, transform: `translateX(${pill.x}px)` }"
      />
      <a
        v-for="a in AREAS"
        :key="a"
        ref="items"
        :href="`#${a}`"
        :aria-current="active === a ? 'location' : undefined"
        class="relative z-10 inline-flex h-11 items-center whitespace-nowrap rounded-full px-3.5 font-display text-[14px] font-medium leading-none tracking-[-.01em] transition-colors duration-150 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-cobalt min-[400px]:px-5 md:h-9 md:px-4 md:text-[15px]"
        :class="active === a ? 'text-paper' : 'text-ink hover:bg-ink/5 dark:hover:bg-white/[.08]'"
      >
        {{ labels[a] }}
      </a>
    </div>
    <CoreControl v-if="stuck" variant="soft" to="/quote" class="hidden lg:inline-flex">{{ t('quoteCta') }}</CoreControl>
  </nav>
</template>

<style scoped>
.cy-pill {
  transition-property: transform, width;
  transition-duration: 240ms;
  transition-timing-function: cubic-bezier(0.16, 1, 0.3, 1);
}
@media (prefers-reduced-motion: reduce) {
  .cy-pill,
  a {
    transition: none;
  }
}
</style>
