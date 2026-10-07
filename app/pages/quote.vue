<script setup lang="ts">
import { SERVICES } from '~/data/services'
import { QUOTE_SCOPES } from '~/data/quote'
import type { ServicePillar } from '#shared/types/content'
import type { QuoteRegion, QuoteResponse, QuoteSize, QuoteTiming } from '#shared/types/quote'

const { $track: track } = useNuxtApp()

const t = useT()
const lang = useLang()
const route = useRoute()

const seoTitle = () => `${t('quoteTitle')} — the CY studio`
const seoDescription = () => t('quoteIntro')
const seoImage = await useOgImage('home')

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: 'website',
  ogImage: seoImage,
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
  twitterImage: seoImage,
})

const pillars = computed(() => ([
  { pillar: 'product', title: t('servicesPillarProduct') },
  { pillar: 'web', title: t('servicesPillarWeb') },
  { pillar: 'brand', title: t('servicesPillarBrand') },
  { pillar: 'motion', title: t('servicesPillarMotion') },
] as { pillar: ServicePillar; title: string }[])
  .map((p) => ({ ...p, items: SERVICES.filter((s) => s.pillar === p.pillar) })))

const number = (slug: string) => String(SERVICES.findIndex((s) => s.slug === slug) + 1).padStart(2, '0')
const serviceBySlug = (slug: string) => SERVICES.find((s) => s.slug === slug)!

// /quote?service=website llega con ese servicio ya elegido (botones de /services y banners).
const preselected = typeof route.query.service === 'string' && QUOTE_SCOPES[route.query.service] ? [route.query.service] : []

const step = ref(1)
const selected = ref<string[]>(preselected)
const sizes = reactive<Record<string, QuoteSize>>({})
const region = ref<QuoteRegion>(lang.value === 'en' ? 'abroad' : 'gt')
const timing = ref<QuoteTiming>('flexible')
const form = reactive({ brief: '', name: '', email: '', whatsapp: '', business: '', website: '' })

const sending = ref(false)
const errorMessage = ref('')
const result = ref<QuoteResponse | null>(null)
const stepHeadingEl = ref<HTMLElement | null>(null)

function toggle(slug: string) {
  selected.value = selected.value.includes(slug) ? selected.value.filter((s) => s !== slug) : [...selected.value, slug]
}

// Los elegidos van en el orden del catálogo, no en el orden en que se tocaron.
const chosen = computed(() => SERVICES.filter((s) => selected.value.includes(s.slug)))

const sizeOptions = computed(() => [
  { value: 's' as QuoteSize, label: t('quoteSizeS') },
  { value: 'm' as QuoteSize, label: t('quoteSizeM') },
  { value: 'l' as QuoteSize, label: t('quoteSizeL') },
])
const regionOptions = computed(() => [
  { value: 'gt' as QuoteRegion, label: t('quoteRegionGt') },
  { value: 'abroad' as QuoteRegion, label: t('quoteRegionAbroad') },
])
const timingOptions = computed(() => [
  { value: 'flexible' as QuoteTiming, label: t('quoteTimingFlexible') },
  { value: 'month' as QuoteTiming, label: t('quoteTimingMonth') },
  { value: 'urgent' as QuoteTiming, label: t('quoteTimingUrgent') },
])

const stepTitle = computed(() => [t('quoteStepServices'), t('quoteStepScope'), t('quoteStepContext'), t('quoteStepContact')][step.value - 1])
const stepHint = computed(() => [t('quoteStepServicesHint'), t('quoteStepScopeHint'), '', t('quoteStepContactHint')][step.value - 1])

async function go(to: number) {
  if (to === 2) chosen.value.forEach((s) => (sizes[s.slug] ??= 'm'))
  step.value = to
  await nextTick()
  stepHeadingEl.value?.focus()
}

async function submit() {
  sending.value = true
  errorMessage.value = ''
  try {
    result.value = await $fetch<QuoteResponse>('/api/quote', {
      method: 'POST',
      body: {
        items: chosen.value.map((s) => ({ slug: s.slug, size: sizes[s.slug] ?? 'm' })),
        region: region.value,
        timing: timing.value,
        lang: lang.value,
        ...form,
      },
    })
    track('quote_submitted', { services: selected.value, region: region.value, lang: lang.value })
    await nextTick()
    stepHeadingEl.value?.focus()
  } catch {
    errorMessage.value = t('quoteError')
  } finally {
    sending.value = false
  }
}

function restart() {
  result.value = null
  selected.value = []
  go(1)
}

const money = (n: number) => `${result.value?.estimate.currency === 'GTQ' ? 'Q' : '$'}${n.toLocaleString('en-US')}`

const whatsappHref = computed(() => {
  const message = t('quoteResultWhatsappPrefill').replace('{ref}', result.value?.ref ?? '')
  return `https://wa.me/50245858629?text=${encodeURIComponent(message)}`
})

// Solo los pilares que ya tienen casos publicados en /work (igual que /services).
const showWork = computed(() => chosen.value.some((s) => s.pillar === 'product' || s.pillar === 'web'))

const inputClass = 'mt-2 w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-cobalt/60'
const labelClass = 'block font-display font-bold text-sm uppercase tracking-wide text-ink'
const tagClass = 'font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft'
</script>

<template>
  <div class="bg-paper min-h-screen pt-28 md:pt-32 pb-24">
    <div class="px-6 md:px-12 max-w-4xl mx-auto w-full">
      <header class="max-w-3xl">
        <h1 class="font-display font-bold text-[40px] md:text-[56px] leading-tight text-ink">
          {{ t('quoteTitle') }}
        </h1>
        <p class="mt-4 text-ink-soft text-lg">{{ t('quoteIntro') }}</p>
      </header>

      <!-- Resultado -->
      <section v-if="result" class="mt-12 md:mt-16" aria-live="polite">
        <div class="rounded-[28px] border border-ink/15 p-6 md:p-10">
          <p :class="tagClass">{{ t('quoteResultRef').replace('{ref}', result.ref) }}</p>
          <h2 ref="stepHeadingEl" tabindex="-1" class="mt-3 scroll-mt-32 font-display font-bold text-2xl text-ink focus:outline-none">
            {{ t('quoteResultTitle') }}
          </h2>
          <p class="mt-4 font-display font-bold text-[36px] md:text-[56px] leading-none tracking-[-.02em] text-cobalt">
            <span class="whitespace-nowrap">{{ money(result.estimate.min) }} –</span>{{ ' ' }}<span class="whitespace-nowrap">{{ money(result.estimate.max) }}</span>
          </p>
          <p class="mt-3 text-ink-soft">
            {{ result.estimate.plusVat ? t('quoteResultVat') : t('quoteResultUsd') }}
          </p>

          <ul v-if="result.estimate.items.length > 1" class="mt-8 divide-y divide-ink/15 border-y border-ink/15">
            <li v-for="item in result.estimate.items" :key="item.slug" class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
              <span class="text-ink">{{ serviceBySlug(item.slug).title[lang] }}</span>
              <span class="text-ink-soft tabular-nums">{{ money(item.min) }} – {{ money(item.max) }}</span>
            </li>
          </ul>

          <p class="mt-8 text-ink">{{ t('quoteResultNote') }}</p>
          <p class="mt-3 text-ink-soft">{{ t('quoteResultDemo') }}</p>

          <div class="mt-8 flex flex-wrap items-center gap-3">
            <CoreControl
              variant="solid"
              :to="whatsappHref"
              target="_blank"
              rel="noopener noreferrer"
              @click="track('whatsapp_clicked', { lang, from: 'quote' })"
            >
              {{ t('quoteResultWhatsapp') }}
            </CoreControl>
            <CoreControl v-if="showWork" variant="soft" to="/work">{{ t('servicesSeeWork') }}</CoreControl>
            <CoreControl variant="link" @click="restart">{{ t('quoteResultRestart') }}</CoreControl>
          </div>
        </div>
      </section>

      <form v-else class="mt-12 md:mt-16" @submit.prevent="step < 4 ? go(step + 1) : submit()">
        <p :class="tagClass">{{ t('quoteStep').replace('{n}', String(step)) }}</p>
        <h2 ref="stepHeadingEl" tabindex="-1" class="mt-3 scroll-mt-32 font-display font-bold text-[28px] md:text-[40px] leading-tight text-ink focus:outline-none">
          {{ stepTitle }}
        </h2>
        <p v-if="stepHint" class="mt-2 text-ink-soft">{{ stepHint }}</p>

        <!-- 1 · Servicios -->
        <div v-if="step === 1" class="mt-8 space-y-10">
          <fieldset v-for="group in pillars" :key="group.pillar">
            <legend :class="tagClass">{{ group.title }}</legend>
            <div class="mt-3 grid grid-cols-1 md:grid-cols-2 gap-3">
              <button
                v-for="s in group.items"
                :key="s.slug"
                type="button"
                :aria-pressed="selected.includes(s.slug)"
                class="flex h-full items-start gap-4 rounded-[20px] border p-5 text-left transition-colors duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                :class="selected.includes(s.slug) ? 'border-cobalt bg-cobalt/5' : 'border-ink/15 hover:border-ink/40'"
                @click="toggle(s.slug)"
              >
                <span
                  aria-hidden="true"
                  class="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-150"
                  :class="selected.includes(s.slug) ? 'border-cobalt bg-cobalt text-paper' : 'border-ink/30'"
                >
                  <svg v-if="selected.includes(s.slug)" viewBox="0 0 16 16" class="h-3 w-3" fill="none">
                    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
                <span>
                  <span :class="tagClass">{{ number(s.slug) }}</span>
                  <span class="mt-1 block font-display font-bold text-lg text-ink">{{ s.title[lang] }}</span>
                  <span class="mt-1 block text-sm text-ink-soft">{{ s.summary[lang] }}</span>
                </span>
              </button>
            </div>
          </fieldset>
        </div>

        <!-- 2 · Alcance -->
        <div v-else-if="step === 2" class="mt-8 divide-y divide-ink/15 border-y border-ink/15">
          <div v-for="s in chosen" :key="s.slug" class="py-6">
            <p :class="tagClass">{{ number(s.slug) }}</p>
            <h3 class="mt-1 font-display font-bold text-xl text-ink">{{ s.title[lang] }}</h3>
            <CoreSegmentedControl
              :model-value="sizes[s.slug] ?? 'm'"
              class="mt-4"
              :aria-label="`${t('quoteStepScope')} ${s.title[lang]}`"
              :options="sizeOptions"
              @update:model-value="sizes[s.slug] = $event"
            />
            <p class="mt-3 text-ink">{{ QUOTE_SCOPES[s.slug]![sizes[s.slug] ?? 'm'][lang] }}</p>
            <p class="mt-1 text-sm text-ink-soft">{{ t('servicesTimeline') }}: {{ s.timeline[lang] }}</p>
          </div>
        </div>

        <!-- 3 · Contexto -->
        <div v-else-if="step === 3" class="mt-8 space-y-8">
          <div>
            <p :class="labelClass">{{ t('quoteRegionLabel') }}</p>
            <CoreSegmentedControl v-model="region" class="mt-3" :aria-label="t('quoteRegionLabel')" :options="regionOptions" />
          </div>
          <div>
            <p :class="labelClass">{{ t('quoteTimingLabel') }}</p>
            <!-- Botones sueltos y no segmentado: las tres opciones no caben en una fila en móvil. -->
            <div class="mt-3 flex flex-wrap gap-2" role="group" :aria-label="t('quoteTimingLabel')">
              <CoreControl
                v-for="o in timingOptions"
                :key="o.value"
                :variant="timing === o.value ? 'solid' : 'soft'"
                :aria-pressed="timing === o.value"
                @click="timing = o.value"
              >
                {{ o.label }}
              </CoreControl>
            </div>
          </div>
          <div>
            <label for="quote-brief" :class="labelClass">{{ t('quoteBriefLabel') }}</label>
            <textarea id="quote-brief" v-model="form.brief" rows="4" maxlength="2000" :placeholder="t('quoteBriefPlaceholder')" :class="inputClass" />
          </div>
        </div>

        <!-- 4 · Datos -->
        <div v-else class="mt-8 grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label for="quote-name" :class="labelClass">{{ t('contactNameLabel') }}</label>
            <input id="quote-name" v-model="form.name" type="text" required maxlength="120" autocomplete="name" :class="inputClass" />
          </div>
          <div>
            <label for="quote-email" :class="labelClass">{{ t('contactEmailLabel') }}</label>
            <input id="quote-email" v-model="form.email" type="email" required maxlength="200" autocomplete="email" :class="inputClass" />
          </div>
          <div>
            <label for="quote-whatsapp" :class="labelClass">{{ t('quoteWhatsappLabel') }}</label>
            <input id="quote-whatsapp" v-model="form.whatsapp" type="tel" maxlength="40" autocomplete="tel" :class="inputClass" />
          </div>
          <div>
            <label for="quote-business" :class="labelClass">{{ t('quoteBusinessLabel') }}</label>
            <input id="quote-business" v-model="form.business" type="text" maxlength="160" autocomplete="organization" :class="inputClass" />
          </div>
          <!-- Honeypot: hidden from real visitors, bots often fill every field. -->
          <div class="absolute -left-[9999px]" aria-hidden="true">
            <input v-model="form.website" type="text" tabindex="-1" autocomplete="off" />
          </div>
        </div>

        <p v-if="errorMessage" role="alert" class="mt-6 text-sm text-ink">{{ errorMessage }}</p>

        <div class="mt-10 flex items-center justify-between gap-3">
          <CoreControl v-if="step > 1" variant="soft" @click="go(step - 1)">{{ t('quoteBack') }}</CoreControl>
          <span v-else />
          <CoreControl variant="solid" type="submit" :disabled="!selected.length || sending">
            {{ step < 4 ? t('quoteNext') : sending ? t('quoteSending') : t('quoteSubmit') }}
          </CoreControl>
        </div>
      </form>
    </div>
  </div>
</template>
