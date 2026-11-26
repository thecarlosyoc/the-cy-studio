<!-- app/components/case/System.vue -->
<script setup lang="ts">
import type { SceneImage, paymentsScenes } from '#shared/data/casePaymentsScenes'

// Design system scene: four component groups (2x2 on desktop, one column on a phone) in the page flow,
// with CoreReveal entrances; then the two dashboards on a pinned stage (a laptop and a phone that stay
// still while the scroll swaps their screens), stacked instead on a phone or with reduced motion.
defineProps<{ system: typeof paymentsScenes.system; no: string }>()
const lang = useLang()
// Rendered width of a framed sheet = box width x cover factor (a sheet wider than 16:10 overflows its box) x
// zoom; `sizes` says so, so the browser asks for at least 2 image px per CSS px.
const sizesFor = (img: SceneImage) => {
  const k = Math.max(1, img.width / img.height / 1.6) * (img.focus?.[2] ?? 1)
  const r = (n: number) => Math.round(n * k * 1.05)
  return `sm:${r(100)}vw md:${r(50)}vw lg:${r(520)}px xl:${r(556)}px xxl:${r(556)}px`
}
</script>

<template>
  <div>
  <CaseScene id="case-system" :no="no" :tag="system.tag[lang]" :title="system.title[lang]" :line="system.line[lang]">
    <ul class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6">
      <li v-for="(g, i) in system.groups" :key="g.image.src">
        <CoreReveal class="h-full" :style="{ transitionDelay: `${(i % 2) * 90}ms` }">
          <figure class="h-full rounded-2xl bg-white p-3 dark:bg-white/[.08] md:p-4">
            <!-- ponytail: light captures sit on their own paper-coloured mat in dark mode too; a dark re-export is out of scope. -->
            <!-- One 16:10 box for every sheet; each is held on the part that shows its group (`focus`). -->
            <div class="aspect-[16/10] overflow-hidden rounded-lg" :style="{ background: g.mat }">
              <CaseShot :img="g.image" framed :sizes="sizesFor(g.image)" />
            </div>
            <figcaption class="px-1 pb-1 pt-4 md:px-2 md:pb-2">
              <h3 class="font-display text-xl font-bold text-ink">{{ g.name[lang] }}</h3>
              <p class="mt-2 text-base text-ink-soft">{{ g.text[lang] }}</p>
            </figcaption>
          </figure>
        </CoreReveal>
      </li>
    </ul>
  </CaseScene>

  <!-- Dashboards: a pinned stage (laptop and phone stay still, the scroll swaps their screens). Not next to
       another pinned scene: the group grid is above and the closing scene below. -->
  <CaseHold :steps="2" step="150svh">
    <template #default="{ active, go }">
      <section aria-labelledby="case-system-dash-title" class="flex min-h-0 flex-1 flex-col">
        <h3 id="case-system-dash-title" class="font-display text-[30px] font-bold leading-tight text-ink">{{ system.dashboards.title[lang] }}</h3>
        <p class="mt-2 max-w-[820px] text-base text-ink-soft">{{ system.dashboards.line[lang] }}</p>

        <div class="relative mt-4">
          <span class="absolute inset-x-0 top-0 h-0.5 bg-ink/15" aria-hidden="true" />
          <span class="case-hold-fill absolute inset-x-0 top-0 h-0.5 bg-cobalt" aria-hidden="true" />
          <ol class="grid grid-cols-2 gap-4">
            <li v-for="(s, i) in system.dashboards.states" :key="s.label.es">
              <button
                type="button"
                :aria-current="active === i ? 'step' : undefined"
                class="block w-full pt-3 text-left focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                @click="go(i)"
              >
                <span class="block font-mono text-[11px] uppercase tracking-[.16em] transition-colors duration-150" :class="active === i ? 'text-cobalt' : 'text-ink-soft'">{{ String(i + 1).padStart(2, '0') }} / 02</span>
                <span class="mt-1 block font-display text-base transition-colors duration-150" :class="active === i ? 'font-bold text-ink' : 'font-medium text-ink-soft'">{{ s.label[lang] }}</span>
              </button>
            </li>
          </ol>
        </div>

        <div class="mt-3 grid">
          <p
            v-for="(s, i) in system.dashboards.states"
            :key="s.label.es"
            class="col-start-1 row-start-1 text-lg text-ink-soft transition-opacity duration-300 motion-reduce:transition-none"
            :class="active === i ? 'opacity-100' : 'pointer-events-none opacity-0'"
            :aria-hidden="active !== i"
          >{{ s.caption[lang] }}</p>
        </div>

        <div class="mt-4 min-h-0 flex-1 [container-type:size]">
          <CaseDevices :states="system.dashboards.states" :active="active" />
        </div>
      </section>
    </template>

    <template #stacked>
      <section aria-labelledby="case-system-dash-title" class="px-6 pb-16 md:px-12 md:pb-24">
        <div class="mx-auto max-w-[1200px]">
          <CoreReveal>
            <h3 id="case-system-dash-title" class="max-w-[900px] break-words font-display text-[28px] font-bold leading-[1.1] text-ink md:text-[40px]">{{ system.dashboards.title[lang] }}</h3>
            <p class="mt-4 max-w-[720px] text-lg text-ink-soft">{{ system.dashboards.line[lang] }}</p>
          </CoreReveal>
          <ol class="mt-10 space-y-14 md:space-y-20">
            <li v-for="(s, i) in system.dashboards.states" :key="s.label.es">
              <CoreReveal>
                <p class="font-mono text-[11px] uppercase tracking-[.16em] text-cobalt">{{ String(i + 1).padStart(2, '0') }} / 02 · {{ s.label[lang] }}</p>
                <p class="mt-2 mb-6 font-display text-xl font-medium text-ink">{{ s.caption[lang] }}</p>
                <CaseDevices :states="[s]" :active="0" flow />
              </CoreReveal>
            </li>
          </ol>
        </div>
      </section>
    </template>
  </CaseHold>
  </div>
</template>
