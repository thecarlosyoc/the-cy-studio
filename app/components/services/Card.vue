<!-- app/components/services/Card.vue -->
<script setup lang="ts">
import { SERVICES } from '#shared/data/services'
import type { Service } from '#shared/types/content'

// One service as a compact column of the rail: area and number, title, summary, time. What it
// includes stays out of sight until asked for: «Qué recibes» makes this the active service and opens
// its detail in the panel under the rail, where the one estimate button lives.
// id = slug: /services#<slug> scrolls the page and the rail to it and makes it active.
const props = defineProps<{ service: Service; area: string; active: boolean }>()
const emit = defineEmits<{ details: [] }>()

const t = useT()
const lang = useLang()
const number = computed(() => String(SERVICES.indexOf(props.service) + 1).padStart(2, '0'))
</script>

<template>
  <article
    :id="service.slug"
    :aria-labelledby="`${service.slug}-title`"
    class="svc-card relative flex h-full scroll-mt-32 flex-col gap-3 border-l-2 pl-6 md:pl-8"
    :class="active ? 'border-cobalt' : 'border-ink/15'"
  >
    <p class="flex gap-3 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">
      <span class="text-cobalt">{{ number }}</span>{{ area }}
    </p>
    <h3 :id="`${service.slug}-title`" class="mt-1 font-display text-2xl font-bold leading-tight text-ink">{{ service.title[lang] }}</h3>
    <p class="text-base text-ink-soft">{{ service.summary[lang] }}</p>
    <div class="mt-auto flex items-center justify-between gap-4 pt-3">
      <p class="text-sm text-ink-soft"><span class="sr-only">{{ t('servicesTimeline') }}: </span>{{ service.timeline[lang] }}</p>
      <!-- The whole column answers the click (the stretched ::after), the button carries the name. -->
      <button
        type="button"
        class="inline-flex h-11 items-center gap-2 font-display text-[14px] font-medium text-ink after:absolute after:inset-0 after:content-[''] focus-visible:outline-none md:h-9 md:text-[15px]"
        aria-controls="svc-detail"
        :aria-labelledby="`${service.slug}-more ${service.slug}-title`"
        @click="emit('details')"
      >
        <span :id="`${service.slug}-more`">{{ t('servicesDeliverables') }}</span>
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
          <path d="M3 8h10M8 3v10" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
      </button>
    </div>
  </article>
</template>

<style scoped>
.svc-card {
  transition: border-color 0.2s ease;
}
@media (hover: hover) {
  .svc-card:not(.border-cobalt):hover {
    border-left-color: rgb(var(--color-ink) / 0.45);
  }
}
/* The ring goes on the column, since the button's hit area is the whole column. */
.svc-card:has(button:focus-visible) {
  outline: 2px solid rgb(var(--color-cobalt));
  outline-offset: 4px;
}
</style>
