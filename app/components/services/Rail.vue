<!-- app/components/services/Rail.vue -->
<script setup lang="ts">
import { SERVICES } from '#shared/data/services'
import type { Service } from '#shared/types/content'

// The ten services as one horizontal rail, the /work pattern without the autoplay (scroll is the only
// input): native sideways scroll with snap (trackpad, swipe, Shift+wheel, arrow keys once focused) and
// two step buttons on desktop. Columns stay compact; one panel under the rail follows the active
// service and holds what it includes (closed until asked for) and the page's one estimate button for
// it (Carlos, 2026-11-26: ten «Calcula un estimado» and every detail at once were too much).
// Active = the column at the rail's left edge as the reader scrolls, or the one they click.
const props = defineProps<{ chapters: { id: string; title: string; rows: Service[] }[] }>()

const { $track: track } = useNuxtApp()
const t = useT()
const lang = useLang()

const columns = computed(() => props.chapters.flatMap((c) => c.rows.map((s) => ({ service: s, area: c.title }))))
const active = ref(0)
const current = computed(() => columns.value[active.value]!)
const number = computed(() => String(SERVICES.indexOf(current.value.service) + 1).padStart(2, '0'))

// WhatsApp Business del studio (+502 5212 8955), el mismo de /contact.
const whatsappHref = computed(() => {
  const message = t('servicesWhatsappPrefill').replace('{service}', current.value.service.title[lang.value])
  return `https://wa.me/50252128955?text=${encodeURIComponent(message)}`
})

const rail = ref<HTMLElement | null>(null)
const detail = ref<{ $el: HTMLDetailsElement } | null>(null)
// A click (or a #slug) picks the column; the scroll it starts must not hand the choice back to
// whichever column lands at the left edge. The next scroll by the reader does.
let picked = false
let pickTimer: ReturnType<typeof setTimeout> | undefined
const reduce = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

function columnStep(el: HTMLElement) {
  const items = el.querySelectorAll('li')
  return items.length > 1 ? items[1]!.offsetLeft - items[0]!.offsetLeft : el.clientWidth
}
function sync() {
  const el = rail.value
  if (el && !picked) active.value = Math.min(columns.value.length - 1, Math.round(el.scrollLeft / columnStep(el)))
}
// The step buttons move the active service and bring its column to the left edge (where the scroll
// rule would put it too); a click on a column scrolls the rail only as much as needed to show it.
function step(dir: 1 | -1) {
  pick(Math.min(columns.value.length - 1, Math.max(0, active.value + dir)), false, 'start')
}
function pick(i: number, open: boolean, inline: ScrollLogicalPosition = 'nearest') {
  active.value = i
  picked = true
  clearTimeout(pickTimer)
  pickTimer = setTimeout(() => (picked = false), 900)
  const li = rail.value?.querySelectorAll('li')[i]
  const el = rail.value
  if (li && el) {
    // Scroll the rail only (scrollIntoView would also move the page).
    const pad = parseFloat(getComputedStyle(el).scrollPaddingInlineStart) || 0
    const x = li.getBoundingClientRect().left - el.getBoundingClientRect().left
    const left = el.scrollLeft + x - pad
    const visible = x >= pad - 1 && x + li.offsetWidth <= el.clientWidth - pad + 1
    if (inline === 'start' || !visible) el.scrollTo({ left, behavior: reduce() ? 'auto' : 'smooth' })
  }
  if (open && detail.value) detail.value.$el.open = true
}
// /services#<slug> (social pieces, /quote): bring the rail and its panel into view with that service
// active. Runs on load and on every hash change.
const route = useRoute()
function fromHash() {
  let id: string
  try {
    id = decodeURIComponent(location.hash.slice(1))
  } catch {
    return
  }
  const i = columns.value.findIndex((c) => c.service.slug === id)
  if (i < 0) return
  pick(i, false)
  requestAnimationFrame(() => document.getElementById(id)?.scrollIntoView({ block: 'start', inline: 'start' }))
}
onMounted(() => {
  sync()
  rail.value?.addEventListener('scroll', sync, { passive: true })
  window.addEventListener('resize', sync)
  fromHash()
})
watch(() => route.hash, () => nextTick(fromHash))
onBeforeUnmount(() => {
  clearTimeout(pickTimer)
  rail.value?.removeEventListener('scroll', sync)
  window.removeEventListener('resize', sync)
})

const ARROW = { [-1]: 'M12.5 15.5 7 10l5.5-5.5', [1]: 'M7.5 15.5 13 10 7.5 4.5' } as const
</script>

<template>
  <!-- Head, rail and panel fit one laptop screen (1280 x 720 under the nav). -->
  <section aria-labelledby="services-catalog" class="flex flex-col gap-8 pb-24 pt-20 md:gap-10 md:pb-32 md:pt-28">
    <div class="flex flex-col gap-4 px-6 md:flex-row md:items-end md:justify-between md:gap-10 md:px-16">
      <CoreSectionHead title-id="services-catalog">
        {{ t('servicesFactServices').replace('{n}', String(columns.length)) }}
      </CoreSectionHead>
      <p class="max-w-[440px] text-base text-ink-soft md:ml-auto md:pb-2 md:text-right">{{ t('servicesIntro') }}</p>
      <div class="hidden shrink-0 gap-2 md:flex md:pb-1">
        <button
          v-for="dir in ([-1, 1] as const)"
          :key="dir"
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-full border border-ink/50 text-ink transition-[background-color,opacity] duration-150 hover:bg-ink/5 focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper aria-disabled:opacity-40 aria-disabled:hover:bg-transparent"
          :aria-label="dir < 0 ? t('workPrev') : t('workNext')"
          :aria-disabled="(dir < 0 ? active === 0 : active === columns.length - 1) || undefined"
          @click="step(dir)"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
            <path :d="ARROW[dir]" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>

    <div
      ref="rail"
      role="region"
      tabindex="0"
      :aria-label="t('servicesFactServices').replace('{n}', String(columns.length))"
      class="svc-rail snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-px-6 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cobalt md:scroll-px-16"
    >
      <ul class="flex w-max gap-6 px-6 py-1 md:gap-8 md:px-16">
        <li v-for="(c, i) in columns" :key="c.service.slug" class="w-[82vw] max-w-[340px] shrink-0 snap-start md:w-[340px]">
          <CoreReveal :style="{ transitionDelay: `${Math.min(i, 3) * 60}ms` }">
            <ServicesCard :service="c.service" :area="c.area" :active="active === i" @details="pick(i, true)" />
          </CoreReveal>
        </li>
      </ul>
    </div>

    <!-- The panel of the active service: its name, what it includes (closed until asked for), and the
         one estimate button and WhatsApp link, both for that service. -->
    <div id="svc-detail" class="px-6 md:px-16">
      <div class="flex flex-col gap-4 border-t-2 border-cobalt pt-5 md:flex-row md:items-center md:justify-between md:gap-10">
        <Transition name="svc-swap" mode="out-in">
          <!-- On a phone the active column sits right above, so the name shows from 768 px only. -->
          <p :key="current.service.slug" class="hidden min-w-0 items-baseline gap-3 md:flex">
            <span class="font-mono text-[11px] uppercase tracking-[.16em] text-cobalt">{{ number }}</span>
            <span class="font-display text-xl font-bold text-ink md:text-2xl">{{ current.service.title[lang] }}</span>
          </p>
        </Transition>
        <div class="flex shrink-0 flex-wrap items-center gap-x-6 gap-y-3">
          <CoreControl
            variant="soft"
            :to="`/quote?service=${current.service.slug}`"
            @click="track('service_estimate_clicked', { service: current.service.slug, lang })"
          >
            {{ t('quoteCta') }}
          </CoreControl>
          <CoreControl
            variant="link"
            :to="whatsappHref"
            target="_blank"
            rel="noopener noreferrer"
            @click="track('service_quote_clicked', { service: current.service.slug, lang })"
          >
            {{ t('servicesQuote') }}
          </CoreControl>
        </div>
      </div>
      <CoreDisclosure ref="detail" size="compact" class="mt-2">
        <template #header>
          <span class="font-display text-lg font-bold text-ink">{{ t('servicesDeliverables') }}</span>
        </template>
        <div :key="current.service.slug" class="grid grid-cols-1 gap-6 pb-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:gap-16">
          <div class="flex flex-col gap-4">
            <ul class="grid grid-cols-1 gap-x-6 gap-y-3 md:grid-cols-2">
              <CoreCheckItem v-for="(d, i) in current.service.deliverables" :key="d.es" :label="d[lang]" :index="i" />
            </ul>
            <ServicesMotionDemo v-if="current.service.slug === 'ui-motion'" />
          </div>
          <div class="flex flex-col gap-2">
            <p class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ t('servicesIdealFor') }}</p>
            <p class="text-base text-ink">{{ current.service.idealFor[lang] }}</p>
          </div>
        </div>
      </CoreDisclosure>
    </div>
  </section>
</template>

<style scoped>
.svc-rail {
  scrollbar-width: none;
}
.svc-rail::-webkit-scrollbar {
  display: none;
}
/* The active service's name swaps with a short fade. */
.svc-swap-enter-active,
.svc-swap-leave-active {
  transition: opacity 0.15s ease;
}
.svc-swap-enter-from,
.svc-swap-leave-to {
  opacity: 0;
}
</style>
