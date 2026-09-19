<!-- app/components/home/Hero.vue -->
<script setup lang="ts">
// Apertura de la home: retrato a sangre con el nombre en tratamiento editorial.
// Sticky: la columna de contenido (z-10, fondo opaco) sube y lo cubre. Al hacer scroll el
// retrato y el nombre se mueven a distinta velocidad (paralaje) mientras se cubren:
// solo transform + opacity, ligado a la posición de scroll (reversible).
//
// La entrada es CSS puro (keyframes con fill `backwards`): el texto llega completo desde el
// SSR y sin JS se ve en su posición final. Solo anima en carga en frío; en navegación SPA
// manda page-enter (nuxt.config): dos momentos orquestados a la vez rompen la regla de uno solo.

const t = useT()
const { photo } = await useSitePhotos()
const cold = useNuxtApp().isHydrating
// El nombre es editable: cada palabra va en su propia máscara para la entrada.
const nameWords = computed(() => t('heroName').split(' '))

const probeRef = ref<HTMLElement | null>(null)
let rangePx = 1
let raf = 0
let cleanup: Array<() => void> = []

// Fallback sin scroll-driven animations: rAF escribe --p (0..1) en :root y CSS reproduce los
// mismos keyframes en pausa . Sin leer layout dentro del
// loop: el rango (svh) se mide una vez en la sonda y se recachea en resize.
function setupScrollFallback() {
  if (CSS.supports('animation-timeline', 'scroll()')) return
  const root = document.documentElement
  const measure = () => (rangePx = probeRef.value?.offsetHeight || 1)
  const write = () => {
    raf = 0
    const p = Math.min(Math.max(window.scrollY / rangePx, 0), 1)
    root.style.setProperty('--p', String(p))
    root.style.setProperty('--pm', String(Math.min(p / 0.45, 1)))
  }
  const onScroll = () => {
    if (!raf) raf = requestAnimationFrame(write)
  }
  measure()
  window.addEventListener('resize', measure)
  window.addEventListener('scroll', onScroll, { passive: true })
  write()
  cleanup.push(() => {
    window.removeEventListener('resize', measure)
    window.removeEventListener('scroll', onScroll)
    cancelAnimationFrame(raf)
    root.style.removeProperty('--p')
    root.style.removeProperty('--pm')
  })
}

onMounted(setupScrollFallback)
onUnmounted(() => {
  cleanup.forEach((fn) => fn())
  cleanup = []
})
</script>

<template>
  <section class="hero" data-nav-tone="image" :data-entry="cold ? '' : undefined">
    <div class="hero-media">
      <NuxtPicture
        :src="photo('hero')"
        :alt="t('heroPortraitAlt')"
        format="avif,webp"
        sizes="sm:100vw md:100vw lg:100vw xl:100vw xxl:100vw 2xl:100vw"
        densities="1x"
        preload
        :img-attrs="{ class: 'hero-img', fetchpriority: 'high' }"
      />
    </div>
    <div class="hero-guard" aria-hidden="true" />
    <div class="hero-scrim" aria-hidden="true" />

    <div class="hero-content px-6 md:px-16">
      <p class="hero-fade hero-role font-mono uppercase md:normal-case text-[11px] md:text-[13px] tracking-[.08em]">
        <span class="hero-fade-in">{{ t('heroRole') }}</span>
      </p>
      <div class="hero-foot">
        <h1 class="hero-name font-display font-bold">
          <template v-for="(word, i) in nameWords" :key="i">
            <template v-if="i">{{ ' ' }}</template>
            <span class="w"><span class="w-in" :style="{ '--i': i }">{{ word }}</span></span>
          </template>
        </h1>
        <p class="hero-fade hero-meta font-mono uppercase md:normal-case text-[11px] md:text-[13px] tracking-[.06em]">
          <span class="hero-fade-in">{{ t('heroMeta1') }}</span>
        </p>
      </div>
    </div>

    <div ref="probeRef" class="hero-probe" aria-hidden="true" />
  </section>
</template>

<style scoped>
.hero {
  position: sticky;
  top: 0;
  min-height: var(--hero-min-h);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  color: rgb(var(--on-image-fg));
  background: rgb(var(--on-image-top));
}

/* Mide el rango de scroll en las mismas unidades que el CSS (svh). */
.hero-probe {
  position: absolute;
  top: 0;
  left: 0;
  width: 1px;
  height: var(--hero-scroll-range);
  visibility: hidden;
  pointer-events: none;
}

.hero-media {
  position: absolute;
  inset: 0;
}
.hero-media :deep(picture),
.hero-media :deep(.hero-img) {
  display: block;
  width: 100%;
  height: 100%;
}
/* Encuadre por slot, no por el recorte de la foto: ver --pos-hero en main.css. */
.hero-media :deep(.hero-img) {
  object-fit: cover;
  object-position: var(--pos-hero);
  filter: var(--photo-filter);
}

/* Guarda del navbar y scrim del nombre: sombra neutra, no velo del color del tema. */
.hero-guard,
.hero-scrim {
  position: absolute;
  left: 0;
  right: 0;
  pointer-events: none;
}
.hero-guard {
  top: 0;
  height: 180px;
  background: linear-gradient(to bottom, rgb(0 0 0 / 0.42), rgb(0 0 0 / 0));
}
.hero-scrim {
  bottom: 0;
  height: 63%;
  background: linear-gradient(
    to bottom,
    rgb(var(--on-image-bg) / 0),
    rgb(var(--on-image-bg) / 0.42) 55%,
    rgb(var(--on-image-bg) / 0.88)
  );
}

.hero-content {
  position: relative;
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding-top: calc(var(--navbar-height) + 1.5rem);
  /* Mobile: el dock fijo (82px) tapa el borde inferior. */
  padding-bottom: 6.75rem;
}
.hero-role {
  color: rgb(var(--on-image-fg) / 0.75);
}

.hero-name {
  font-size: var(--name-size);
  line-height: 0.88;
  letter-spacing: -0.045em;
}
/* Recorte por palabra. El padding negativo evita cortar descendentes con line-height < 1. */
.w {
  display: block;
  width: fit-content;
  overflow: hidden;
  padding-bottom: 0.12em;
  margin-bottom: -0.12em;
}
.w-in {
  display: block;
}

.hero-foot {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1.25rem 2rem;
}
/* Mobile: debajo del nombre, a la izquierda. Desktop: junto al nombre si cabe; si no, baja sin taparlo. */
.hero-meta {
  line-height: 1.7;
  color: rgb(var(--on-image-fg) / 0.66);
}

@media (min-width: 768px) {
  .hero-meta {
    margin-left: auto;
    padding-bottom: 0.9rem;
    text-align: right;
  }
  .hero-content {
    padding-top: calc(var(--navbar-height) + 3.5rem);
    padding-bottom: 5.25rem;
  }
  .hero-guard {
    height: 240px;
  }
  .hero-scrim {
    height: 60%;
  }
  .w {
    display: inline-block;
    vertical-align: top;
  }
}

/* --- Entrada (carga en frío): CSS puro, un solo momento --- */
@keyframes hero-settle {
  from {
    transform: scale(1.04);
  }
}
@keyframes hero-word {
  from {
    opacity: 0;
    transform: translateY(0.32em);
  }
}
@keyframes hero-fade-in {
  from {
    opacity: 0;
  }
}
@media (prefers-reduced-motion: no-preference) {
  .hero[data-entry] .hero-media :deep(.hero-img) {
    animation: hero-settle var(--dur-settle) var(--ease-settle) backwards;
  }
  .hero[data-entry] .w-in {
    animation: hero-word var(--dur-word) var(--ease-enter)
      calc(var(--word-start) + var(--i) * var(--stagger-word)) backwards;
  }
  /* Rol y metadata: solo opacidad, una vez arrancada la última palabra. */
  .hero[data-entry] .hero-fade-in {
    animation: hero-fade-in var(--dur-meta) var(--ease-enter)
      calc(var(--word-start) + var(--stagger-word)) backwards;
  }
}

/* --- Relevo en scroll: mismos keyframes en ambas rutas. El nombre sube más rápido
   que el retrato (-14% vs -3%): esa diferencia de velocidad es el paralaje. --- */
@keyframes hero-media-out {
  to {
    transform: translateY(-3%) scale(1.06);
  }
}
@keyframes hero-name-out {
  to {
    opacity: 0;
    transform: translateY(-14%);
  }
}
@keyframes hero-fade-out {
  to {
    opacity: 0;
  }
}

@supports (animation-timeline: scroll()) {
  .hero-media,
  .hero-name,
  .hero-fade {
    animation: hero-media-out 1s var(--ease-settle) both;
    animation-timeline: scroll(root);
    animation-range: 0px var(--hero-scroll-range);
  }
  .hero-name {
    animation-name: hero-name-out;
  }
  /* Rol y metadata salen antes, a 45%. */
  .hero-fade {
    animation-name: hero-fade-out;
    animation-range: 0px calc(var(--hero-scroll-range) * 0.45);
  }
}

@supports not (animation-timeline: scroll()) {
  .hero-media {
    animation: hero-media-out 1s var(--ease-settle) both paused;
    animation-delay: calc(var(--p, 0) * -1s);
  }
  .hero-name {
    animation: hero-name-out 1s var(--ease-settle) both paused;
    animation-delay: calc(var(--p, 0) * -1s);
  }
  .hero-fade {
    animation: hero-fade-out 1s var(--ease-settle) both paused;
    animation-delay: calc(var(--pm, 0) * -1s);
  }
}

/* Reduced motion: todo en su estado final, sin escala, recorte ni paralaje. Va al final para ganar. */
@media (prefers-reduced-motion: reduce) {
  .hero-media,
  .hero-name,
  .hero-fade,
  .hero-fade-in,
  .w-in,
  .hero-media :deep(.hero-img) {
    animation: none;
  }
}
</style>
