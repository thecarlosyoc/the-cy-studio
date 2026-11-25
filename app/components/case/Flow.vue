<!-- app/components/case/Flow.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

const props = defineProps<{ flow: typeof paymentsScenes.flow }>()
const lang = useLang()
const t = useT()
const reduced = useReducedMotion()
const root = ref<HTMLElement | null>(null)
const inView = useInView(root, { threshold: 0.4 })

const active = ref(0)
const paused = ref(false) // user toggle (pause button)
const hovering = ref(false) // transient: pointer or focus inside
const manual = ref(false) // a manual step pick stops auto-advance for good
const hidden = ref(false) // tab in background
onMounted(() => {
  const on = () => (hidden.value = document.hidden)
  on()
  document.addEventListener('visibilitychange', on)
  onUnmounted(() => document.removeEventListener('visibilitychange', on))
})
function pick(i: number) { active.value = i; manual.value = true }

// Auto-advance every 2.5 s while the scene is on screen; a change of state restarts the timer.
let timer: ReturnType<typeof setTimeout> | undefined
watchEffect((onCleanup) => {
  if (!inView.value || paused.value || hovering.value || manual.value || hidden.value || reduced.value) return
  const i = active.value
  timer = setTimeout(() => { active.value = (i + 1) % props.flow.steps.length }, 2500)
  onCleanup(() => clearTimeout(timer))
})
</script>

<template>
  <CaseScene id="case-flow" :tag="flow.tag[lang]" :title="flow.title[lang]" :line="flow.line[lang]">
    <div
      ref="root"
      @pointerenter="hovering = true"
      @pointerleave="hovering = false"
      @focusin="hovering = true"
      @focusout="hovering = false"
    >
      <div role="group" :aria-label="t('caseFlowLabel')" class="-mx-6 flex snap-x gap-2 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-6 md:gap-4 md:overflow-visible md:px-0">
        <button
          v-for="(s, i) in flow.steps"
          :key="s.name.es"
          type="button"
          :aria-pressed="active === i"
          class="min-h-11 w-[150px] shrink-0 snap-start border-t-2 pt-3 text-left transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper md:w-auto"
          :class="active === i ? 'border-cobalt' : 'border-ink/20 hover:border-ink/50'"
          @click="pick(i)"
        >
          <span class="block font-mono text-[11px] uppercase tracking-[.16em]" :class="active === i ? 'text-cobalt' : 'text-ink-soft'">{{ String(i + 1).padStart(2, '0') }}</span>
          <span class="mt-1 block font-display text-base" :class="active === i ? 'font-bold text-ink' : 'font-medium text-ink-soft'">{{ s.name[lang] }}</span>
        </button>
      </div>

      <!-- WCAG 2.2.2: explicit pause for the auto-advance (hidden when it can never run). -->
      <CoreControl v-if="!reduced && !manual" variant="soft" class="mt-4" :aria-pressed="paused" @click="paused = !paused">
        {{ t('casePause') }}
      </CoreControl>

      <!-- Fixed-height stage so a swap never moves the page; each screen is contained inside it. -->
      <div class="relative mt-6 flex h-[260px] items-center justify-center overflow-hidden rounded-2xl bg-white p-4 dark:bg-white/[.08] md:h-[420px] md:p-8">
        <div
          v-for="(s, i) in flow.steps"
          :key="s.name.es"
          class="absolute inset-4 flex items-center justify-center transition-opacity duration-300 motion-reduce:transition-none md:inset-8"
          :class="active === i ? 'opacity-100' : 'pointer-events-none opacity-0'"
          :aria-hidden="active !== i"
        >
          <NuxtImg
            :src="s.image.src"
            :alt="s.image.alt[lang]"
            sizes="sm:100vw md:100vw lg:1100px xl:1100px xxl:1100px"
            loading="lazy"
            format="webp"
            class="max-h-full max-w-full object-contain"
          />
        </div>
      </div>
    </div>
  </CaseScene>
</template>
