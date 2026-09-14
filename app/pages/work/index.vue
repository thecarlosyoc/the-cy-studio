<script setup lang="ts">
import type { WorkItem } from '#shared/types/content'
import { dict } from '~/data/i18n'

const lang = useLang()
const t = useT()
const activeType = ref<'product' | 'brand'>('product')

const seoTitle = 'Trabajo — the CY studio'
const seoDescription = dict.es.workIntro
const seoImage = useAbsoluteImageUrl()()

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: 'website',
  ogImage: seoImage,
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: seoImage,
})

const { data: workItems } = await useFetch<WorkItem[]>('/api/work')

const filteredItems = computed(() =>
  (workItems.value ?? []).filter((item) => item.type === activeType.value)
)
</script>

<template>
  <div class="bg-paper min-h-screen">
    <div class="md:hidden" style="padding-top: var(--navbar-height);">
      <div class="sticky z-10 bg-paper px-6 pt-6 pb-4" style="top: var(--navbar-height);">
        <h1 class="font-display font-bold text-[40px] text-ink leading-tight">
          {{ t('workTitle') }}
        </h1>
        <p class="mt-4 text-ink-soft text-base">
          {{ t('workIntro') }}
        </p>

        <div class="mt-6 inline-flex gap-1.5 rounded-full bg-ink/5 p-1.5">
          <CoreControl
            :variant="activeType === 'product' ? 'solid' : 'soft'"
            @click="activeType = 'product'"
          >
            {{ t('workFilterProduct') }}
          </CoreControl>
          <CoreControl
            :variant="activeType === 'brand' ? 'solid' : 'soft'"
            @click="activeType = 'brand'"
          >
            {{ t('workFilterBrand') }}
          </CoreControl>
        </div>
      </div>

      <div class="px-6 pt-2 pb-6 space-y-6">
        <CoreReveal v-for="item in filteredItems" :key="item.slug">
          <CardWork
            :title="item.title[lang]"
            :description="item.description[lang]"
            :image="item.gallery[0]"
            :to="`/work/${item.slug}`"
          />
        </CoreReveal>
      </div>
    </div>

    <div class="hidden md:block px-12 pt-32 pb-24">
      <h1 class="font-display font-bold text-[64px] text-ink leading-tight">
        {{ t('workTitle') }}
      </h1>
      <p class="mt-4 max-w-2xl text-ink-soft text-lg">
        {{ t('workIntro') }}
      </p>

      <div class="mt-8 inline-flex gap-1.5 rounded-full bg-ink/5 p-1.5">
        <CoreControl
          :variant="activeType === 'product' ? 'solid' : 'soft'"
          @click="activeType = 'product'"
        >
          {{ t('workFilterProduct') }}
        </CoreControl>
        <CoreControl
          :variant="activeType === 'brand' ? 'solid' : 'soft'"
          @click="activeType = 'brand'"
        >
          {{ t('workFilterBrand') }}
        </CoreControl>
      </div>

      <div class="relative mt-10">
        <div
          class="flex gap-6 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide"
          style="mask-image: linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%); -webkit-mask-image: linear-gradient(90deg, transparent 0%, black 4%, black 96%, transparent 100%);"
        >
          <CardWork
            v-for="item in filteredItems"
            :key="item.slug"
            :title="item.title[lang]"
            :description="item.description[lang]"
            :image="item.gallery[0]"
            :to="`/work/${item.slug}`"
            class="w-[420px] shrink-0 snap-start"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style>
.scrollbar-hide::-webkit-scrollbar { display: none; }
.scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
</style>