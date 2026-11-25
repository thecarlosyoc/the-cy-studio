<!-- app/components/case/Bolson.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

const props = defineProps<{ bolson: typeof paymentsScenes.bolson }>()
const lang = useLang()
const t = useT()
const root = ref<HTMLElement | null>(null)
const { active, paused, manual, reduced, pick, hover } = useStepper(props.bolson.stages.length, root)
const path = ref(0)
</script>

<template>
  <CaseScene id="case-bolson" :tag="bolson.tag[lang]" :title="bolson.title[lang]" :line="bolson.line[lang]">
    <div
      ref="root"
      v-bind="hover"
    >
      <!-- Track: the four stages joined by one line; the active stage lights its segment and dot. -->
      <div role="group" :aria-label="t('caseFlowLabel')" class="-mx-6 flex snap-x overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
        <button
          v-for="(s, i) in bolson.stages"
          :key="i"
          type="button"
          :aria-pressed="active === i"
          class="relative min-h-11 w-[170px] shrink-0 snap-start border-t-2 pb-1 pr-3 pt-4 text-left transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper md:w-auto"
          :class="active === i ? 'border-cobalt' : 'border-ink/20 hover:border-ink/50'"
          @click="pick(i)"
        >
          <span class="absolute -top-[6px] left-0 h-2.5 w-2.5 rounded-full" :class="active === i ? 'bg-cobalt' : 'bg-ink/30'" aria-hidden="true" />
          <span class="block font-mono text-[11px] uppercase tracking-[.16em]" :class="active === i ? 'text-cobalt' : 'text-ink-soft'">{{ String(i + 1).padStart(2, '0') }} · {{ s.role[lang] }}</span>
          <span class="mt-1 block font-display text-base" :class="active === i ? 'font-bold text-ink' : 'font-medium text-ink-soft'">{{ s.text[lang] }}</span>
        </button>
      </div>

      <CoreControl v-if="!reduced && !manual" data-stepper-pause variant="soft" class="mt-4" :aria-pressed="paused" @click="paused = !paused">
        {{ t('casePause') }}
      </CoreControl>

      <div class="relative mt-6 flex h-[240px] items-center justify-center overflow-hidden rounded-2xl bg-white p-3 dark:bg-white/[.08] sm:h-[360px] md:h-[560px] md:p-6">
        <div
          v-for="(s, i) in bolson.stages"
          :key="i"
          class="absolute inset-3 flex items-center justify-center transition-opacity duration-300 motion-reduce:transition-none md:inset-6"
          :class="active === i ? 'opacity-100' : 'pointer-events-none opacity-0'"
          :aria-hidden="active !== i"
        >
          <NuxtImg
            :src="s.image.src"
            :alt="s.image.alt[lang]"
            sizes="sm:100vw md:100vw lg:1100px xl:1100px xxl:1100px"
            loading="lazy"
            format="webp"
            class="max-h-full max-w-full rounded-lg object-contain"
          />
        </div>
      </div>
    </div>

    <h3 class="mt-16 font-display text-2xl font-bold text-ink md:text-3xl">{{ t('caseBolsonFail') }}</h3>
    <div class="mt-4 flex flex-wrap gap-2">
      <CoreControl
        v-for="(p, i) in bolson.paths"
        :key="p.kind.es"
        :variant="path === i ? 'solid' : 'soft'"
        :aria-pressed="path === i"
        @click="path = i"
      >
        {{ p.kind[lang] }}
      </CoreControl>
    </div>
    <p class="mt-4 text-lg text-ink">{{ bolson.paths[path].text[lang] }}</p>
    <div class="mt-4 overflow-hidden rounded-2xl bg-white p-3 dark:bg-white/[.08] md:p-6">
      <CaseShot :img="bolson.paths[path].image" class="mx-auto max-w-[900px] rounded-lg" />
    </div>

    <p class="mt-10 text-base text-ink-soft">{{ bolson.rules.map(r => r[lang]).join(' · ') }}</p>
    <p class="mt-3 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ bolson.count[lang] }}</p>
  </CaseScene>
</template>
