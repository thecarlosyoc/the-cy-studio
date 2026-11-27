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
        if (el.value) observer.unobserve(el.value)
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
  /* position + tamaño explícitos: un descendiente con `position: absolute`
     (p. ej. la imagen de la galería) toma como referencia el elemento
     transformado más cercano — este div, mientras la transición está activa —
     así que sin estas dos líneas colapsaría a 0×0 (su único contenido ya no
     aporta tamaño intrínseco) en vez de heredar el tamaño de su contenedor. */
  position: relative;
  height: 100%;
  /* 0.01, not 0: Chrome skips a paint at opacity 0 when it picks the LCP, so a first-screen reveal
     (the /services h1, the first /work card) only counted once its fade began. At 0.01 it counts at
     first paint and still reads as hidden; server/plugins/reveal-first-screen.ts starts that fade. */
  opacity: 0.01;
  transform: translateY(20px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.core-reveal.is-visible {
  opacity: 1;
  transform: none;
}
</style>