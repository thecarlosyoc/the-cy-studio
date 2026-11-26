<!-- app/components/case/Maps.vue -->
<script setup lang="ts">
import type { MapsScene } from '#shared/types/caseStudy'

// The case's FigJam diagrams: the module map full width, then the flows. Each image is the export of
// its own language; the caption says what it shows and the image opens full size, where a phone can
// zoom into the diagram's text.
defineProps<{ scene: MapsScene; no: string }>()
const lang = useLang()
const t = useT()
</script>

<template>
  <CaseScene id="case-maps" :no="no" :tag="scene.tag[lang]" :title="scene.title[lang]" :line="scene.line[lang]">
    <div class="grid grid-cols-1 gap-12 md:gap-16">
      <CoreReveal v-for="m in scene.maps" :key="m.name.es">
        <figure>
          <a
            :href="m.image[lang].src"
            target="_blank"
            rel="noopener"
            class="block overflow-hidden rounded-2xl bg-white ring-1 ring-ink/10 transition-shadow hover:ring-ink/30 dark:bg-white/[.08]"
          >
            <CaseShot :img="m.image[lang]" sizes="sm:100vw md:100vw lg:1200px xl:1200px xxl:1200px" />
          </a>
          <figcaption class="mt-4 flex flex-col gap-1 md:flex-row md:items-baseline md:justify-between md:gap-8">
            <span>
              <span class="font-display text-xl font-bold text-ink">{{ m.name[lang] }}</span>
              <span class="mt-1 block text-base text-ink-soft">{{ m.text[lang] }}</span>
            </span>
            <a
              :href="m.image[lang].src"
              target="_blank"
              rel="noopener"
              class="shrink-0 py-2 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft underline-offset-4 hover:text-ink hover:underline"
            >{{ t('caseOpenFull') }} ↗</a>
          </figcaption>
        </figure>
      </CoreReveal>
    </div>
    <p class="mt-10 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ scene.note[lang] }}</p>
  </CaseScene>
</template>
