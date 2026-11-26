<!-- app/components/case/Tour.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

// The guided tour of the affiliated business, on its own: the tooltip of the first visit and the help
// dialog with video, both held on the piece that matters.
defineProps<{ tour: typeof paymentsScenes.tour; no: string }>()
const lang = useLang()
</script>

<template>
  <CaseScene id="case-tour" :no="no" :tag="tour.tag[lang]" :title="tour.title[lang]" :line="tour.line[lang]">
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2">
      <CoreReveal v-for="(img, i) in tour.images" :key="img.src" :style="{ transitionDelay: `${i * 80}ms` }">
        <figure>
          <div class="aspect-[16/10] overflow-hidden rounded-2xl bg-ink/5">
            <CaseShot :img="img" framed sizes="sm:160vw md:120vw lg:1200px xl:1200px xxl:1200px" />
          </div>
          <figcaption class="mt-3 text-base text-ink-soft">{{ img.alt[lang] }}</figcaption>
        </figure>
      </CoreReveal>
    </div>
  </CaseScene>
</template>
