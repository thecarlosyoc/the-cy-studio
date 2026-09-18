<!-- app/components/home/GuideDot.vue -->
<script setup lang="ts">
import gsap from 'gsap'

// El punto del nav/dock solo viaja en dos momentos: sale hacia el punto de la
// primera sección visible, y vuelve al nav cuando el scroll se detiene.
// Entre secciones no vuela: cada SectionDot aparece y desaparece en su sitio.
// mode: home = punto en el nav · flying = en tránsito · docked = en las secciones
const mode = useState<'home' | 'flying' | 'docked'>('guide-mode', () => 'home')
const flyer = ref<HTMLElement | null>(null)

const DURATION = 0.4 // trayecto largo: más que los 150–200 ms de una interacción puntual
const IDLE_MS = 1200

let cleanup: (() => void) | undefined

onMounted(() => {
  const el = flyer.value
  if (!el) return
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches

  let tween: gsap.core.Tween | undefined
  let returning = false
  let idleTimer: ReturnType<typeof setTimeout> | undefined

  const navHeight = () => parseFloat(document.documentElement.style.getPropertyValue('--navbar-height')) || 72
  const navDot = () => [...document.querySelectorAll<HTMLElement>('[data-nav-dot]')].find((n) => n.getClientRects().length)
  const dots = () => [...document.querySelectorAll<HTMLElement>('[data-section-dot]')]
  const color = (n: Element) => getComputedStyle(n).backgroundColor
  const inView = () => {
    const top = navHeight()
    return dots().filter((d) => {
      const r = d.getBoundingClientRect()
      return r.top > top && r.top < window.innerHeight * 0.8
    })
  }

  // Sin transición: el relevo entre el viajero y el punto real no debe parpadear.
  function setShown(d: HTMLElement, on: boolean, instant = false) {
    if (instant) d.style.transition = 'none'
    if (on) d.dataset.shown = ''
    else delete d.dataset.shown
    if (instant) {
      void d.offsetWidth
      d.style.transition = ''
    }
  }

  function render() {
    const vis = inView()
    dots().forEach((d) => setShown(d, vis.includes(d)))
    return vis
  }

  // Vuela desde donde esté hasta `to` (se mide en cada frame: el destino se mueve con el scroll).
  function fly(from: DOMRect, fromColor: string, to: () => HTMLElement | undefined, toColor: string, done: () => void) {
    tween?.kill()
    mode.value = 'flying'
    gsap.set(el, { x: from.left, y: from.top, opacity: 1, backgroundColor: fromColor })
    const p = { t: 0 }
    tween = gsap.to(p, {
      t: 1,
      duration: reduce ? 0 : DURATION,
      ease: 'power3.out',
      onUpdate() {
        const r = to()?.getBoundingClientRect() ?? from
        gsap.set(el, { x: from.left + (r.left - from.left) * p.t, y: from.top + (r.top - from.top) * p.t })
      },
      onComplete: () => {
        gsap.set(el, { opacity: 0 })
        done()
      },
    })
    gsap.to(el, { backgroundColor: toColor, duration: reduce ? 0 : DURATION })
  }

  function launch(target: HTMLElement) {
    returning = false
    const mid = !!tween?.isActive() // relevo desde un regreso en curso
    const nav = navDot()
    const src = mid ? el : nav
    if (!src) return
    fly(src.getBoundingClientRect(), color(src), () => target, color(target), () => {
      const vis = inView()
      const t = vis.includes(target) ? target : vis[0]
      if (!t) return void (mode.value = 'home')
      dots().forEach((d) => setShown(d, d === t || vis.includes(d), d === t))
      mode.value = 'docked'
    })
  }

  function goHome(from: HTMLElement) {
    const nav = navDot()
    if (!nav) return void (mode.value = 'home')
    returning = true
    const rect = from.getBoundingClientRect()
    const fromColor = color(from)
    dots().forEach((d) => setShown(d, false, true))
    fly(rect, fromColor, navDot, color(nav), () => {
      returning = false
      mode.value = 'home'
    })
  }

  function onScroll() {
    clearTimeout(idleTimer)
    idleTimer = setTimeout(() => {
      if (mode.value !== 'docked') return
      const from = inView()[0]
      from ? goHome(from) : (mode.value = 'home')
    }, IDLE_MS)

    if (mode.value === 'flying' && !returning) return
    const vis = mode.value === 'docked' ? render() : inView()
    if (!vis.length) {
      // sin sección a la vista: el punto descansa en el nav (o sigue su regreso)
      if (mode.value === 'docked') mode.value = 'home'
      return
    }
    if (mode.value !== 'docked') launch(vis[0]!)
  }

  onScroll()
  window.addEventListener('scroll', onScroll, { passive: true })
  cleanup = () => {
    clearTimeout(idleTimer)
    tween?.kill()
    window.removeEventListener('scroll', onScroll)
    mode.value = 'home'
  }
})

onUnmounted(() => cleanup?.())
</script>

<template>
  <!-- Teleport: la transición de página transforma el contenedor y rompería `fixed`. -->
  <Teleport to="body">
    <span
      ref="flyer"
      aria-hidden="true"
      class="pointer-events-none fixed left-0 top-0 z-[60] h-2 w-2 rounded-full opacity-0"
    />
  </Teleport>
</template>
