<!-- app/components/services/Card.vue -->
<script setup lang="ts">
import { SERVICES } from '#shared/data/services'
import type { Service } from '#shared/types/content'

// One service as a column of the rail, everything at sight (no dropdown): area and number, title,
// summary, deliverables, who it is for, time, and the two actions. id = slug: /services#<slug> scrolls
// the page and the rail to it (scroll-margin and the rail's scroll-padding), and :target marks it.
const props = defineProps<{ service: Service; area: string }>()

const { $track: track } = useNuxtApp()
const t = useT()
const lang = useLang()

const number = computed(() => String(SERVICES.indexOf(props.service) + 1).padStart(2, '0'))

// WhatsApp Business del studio (+502 5212 8955), el mismo de /contact.
const whatsappHref = computed(() => {
  const message = t('servicesWhatsappPrefill').replace('{service}', props.service.title[lang.value])
  return `https://wa.me/50252128955?text=${encodeURIComponent(message)}`
})
</script>

<template>
  <!-- From 768 px the column is a spread: what it is and who it is for on the left, what you get on
       the right, the actions across the foot. Rows: tag, content (takes the spare height, so the feet of
       all columns line up), foot. -->
  <article
    :id="service.slug"
    :aria-labelledby="`${service.slug}-title`"
    class="svc-card grid h-full scroll-mt-32 grid-cols-1 grid-rows-[auto_auto_1fr_auto] gap-x-8 gap-y-4 border-l border-ink/15 pl-6 md:grid-cols-2 md:grid-rows-[auto_1fr_auto] md:gap-y-5 md:pl-8"
  >
    <p class="flex gap-3 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft md:col-span-2">
      <span class="text-cobalt">{{ number }}</span>{{ area }}
    </p>
    <div class="flex flex-col gap-3">
      <h3 :id="`${service.slug}-title`" class="font-display text-2xl font-bold leading-tight text-ink">{{ service.title[lang] }}</h3>
      <p class="text-base text-ink-soft">{{ service.summary[lang] }}</p>
      <p class="mt-2 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ t('servicesIdealFor') }}</p>
      <p class="-mt-1.5 text-sm text-ink">{{ service.idealFor[lang] }}</p>
    </div>
    <div class="flex flex-col gap-4">
      <h4 class="sr-only">{{ t('servicesDeliverables') }}</h4>
      <ul class="flex flex-col gap-3">
        <CoreCheckItem v-for="(d, i) in service.deliverables" :key="d.es" :label="d[lang]" :index="i" />
      </ul>
      <ServicesMotionDemo v-if="service.slug === 'ui-motion'" class="svc-demo" />
    </div>
    <div class="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-ink/15 pt-4 md:col-span-2">
      <p class="text-sm text-ink-soft"><span class="sr-only">{{ t('servicesTimeline') }}: </span>{{ service.timeline[lang] }}</p>
      <div class="flex flex-wrap items-center gap-x-6 gap-y-3">
        <CoreControl
          variant="soft"
          :to="`/quote?service=${service.slug}`"
          @click="track('service_estimate_clicked', { service: service.slug, lang })"
        >
          {{ t('quoteCta') }}
        </CoreControl>
        <CoreControl
          variant="link"
          :to="whatsappHref"
          target="_blank"
          rel="noopener noreferrer"
          @click="track('service_quote_clicked', { service: service.slug, lang })"
        >
          {{ t('servicesQuote') }}
        </CoreControl>
      </div>
    </div>
  </article>
</template>

<style scoped>
/* /services#<slug>: the column the link points at carries a cobalt rule. */
.svc-card {
  transition: border-color 0.3s ease;
}
/* The UI motion demo, compact inside a column: the button first, its hint beside it, no frame. */
.svc-demo {
  flex-direction: row-reverse;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
  border: 0;
  padding: 0;
}
.svc-card:target {
  border-left-color: rgb(var(--color-cobalt));
  border-left-width: 2px;
}
</style>
