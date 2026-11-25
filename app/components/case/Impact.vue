<!-- app/components/case/Impact.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

const props = defineProps<{ impact: typeof paymentsScenes.impact }>()
const lang = useLang()
const reduced = useReducedMotion()
const root = ref<HTMLElement | null>(null)
const inView = useInView(root, { once: true })

const finals = computed(() => props.impact.stats.map(s => (typeof s.value === 'string' ? s.value : s.value[lang.value])))
// 0..1 progress. Starts at 0 on server and client (no flash of the final numbers); the final values
// stay in the sr-only spans for screen readers and crawlers. Reduced motion jumps straight to 1.
const p = ref(0)
onMounted(() => { if (reduced.value) p.value = 1 })
watch(reduced, (r) => { if (r) p.value = 1 })
watch(inView, (v) => {
  if (!v) return
  if (reduced.value) { p.value = 1; return }
  const t0 = performance.now()
  const step = (now: number) => {
    const k = Math.min((now - t0) / 1200, 1)
    p.value = 1 - (1 - k) ** 3
    if (k < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
})

// Every number in the string scales with p; commas stay where the final value has them.
function shown(text: string) {
  return text.replace(/\d[\d,]*/g, (m) => {
    const n = Math.round(parseInt(m.replace(/,/g, ''), 10) * p.value)
    return m.includes(',') ? n.toLocaleString('en-US') : String(n)
  })
}
</script>

<template>
  <CaseScene id="case-impact" :tag="impact.tag[lang]" :title="impact.title[lang]" :line="impact.line[lang]">
    <dl ref="root" class="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
      <div v-for="(s, i) in impact.stats" :key="i" class="flex flex-col border-t-2 border-cobalt pt-4">
        <dt class="text-base text-ink-soft">{{ s.label[lang] }}</dt>
        <dd class="order-first mb-3 font-display text-[40px] font-bold leading-none tabular-nums text-ink md:text-[56px]">
          <span class="sr-only">{{ finals[i] }}</span>
          <span aria-hidden="true">{{ shown(finals[i]) }}</span>
        </dd>
      </div>
    </dl>
  </CaseScene>
</template>
