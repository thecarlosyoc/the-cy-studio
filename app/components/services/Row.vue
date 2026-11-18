<!-- app/components/services/Row.vue -->
<script setup lang="ts">
import { SERVICES } from '#shared/data/services'
import type { Service } from '#shared/types/content'

// One service: closed = number, title, summary, time; open = deliverables, who it is for, two actions.
// id = slug (anchor target); name groups the rows of one area so only one is open at a time.
const props = defineProps<{ service: Service }>()

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
  <CoreDisclosure :id="service.slug" :name="`svc-${service.pillar}`">
    <template #header>
      <span class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-3 md:grid-cols-[40px_1fr_auto] md:gap-x-6">
        <span class="col-start-1 row-start-1 self-center font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft md:self-start md:pt-2.5">
          {{ number }}
        </span>
        <span class="col-span-2 row-start-2 flex flex-col gap-2 md:col-span-1 md:col-start-2 md:row-start-1">
          <h3 class="pr-14 font-display text-2xl font-bold leading-tight text-ink md:pr-0 md:text-3xl">{{ service.title[lang] }}</h3>
          <span class="block text-base text-ink-soft">{{ service.summary[lang] }}</span>
        </span>
        <span class="col-start-2 row-start-1 block self-center pr-14 text-sm text-ink-soft md:col-start-3 md:self-start md:pr-0 md:pt-1.5">
          <span class="sr-only">{{ t('servicesTimeline') }}: </span>{{ service.timeline[lang] }}
        </span>
      </span>
    </template>

    <div class="flex flex-col gap-6 pb-10 md:pl-16">
      <ServicesMotionDemo v-if="service.slug === 'ui-motion'" />
      <div>
        <h4 class="sr-only">{{ t('servicesDeliverables') }}</h4>
        <ul class="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
          <CoreCheckItem v-for="(d, i) in service.deliverables" :key="d.es" :label="d[lang]" :index="i" />
        </ul>
      </div>
      <div class="flex flex-col gap-2">
        <p class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ t('servicesIdealFor') }}</p>
        <p class="text-base text-ink">{{ service.idealFor[lang] }}</p>
      </div>
      <div class="flex flex-col items-start gap-3 md:flex-row md:items-center md:gap-6">
        <CoreControl
          variant="soft"
          :to="`/quote?service=${service.slug}`"
          @click="track('service_estimate_clicked', { service: service.slug, lang })"
        >
          <CoreSwapLabel :text="t('quoteCta')" icon-position="end">
            <template #icon>
              <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
                <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </template>
          </CoreSwapLabel>
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
  </CoreDisclosure>
</template>
