<!-- app/components/case/Decisions.vue -->
<script setup lang="ts">
import type { paymentsScenes } from '#shared/data/casePaymentsScenes'

const props = defineProps<{ decisions: typeof paymentsScenes.decisions }>()
const lang = useLang()
const t = useT()
const reduced = useReducedMotion()

const active = ref(0)
const triggers = ref<HTMLElement[]>([])

// Desktop: the list and the screen are sticky; one invisible 70svh trigger per decision drives `active`
// when it crosses the middle band of the viewport.
let io: IntersectionObserver | undefined
let target = -1
let targetTimer: ReturnType<typeof setTimeout> | undefined
onMounted(() => {
  io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue
        const i = Number((e.target as HTMLElement).dataset.i)
        // During a scroll started by go(), ignore the triggers we pass through until we reach the target.
        if (target >= 0 && i !== target) continue
        target = -1
        active.value = i
      }
    },
    { rootMargin: '-45% 0px -45% 0px' },
  )
  triggers.value.forEach(el => io?.observe(el))
})
onUnmounted(() => { io?.disconnect(); clearTimeout(targetTimer) })

function go(i: number) {
  active.value = i
  target = i
  clearTimeout(targetTimer)
  targetTimer = setTimeout(() => { target = -1 }, 1500) // fallback if the target band is never reached
  triggers.value[i]?.scrollIntoView({ behavior: reduced.value ? 'auto' : 'smooth', block: 'center' })
}
</script>

<template>
  <!-- On desktop the header lives inside the sticky column (below), so the scene header only shows on mobile. -->
  <CaseScene id="case-decisions" :tag="decisions.tag[lang]" :title="decisions.title[lang]" header-class="md:hidden">
    <!-- Desktop -->
    <div class="hidden md:grid md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] md:gap-12">
      <nav :aria-label="t('caseDecisionsLabel')" class="relative z-10 col-start-1 row-start-1">
        <div class="sticky top-28">
        <p class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ decisions.tag[lang] }}</p>
        <h2 class="mt-2 mb-4 font-display text-[30px] font-bold leading-tight text-ink">{{ decisions.title[lang] }}</h2>
        <ol class="space-y-1">
          <li v-for="(d, i) in decisions.items" :key="d.name.es">
            <button
              type="button"
              :aria-current="active === i ? 'true' : undefined"
              class="block w-full border-l-2 py-3 pl-5 pr-2 text-left transition-colors duration-150 focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              :class="active === i ? 'border-cobalt' : 'border-ink/20 hover:border-ink/50'"
              @click="go(i)"
            >
              <span class="block font-mono text-[11px] uppercase tracking-[.16em]" :class="active === i ? 'text-cobalt' : 'text-ink-soft'">
                {{ String(i + 1).padStart(2, '0') }} / {{ String(decisions.items.length).padStart(2, '0') }}
              </span>
              <span class="mt-1 block font-display text-xl" :class="active === i ? 'font-bold text-ink' : 'font-medium text-ink-soft'">{{ d.name[lang] }}</span>
              <!-- All texts stay in the DOM; the grid-rows trick collapses the inactive ones without moving siblings' layout logic. -->
              <span
                class="grid transition-[grid-template-rows] duration-300 motion-reduce:transition-none"
                :class="active === i ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
              >
                <span class="overflow-hidden"><span class="mt-2 block text-base text-ink-soft">{{ d.text[lang] }}</span></span>
              </span>
            </button>
          </li>
        </ol>
        </div>
      </nav>

      <div class="col-start-2 row-start-1">
        <!-- The card hugs its image(s) and is centered in the sticky area; only the active decision is rendered. -->
        <div class="sticky top-28 flex h-[calc(100svh-9rem)] items-center">
          <Transition
            mode="out-in"
            enter-active-class="transition-opacity duration-300 motion-reduce:transition-none"
            leave-active-class="transition-opacity duration-200 motion-reduce:transition-none"
            enter-from-class="opacity-0"
            leave-to-class="opacity-0"
          >
            <div :key="active" class="w-full rounded-2xl bg-white p-6 dark:bg-white/[.08]">
              <NuxtImg
                v-for="(img, k) in decisions.items[active].images"
                :key="img.src"
                :src="img.src"
                :alt="img.alt[lang]"
                sizes="sm:100vw md:60vw lg:700px xl:700px xxl:700px"
                loading="lazy"
                format="webp"
                class="mx-auto block h-auto w-auto max-w-full rounded-lg object-contain"
                :class="decisions.items[active].images.length > 1 ? 'relative max-h-[32svh] shadow-lg' + (k ? ' -mt-6 ml-auto mr-0' : '') : 'max-h-[70svh]'"
              />
            </div>
          </Transition>
        </div>
      </div>

      <!-- Scroll drivers: they only give the row its height and mark where each decision starts. -->
      <div class="pointer-events-none col-span-2 col-start-1 row-start-1" aria-hidden="true">
        <div v-for="(d, i) in decisions.items" :key="d.name.es" :ref="(el) => { if (el) triggers[i] = el as HTMLElement }" :data-i="i" class="h-[70svh]" />
      </div>
    </div>

    <!-- Mobile: each decision stacked with its screen(s) -->
    <ol class="space-y-12 md:hidden">
      <li v-for="(d, i) in decisions.items" :key="d.name.es">
        <p class="font-mono text-[11px] uppercase tracking-[.16em] text-cobalt">{{ String(i + 1).padStart(2, '0') }} / {{ String(decisions.items.length).padStart(2, '0') }}</p>
        <h3 class="mt-2 font-display text-2xl font-bold text-ink">{{ d.name[lang] }}</h3>
        <p class="mt-2 text-base text-ink-soft">{{ d.text[lang] }}</p>
        <div class="mt-4 space-y-3 rounded-2xl bg-white p-3 dark:bg-white/[.08]">
          <CaseShot v-for="img in d.images" :key="img.src" :img="img" class="rounded-lg" sizes="sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw" />
        </div>
      </li>
    </ol>
  </CaseScene>
</template>
