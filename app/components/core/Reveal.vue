<!-- app/components/core/Reveal.vue -->
<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const el = ref<HTMLElement | null>(null)
let trigger: ScrollTrigger

onMounted(() => {
  if (!el.value) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) return

  const anim = gsap.fromTo(
    el.value,
    { opacity: 0, y: 20 },
    { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' }
  )

  trigger = ScrollTrigger.create({
    trigger: el.value,
    start: 'top 85%',
    animation: anim,
    toggleActions: 'play none none reverse',
  })
})

onUnmounted(() => {
  trigger?.kill()
})
</script>

<template>
  <div ref="el">
    <slot />
  </div>
</template>