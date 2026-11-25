// Reactive "is this element on screen". `once` latches true after the first time.
export function useInView(target: Ref<HTMLElement | null>, opts: { once?: boolean; threshold?: number } = {}) {
  const inView = ref(false)
  let io: IntersectionObserver | undefined
  onMounted(() => {
    if (!target.value) return
    io = new IntersectionObserver(
      (entries) => {
        // With `once` any intersecting entry counts; otherwise the latest entry wins.
        const e = opts.once ? (entries.find(x => x.isIntersecting) ?? entries[entries.length - 1]) : entries[entries.length - 1]
        if (e.isIntersecting) {
          inView.value = true
          if (opts.once) io?.disconnect()
        } else if (!opts.once) inView.value = false
      },
      { threshold: opts.threshold ?? 0.3 },
    )
    io.observe(target.value)
  })
  onUnmounted(() => io?.disconnect())
  return inView
}
