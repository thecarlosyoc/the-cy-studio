<script setup lang="ts">
const t = useT()
</script>

<template>
  <section class="relative min-h-screen flex items-center justify-center px-6 md:px-12 text-center">
    <!-- Una columna centrada (Figma 292:1581). Sin logo: ya está en el navbar. text-balance
         reparte el titular en 2 líneas en desktop y 3 en mobile, sin viuda, en ES y EN. -->
    <div class="flex flex-col items-center gap-5 md:gap-6">
      <p class="font-mono text-[11px] md:text-[13px] tracking-[.16em] uppercase text-ink-soft">{{ t('heroSignRole') }}</p>
      <h1 class="font-display font-bold text-[44px] md:text-[80px] leading-none tracking-[-.03em] text-ink max-w-[1100px] text-balance">
        {{ t('aboutHeroTitle') }}
      </h1>
    </div>
    <p class="absolute inset-x-0 bottom-32 md:bottom-16 font-mono text-[11px] tracking-[.16em] uppercase text-ink-soft">{{ t('scroll') }} ↓</p>
  </section>
</template>
