<!-- app/components/case/Validation.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

// Before / after in the page flow: each table shows Phase 1 next to Phase 2, both held on the columns
// that changed, with the change named under each one. Not pinned (Carlos, 2026-11-25): the page keeps
// its pinned scenes for the table, the bolsón row and the dashboards.
defineProps<{ validation: typeof paymentsScenes.validation; no: string }>()
const lang = useLang()
// The alt text reads «Fase 1: tabla sin…»; next to the phase chip only what comes after the colon is shown.
const change = (alt: string) => alt.replace(/^[^:]+:\s*/, '').replace(/^./, c => c.toUpperCase())
</script>

<template>
  <CaseScene id="case-validation" :no="no" :tag="validation.tag[lang]" :title="validation.title[lang]" :line="validation.line[lang]">
    <ul class="space-y-12">
      <li v-for="tb in validation.tabs" :key="tb.name.es">
        <CoreReveal>
          <h3 class="font-display text-2xl font-bold text-ink">{{ tb.name[lang] }}</h3>
          <div class="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
            <figure v-for="(s, k) in [tb.before, tb.after]" :key="s.src">
              <!-- On a phone the frame keeps a legible width and scrolls sideways, like the wide tables; its
                   right edge fades to say there is more. -->
              <div class="case-validation-frame overflow-x-auto rounded-2xl">
                <div class="aspect-[16/10] min-w-[640px] overflow-hidden rounded-2xl bg-white dark:bg-white/[.08] md:min-w-0">
                  <CaseShot :img="s" framed sizes="sm:960px md:80vw lg:960px xl:960px xxl:960px" />
                </div>
              </div>
              <figcaption class="mt-3 flex items-center gap-3 text-base text-ink">
                <span class="shrink-0 whitespace-nowrap rounded px-2.5 py-1 font-mono text-[11px] uppercase tracking-[.16em] text-paper" :class="k ? 'bg-cobalt' : 'bg-ink'">{{ (k ? validation.after : validation.before)[lang] }}</span>
                {{ change(s.alt[lang]) }}
              </figcaption>
            </figure>
          </div>
        </CoreReveal>
      </li>
    </ul>
  </CaseScene>
</template>

<style scoped>
/* The fade says «more to the right»: it shows only where the frame overflows (under 688 px of viewport, where the 640 px frame does not fit) and
   goes away as the scroll reaches the end. Without scroll-driven animations it stays static. The fade width is
   a registered length so it interpolates: a mask-image gradient animates discretely and would jump at 50 %. */
@property --case-validation-fade {
  syntax: '<length>';
  inherits: false;
  initial-value: 40px;
}
@media (max-width: 687px) {
  .case-validation-frame { mask-image: linear-gradient(90deg, #000 calc(100% - var(--case-validation-fade)), transparent); }
  @supports (animation-timeline: scroll()) {
    .case-validation-frame { animation: case-validation-fade linear both; animation-timeline: scroll(self inline); }
  }
}
@keyframes case-validation-fade {
  to { --case-validation-fade: 0px; }
}
</style>
