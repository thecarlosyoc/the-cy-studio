<!-- app/components/case/Decisions.vue -->
<script setup lang="ts">
import type { DecisionsScene } from '#shared/types/caseStudy'

// A flow and the design decisions in one pinned scene: each step with the decision behind it and its
// screen. With `table`, the first step is the wide table and takes two stretches of the hold, the time it
// needs to slide its columns; so hold stop 0 and 1 are both step 0.
const props = defineProps<{ scene: DecisionsScene; no: string }>()
const lang = useLang()
const t = useT()
const lead = computed(() => (props.scene.table ? 1 : 0))
const stops = computed(() => props.scene.steps.length + lead.value)
const stepOf = (stop: number) => Math.max(0, stop - lead.value)
const stopOf = (step: number) => (step ? step + lead.value : 0)
const pad = (i: number) => String(i + 1).padStart(2, '0')
</script>

<template>
  <CaseHold :steps="stops">
    <template #default="{ active, go }">
      <section aria-labelledby="case-decisions-title" class="flex min-h-0 flex-1 flex-col">
        <p class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ no }} · {{ scene.tag[lang] }}</p>
        <h2 id="case-decisions-title" class="mt-2 font-display text-[30px] font-bold leading-tight text-ink">{{ scene.title[lang] }}</h2>

        <div class="relative mt-6">
          <span class="absolute inset-x-0 top-0 h-0.5 bg-ink/15" aria-hidden="true" />
          <!-- With the table, four equal labels over five stretches of scroll (the first step takes two):
               the line is remapped so it reaches each label when its step starts. -->
          <span class="case-hold-fill absolute inset-x-0 top-0 h-0.5 bg-cobalt" :class="{ 'decisions-fill': scene.table }" :style="{ '--active': stepOf(active), '--steps': scene.steps.length }" aria-hidden="true" />
          <ol class="grid gap-4" :style="{ gridTemplateColumns: `repeat(${scene.steps.length}, minmax(0, 1fr))` }" :aria-label="t('caseFlowLabel')">
            <li v-for="(s, i) in scene.steps" :key="s.name.es">
              <button
                type="button"
                :aria-current="stepOf(active) === i ? 'step' : undefined"
                class="block w-full pt-3 text-left focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                @click="go(stopOf(i))"
              >
                <span class="block font-mono text-[11px] uppercase tracking-[.16em] transition-colors duration-150" :class="stepOf(active) === i ? 'text-cobalt' : 'text-ink-soft'">{{ pad(i) }}</span>
                <span class="mt-1 block font-display text-base transition-colors duration-150" :class="stepOf(active) === i ? 'font-bold text-ink' : 'font-medium text-ink-soft'">{{ s.name[lang] }}</span>
              </button>
            </li>
          </ol>
        </div>

        <!-- The decision behind the active step. All four share one cell, so the stage never moves. -->
        <div class="mt-5 grid">
          <p
            v-for="(s, i) in scene.steps"
            :key="s.name.es"
            class="col-start-1 row-start-1 max-w-[820px] text-lg transition-opacity duration-300 motion-reduce:transition-none"
            :class="stepOf(active) === i ? 'opacity-100' : 'pointer-events-none opacity-0'"
            :aria-hidden="stepOf(active) !== i"
          >
            <strong class="font-display font-bold text-ink">{{ s.decision[lang] }}.</strong>{{ ' ' }}<span class="text-ink-soft">{{ s.text[lang] }}</span>
          </p>
        </div>

        <div class="relative mt-6 min-h-0 flex-1 [container-type:size]">
          <div
            v-for="(s, i) in scene.steps"
            :key="s.name.es"
            class="absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none"
            :class="stepOf(active) === i ? 'opacity-100' : 'pointer-events-none opacity-0'"
            :aria-hidden="stepOf(active) !== i"
          >
            <CaseTablePan v-if="i === 0 && scene.table" :table="scene.table" />
            <CaseStage v-else :images="s.images" :column="s.images.length > 1 && s.images[0].box?.[0] === 100" />
          </div>
        </div>
      </section>
    </template>

    <template #stacked>
      <CaseScene id="case-decisions" :no="no" :tag="scene.tag[lang]" :title="scene.title[lang]">
        <ol class="space-y-14">
          <li v-for="(s, i) in scene.steps" :key="s.name.es">
            <p class="font-mono text-[11px] uppercase tracking-[.16em] text-cobalt">{{ pad(i) }} · {{ s.name[lang] }}</p>
            <h3 class="mt-2 font-display text-2xl font-bold text-ink">{{ s.decision[lang] }}</h3>
            <p class="mt-2 text-base text-ink-soft">{{ s.text[lang] }}</p>
            <div class="mt-4 space-y-3">
              <template v-if="i === 0 && scene.table">
                <CaseWide :img="scene.table.cards" />
                <CaseWide :img="scene.table.still" />
              </template>
              <CaseWide v-for="img in s.images" :key="img.src" :img="img" />
            </div>
          </li>
        </ol>
      </CaseScene>
    </template>
  </CaseHold>
</template>

<style scoped>
@keyframes decisions-fill {
  0% { transform: scaleX(0); }
  40% { transform: scaleX(0.25); }
  60% { transform: scaleX(0.5); }
  80% { transform: scaleX(0.75); }
  100% { transform: scaleX(1); }
}
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .decisions-fill { animation-name: decisions-fill; }
  }
}
</style>
