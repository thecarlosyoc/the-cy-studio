<!-- app/pages/work/[slug]/case-study.vue -->
<script setup lang="ts">
import type { WorkItem } from '#shared/types/content'
import { CASE_STUDIES, CASE_STUDY_SLUGS } from '~/data/caseStudies'

const route = useRoute()
const slug = String(route.params.slug)
if (!CASE_STUDY_SLUGS.has(slug)) throw createError({ statusCode: 404, statusMessage: 'Not found', fatal: true })

const scenes = CASE_STUDIES[slug as keyof typeof CASE_STUDIES]
const lang = useLang()
const t = useT()
const { data: item } = await useFetch<WorkItem>(`/api/work/${slug}`)
const { data: items } = await useWorkItems()

// Next published product case after this one, in list order; /work when this is the last.
const next = computed(() => {
  const list = (items.value ?? []).filter(i => i.type === 'product')
  const n = list[list.findIndex(i => i.slug === slug) + 1]
  return n ? { title: n.title[lang.value], to: `/work/${n.slug}` } : { title: t('work'), to: '/work' }
})

const toAbsoluteImageUrl = useAbsoluteImageUrl()
const seoTitle = computed(() => `${item.value?.title?.[lang.value] ?? scenes.hero.title[lang.value]} · ${t('caseStudyLabel')}`)
const seoDescription = computed(() => scenes.hero.line[lang.value])
const seoImage = computed(() => toAbsoluteImageUrl(scenes.hero.poster.src))
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
  <div class="min-h-screen bg-paper pb-24 pt-28 md:pt-32">
    <nav class="mx-auto flex max-w-[1200px] items-center gap-2 px-6 text-sm md:px-12" :aria-label="t('caseStudyLabel')">
      <NuxtLink
        :to="`/work/${slug}`"
        class="flex min-h-6 min-w-0 shrink-0 items-center gap-1.5 py-1 text-ink-soft transition-colors hover:text-ink"
      >
        <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
          <path d="M12 5L7 10L12 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
        {{ item?.title?.[lang] ?? scenes.hero.title[lang] }}
      </NuxtLink>
      <span class="shrink-0 text-ink-soft/40" aria-hidden="true">/</span>
      <span class="truncate font-bold text-ink">{{ t('caseStudyLabel') }}</span>
    </nav>

    <CaseHero :hero="scenes.hero" />
    <CaseImpact :impact="scenes.impact" />
    <CaseDiscovery :discovery="scenes.discovery" />
    <CaseUsers :users="scenes.users" />
    <CaseProcess :process="scenes.process" />
    <CaseFlow :flow="scenes.flow" />
    <CaseDecisions :decisions="scenes.decisions" />
    <CaseBolson :bolson="scenes.bolson" />
    <CaseValidation :validation="scenes.validation" />
    <CaseClose :close="scenes.close" :footnote="scenes.footnote[lang]" :demo-url="item?.demoUrl" :next="next" />
  </div>
</template>
