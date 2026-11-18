<!-- app/components/home/CtaBand.vue -->
<script setup lang="ts">
// Full-width cobalt closing band (nav and dock adapt to it through data-nav-tone) with the footer inside.
// Extracted from the home; the home passes its own copy and /services its own.
defineProps<{
  title: string
  text: string
  buttonLabel: string
  buttonTo: string
  secondaryLabel?: string
  secondaryHref?: string
}>()
</script>

<template>
  <section data-nav-tone="cobalt" class="bg-cobalt text-paper px-6 md:px-16 pt-24 pb-28 md:py-32">
    <CoreReveal class="w-full">
      <div class="mx-auto max-w-4xl text-center">
        <HomeSectionDot on-cobalt class="mx-auto" />
        <h2 class="mt-4 font-display font-bold text-[40px] md:text-[72px] leading-[1.05] break-words">{{ title }}</h2>
        <p class="mx-auto mt-6 max-w-xl text-lg md:text-xl text-paper/85">{{ text }}</p>
        <NuxtLink
          :to="buttonTo"
          :data-cursor="buttonLabel"
          class="mt-10 inline-flex items-center gap-1.5 rounded-full bg-paper h-11 md:h-9 px-5 md:px-4 font-display font-medium text-[14px] md:text-[15px] leading-none tracking-[-.01em] text-cobalt transition-colors duration-200 hover:bg-paper/85 focus-visible:ring-2 focus-visible:ring-paper focus-visible:ring-offset-2 focus-visible:ring-offset-cobalt"
        >
          {{ buttonLabel }}
          <svg width="16" height="16" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </NuxtLink>
        <p v-if="secondaryLabel && secondaryHref" class="mt-4">
          <a
            :href="secondaryHref"
            target="_blank"
            rel="noopener noreferrer"
            class="inline-flex h-11 items-center font-display text-[14px] font-medium leading-none tracking-[-.01em] text-paper underline underline-offset-4 decoration-paper/50 transition-colors duration-200 hover:decoration-paper md:h-9 md:text-[15px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-paper"
          >{{ secondaryLabel }}</a>
        </p>
      </div>
      <SiteFooter on-cobalt class="mx-auto mt-16 max-w-6xl md:mt-24" />
    </CoreReveal>
  </section>
</template>
