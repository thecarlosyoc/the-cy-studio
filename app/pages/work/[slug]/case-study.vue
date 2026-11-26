<!-- app/pages/work/[slug]/case-study.vue -->
<script setup lang="ts">
import type { Component } from 'vue'
import type { CaseScene } from '#shared/types/caseStudy'
import type { WorkItem } from '#shared/types/content'
import { CASE_STUDIES, CASE_STUDY_SLUGS, UNNUMBERED_KINDS } from '~/data/caseStudies'
import CaseDecisions from '~/components/case/Decisions.vue'
import CaseDiscovery from '~/components/case/Discovery.vue'
import CaseFlow from '~/components/case/Flow.vue'
import CasePair from '~/components/case/Pair.vue'
import CaseProcess from '~/components/case/Process.vue'
import CaseSystem from '~/components/case/System.vue'
import CaseThreshold from '~/components/case/Threshold.vue'
import CaseUsers from '~/components/case/Users.vue'
import CaseValidation from '~/components/case/Validation.vue'

// The block catalog (shared/types/caseStudy.ts): every block takes its scene as `scene` and its number as `no`.
const BLOCKS: Record<CaseScene['kind'], Component> = {
  discovery: CaseDiscovery,
  users: CaseUsers,
  process: CaseProcess,
  threshold: CaseThreshold,
  decisions: CaseDecisions,
  pair: CasePair,
  flow: CaseFlow,
  validation: CaseValidation,
  system: CaseSystem,
}

const route = useRoute()
const slug = String(route.params.slug)
if (!CASE_STUDY_SLUGS.has(slug)) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

const study = CASE_STUDIES[slug]!
const lang = useLang()
const t = useT()
const { data: item } = await useFetch<WorkItem>(`/api/work/${slug}`)
const { data: items } = await useWorkItems()

// Next published product case after this one, in list order. The last case points to the whole list
// and says so, instead of presenting «Trabajo» as if it were a case.
const next = computed(() => {
  const list = (items.value ?? []).filter(i => i.type === 'product')
  const idx = list.findIndex(i => i.slug === slug)
  const n = idx >= 0 ? list[idx + 1] : undefined
  return n
    ? { label: study.close.next[lang.value], title: n.title[lang.value], to: `/work/${n.slug}` }
    : { label: t('caseMoreWork'), title: t('caseAllWork'), to: '/work' }
})
// Scene number for the mono tag of each scene, «03 / 10»: the hero is 1, the closing scene the last, and
// unnumbered blocks (the dark threshold band) are skipped.
let count = 1
const sceneNo = study.scenes.map(s => (UNNUMBERED_KINDS.has(s.kind) ? undefined : ++count))
const TOTAL = count + 1
const no = (n: number) => `${String(n).padStart(2, '0')} / ${String(TOTAL).padStart(2, '0')}`

const toAbsoluteImageUrl = useAbsoluteImageUrl()
// The title of the page is the one its H1 shows (the work item may be named slightly differently).
const seoTitle = computed(() => `${study.hero.title[lang.value]} · ${t('caseStudyLabel')}`)
const seoDescription = computed(() => study.hero.line[lang.value])
const seoImage = computed(() => toAbsoluteImageUrl(study.hero.poster.src))
useSeoMeta({
  title: () => seoTitle.value,
  description: () => seoDescription.value,
  ogTitle: () => seoTitle.value,
  ogDescription: () => seoDescription.value,
  ogType: 'article',
  ogImage: () => seoImage.value,
  twitterCard: 'summary_large_image',
  twitterTitle: () => seoTitle.value,
  twitterDescription: () => seoDescription.value,
  twitterImage: () => seoImage.value,
})
</script>

<template>
  <div class="bg-paper">
    <!-- The desktop nav has no surface of its own: this fade is the paper it sits on while the hero
         scrolls under it. The cobalt loop paints above it (z-[6] in CaseHero); the column below has its own. -->
    <div class="pointer-events-none sticky top-0 z-[5] -mb-24 hidden h-24 bg-gradient-to-b from-paper from-60% to-paper/0 md:block" aria-hidden="true" />
    <!-- Short laptop screens (under 800 px of height) get a tighter top, so the results stay in the first screen. -->
    <div class="pt-28 md:pt-32 md:[@media(max-height:800px)]:pt-24">
      <div class="px-6 md:px-12">
        <nav class="mx-auto flex max-w-[1200px] items-center gap-2 pb-10 text-sm md:pb-14 md:[@media(max-height:800px)]:pb-6" :aria-label="t('caseStudyLabel')">
          <NuxtLink
            :to="`/work/${slug}`"
            class="-ml-1 flex min-h-6 min-w-0 shrink items-center gap-1.5 py-1 text-ink-soft transition-colors hover:text-ink"
          >
            <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
              <path d="M12 5L7 10L12 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            </svg>
            <span class="truncate">{{ item?.title?.[lang] ?? study.hero.title[lang] }}</span>
          </NuxtLink>
          <span class="shrink-0 text-ink-soft/40" aria-hidden="true">/</span>
          <span class="truncate font-bold text-ink">{{ t('caseStudyLabel') }}</span>
        </nav>
      </div>
      <CaseHero :hero="study.hero" :role="item?.role" :no="no(1)" />
    </div>

    <!-- Opaque column over the pinned loop of the hero: from 768 px up (and with motion) it starts one
         screen early, so it rises over the loop while the loop is still stuck. data-nav-cover: once it
         crosses the nav, the nav stops reading the cobalt underneath (useNavTone). -->
    <div data-nav-cover class="relative z-10 bg-paper pb-24 md:motion-safe:-mt-[100svh]">
      <!-- Same paper fade under the nav as in the hero, for the column. The dark threshold scene sits
           above it (z-40). -->
      <div class="pointer-events-none sticky top-0 z-30 -mb-24 hidden h-24 bg-gradient-to-b from-paper from-60% to-paper/0 md:block" aria-hidden="true" />
      <component
        :is="BLOCKS[s.kind]"
        v-for="(s, i) in study.scenes"
        :key="s.kind"
        :scene="s"
        :no="sceneNo[i] ? no(sceneNo[i]!) : undefined"
      />
      <CaseClose :close="study.close" :footnote="study.footnote[lang]" :demo-url="item?.demoUrl" :next="next" :no="no(TOTAL)" />
    </div>
  </div>
</template>
