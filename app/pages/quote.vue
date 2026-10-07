<script setup lang="ts">
import { SERVICES } from '~/data/services'
import { QUOTE_SCOPES } from '~/data/quote'
import gsap from 'gsap'
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

// Nombres cortos para la lista de pasos (columna izquierda en desktop, barra en móvil).
const steps = computed(() => [t('quoteStepNameServices'), t('quoteStepNameScope'), t('quoteStepNameContext'), t('quoteStepNameContact')])
// Se puede volver a cualquier paso ya visitado, nunca saltar hacia adelante.
const furthest = ref(1)

const stepTitle = computed(() => [t('quoteStepServices'), t('quoteStepScope'), t('quoteStepContext'), t('quoteStepContact')][step.value - 1])
const stepHint = computed(() => [t('quoteStepServicesHint'), t('quoteStepScopeHint'), '', t('quoteStepContactHint')][step.value - 1])

async function go(to: number) {
  if (to === 2) chosen.value.forEach((s) => (sizes[s.slug] ??= 'm'))
  step.value = to
  furthest.value = Math.max(furthest.value, to)
  // Espera a que termine la transición de salida (out-in) para enfocar el título nuevo.
  await new Promise((r) => setTimeout(r, reduceMotion() ? 0 : 200))
  stepHeadingEl.value?.focus()
}

const reduceMotion = () => import.meta.client && window.matchMedia('(prefers-reduced-motion: reduce)').matches

// El rango "cuenta" hasta su valor, como un marcador: 900ms, misma curva que CoreReveal.
const shown = reactive({ min: 0, max: 0 })
watch(result, (r) => {
  if (!r) return
  if (reduceMotion()) {
    shown.min = r.estimate.min
    shown.max = r.estimate.max
    return
  }
  shown.min = 0
  shown.max = 0
  gsap.to(shown, { min: r.estimate.min, max: r.estimate.max, duration: 0.9, ease: 'expo.out', snap: { min: 50, max: 50 } })
})

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
    await new Promise((r) => setTimeout(r, reduceMotion() ? 0 : 200))
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
  furthest.value = 1
  go(1)
}

const money = (n: number) => `${result.value?.estimate.currency === 'GTQ' ? 'Q' : '$'}${n.toLocaleString('en-US')}`

const whatsappHref = computed(() => {
  const message = t('quoteResultWhatsappPrefill').replace('{ref}', result.value?.ref ?? '')
  return `https://wa.me/50245858629?text=${encodeURIComponent(message)}`
})

// Solo los pilares que ya tienen casos publicados en /work (igual que /services).
const showWork = computed(() => chosen.value.some((s) => s.pillar === 'product' || s.pillar === 'web'))

const sizeLabel = (slug: string) => sizeOptions.value.find((o) => o.value === (sizes[slug] ?? 'm'))!.label
const nextLabel = computed(() => (step.value < 4 ? t('quoteNext') : sending.value ? t('quoteSending') : t('quoteSubmit')))

const inputClass = 'mt-2 w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-cobalt/60'
const labelClass = 'block font-display font-bold text-sm uppercase tracking-wide text-ink'
const tagClass = 'font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft'
</script>

<!--
  Desktop: dos columnas. A la izquierda (fija al hacer scroll) el título, los
  pasos y lo que el cliente va eligiendo; a la derecha el paso actual. En
  móvil todo se apila y los pasos se vuelven una barra de progreso.
-->
<template>
  <div class="bg-paper min-h-screen pt-28 md:pt-32 pb-32 md:pb-24">
    <div class="px-6 md:px-12 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-20">
      <aside class="lg:sticky lg:top-32 lg:self-start">
        <h1 class="font-display font-bold text-[40px] md:text-[56px] lg:text-[48px] leading-tight text-ink">
          {{ t('quoteTitle') }}
        </h1>
        <!-- En móvil, pasado el primer paso, la intro se oculta para que el paso quede a la vista. -->
        <div :class="furthest > 1 || result ? 'hidden lg:block' : ''">
          <p class="mt-4 text-ink-soft text-lg">{{ t('quoteIntro') }}</p>
          <p :class="[tagClass, 'mt-6']">{{ t('quoteFacts') }}</p>
        </div>

        <nav :aria-label="t('quoteStepsLabel')" class="hidden lg:block mt-12">
          <ol class="border-t border-ink/15">
            <li v-for="(name, i) in steps" :key="name" class="border-b border-ink/15">
              <button
                type="button"
                class="flex w-full items-center gap-4 py-4 text-left transition-colors duration-150 disabled:cursor-default focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                :class="!result && step === i + 1 ? 'text-ink' : i + 1 <= furthest && !result ? 'text-ink-soft hover:text-ink' : 'text-ink-soft'"
                :disabled="!!result || i + 1 > furthest || step === i + 1"
                :aria-current="!result && step === i + 1 ? 'step' : undefined"
                @click="go(i + 1)"
              >
                <span :class="tagClass">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="font-display text-lg" :class="!result && step === i + 1 ? 'font-bold' : 'font-medium'">{{ name }}</span>
                <span class="ml-auto flex h-5 w-5 items-center justify-center" aria-hidden="true">
                  <CoreDot v-if="!result && step === i + 1" />
                  <svg v-else-if="result || i + 1 < furthest || i + 1 < step" viewBox="0 0 16 16" class="h-4 w-4 text-cobalt" fill="none">
                    <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                  </svg>
                </span>
              </button>
            </li>
          </ol>

          <div v-if="chosen.length && !result" class="mt-8">
            <p :class="tagClass">{{ t('quoteSelection') }}</p>
            <TransitionGroup tag="ul" name="quote-chip" class="mt-3 flex flex-wrap gap-2">
              <li
                v-for="s in chosen"
                :key="s.slug"
                class="rounded-full bg-ink/5 px-3 py-1.5 text-sm text-ink"
              >
                {{ s.title[lang] }}<span v-if="furthest > 1" class="text-ink-soft"> · {{ sizeLabel(s.slug) }}</span>
              </li>
            </TransitionGroup>
          </div>
        </nav>
      </aside>

      <section class="mt-10 lg:mt-0" aria-live="polite">
        <!-- Progreso en móvil: cuatro segmentos que se llenan de cobalto. -->
        <div v-if="!result" class="lg:hidden" aria-hidden="true">
          <div class="flex gap-1.5">
            <span
              v-for="n in 4"
              :key="n"
              class="h-1 flex-1 rounded-full transition-colors duration-300"
              :class="n <= step ? 'bg-cobalt' : 'bg-ink/15'"
            />
          </div>
        </div>

        <Transition name="quote-step" mode="out-in">
          <!-- Resultado -->
          <div v-if="result" key="result" class="rounded-[28px] border border-ink/15 p-6 md:p-10">
            <p :class="tagClass">{{ t('quoteResultRef').replace('{ref}', result.ref) }}</p>
            <h2 ref="stepHeadingEl" tabindex="-1" class="mt-3 scroll-mt-32 font-display font-bold text-2xl text-ink focus:outline-none">
              {{ t('quoteResultTitle') }}
            </h2>
            <!-- El lector de pantalla recibe el rango final; el conteo es solo visual. -->
            <p class="sr-only">{{ money(result.estimate.min) }} – {{ money(result.estimate.max) }}</p>
            <p aria-hidden="true" class="mt-4 font-display font-bold text-[30px] sm:text-[40px] md:text-[52px] leading-none tracking-[-.02em] text-cobalt tabular-nums">
              <span class="whitespace-nowrap">{{ money(shown.min) }} –</span>{{ ' ' }}<span class="whitespace-nowrap">{{ money(shown.max) }}</span>
            </p>
            <p class="mt-3 text-ink-soft">
              {{ result.estimate.plusVat ? t('quoteResultVat') : t('quoteResultUsd') }} {{ t('quoteResultNote') }}
            </p>

            <ul v-if="result.estimate.items.length > 1" class="mt-8 divide-y divide-ink/15 border-y border-ink/15">
              <li v-for="item in result.estimate.items" :key="item.slug" class="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 py-4">
                <span class="text-ink">{{ serviceBySlug(item.slug).title[lang] }}</span>
                <span class="text-ink-soft tabular-nums">{{ money(item.min) }} – {{ money(item.max) }}</span>
              </li>
            </ul>

            <h3 :class="[tagClass, 'mt-10']">{{ t('quoteWhatsNext') }}</h3>
            <ol class="mt-4 space-y-4">
              <li v-for="(line, i) in [t('quoteNext1'), t('quoteNext2'), t('quoteNext3')]" :key="i" class="flex gap-4">
                <span :class="[tagClass, 'pt-[5px] text-cobalt']">{{ String(i + 1).padStart(2, '0') }}</span>
                <span class="text-ink">{{ line }}</span>
              </li>
            </ol>

            <div class="mt-10 flex flex-wrap items-center gap-3">
              <CoreControl
                variant="solid"
                :to="whatsappHref"
                target="_blank"
                rel="noopener noreferrer"
                :aria-label="t('quoteResultWhatsapp')"
                @click="track('whatsapp_clicked', { lang, from: 'quote' })"
              >
                <CoreSwapLabel :text="t('quoteResultWhatsapp')" icon-position="end">
                  <template #icon>
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
                      <path d="M5 15L15 5M15 5H7M15 5V13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </template>
                </CoreSwapLabel>
              </CoreControl>
              <CoreControl v-if="showWork" variant="soft" to="/work">{{ t('servicesSeeWork') }}</CoreControl>
              <CoreControl variant="link" @click="restart">{{ t('quoteResultRestart') }}</CoreControl>
            </div>
          </div>

          <form v-else :key="step" class="mt-6 lg:mt-0" @submit.prevent="step < 4 ? go(step + 1) : submit()">
            <p :class="tagClass">
              {{ t('quoteStep').replace('{n}', String(step)) }}<span class="lg:hidden"> · {{ steps[step - 1] }}</span>
            </p>
            <h2 ref="stepHeadingEl" tabindex="-1" class="mt-3 scroll-mt-32 font-display font-bold text-[28px] md:text-[40px] leading-tight text-ink focus:outline-none">
              {{ stepTitle }}
            </h2>
            <p v-if="stepHint" class="mt-2 text-ink-soft">{{ stepHint }}</p>

            <!-- 1 · Servicios -->
            <div v-if="step === 1" class="mt-8 space-y-8">
              <fieldset v-for="group in pillars" :key="group.pillar">
                <legend :class="tagClass">{{ group.title }}</legend>
                <div class="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    v-for="s in group.items"
                    :key="s.slug"
                    type="button"
                    :aria-pressed="selected.includes(s.slug)"
                    class="group flex h-full items-start gap-4 rounded-[20px] border p-4 md:p-5 text-left transition-[border-color,background-color] duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
                    :class="selected.includes(s.slug) ? 'border-cobalt bg-cobalt/[.04]' : 'border-ink/15 hover:border-ink/40'"
                    @click="toggle(s.slug)"
                  >
                    <span class="min-w-0 flex-1">
                      <span :class="tagClass">{{ number(s.slug) }}</span>
                      <span class="mt-1 block font-display font-bold text-base md:text-lg text-ink">{{ s.title[lang] }}</span>
                      <span class="mt-1 block text-sm text-ink-soft line-clamp-2">{{ s.summary[lang] }}</span>
                    </span>
                    <span
                      aria-hidden="true"
                      class="quote-check mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors duration-150"
                      :class="selected.includes(s.slug) ? 'border-cobalt bg-cobalt text-paper is-on' : 'border-ink/30 group-hover:border-ink/60'"
                    >
                      <svg viewBox="0 0 16 16" class="h-3 w-3" fill="none">
                        <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" />
                      </svg>
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
                <p class="mt-3 text-ink">{{ QUOTE_SCOPES[s.slug]![sizes[s.slug] ?? 'm'].scope[lang] }}</p>
                <p class="mt-1 text-sm text-ink-soft">{{ t('servicesTimeline') }}: {{ QUOTE_SCOPES[s.slug]![sizes[s.slug] ?? 'm'].time[lang] }}</p>
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

            <div class="mt-10 flex items-center gap-3">
              <CoreControl v-if="step > 1" variant="soft" @click="go(step - 1)">{{ t('quoteBack') }}</CoreControl>
              <span v-if="step === 1 && selected.length" :class="tagClass">
                {{ t('quoteSelectedCount').replace('{n}', String(selected.length)) }}
              </span>
              <CoreControl
                variant="solid"
                type="submit"
                class="ml-auto"
                :disabled="!selected.length || sending"
                :aria-label="nextLabel"
              >
                <CoreSwapLabel :text="nextLabel" icon-position="end">
                  <template #icon>
                    <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
                      <path d="M4 10h12M11 5l5 5-5 5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                    </svg>
                  </template>
                </CoreSwapLabel>
              </CoreControl>
            </div>
          </form>
        </Transition>
      </section>
    </div>
  </div>
</template>

<style scoped>
/* Cambio de paso: sale rápido hacia arriba, entra desde abajo. Misma curva que CoreReveal. */
.quote-step-enter-active {
  transition: opacity 0.32s cubic-bezier(0.16, 1, 0.3, 1), transform 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}
.quote-step-leave-active {
  transition: opacity 0.16s ease-out, transform 0.16s ease-out;
}
.quote-step-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.quote-step-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}

/* La palomita entra con un pequeño rebote al elegir un servicio. */
.quote-check svg {
  opacity: 0;
  transform: scale(0.5);
  transition: opacity 0.15s ease-out, transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1);
}
.quote-check.is-on svg {
  opacity: 1;
  transform: none;
}

.quote-chip-enter-active,
.quote-chip-leave-active {
  transition: opacity 0.2s ease-out, transform 0.2s ease-out;
}
.quote-chip-enter-from,
.quote-chip-leave-to {
  opacity: 0;
  transform: scale(0.9);
}

@media (prefers-reduced-motion: reduce) {
  .quote-step-enter-active,
  .quote-step-leave-active,
  .quote-check svg,
  .quote-chip-enter-active,
  .quote-chip-leave-active {
    transition: none;
  }
}
</style>
