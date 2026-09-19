// app/composables/useNavTone.ts
// Tono de la superficie que hay bajo la línea `y` del nav/dock: el valor de `data-nav-tone`
// ('cobalt' | 'image') del elemento visible más arriba en ese punto, o null.
// Se usa la pila de pintado (elementsFromPoint) y no el rect de la sección: el hero es sticky y
// su rect no cambia cuando la columna de contenido lo cubre.
export function useNavTone(probeY: () => number) {
  const tone = ref<string | null>(null)
  let frame = 0

  const check = () => {
    frame = 0
    const top = document
      .elementsFromPoint(window.innerWidth / 2, probeY())
      .find((el) => !el.closest('[data-nav-chrome]'))
    tone.value = top?.closest('[data-nav-tone]')?.getAttribute('data-nav-tone') ?? null
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
  return tone
}
