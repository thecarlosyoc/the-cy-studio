<!-- app/components/home/ProcessRail.vue -->
<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import type { DictKey } from '~/data/i18n'

gsap.registerPlugin(ScrollTrigger)

const t = useT()
const tk = (key: string) => t(key as DictKey)
const steps = [1, 2, 3, 4] as const

// Rail fill = scroll progress through the list; a step lights up (.is-on)
// once the fill reaches it. Reduced motion: everything lit, no scrub.
const listRef = ref<HTMLElement | null>(null)
const fillRef = ref<HTMLElement | null>(null)
let st: ScrollTrigger | undefined

onMounted(() => {
  const list = listRef.value
  const fill = fillRef.value
  if (!list || !fill) return
  const items = Array.from(list.querySelectorAll<HTMLElement>('[data-step]'))
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    fill.style.transform = 'scaleY(1)'
    items.forEach((el) => el.classList.add('is-on'))
    return
  }
  st = ScrollTrigger.create({
    trigger: list,
    start: 'top 65%',
    end: 'bottom 65%',
    scrub: 0.3,
    onUpdate: (self) => {
      fill.style.transform = `scaleY(${self.progress})`
      const y = self.progress * list.offsetHeight
      items.forEach((el) => el.classList.toggle('is-on', el.offsetTop <= y))
    },
  })
})
onUnmounted(() => st?.kill())
</script>

<template>
  <div ref="listRef" class="relative">
    <span class="absolute left-0 top-0 h-full w-px bg-ink/15" aria-hidden="true" />
    <span ref="fillRef" class="absolute left-0 top-0 h-full w-px origin-top scale-y-0 bg-cobalt" aria-hidden="true" />
    <CoreReveal
      v-for="n in steps"
      :key="n"
      data-step
      class="group relative pb-10 pl-8 last:pb-0 md:grid md:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] md:gap-16 md:pb-14 md:pl-12"
    >
      <span
        class="absolute -left-[4.5px] top-2 h-2.5 w-2.5 rounded-full border border-ink/25 bg-paper transition-colors duration-200 motion-reduce:transition-none group-[.is-on]:border-cobalt group-[.is-on]:bg-cobalt"
        aria-hidden="true"
      />
      <div>
        <span class="font-mono text-sm tracking-[.16em] text-cobalt">0{{ n }}</span>
        <h3 class="mt-2 font-display font-bold text-2xl md:text-3xl text-ink">{{ tk(`homeProcess${n}Title`) }}</h3>
      </div>
      <p class="mt-3 text-ink-soft text-base md:mt-0 md:pt-7 md:text-lg">{{ tk(`homeProcess${n}Text`) }}</p>
    </CoreReveal>
  </div>
</template>
