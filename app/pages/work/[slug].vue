<!-- app/pages/work/[slug].vue -->
<script setup lang="ts">
import { workItems } from '~/data/work'

const route = useRoute()
const lang = useLang()
const t = useT()
const item = computed(() => workItems.find((i) => i.slug === route.params.slug))
</script>

<template>
  <div v-if="item" class="bg-paper min-h-screen pt-28 md:pt-32 pb-24">
    <div class="px-6 md:px-12 max-w-4xl mx-auto">
      <h1 class="font-display font-bold text-[40px] md:text-[64px] text-ink leading-tight">
        {{ item.title[lang] }}
      </h1>
      <p class="mt-4 text-ink-soft text-lg max-w-2xl">
        {{ item.description[lang] }}
      </p>
      <hr class="mt-8 border-ink/15" />

      <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
        <div class="space-y-8">
          <div>
            <h2 class="font-display font-bold text-sm uppercase tracking-wide text-ink">{{ t('aboutRole') }}</h2>
            <ul class="mt-3 space-y-2">
              <li v-for="(r, i) in item.role" :key="i" class="text-ink-soft">{{ r[lang] }}</li>
            </ul>
          </div>
          <div>
            <h2 class="font-display font-bold text-sm uppercase tracking-wide text-ink">{{ t('aboutTools') }}</h2>
            <ul class="mt-3 space-y-2">
              <li v-for="tool in item.tools" :key="tool" class="text-ink-soft">{{ tool }}</li>
            </ul>
          </div>
          <div>
            <h2 class="font-display font-bold text-sm uppercase tracking-wide text-ink">{{ t('aboutDate') }}</h2>
            <p class="mt-3 text-ink-soft">{{ item.date[lang] }}</p>
          </div>
        </div>

        <div class="space-y-8">
          <div>
            <h2 class="font-display font-bold text-sm uppercase tracking-wide text-ink">{{ t('aboutDescription') }}</h2>
            <p class="mt-3 text-ink-soft">{{ item.description[lang] }}</p>
          </div>
          <div>
            <h2 class="font-display font-bold text-sm uppercase tracking-wide text-ink">{{ t('aboutContext') }}</h2>
            <p class="mt-3 text-ink-soft">{{ item.context[lang] }}</p>
          </div>
        </div>
      </div>
    </div>

    <div class="mt-14 px-6 md:px-12">
      <WorkGalleryGrid :images="item.gallery" />
    </div>
  </div>

  <div v-else class="min-h-screen flex items-center justify-center">
    <p class="text-ink-soft">{{ t('notFound') }}</p>
  </div>
</template>