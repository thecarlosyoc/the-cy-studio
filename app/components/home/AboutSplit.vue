<!-- app/components/home/AboutSplit.vue -->
<script setup lang="ts">
// Sección "Sobre mí" del inicio: foto a sangre en la mitad izquierda, texto centrado en la
// derecha. Un solo gesto al entrar en viewport: la foto se asienta y el texto entra como bloque.
// Estado oculto solo con JS activo (@media scripting) y con fail-open en CSS: sin JS, o si el
// bundle nunca hidrata, la sección se ve completa.
const t = useT()
const { photo } = await useSitePhotos()

// "Soy Carlos Yoc." va en Bold, el resto en Regular. El texto es editable desde el admin:
// se parte en la primera frase, sea cual sea el idioma.
const text = computed(() => {
  const full = t('homeAboutText')
  const i = full.indexOf('. ')
  return i < 0 ? { lead: full, rest: '' } : { lead: full.slice(0, i + 1), rest: full.slice(i + 1) }
})

const rootRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | undefined
onMounted(() => {
  const el = rootRef.value
  if (!el) return
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return void (el.dataset.in = '')
  observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) return
      el.dataset.in = ''
      observer?.disconnect()
    },
    { threshold: 0.3 },
  )
  observer.observe(el)
})
onUnmounted(() => observer?.disconnect())
</script>

<template>
  <section ref="rootRef" class="about-split grid grid-cols-1 md:grid-cols-2 bg-paper">
    <div class="about-photo relative aspect-[4/5] md:aspect-auto md:min-h-svh overflow-hidden">
      <!-- sizes sobredimensionado a propósito: la foto es horizontal y object-cover recorta parte del ancho. -->
      <NuxtImg
        :src="photo('home')"
        :alt="t('homeAboutAlt')"
        sizes="sm:150vw md:75vw lg:75vw xl:75vw xxl:75vw 2xl:75vw"
        densities="1x"
        format="webp"
        loading="lazy"
        class="about-img absolute inset-0 h-full w-full object-cover"
      />
    </div>
    <div class="flex items-center justify-center px-6 py-16 md:px-[100px] md:py-24">
      <div class="about-copy w-full max-w-[520px]">
        <HomeSectionDot class="mb-4" />
        <p class="font-mono text-[13px] tracking-[.08em] uppercase text-ink/60">{{ t('homeAboutLabel') }}</p>
        <p class="mt-10 font-display text-[24px] leading-[1.45] text-ink">
          <strong class="font-bold">{{ text.lead }}</strong>{{ text.rest }}
        </p>
        <CoreControl to="/about" variant="outline" class="mt-[52px]">{{ t('homeAboutCta') }}</CoreControl>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Encuadre por slot (main.css): el sujeto queda a la izquierda y el corte de la mitad cae sobre el fondo. */
.about-img {
  object-position: var(--pos-about-home);
  filter: var(--photo-filter);
}

@media (scripting: enabled) and (prefers-reduced-motion: no-preference) {
  .about-split:not([data-in]) .about-img {
    transform: scale(1.03);
  }
  .about-split:not([data-in]) .about-copy {
    opacity: 0;
    transform: translateY(12px);
    /* Si el bundle nunca hidrata, el bloque se abre solo (patrón de SiteSplash). */
    animation: about-fail-open 0s linear 4s forwards;
  }
  .about-split[data-in] .about-img {
    transition: transform var(--dur-settle) var(--ease-settle);
  }
  .about-split[data-in] .about-copy {
    transition:
      opacity 500ms var(--ease-enter) 120ms,
      transform 500ms var(--ease-enter) 120ms;
  }
}
@keyframes about-fail-open {
  to {
    opacity: 1;
    transform: none;
  }
}
</style>
