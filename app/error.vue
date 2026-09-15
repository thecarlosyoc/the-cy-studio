<!-- app/error.vue -->
<!--
  Nuxt renders this in place of the whole app (not inside app.vue) whenever a
  route doesn't match anything or a page throws. It has to rebuild its own
  shell (navbar, dock, cursor) rather than relying on app.vue's — Nuxt never
  wraps this file with it.
-->
<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const t = useT()

const isNotFound = computed(() => props.error?.statusCode === 404)

function handleGoHome() {
  clearError({ redirect: '/' })
}

const arrowEl = ref<HTMLElement | null>(null)
useMagnetic(arrowEl, { zoneSelector: 'button', radius: 70, strength: 12 })

useSeoMeta({
  title: () => (isNotFound.value ? 'Página no encontrada — the CY studio' : 'Algo salió mal — the CY studio'),
  robots: 'noindex, nofollow',
})
</script>

<template>
  <div class="bg-paper min-h-screen" style="overflow-x: clip;">
    <NavNavbar />

    <div class="min-h-screen flex flex-col items-center justify-center gap-6 px-6 pb-28 md:pb-0 text-center">
      <div class="flex h-14 w-14 items-center justify-center rounded-full bg-ink/5 text-ink-soft">
        <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
          <circle cx="9" cy="9" r="6" stroke="currentColor" stroke-width="1.5" />
          <path d="M17 17L13.5 13.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </div>

      <div>
        <p class="font-display font-bold text-[88px] md:text-[150px] leading-none text-ink [-webkit-text-stroke:0.02em_currentColor]">
          {{ error?.statusCode ?? 404 }}
        </p>
        <h1 class="mt-2 font-display font-bold text-2xl md:text-3xl text-ink">
          {{ isNotFound ? t('errorNotFoundTitle') : t('errorGenericTitle') }}
        </h1>
        <p class="mt-3 text-ink-soft max-w-md mx-auto">
          {{ isNotFound ? t('errorNotFoundText') : t('errorGenericText') }}
        </p>
      </div>

      <button
        type="button"
        :data-cursor="t('home')"
        class="group inline-flex items-center gap-3 rounded-full bg-ink text-paper pl-6 pr-2 py-2 font-medium transition-colors hover:bg-ink-soft"
        @click="handleGoHome"
      >
        {{ t('errorHomeCta') }}
        <span
          ref="arrowEl"
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-paper/15 transition-transform duration-200 group-hover:rotate-45"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </span>
      </button>
    </div>

    <NavDock />
    <CoreCursor />
  </div>
</template>
