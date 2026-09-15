<!-- app/components/home/Cta.vue -->
<script setup lang="ts">
const t = useT()

const iconEl = ref<HTMLElement | null>(null)
useMagnetic(iconEl)
</script>

<template>
  <NuxtLink
    to="/contact"
    :data-cursor="t('talkCta')"
    data-cursor-accent="true"
    data-cursor-emoji="🚀"
    class="group block rounded-[28px] border border-ink/15 px-8 py-8 md:px-10 md:py-10 transition-colors duration-200 hover:border-cobalt hover:bg-cobalt"
  >
    <div class="flex items-start justify-between gap-6">
      <h2 class="font-display font-bold text-[28px] md:text-[40px] text-ink leading-tight max-w-2xl transition-colors duration-200 group-hover:text-paper">
        {{ t('ctaTitle') }}
      </h2>
      <span ref="iconEl" class="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink/10 transition-all duration-200 group-hover:rotate-45 group-hover:bg-paper/20">
        <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
          <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" class="text-ink transition-colors duration-200 group-hover:text-paper" />
        </svg>
      </span>
    </div>
    <hr class="my-6 border-ink/15 transition-colors duration-200 group-hover:border-paper/25" />
    <p class="text-ink-soft text-base md:text-lg max-w-2xl transition-colors duration-200 group-hover:text-paper/85">
      {{ t('ctaText') }}
    </p>
  </NuxtLink>
</template>