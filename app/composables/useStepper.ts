// Auto-advancing stepper state shared by the case scenes (Flow, Bolson).
// Advances every 2.5 s while `root` is on screen; stops while paused, hovered/focused, tab hidden or with
// reduced motion, and for good after the first manual pick (WCAG 2.2.2: the caller also shows a pause button).
export function useStepper(count: number, root: Ref<HTMLElement | null>) {
  const reduced = useReducedMotion()
  const inView = useInView(root, { threshold: 0.4 })
  const active = ref(0)
  const paused = ref(false) // user toggle (pause button)
  const hovered = ref(false) // pointer inside (mouse/pen only)
  const focused = ref(false) // keyboard focus inside, except on the pause button itself
  const manual = ref(false)
  const hidden = ref(false) // tab in background
  const onVisibility = () => (hidden.value = document.hidden)
  onMounted(() => {
    onVisibility()
    document.addEventListener('visibilitychange', onVisibility)
  })
  onUnmounted(() => document.removeEventListener('visibilitychange', onVisibility))
  function pick(i: number) { active.value = i; manual.value = true }

  let timer: ReturnType<typeof setTimeout> | undefined
  watchEffect((onCleanup) => {
    if (!inView.value || paused.value || hovered.value || focused.value || manual.value || hidden.value || reduced.value) return
    const i = active.value
    timer = setTimeout(() => { active.value = (i + 1) % count }, 2500)
    onCleanup(() => clearTimeout(timer))
  })
  // Bind these on the scene root. The pause button carries data-stepper-pause so focusing it never blocks resuming.
  const hover = {
    onPointerenter: (e: PointerEvent) => { if (e.pointerType !== 'touch') hovered.value = true },
    onPointerleave: () => { hovered.value = false },
    onFocusin: (e: FocusEvent) => { focused.value = !(e.target as HTMLElement).closest('[data-stepper-pause]') },
    onFocusout: (e: FocusEvent) => {
      if (!root.value?.contains(e.relatedTarget as Node | null)) focused.value = false
    },
  }
  return { active, paused, manual, reduced, pick, hover }
}
