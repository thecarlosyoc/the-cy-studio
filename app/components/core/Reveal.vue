<!-- app/components/core/Reveal.vue -->
<script setup lang="ts">
const el = ref<HTMLElement | null>(null)
let observer: IntersectionObserver

onMounted(() => {
  if (!el.value) return

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (reduceMotion) {
    el.value.style.opacity = '1'
    el.value.style.transform = 'none'
    return
  }

  observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        el.value?.classList.add('is-visible')
      } else {
        el.value?.classList.remove('is-visible')
      }
    },
    { threshold: 0.15 }
  )
  observer.observe(el.value)
})

onUnmounted(() => observer?.disconnect())
</script>

<template>
  <div ref="el" class="core-reveal">
    <slot />
  </div>
</template>

<style scoped>
.core-reveal {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.core-reveal.is-visible {
  opacity: 1;
  transform: none;
}
</style>