// app/composables/useMagnetic.ts
import gsap from 'gsap'
import type { Ref } from 'vue'

// Reuses the same "pull toward the cursor" technique built for the Hero's
// letters (app/components/home/Hero.vue), generalized to a single element.
// `target` is the small element that actually moves (e.g. an icon badge);
// the pull triggers from anywhere inside its nearest ancestor matching
// `zoneSelector` (e.g. the whole card link), found via `closest` rather than
// a second template ref — refs placed directly on <NuxtLink> can resolve to
// the component instance instead of the DOM node, depending on how it forwards
// them, so walking up from a plain element ref is the more reliable path.
export function useMagnetic(
  target: Ref<HTMLElement | null>,
  options?: { radius?: number; strength?: number; zoneSelector?: string },
) {
  const radius = options?.radius ?? 90
  const strength = options?.strength ?? 16
  const zoneSelector = options?.zoneSelector ?? 'a'

  let moveX: gsap.QuickToFunc | undefined
  let moveY: gsap.QuickToFunc | undefined
  let zoneEl: HTMLElement | undefined

  function onMove(e: MouseEvent) {
    const el = target.value
    if (!el || !moveX || !moveY) return
    const rect = el.getBoundingClientRect()
    const dx = e.clientX - (rect.left + rect.width / 2)
    const dy = e.clientY - (rect.top + rect.height / 2)
    const dist = Math.hypot(dx, dy)
    if (dist < radius && dist > 0) {
      const pull = (1 - dist / radius) * strength
      moveX(-(dx / dist) * pull)
      moveY(-(dy / dist) * pull)
    } else {
      moveX(0)
      moveY(0)
    }
  }

  function onLeave() {
    moveX?.(0)
    moveY?.(0)
  }

  onMounted(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (!window.matchMedia('(hover: hover)').matches) return
    if (!target.value) return

    const foundZone = target.value.closest<HTMLElement>(zoneSelector)
    if (!foundZone) return

    moveX = gsap.quickTo(target.value, 'x', { duration: 0.35, ease: 'power3' })
    moveY = gsap.quickTo(target.value, 'y', { duration: 0.35, ease: 'power3' })

    zoneEl = foundZone
    zoneEl.addEventListener('mousemove', onMove)
    zoneEl.addEventListener('mouseleave', onLeave)
  })

  onUnmounted(() => {
    zoneEl?.removeEventListener('mousemove', onMove)
    zoneEl?.removeEventListener('mouseleave', onLeave)
  })
}
