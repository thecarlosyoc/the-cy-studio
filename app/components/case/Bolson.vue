<!-- app/components/case/Bolson.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

// Two layouts. Pinned (the hold exists: 768 px wide, 620 px tall, motion allowed): a horizontal row of
// panels (four hand-offs, then the failure paths) that the page's vertical scroll carries sideways while
// the scene stays put; nothing to click or drag. Stacked (phones, reduced motion, short screens): the four
// hand-offs in one row (2 × 2 under 1024 px), each card held on its dialog; below, the two failure paths
// as two short cards. A cobalt line on top of each stage fills as the row comes in.
defineProps<{ bolson: typeof paymentsScenes.bolson; no: string }>()
const lang = useLang()
const t = useT()
const PANELS = 5 // four stages + the failure panel
</script>

<template>
  <CaseHold :steps="PANELS" step="55svh">
    <template #default="{ active }">
      <section aria-labelledby="case-bolson-title" class="flex min-h-0 flex-1 flex-col">
        <p class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ no }} · {{ bolson.tag[lang] }}</p>
        <h2 id="case-bolson-title" class="mt-2 font-display text-[30px] font-bold leading-tight text-ink">{{ bolson.title[lang] }}</h2>
        <p class="mt-1 max-w-[820px] text-base text-ink-soft">{{ bolson.line[lang] }}</p>

        <!-- Progress of the hold: the thin line only, no numbered rail (this scene is a row passing by). -->
        <div class="relative mt-4">
          <span class="absolute inset-x-0 top-0 h-0.5 bg-ink/15" aria-hidden="true" />
          <span class="case-hold-fill absolute inset-x-0 top-0 h-0.5 bg-cobalt" aria-hidden="true" />
        </div>

        <!-- The room under the progress line is a size container: row, rules and count sit together as one
             block centred in it. `--h` is the height of a dialog box, from that room (never above 380 px: a
             1920 px capture then renders at 960 px at most, one image px per device px on a 2x screen).
             The track is wider than the window and travels with the hold. -->
        <div class="mt-5 flex min-h-0 flex-1 flex-col justify-center [container-type:size]">
          <div class="case-row-window -mx-12 px-12" :style="{ '--h': 'clamp(160px, calc(100cqh - 185px), 380px)', '--n': PANELS - 1, '--active': active }">
            <ol class="case-row-track flex w-max items-start gap-6">
              <li v-for="(s, i) in bolson.stages" :key="i" class="shrink-0" style="width: var(--p)">
                <div class="border-t-2 border-ink/15 pt-3">
                  <p class="font-mono text-[11px] uppercase tracking-[.16em] text-cobalt">{{ String(i + 1).padStart(2, '0') }} · {{ s.role[lang] }}</p>
                  <h3 class="mt-1 font-display text-xl font-bold leading-snug text-ink">{{ s.text[lang] }}</h3>
                  <!-- The dialog, whole, on a little of its screen: the capture is 960 px wide at most, held on `focus`; it always covers its box.
                       `--p * 2.45` keeps the 720 px dialog (37.5 % of the capture) inside a narrow panel (888–1127 px containers). -->
                  <div class="relative mt-3 overflow-hidden rounded-2xl bg-ink/5" :style="{ height: 'var(--h)' }">
                    <CaseShot
                      :img="s.image"
                      sizes="960px"
                      class="absolute max-w-none"
                      :style="{ width: 'min(960px, calc(var(--p) * 2.45), max(100%, calc(var(--h) * 2.526)))', left: '50%', top: '50%', transform: `translate(-${s.image.focus?.[0] ?? 50}%, -${s.image.focus?.[1] ?? 50}%)` }"
                    />
                  </div>
                </div>
              </li>
              <!-- As wide as its two dialogs: the row ends with the last stage panel and this one filling the window. -->
              <li class="shrink-0" style="width: var(--f)">
                <div class="border-t-2 border-ink/15 pt-3">
                  <h3 class="font-display text-xl font-bold text-ink">{{ t('caseBolsonFail') }}</h3>
                  <ul class="mt-3 flex justify-center gap-6">
                    <li v-for="p in bolson.paths" :key="p.kind.es" style="width: var(--d)">
                      <p class="font-mono text-[11px] uppercase tracking-[.16em] text-cobalt">{{ p.kind[lang] }}</p>
                      <p class="mt-1 text-base text-ink">{{ p.text[lang] }}</p>
                      <div class="mt-3 flex justify-center rounded-xl bg-ink/5 p-3">
                        <CaseShot :img="p.image" class="!h-auto !w-auto max-w-full rounded-md shadow-[0_8px_30px_rgb(18_17_14/0.12)]" :style="{ maxHeight: 'calc(var(--h) - 76px)' }" sizes="360px" />
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
            </ol>
          </div>

          <p class="mt-4 text-base text-ink-soft">{{ bolson.rules.map(r => r[lang]).join(' · ') }}</p>
          <p class="mt-2 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ bolson.count[lang] }}</p>
        </div>
      </section>
    </template>

    <template #stacked>
    <CaseScene id="case-bolson" :no="no" :tag="bolson.tag[lang]" :title="bolson.title[lang]" :line="bolson.line[lang]">
      <ol class="grid grid-cols-2 gap-x-4 gap-y-8 md:gap-x-6 lg:grid-cols-4">
        <li v-for="(s, i) in bolson.stages" :key="i" class="case-relay-step relative flex flex-col pt-4">
          <span class="absolute inset-x-0 top-0 h-0.5 bg-ink/15" aria-hidden="true" />
          <span class="case-relay absolute inset-x-0 top-0 h-0.5 origin-left bg-cobalt" aria-hidden="true" />
          <p class="font-mono text-[11px] uppercase tracking-[.16em] text-cobalt">{{ String(i + 1).padStart(2, '0') }} · {{ s.role[lang] }}</p>
          <h3 class="mt-1 font-display text-base font-bold leading-snug text-ink md:text-xl">{{ s.text[lang] }}</h3>
          <!-- Pushed to the bottom of the card: a title that wraps (longer in EN) never drops its image below the row. -->
          <div class="mt-auto pt-3">
            <div class="aspect-square overflow-hidden rounded-2xl bg-ink/5">
              <CaseShot :img="s.image" framed sizes="sm:105vw md:110vw lg:720px xl:720px xxl:720px" />
            </div>
          </div>
        </li>
      </ol>

      <h3 class="mt-12 font-display text-xl font-bold text-ink md:mt-14 md:text-2xl">{{ t('caseBolsonFail') }}</h3>
      <ul class="mt-5 grid grid-cols-1 gap-4 md:gap-6 lg:grid-cols-2">
        <li v-for="p in bolson.paths" :key="p.kind.es" class="flex items-center gap-4 rounded-2xl bg-white p-4 dark:bg-white/[.08] md:gap-6 md:p-5">
          <div class="min-w-0 flex-1">
            <p class="font-mono text-[11px] uppercase tracking-[.16em] text-cobalt dark:text-ink-soft">{{ p.kind[lang] }}</p>
            <p class="mt-2 text-base text-ink md:text-lg">{{ p.text[lang] }}</p>
          </div>
          <!-- Same box for both dialogs; each one keeps its own height (720 px captures, 3x and over at this width). -->
          <div class="flex w-[132px] shrink-0 items-center self-stretch rounded-xl bg-ink/5 p-3 md:w-[216px] md:p-4">
            <CaseShot :img="p.image" class="rounded-md shadow-[0_8px_30px_rgb(18_17_14/0.12)]" sizes="sm:216px md:216px lg:216px xl:216px xxl:216px" />
          </div>
        </li>
      </ul>

      <p class="mt-8 text-base text-ink-soft">{{ bolson.rules.map(r => r[lang]).join(' · ') }}</p>
      <p class="mt-3 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ bolson.count[lang] }}</p>
    </CaseScene>
    </template>
  </CaseHold>
</template>

<style scoped>
/* Static by default: every line full. With scroll-driven animations each line fills while the row
   travels up the lower half of the screen, each stage a little after the one before it. */
@keyframes case-relay {
  from { transform: scaleX(0); }
}
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .case-relay {
      animation: case-relay linear both;
      animation-timeline: view(block);
      animation-range: cover 8% cover 30%;
    }
    .case-relay-step:nth-child(2) .case-relay { animation-range: cover 14% cover 36%; }
    .case-relay-step:nth-child(3) .case-relay { animation-range: cover 20% cover 42%; }
    .case-relay-step:nth-child(4) .case-relay { animation-range: cover 26% cover 48%; }
  }
}

/* Pinned row. Without scroll-driven animations the track steps with the hold's `--active` (every panel is
   still reachable by scrolling); with them it travels with the whole hold, resting a little at both ends.
   The window reaches 48 px into the stage's side padding on both sides and fades there, so a panel entering
   or leaving is never cut mid-word, and at rest the first and last panels sit clear of the fade. */
.case-row-window {
  /* Narrow stages: the failure panel is the whole window, a stage panel keeps its floor. Wide stages:
     the last stage panel plus the failure panel (two dialogs, <= 360 px each) fill the window exactly,
     so the row ends on a panel boundary with no empty strip. */
  --d: min(360px, calc((100cqw - 24px) / 2));
  --f: 100cqw;
  --p: max(320px, calc(var(--h) * 1.158));
  overflow: hidden;
  mask-image: linear-gradient(90deg, transparent, #000 48px, #000 calc(100% - 48px), transparent);
}
@container (min-width: 888px) {
  .case-row-window {
    --d: min(360px, calc((100cqw - 368px) / 2));
    --f: calc(var(--d) * 2 + 24px);
    --p: calc(100cqw - 48px - var(--d) * 2);
  }
}
.case-row-track {
  transform: translateX(calc((100cqw - 100%) * var(--active) / var(--n)));
  transition: transform 0.5s var(--ease-settle);
}
@keyframes case-row {
  0%, 6% { transform: translateX(0); }
  94%, 100% { transform: translateX(calc(100cqw - 100%)); }
}
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .case-row-track {
      animation: case-row linear both;
      animation-timeline: --case-hold;
      animation-range: contain;
      transition: none;
    }
  }
}
</style>
