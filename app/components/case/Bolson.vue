<!-- app/components/case/Bolson.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

// The four hand-offs of the bolsón increase as a 2 × 2 grid, each card held on its dialog. A cobalt
// line on top of each card fills as the card comes in: the relay moves with the scroll, nothing to click.
defineProps<{ bolson: typeof paymentsScenes.bolson; no: string }>()
const lang = useLang()
const t = useT()
</script>

<template>
  <CaseScene id="case-bolson" :no="no" :tag="bolson.tag[lang]" :title="bolson.title[lang]" :line="bolson.line[lang]">
    <ol class="grid grid-cols-1 gap-x-6 gap-y-10 md:grid-cols-2">
      <li v-for="(s, i) in bolson.stages" :key="i" class="relative pt-5">
        <span class="absolute inset-x-0 top-0 h-0.5 bg-ink/15" aria-hidden="true" />
        <span class="case-relay absolute inset-x-0 top-0 h-0.5 origin-left bg-cobalt" :class="i % 2 && 'case-relay-late'" aria-hidden="true" />
        <p class="font-mono text-[11px] uppercase tracking-[.16em] text-cobalt">{{ String(i + 1).padStart(2, '0') }} · {{ s.role[lang] }}</p>
        <h3 class="mt-1 font-display text-2xl font-bold text-ink">{{ s.text[lang] }}</h3>
        <div class="mt-4 aspect-[16/10] overflow-hidden rounded-2xl bg-ink/5">
          <CaseShot :img="s.image" framed sizes="sm:160vw md:80vw lg:960px xl:960px xxl:960px" />
        </div>
      </li>
    </ol>

    <h3 class="mt-20 font-display text-2xl font-bold text-ink md:text-3xl">{{ t('caseBolsonFail') }}</h3>
    <ul class="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
      <li v-for="p in bolson.paths" :key="p.kind.es" class="flex flex-col rounded-2xl bg-white p-4 dark:bg-white/[.08] md:p-6">
        <p class="font-mono text-[11px] uppercase tracking-[.16em] text-cobalt dark:text-ink-soft">{{ p.kind[lang] }}</p>
        <p class="mt-2 text-lg text-ink">{{ p.text[lang] }}</p>
        <!-- Same box for both dialogs; each one keeps its size (2x capture shown at half its pixels). -->
        <div class="mt-4 flex flex-1 items-center justify-center rounded-xl bg-ink/5 p-4 md:min-h-[420px] md:p-8">
          <CaseShot :img="p.image" class="max-w-[360px] rounded-lg shadow-[0_8px_30px_rgb(18_17_14/0.12)]" sizes="sm:100vw md:360px lg:360px xl:360px xxl:360px" />
        </div>
      </li>
    </ul>

    <p class="mt-10 text-base text-ink-soft">{{ bolson.rules.map(r => r[lang]).join(' · ') }}</p>
    <p class="mt-3 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ bolson.count[lang] }}</p>
  </CaseScene>
</template>

<style scoped>
/* Static by default: every line full. With scroll-driven animations each line fills while it travels
   up the lower half of the screen; the right-hand card of a row starts a little later. */
@keyframes case-relay {
  from { transform: scaleX(0); }
}
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .case-relay {
      animation: case-relay linear both;
      animation-timeline: view(block);
      animation-range: cover 8% cover 38%;
    }
    .case-relay-late {
      animation-range: cover 18% cover 48%;
    }
  }
}
</style>
