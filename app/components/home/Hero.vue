<!-- app/components/home/Hero.vue -->
<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const lang = useLang()
const t = useT()

const trackRef = ref<HTMLElement | null>(null)
const guidesRef = ref<HTMLElement | null>(null)
const hookRef = ref<HTMLElement | null>(null)
const signRef = ref<HTMLElement | null>(null)
const cueRef = ref<HTMLElement | null>(null)
const locationRef = ref<HTMLElement | null>(null)

const line1 = computed(() => t('heroLine1').split(''))
const line2 = computed(() => t('heroLine2').split(''))

const guideCount = 7
const guideOffsets = Array.from({ length: guideCount }, (_, i) => i / (guideCount - 1) - 0.5)

let scrollTl: gsap.core.Timeline | undefined
let scrollSt: ScrollTrigger | undefined
let breathTween: gsap.core.Tween | undefined
let breathVisibilityObserver: IntersectionObserver | undefined
let cleanupFns: Array<() => void> = []

function teardown() {
  scrollSt?.kill()
  scrollTl?.kill()
  breathTween?.kill()
  breathVisibilityObserver?.disconnect()
  scrollSt = undefined
  scrollTl = undefined
  breathTween = undefined
  breathVisibilityObserver = undefined
  cleanupFns.forEach((fn) => fn())
  cleanupFns = []
}

async function rebuild() {
  teardown()
  // Espera a que Vue vuelva a renderizar las letras (line1/line2 cambiaron)
  // antes de que GSAP vuelva a capturar los elementos .ltr por referencia.
  await nextTick()
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduceMotion) {
    setupScrollAnimation()
    setupBreathing()
    setupBreathingHover()
  }
}

onMounted(() => {
  // Evita que el navegador restaure una posición de scroll vieja antes de montar GSAP
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  window.scrollTo(0, 0)
  rebuild()
})

onUnmounted(() => {
  teardown()
})

// El texto animado letra por letra cambia de cantidad/ancho entre idiomas, así
// que la animación de scroll y el hover magnético deben reconstruirse enteros.
watch(lang, () => {
  rebuild()
})

function setupScrollAnimation() {
  const letters1 = gsap.utils.toArray<HTMLElement>('.hero-l1 .ltr')
  const letters2 = gsap.utils.toArray<HTMLElement>('.hero-l2 .ltr')
  const guideEls = gsap.utils.toArray<HTMLElement>('.hero-guide')

  gsap.set(locationRef.value, { opacity: 0, y: 16 })

  scrollTl = gsap.timeline({ paused: true })
  // Ancla la duración total del timeline a 1, para que cada posición (0..1)
  // corresponda exactamente al progreso de scroll (0..1), sin adivinar.
  scrollTl.to({}, { duration: 1 })

  // scaleX/scaleY (not the `scale` shorthand) so this never fights with the
  // hover effect below, which also animates these letters' scale via quickTo.
  letters1.forEach((el, i) => {
    const offset = i - (letters1.length - 1) / 2
    scrollTl.to(el, { xPercent: offset * 12, yPercent: -14, scaleX: 0.82, scaleY: 0.82, opacity: 0, ease: 'power2.inOut', duration: 0.5 }, 0)
  })
  letters2.forEach((el, i) => {
    const offset = i - (letters2.length - 1) / 2
    scrollTl.to(el, { xPercent: offset * 12, yPercent: 14, scaleX: 0.82, scaleY: 0.82, opacity: 0, ease: 'power2.inOut', duration: 0.5 }, 0)
  })
  scrollTl.to(signRef.value, { opacity: 0, ease: 'none', duration: 0.28 }, 0)
  scrollTl.to(cueRef.value, { opacity: 0, ease: 'none', duration: 0.2 }, 0)

  // El texto de ubicación aparece y se desvanece durante la "cola" del scroll (0.48 → 1)
  scrollTl.to(locationRef.value, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.14 }, 0.48)
  scrollTl.to(locationRef.value, { opacity: 0, y: -16, ease: 'power2.in', duration: 0.12 }, 0.86)

  // Perf: this ran on every scroll tick (at 60fps during the scrub) and used
  // to read `guidesRef.value.offsetWidth` inline, which forces a synchronous
  // layout reflow each time — the actual cause of the choppiness, on both
  // mobile and desktop since it's the same code path for every viewport.
  // Caching the width and only refreshing it when ScrollTrigger says the
  // layout actually changed removes that reflow from the hot path. Likewise,
  // quickSetter avoids re-parsing a tween config on every single call, which
  // gsap.set(el, {...}) does — cheap alone, but not for 7 elements at 60fps.
  let guidesWidth = guidesRef.value?.offsetWidth ?? 0
  const setGuideX = guideEls.map((el) => gsap.quickSetter(el, 'x', 'px'))
  const setGuidesOpacity = gsap.quickSetter(guidesRef.value, 'opacity')

  scrollSt = ScrollTrigger.create({
    trigger: trackRef.value,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    animation: scrollTl,
    onRefresh: () => {
      guidesWidth = guidesRef.value?.offsetWidth ?? 0
    },
    onUpdate: (self) => {
      const p = self.progress
      const breathe = Math.sin(p * Math.PI)
      setGuideX.forEach((set, i) => {
        set(guideOffsets[i] * breathe * guidesWidth * 0.62)
      })
      setGuidesOpacity((0.9 - breathe * 0.25) * (1 - gsap.utils.clamp(0, 1, (p - 0.62) / 0.3)))
    },
  })
}

// The whole headline breathes on its own, always — a slow, continuous
// inhale/exhale scale on the block that contains both lines. This is what
// makes "Diseño que respira" literally true at rest, not just a hover trick.
function setupBreathing() {
  if (!hookRef.value) return
  breathTween = gsap.to(hookRef.value, {
    scale: 1.045,
    opacity: 0.92,
    duration: 2.6,
    ease: 'sine.inOut',
    yoyo: true,
    repeat: -1,
  })

  // Same pause-off-screen pattern as GalleryGrid's video autoplay gate: once
  // the user scrolls past the hero this loop keeps running for nothing.
  breathVisibilityObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) breathTween?.resume()
      else breathTween?.pause()
    },
    { threshold: 0 },
  )
  breathVisibilityObserver.observe(hookRef.value)
}

// Hovering no longer scatters letters away from the cursor (felt chaotic,
// the opposite of "breathing"). Instead, letters near the cursor swell
// gently — like the ambient breath quickening close by — and settle back
// to their resting size. This scale composes with the parent's ambient
// breathing scale automatically (nested transforms multiply visually).
function setupBreathingHover() {
  const hook = hookRef.value
  if (!hook) return

  const letters = gsap.utils.toArray<HTMLElement>('.ltr', hook)
  const movers = letters.map((el) => ({
    el,
    scaleX: gsap.quickTo(el, 'scaleX', { duration: 0.5, ease: 'sine.out' }),
    scaleY: gsap.quickTo(el, 'scaleY', { duration: 0.5, ease: 'sine.out' }),
    y: gsap.quickTo(el, 'y', { duration: 0.5, ease: 'sine.out' }),
  }))

  const radius = 180
  const maxBoost = 0.6
  const maxLift = 16

  function onMove(e: MouseEvent) {
    movers.forEach(({ el, scaleX, scaleY, y }) => {
      const rect = el.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      const dist = Math.hypot(dx, dy)
      const proximity = dist < radius ? 1 - dist / radius : 0
      const s = 1 + proximity * maxBoost
      scaleX(s)
      scaleY(s)
      y(-proximity * maxLift)
    })
  }

  function onLeave() {
    movers.forEach(({ scaleX, scaleY, y }) => {
      scaleX(1)
      scaleY(1)
      y(0)
    })
  }

  hook.addEventListener('mousemove', onMove)
  hook.addEventListener('mouseleave', onLeave)
  cleanupFns.push(() => {
    hook.removeEventListener('mousemove', onMove)
    hook.removeEventListener('mouseleave', onLeave)
  })
}
</script>

<template>
  <div ref="trackRef" class="hero-track">
    <div class="hero-sticky">
      <div class="hero-stage">
        <div ref="guidesRef" class="hero-guides">
          <span
            v-for="(offset, i) in guideOffsets"
            :key="i"
            class="hero-guide"
            :style="{ left: `${(i / (guideOffsets.length - 1)) * 100}%` }"
          />
        </div>

        <div ref="hookRef" class="hero-hook">
          <div class="hero-line hero-l1">
            <span v-for="(ch, i) in line1" :key="'l1-' + i" class="ltr" :class="{ 'hero-space': ch === ' ' }">
              {{ ch === ' ' ? '' : ch }}
            </span>
          </div>
          <div class="hero-line hero-l2 text-cobalt">
            <span v-for="(ch, i) in line2" :key="'l2-' + i" class="ltr">{{ ch }}</span>
          </div>
        </div>

        <div ref="signRef" class="hero-sign">
          <span class="font-display font-normal text-[clamp(1rem,1.9vw,1.35rem)] tracking-tight">Carlos Yoc</span>
          <span class="text-ink/20 text-[1.1rem]">|</span>
          <span
            class="font-display font-bold text-[clamp(1rem,1.9vw,1.35rem)] tracking-tight text-ink [-webkit-text-stroke:0.5px_currentColor]"
          >{{ t('heroSignRole') }}</span>
        </div>

        <div ref="cueRef" class="hero-cue font-mono text-[.66rem] tracking-[.16em] uppercase text-ink-soft">
          {{ t('scroll') }} ↓
        </div>

        <div ref="locationRef" class="hero-location">
          {{ t('heroLocationLine1') }}<br />{{ t('heroLocationLine2') }}
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.hero-track { height: 220vh; position: relative; }
.hero-sticky { position: sticky; top: 0; height: 100vh; display: flex; flex-direction: column; justify-content: center; overflow: hidden; }
.hero-stage { position: relative; width: 100%; padding: 0 clamp(18px, 4vw, 48px); }

.hero-guides { position: absolute; top: -40vh; bottom: -40vh; left: clamp(18px, 4vw, 48px); right: clamp(18px, 4vw, 48px); pointer-events: none; opacity: 0; z-index: 0; }
.hero-guide { position: absolute; top: 0; bottom: 0; width: 1px; margin-left: -0.5px; background: rgb(var(--color-ink) / 0.14); will-change: transform; }

.hero-hook { position: relative; z-index: 3; text-align: center; }
.hero-line { display: flex; justify-content: center; flex-wrap: nowrap; align-items: baseline; font-family: var(--font-display, 'Space Grotesk'); font-weight: 700; letter-spacing: -0.05em; line-height: 0.88; }
/* Fluido en vez de un salto fijo en un breakpoint: toca 70px en mobile angosto
   (~390px) y 170px en desktop ancho (~1440px), interpolando de forma continua
   entre ambos — así nunca hay un ancho intermedio donde el texto no quepa. */
.hero-l1, .hero-l2 { font-size: clamp(70px, 2.05rem + 9.52vw, 170px); }
.hero-line .ltr { display: block; will-change: transform, opacity; }
.hero-space { display: block; width: 0.3em; flex: 0 0 auto; }

.hero-sign { position: relative; z-index: 4; margin-top: clamp(22px, 3.6vw, 44px); display: flex; flex-wrap: wrap; gap: 4px clamp(4px, 0.6vw, 8px); align-items: baseline; justify-content: center; text-align: center; }
.hero-cue { position: relative; z-index: 4; margin-top: clamp(20px, 3vw, 34px); text-align: center; }

.hero-location {
  position: absolute; inset: 0; z-index: 2;
  display: flex; align-items: center; justify-content: center; text-align: center;
  pointer-events: none;
  font-family: var(--font-display, 'Space Grotesk'); font-weight: 500;
  font-size: clamp(1.1rem, 2.4vw, 1.6rem); letter-spacing: -0.01em; line-height: 1.4;
  color: rgb(var(--color-ink-soft));
}

@media (prefers-reduced-motion: reduce) {
  .hero-track { height: auto; }
  .hero-sticky { position: static; height: auto; padding: 150px 0 70px; }
  .hero-guides, .hero-location { display: none; }
}

/* The faux-black stroke is desktop-only: these letters are continuously
   scaled/moved during the scroll-scrub, and re-rasterizing a stroked glyph
   on every frame of that (rather than a cheap compositor-only transform) is
   what was dropping mobile to ~10fps for the whole track. Desktop GPUs eat
   the cost fine; phones don't. */
@media (min-width: 768px) {
  .hero-line { -webkit-text-stroke: 0.02em currentColor; }
}
</style>