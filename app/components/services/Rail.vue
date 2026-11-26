<!-- app/components/services/Rail.vue -->
<script setup lang="ts">
import type { Service } from '#shared/types/content'

// The ten services as one horizontal rail, the /work pattern without the autoplay (scroll is the only
// input): native sideways scroll with snap (trackpad, swipe, Shift+wheel, arrow keys once focused) and
// two step buttons on desktop. Each column comes in as it enters the rail and its checks draw.
const props = defineProps<{ chapters: { id: string; title: string; rows: Service[] }[] }>()
const t = useT()

const columns = computed(() => props.chapters.flatMap((c) => c.rows.map((s) => ({ service: s, area: c.title }))))

const track = ref<HTMLElement | null>(null)
const atStart = ref(true)
const atEnd = ref(false)
function sync() {
  const el = track.value
  if (!el) return
  atStart.value = el.scrollLeft <= 4
  atEnd.value = el.scrollLeft >= el.scrollWidth - el.clientWidth - 4
}
function step(dir: 1 | -1) {
  const el = track.value
  const col = el?.querySelector('li')
  if (!el || !col) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  el.scrollBy({ left: dir * col.getBoundingClientRect().width, behavior: reduce ? 'auto' : 'smooth' })
}
onMounted(() => {
  sync()
  track.value?.addEventListener('scroll', sync, { passive: true })
  window.addEventListener('resize', sync)
})
onBeforeUnmount(() => {
  track.value?.removeEventListener('scroll', sync)
  window.removeEventListener('resize', sync)
})

const ARROW = { [-1]: 'M12.5 15.5 7 10l5.5-5.5', [1]: 'M7.5 15.5 13 10 7.5 4.5' } as const
</script>

<template>
  <!-- Head and rail fit one laptop screen (1440 x 731 under the nav): a one-line head, and columns
       laid out as spreads instead of tall stacks. -->
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
          :aria-disabled="(dir < 0 ? atStart : atEnd) || undefined"
          @click="step(dir)"
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true" focusable="false">
            <path :d="ARROW[dir]" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
          </svg>
        </button>
      </div>
    </div>

    <div
      ref="track"
      role="region"
      tabindex="0"
      :aria-label="t('servicesFactServices').replace('{n}', String(columns.length))"
      class="svc-rail snap-x snap-mandatory overflow-x-auto overscroll-x-contain scroll-px-6 focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-cobalt md:scroll-px-16"
    >
      <ul class="flex w-max gap-6 px-6 md:gap-8 md:px-16">
        <li v-for="(c, i) in columns" :key="c.service.slug" class="w-[82vw] max-w-[360px] shrink-0 snap-start md:w-[560px] md:max-w-none xl:w-[600px]">
          <CoreReveal :style="{ transitionDelay: `${Math.min(i, 3) * 60}ms` }">
            <ServicesCard :service="c.service" :area="c.area" />
          </CoreReveal>
        </li>
      </ul>
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
</style>
