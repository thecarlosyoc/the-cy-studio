<script setup lang="ts">
const t = useT()
</script>

<template>
  <section class="min-h-screen flex items-center justify-center">
    <div class="w-full max-w-5xl px-6 md:px-12 flex flex-col md:flex-row items-start md:items-center gap-6 md:gap-10">
      <div class="text-left shrink-0">
        <BrandLogo class="h-8 w-auto text-ink" />
        <p class="mt-1 font-mono text-[10px] tracking-[.14em] uppercase text-ink-soft">{{ t('aboutHeroByLine') }}</p>
      </div>
      <div class="text-left">
        <h1 class="font-display font-bold text-[32px] md:text-[40px] text-ink leading-tight max-w-xl">
          {{ t('aboutHeroTitle') }}
        </h1>
        <p class="mt-4 text-ink-soft text-base md:text-lg max-w-xl">
          {{ t('aboutHeroText') }}
        </p>
        <p class="mt-6 font-mono text-[11px] tracking-[.16em] uppercase text-ink-soft">{{ t('scroll') }} ↓</p>
      </div>
    </div>
  </section>
</template>