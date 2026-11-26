<!-- app/components/services/Areas.vue -->
<script setup lang="ts">
import type { GalleryVisual } from '#shared/types/content'

// The four areas as one pinned scene (the page's signature, the /about photo hold on a dark stage):
// scrolling steps through the areas, the real visual of each one cross-fades over the last and settles
// from 1.06 to 1, and a rail on the left fills with the scroll. The pinned layout exists only from
// 768 px up, on screens 620 px tall or more and without reduced motion (CaseHold decides); everywhere
// else nothing renders here and the catalog below shows each area's band above its rows.
export interface ServiceArea {
  id: string
  n: string
  title: string
  intro: string
  caseLabel: string
  caseTo?: string
  poster?: string
  alt: string
  video?: GalleryVisual
}
defineProps<{ areas: ServiceArea[] }>()
const t = useT()

// WCAG 2.2.2: the Motion video plays while its step is on screen, so it carries a pause control.
const userPaused = ref(false)
const playing = ref(false)
// A ref inside v-for is an array; only the Motion area has a video.
const media = ref<{ resume: () => void }[]>([])
function togglePlayback() {
  userPaused.value = playing.value
  if (!userPaused.value) media.value[0]?.resume()
}
</script>

<template>
  <section aria-labelledby="services-areas" class="bg-[#12110e]" data-nav-tone="image">
    <h2 id="services-areas" class="sr-only">{{ t('servicesIdxLabel') }}</h2>
    <CaseHold :steps="areas.length" step="65svh">
      <template #default="{ active, go }">
        <div class="grid min-h-0 flex-1 grid-cols-2 items-center gap-10 lg:gap-16">
          <div class="flex flex-col gap-10">
            <p class="font-mono text-[11px] uppercase tracking-[.16em] text-[#f1efea]/70">
              {{ t('servicesFactAreas').replace('{n}', String(areas.length)) }}
            </p>
            <div class="relative pl-6">
              <span class="absolute inset-y-0 left-0 w-0.5 bg-[#f1efea]/15" aria-hidden="true" />
              <span class="svc-rail-fill absolute inset-y-0 left-0 w-0.5 bg-[#f1efea]" aria-hidden="true" />
              <ol class="flex flex-col gap-3">
                <li v-for="(a, i) in areas" :key="a.id">
                  <!-- A shortcut to the step: the scroll stays the input. -->
                  <button
                    type="button"
                    class="flex items-baseline gap-4 text-left font-display text-[28px] font-bold leading-[1.1] transition-colors duration-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f1efea] lg:text-[40px]"
                    :class="active === i ? 'text-[#f1efea]' : 'text-[#f1efea]/60 hover:text-[#f1efea]/85'"
                    :aria-current="active === i ? 'step' : undefined"
                    @click="go(i)"
                  >
                    <span class="font-mono text-[11px] font-normal tracking-[.16em]">{{ a.n }}</span>
                    {{ a.title }}
                  </button>
                </li>
              </ol>
            </div>
            <!-- The active area's line and case link; the others wait in the same cell. -->
            <div class="grid">
              <div
                v-for="(a, i) in areas"
                :key="a.id"
                class="svc-area-copy col-start-1 row-start-1 flex flex-col items-start gap-4"
                :class="active === i ? 'is-on' : 'invisible'"
                :aria-hidden="active !== i || undefined"
              >
                <p class="max-w-[440px] text-lg text-[#f1efea]/80">{{ a.intro }}</p>
                <NuxtLink
                  v-if="a.caseTo"
                  :to="a.caseTo"
                  class="font-display text-[15px] font-medium text-[#f1efea] underline decoration-[#f1efea]/40 underline-offset-4 hover:decoration-[#f1efea] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f1efea]"
                >
                  {{ a.caseLabel }}
                </NuxtLink>
              </div>
            </div>
          </div>

          <div class="relative aspect-[16/10] max-h-full w-full overflow-hidden rounded-2xl bg-[#f1efea]/[.06]">
            <div
              v-for="(a, i) in areas"
              :key="a.id"
              class="svc-area-media absolute inset-0"
              :class="active === i && 'is-on'"
              :aria-hidden="active !== i || undefined"
            >
              <CoreBrowserFrame v-if="a.id === 'web'" url="thecystudio.com/muebleros" class="h-full">
                <NuxtImg src="/images/services/muebleros-1440.webp" :alt="a.alt" loading="lazy" sizes="md:60vw lg:720px" class="h-full w-full object-cover object-top" />
              </CoreBrowserFrame>
              <CoreCoverMedia
                v-else-if="a.video"
                ref="media"
                :video="a.video"
                :poster="a.poster ?? ''"
                :alt="a.alt"
                :paused="active !== i || userPaused"
                :hover-pause="false"
                :poster-width="1280"
                @playing="playing = $event"
              />
              <NuxtImg v-else-if="a.poster" :src="a.poster" :alt="a.alt" loading="lazy" sizes="md:60vw lg:720px" class="h-full w-full object-cover" />
              <button
                v-if="a.video"
                type="button"
                :tabindex="active === i ? undefined : -1"
                class="absolute bottom-4 right-4 z-10 flex h-9 items-center rounded-full bg-[#12110e]/80 px-4 font-display text-[14px] font-medium text-[#f1efea] transition-colors hover:bg-[#12110e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f1efea]"
                @click="togglePlayback"
              >
                {{ playing ? t('servicesVideoPause') : t('servicesVideoPlay') }}
              </button>
            </div>
          </div>
        </div>
      </template>
    </CaseHold>
  </section>
</template>

<style scoped>
/* CaseHold centres a 1200 px column (the case page grid); /services keeps the home's 64 px gutters.
   ponytail: reaches into CaseHold's stage markup; give CaseHold a width prop if a third page needs this. */
@media (min-width: 768px) {
  section :deep(.case-hold > .sticky) { padding-inline: 4rem; }
  section :deep(.case-hold > .sticky > div) { max-width: none; }
}

/* The visual of the active area comes in over the last one and settles, the /about photo gesture. */
.svc-area-media {
  opacity: 0;
  transform: scale(1.06);
  transition: opacity 0.5s var(--ease-settle), transform 1.2s var(--ease-settle);
}
.svc-area-media.is-on {
  opacity: 1;
  transform: none;
}
.svc-area-copy {
  opacity: 0;
  transform: translateY(12px);
  transition: opacity 0.4s var(--ease-settle), transform 0.4s var(--ease-settle);
}
.svc-area-copy.is-on {
  opacity: 1;
  transform: none;
}

/* Rail: steps with the active area; with scroll-driven animations it follows the whole hold. */
.svc-rail-fill {
  transform: scaleY(calc((var(--active) + 1) / var(--steps)));
  transform-origin: top;
  transition: transform 0.3s var(--ease-settle);
}
@keyframes svc-rail-fill {
  from { transform: scaleY(0); }
  to { transform: scaleY(1); }
}
@supports (animation-timeline: view()) {
  .svc-rail-fill {
    animation: svc-rail-fill linear both;
    animation-timeline: --case-hold;
    animation-range: contain;
    transition: none;
  }
}
</style>
