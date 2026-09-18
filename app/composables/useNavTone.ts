// app/composables/useNavTone.ts
// true mientras una sección `[data-nav-tone="cobalt"]` está bajo la línea `y` del nav/dock.
export function useNavTone(probeY: () => number) {
  const onCobalt = ref(false)
  let frame = 0

  const check = () => {
    frame = 0
    const y = probeY()
    onCobalt.value = [...document.querySelectorAll('[data-nav-tone="cobalt"]')].some((s) => {
      const r = s.getBoundingClientRect()
      return r.top <= y && r.bottom > y
    })
  }
  const schedule = () => { frame ||= requestAnimationFrame(check) }

  onMounted(() => {
    check()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    useNuxtApp().hook('page:finish', schedule)
  })
  onUnmounted(() => {
    cancelAnimationFrame(frame)
    window.removeEventListener('scroll', schedule)
    window.removeEventListener('resize', schedule)
  })
  return onCobalt
}
