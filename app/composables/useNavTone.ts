// app/composables/useNavTone.ts
// Tono de la superficie que hay bajo la línea `y` del nav/dock: el valor de `data-nav-tone`
// ('cobalt' | 'image') del elemento que cruza esa línea, o null.
// Un IntersectionObserver con root de 1px en la línea: el navegador calcula los cruces en su
// propio paso de render y el scroll no lee layout (antes, elementsFromPoint en cada frame era
// el mayor costo de script al hacer scroll).
// El hero es sticky: su rect sigue cruzando la línea cuando la columna de contenido lo cubre.
// Esa columna lleva `data-nav-cover` (opaca, encima del hero): mientras cruza la línea solo
// cuentan los tonos que viven dentro de ella.
export function useNavTone(probeY: () => number) {
  const tone = ref<string | null>(null)
  const crossing = new Set<Element>()
  let io: IntersectionObserver | undefined
  let frame = 0
  let mainObserver: ResizeObserver | undefined

  const update = () => {
    const cover = [...crossing].find((el) => el.hasAttribute('data-nav-cover'))
    const hit = [...crossing].find((el) => el.hasAttribute('data-nav-tone') && (!cover || cover.contains(el)))
    tone.value = hit?.getAttribute('data-nav-tone') ?? null
  }

  // La banda depende del alto de la ventana y los elementos de la página: se rehace en resize
  // y en cambio de página, nunca en scroll.
  const observe = () => {
    frame = 0
    io?.disconnect()
    crossing.clear()
    const y = Math.round(probeY())
    io = new IntersectionObserver((entries) => {
      for (const e of entries) crossing[e.isIntersecting ? 'add' : 'delete'](e.target)
      update()
    }, { rootMargin: `${-y}px 0px ${y + 1 - window.innerHeight}px 0px` })
    document.querySelectorAll('[data-nav-tone], [data-nav-cover]').forEach((el) => io!.observe(el))
    update()
  }
  const schedule = () => { frame ||= requestAnimationFrame(observe) }

  onMounted(() => {
    observe()
    window.addEventListener('resize', schedule)
    // Cambio de página: <main> persiste entre páginas y cambia de alto cuando sale la anterior
    // y entra la nueva (out-in); ahí se observan los elementos nuevos. El movimiento de la
    // transición de entrada lo sigue el propio observer.
    const main = document.querySelector('main')
    if (main) {
      mainObserver = new ResizeObserver(schedule)
      mainObserver.observe(main)
    }
  })
  onUnmounted(() => {
    cancelAnimationFrame(frame)
    io?.disconnect()
    mainObserver?.disconnect()
    window.removeEventListener('resize', schedule)
  })
  return tone
}
