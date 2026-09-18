<!-- app/components/card/Work.vue -->
<script setup lang="ts">
import type { GalleryVisual } from '#shared/types/content'

const t = useT()

defineProps<{
  title: string
  description: string
  image: string
  to: string
  compact?: boolean
  loading?: 'eager' | 'lazy'
  // Explicit video cover (admin-picked). Falls back to the static `image`
  // when absent — most projects don't have one.
  video?: GalleryVisual
}>()

const arrowEl = ref<HTMLElement | null>(null)
useMagnetic(arrowEl, { radius: 70, strength: 12 })
</script>

<template>
  <NuxtLink
    :to="to"
    :data-cursor="t('viewProject')"
    :class="[
      'group block rounded-[28px] border border-ink/15 p-5 transition-colors hover:border-ink/50 hover:bg-ink/5',
      compact ? 'flex flex-col md:p-6' : 'md:p-8',
    ]"
  >
    <div class="flex items-start justify-between gap-2 md:gap-4">
      <h2
        :class="[
          'font-display font-bold text-[22px] text-ink leading-tight line-clamp-2 min-h-[54px]',
          compact ? 'md:text-[32px] md:min-h-[84px]' : 'md:text-[40px] md:min-h-[100px]',
        ]"
      >
        {{ title }}
      </h2>
      <span ref="arrowEl" class="flex h-9 w-9 md:h-11 md:w-11 shrink-0 items-center justify-center rounded-full bg-ink/10 transition-transform duration-200 group-hover:rotate-45">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-ink" />
        </svg>
      </span>
    </div>
    <p class="mt-3 text-ink-soft text-base md:text-lg line-clamp-2 min-h-[48px] md:min-h-[56px]">
      {{ description }}
    </p>
    <hr :class="['border-ink/15', compact ? 'my-4' : 'my-6']" />
    <div v-if="video" class="w-full aspect-square rounded-2xl overflow-hidden">
      <CoreCoverMedia :video="video" :poster="image" :alt="title" />
    </div>
    <NuxtImg
      v-else-if="image"
      :src="image"
      :alt="title"
      :sizes="compact ? '(max-width: 1279px) 320px, 420px' : 'sm:90vw md:1200px'"
      format="webp"
      width="496"
      height="496"
      :loading="loading ?? 'lazy'"
      class="w-full aspect-square rounded-2xl object-cover"
    />
    <div
      v-else
      class="aspect-square flex w-full items-center justify-center rounded-2xl bg-ink/5 text-ink-soft text-sm"
    >
      {{ t('noPhoto') }}
    </div>
  </NuxtLink>
</template>