<!-- app/components/case/Validation.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

const props = defineProps<{ validation: typeof paymentsScenes.validation }>()
const lang = useLang()
const t = useT()
const reduced = useReducedMotion()

const tab = ref(0)
const pos = ref(50) // % of the width where the handle sits; the Phase 2 image shows to its right.
const root = ref<HTMLElement | null>(null)
const inView = useInView(root, { once: true, threshold: 0.5 })
const current = computed(() => props.validation.tabs[tab.value])

// One sweep when the slider first enters: 50 -> 12 -> 88 -> 50. Any user input cancels it.
let raf = 0
let touched = false // the user already took control: the sweep must never run (or run again)
function stopSweep() { touched = true; cancelAnimationFrame(raf) }
watch(reduced, (r) => { if (r) stopSweep() })
watch(inView, (v) => {
  if (!v || reduced.value || touched) return
  const t0 = performance.now()
  const D = 2600
  const step = (now: number) => {
    const k = Math.min((now - t0) / D, 1)
    pos.value = 50 + Math.sin(k * Math.PI * 2) * -38 * (1 - 0.15 * k)
    if (k < 1) raf = requestAnimationFrame(step)
    else pos.value = 50
  }
  raf = requestAnimationFrame(step)
})
onUnmounted(stopSweep)
</script>

<template>
  <CaseScene id="case-validation" :tag="validation.tag[lang]" :title="validation.title[lang]" :line="validation.line[lang]">
    <div role="group" :aria-label="t('caseTableLabel')" class="flex flex-wrap gap-2">
      <CoreControl
        v-for="(tb, i) in validation.tabs"
        :key="tb.name.es"
        :variant="tab === i ? 'solid' : 'soft'"
        :aria-pressed="tab === i"
        @click="tab = i; pos = 50; stopSweep()"
      >
        {{ tb.name[lang] }}
      </CoreControl>
    </div>

    <div ref="root" class="relative mt-6 overflow-hidden rounded-2xl bg-white dark:bg-white/[.08]">
      <div class="relative">
        <CaseShot :key="current.before.src" :img="current.before" />
        <div class="absolute inset-0" :style="{ clipPath: `inset(0 0 0 ${pos}%)` }">
          <NuxtImg
            :key="current.after.src"
            :src="current.after.src"
            :alt="current.after.alt[lang]"
            sizes="sm:100vw md:100vw lg:1200px xl:1200px xxl:1200px"
            loading="lazy"
            format="webp"
            class="block h-full w-full"
          />
        </div>
        <span class="absolute left-3 top-3 rounded bg-ink px-2.5 py-1 font-mono text-[11px] uppercase tracking-[.16em] text-paper">{{ validation.before[lang] }}</span>
        <span class="absolute right-3 top-3 rounded bg-cobalt px-2.5 py-1 font-mono text-[11px] uppercase tracking-[.16em] text-paper">{{ validation.after[lang] }}</span>

        <!-- Native range: keyboard (arrows, Home, End) and touch drag come for free. The handle is drawn below it. -->
        <input
          type="range"
          min="0"
          max="100"
          step="1"
          :value="pos"
          :aria-label="t('caseSliderLabel')"
          :aria-valuetext="t('caseSliderValue').replace('{n}', String(Math.round(pos)))"
          class="peer absolute inset-0 z-10 h-full w-full cursor-ew-resize opacity-0"
          style="touch-action: pan-y"
          @pointerdown="stopSweep"
          @keydown="stopSweep"
          @input="stopSweep(); pos = Number(($event.target as HTMLInputElement).value)"
        >
        <div
          class="pointer-events-none absolute inset-y-0 z-[5] w-0.5 -translate-x-1/2 bg-cobalt peer-focus-visible:[&>span]:ring-2 peer-focus-visible:[&>span]:ring-cobalt peer-focus-visible:[&>span]:ring-offset-2"
          :style="{ left: `${pos}%` }"
          aria-hidden="true"
        >
          <span class="absolute left-1/2 top-1/2 flex h-11 w-11 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-paper bg-cobalt text-paper shadow-lg">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" focusable="false"><path d="M7 5L2 10L7 15M13 5L18 10L13 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" /></svg>
          </span>
        </div>
      </div>
    </div>
  </CaseScene>
</template>
