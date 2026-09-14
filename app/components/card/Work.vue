<!-- app/components/card/Work.vue -->
<script setup lang="ts">
defineProps<{
  title: string
  description: string
  image: string
  to: string
}>()
</script>

<template>
  <NuxtLink
    :to="to"
    class="group block rounded-[28px] border border-ink/15 p-8 transition-colors hover:border-ink/30"
  >
    <div class="flex items-start justify-between gap-4">
      <h2 class="font-display font-bold text-[32px] md:text-[40px] text-ink leading-tight line-clamp-2 min-h-[80px] md:min-h-[100px]">
        {{ title }}
      </h2>
      <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-ink/10 transition-transform duration-200 group-hover:rotate-45">
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-ink" />
        </svg>
      </span>
    </div>
    <p class="mt-3 text-ink-soft text-base md:text-lg line-clamp-2 min-h-[48px] md:min-h-[56px]">
      {{ description }}
    </p>
    <hr class="my-6 border-ink/15" />
    <NuxtImg
      v-if="image"
      :src="image"
      :alt="title"
      sizes="sm:90vw md:420px"
      format="webp"
      loading="lazy"
      class="w-full rounded-2xl object-cover"
    />
  </NuxtLink>
</template>