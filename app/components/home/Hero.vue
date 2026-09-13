<!-- app/components/home/Hero.vue -->
<script setup lang="ts">
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

const trackRef = ref<HTMLElement | null>(null)
const guidesRef = ref<HTMLElement | null>(null)
const hookRef = ref<HTMLElement | null>(null)
const signRef = ref<HTMLElement | null>(null)
const cueRef = ref<HTMLElement | null>(null)
const locationRef = ref<HTMLElement | null>(null)

const line1 = ['D', 'I', 'S', 'E', 'Ñ', 'O', ' ', 'Q', 'U', 'E']
const line2 = ['R', 'E', 'S', 'P', 'I', 'R', 'A']

const guideCount = 7
const guideOffsets = Array.from({ length: guideCount }, (_, i) => i / (guideCount - 1) - 0.5)

let scrollTl: gsap.core.Timeline
let scrollSt: ScrollTrigger
const cleanupFns: Array<() => void> = []

onMounted(() => {
  // Evita que el navegador restaure una posición de scroll vieja antes de montar GSAP
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'
  }
  window.scrollTo(0, 0)

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!reduceMotion) {
    setupScrollAnimation()
    setupMagneticHover()
  }
})

onUnmounted(() => {
  scrollSt?.kill()
  scrollTl?.kill()
  cleanupFns.forEach((fn) => fn())
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

  letters1.forEach((el, i) => {
    const offset = i - (letters1.length - 1) / 2
    scrollTl.to(el, { xPercent: offset * 12, yPercent: -14, scale: 0.82, opacity: 0, ease: 'power2.inOut', duration: 0.5 }, 0)
  })
  letters2.forEach((el, i) => {
    const offset = i - (letters2.length - 1) / 2
    scrollTl.to(el, { xPercent: offset * 12, yPercent: 14, scale: 0.82, opacity: 0, ease: 'power2.inOut', duration: 0.5 }, 0)
  })
  scrollTl.to(signRef.value, { opacity: 0, ease: 'none', duration: 0.28 }, 0)
  scrollTl.to(cueRef.value, { opacity: 0, ease: 'none', duration: 0.2 }, 0)

  // El texto de ubicación aparece y se desvanece durante la "cola" del scroll (0.48 → 1)
  scrollTl.to(locationRef.value, { opacity: 1, y: 0, ease: 'power2.out', duration: 0.14 }, 0.48)
  scrollTl.to(locationRef.value, { opacity: 0, y: -16, ease: 'power2.in', duration: 0.12 }, 0.86)

  scrollSt = ScrollTrigger.create({
    trigger: trackRef.value,
    start: 'top top',
    end: 'bottom bottom',
    scrub: 0.6,
    animation: scrollTl,
    onUpdate: (self) => {
      const p = self.progress
      const breathe = Math.sin(p * Math.PI)
      const gw = guidesRef.value?.offsetWidth ?? 0
      guideEls.forEach((el, i) => {
        gsap.set(el, { x: guideOffsets[i] * breathe * gw * 0.62 })
      })
      gsap.set(guidesRef.value, {
        opacity: (0.9 - breathe * 0.25) * (1 - gsap.utils.clamp(0, 1, (p - 0.62) / 0.3)),
      })
    },
  })
}

function setupMagneticHover() {
  const hook = hookRef.value
  if (!hook) return

  const letters = gsap.utils.toArray<HTMLElement>('.ltr', hook)
  const movers = letters.map((el) => ({
    x: gsap.quickTo(el, 'x', { duration: 0.35, ease: 'power3' }),
    y: gsap.quickTo(el, 'y', { duration: 0.35, ease: 'power3' }),
    el,
  }))

  const radius = 140
  const strength = 18

  function onMove(e: MouseEvent) {
    movers.forEach(({ el, x, y }) => {
      const rect = el.getBoundingClientRect()
      const dx = e.clientX - (rect.left + rect.width / 2)
      const dy = e.clientY - (rect.top + rect.height / 2)
      const dist = Math.hypot(dx, dy)
      if (dist < radius && dist > 0) {
        const pull = (1 - dist / radius) * strength
        x(-(dx / dist) * pull)
        y(-(dy / dist) * pull)
      } else {
        x(0)
        y(0)
      }
    })
  }

  function onLeave() {
    movers.forEach(({ x, y }) => { x(0); y(0) })
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
          <span class="font-display font-semibold text-[clamp(1rem,1.9vw,1.35rem)] tracking-tight">Carlos Yoc</span>
          <span class="text-ink/20 text-[1.1rem]">|</span>
          <span class="font-mono text-[.7rem] tracking-[.1em] uppercase text-ink-soft">Brand &amp; UX/UI Specialist</span>
        </div>

        <div ref="cueRef" class="hero-cue font-mono text-[.66rem] tracking-[.16em] uppercase text-ink-soft">
          Scroll ↓
        </div>

        <div ref="locationRef" class="hero-location">
          Estudio con sede en Guatemala<br />Trabajando globalmente
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
.hero-guide { position: absolute; top: 0; bottom: 0; width: 1px; margin-left: -0.5px; background: rgba(18, 17, 14, 0.14); will-change: transform; }

.hero-hook { position: relative; z-index: 3; text-align: center; }
.hero-line { display: flex; justify-content: center; flex-wrap: nowrap; align-items: baseline; font-family: var(--font-display, 'Space Grotesk'); font-weight: 700; letter-spacing: -0.05em; line-height: 0.88; }
.hero-l1 { font-size: clamp(2.1rem, 9.6vw, 7.6rem); }
.hero-l2 { font-size: clamp(3rem, 14.6vw, 11.6rem); }
.hero-line .ltr { display: block; will-change: transform, opacity; }
.hero-space { display: block; width: 0.3em; flex: 0 0 auto; }

.hero-sign { position: relative; z-index: 4; margin-top: clamp(22px, 3.6vw, 44px); display: flex; flex-wrap: wrap; gap: 6px clamp(14px, 2.6vw, 28px); align-items: baseline; justify-content: center; text-align: center; }
.hero-cue { position: relative; z-index: 4; margin-top: clamp(20px, 3vw, 34px); text-align: center; }

.hero-location {
  position: absolute; inset: 0; z-index: 2;
  display: flex; align-items: center; justify-content: center; text-align: center;
  pointer-events: none;
  font-family: var(--font-display, 'Space Grotesk'); font-weight: 500;
  font-size: clamp(1.1rem, 2.4vw, 1.6rem); letter-spacing: -0.01em; line-height: 1.4;
  color: var(--ink-soft, #43413B);
}

@media (prefers-reduced-motion: reduce) {
  .hero-track { height: auto; }
  .hero-sticky { position: static; height: auto; padding: 150px 0 70px; }
  .hero-guides, .hero-location { display: none; }
}
</style>