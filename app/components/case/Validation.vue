<!-- app/components/case/Validation.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

// Before / after as a short pinned scene: each table goes from Phase 1 to Phase 2 in place, held on the
// columns that changed, with the change named above it. Two tables, two phases: four stops.
const props = defineProps<{ validation: typeof paymentsScenes.validation; no: string }>()
const lang = useLang()
const t = useT()
const shots = props.validation.tabs.flatMap(tb => [tb.before, tb.after])
// The alt text reads «Fase 1: tabla sin…»; next to the phase chip only what comes after the colon is shown.
const change = (alt: string) => alt.replace(/^[^:]+:\s*/, '').replace(/^./, c => c.toUpperCase())
</script>

<template>
  <CaseHold :steps="shots.length" step="45svh">
    <template #default="{ active, go }">
      <section aria-labelledby="case-validation-title" class="flex min-h-0 flex-1 flex-col">
        <p class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ no }} · {{ validation.tag[lang] }}</p>
        <h2 id="case-validation-title" class="mt-2 font-display text-[30px] font-bold leading-tight text-ink">{{ validation.title[lang] }}</h2>

        <div class="mt-6 flex flex-wrap items-center gap-x-8 gap-y-4">
          <div role="group" :aria-label="t('caseTableLabel')" class="flex flex-wrap gap-2">
            <CoreControl
              v-for="(tb, i) in validation.tabs"
              :key="tb.name.es"
              :variant="Math.floor(active / 2) === i ? 'solid' : 'soft'"
              :aria-pressed="Math.floor(active / 2) === i"
              @click="go(i * 2)"
            >
              {{ tb.name[lang] }}
            </CoreControl>
          </div>
          <!-- What changed, in words. One cell for the four captions. -->
          <div class="grid">
            <p
              v-for="(s, i) in shots"
              :key="s.src"
              class="col-start-1 row-start-1 flex items-center gap-3 text-lg text-ink transition-opacity duration-300 motion-reduce:transition-none"
              :class="active === i ? 'opacity-100' : 'pointer-events-none opacity-0'"
              :aria-hidden="active !== i"
            >
              <span class="shrink-0 whitespace-nowrap rounded px-2.5 py-1 font-mono text-[11px] uppercase tracking-[.16em] text-paper" :class="i % 2 ? 'bg-cobalt' : 'bg-ink'">{{ (i % 2 ? validation.after : validation.before)[lang] }}</span>
              {{ change(s.alt[lang]) }}
            </p>
          </div>
        </div>

        <div class="relative mt-6 flex min-h-0 flex-1 items-center justify-center [container-type:size]">
          <!-- A wide frame held on the table rows: the columns that change, not the empty part of the screen. -->
          <div class="relative overflow-hidden rounded-2xl bg-white dark:bg-white/[.08]" style="aspect-ratio: 2.6; width: min(100cqw, calc(100cqh * 2.6))">
            <div
              v-for="(s, i) in shots"
              :key="s.src"
              class="absolute inset-0 transition-opacity duration-500 motion-reduce:transition-none"
              :class="active === i ? 'opacity-100' : 'pointer-events-none opacity-0'"
              :aria-hidden="active !== i"
            >
              <CaseShot :img="s" framed />
            </div>
          </div>
        </div>
      </section>
    </template>

    <template #stacked>
      <CaseScene id="case-validation" :no="no" :tag="validation.tag[lang]" :title="validation.title[lang]" :line="validation.line[lang]">
        <ul class="space-y-12">
          <li v-for="tb in validation.tabs" :key="tb.name.es">
            <h3 class="font-display text-2xl font-bold text-ink">{{ tb.name[lang] }}</h3>
            <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              <figure v-for="(s, k) in [tb.before, tb.after]" :key="s.src">
                <!-- On a phone the frame keeps a legible width and scrolls sideways, like the wide tables. -->
                <div class="overflow-x-auto rounded-2xl">
                  <div class="aspect-[16/10] min-w-[640px] overflow-hidden rounded-2xl bg-white dark:bg-white/[.08] md:min-w-0">
                    <CaseShot :img="s" framed sizes="sm:840px md:80vw lg:780px xl:780px xxl:780px" />
                  </div>
                </div>
                <figcaption class="mt-3 flex items-center gap-3 text-base text-ink">
                  <span class="shrink-0 whitespace-nowrap rounded px-2.5 py-1 font-mono text-[11px] uppercase tracking-[.16em] text-paper" :class="k ? 'bg-cobalt' : 'bg-ink'">{{ (k ? validation.after : validation.before)[lang] }}</span>
                  {{ change(s.alt[lang]) }}
                </figcaption>
              </figure>
            </div>
          </li>
        </ul>
      </CaseScene>
    </template>
  </CaseHold>
</template>
