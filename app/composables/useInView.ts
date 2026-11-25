// Reactive "is this element on screen". `once` latches true after the first time.
export function useInView(target: Ref<HTMLElement | null>, opts: { once?: boolean; threshold?: number } = {}) {
  const inView = ref(false)
  onMounted(() => {
    if (!target.value) return
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          inView.value = true
          if (opts.once) io.disconnect()
        } else if (!opts.once) inView.value = false
      },
      { threshold: opts.threshold ?? 0.3 },
    )
    io.observe(target.value)
    onUnmounted(() => io.disconnect())
  })
  return inView
}
