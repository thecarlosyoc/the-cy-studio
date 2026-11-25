// True when the user asked for less motion. False on the server and until mount, so SSR renders the
// final (static) state; callers that animate start from it only after mount.
export function useReducedMotion() {
  const reduced = ref(false)
  let mq: MediaQueryList | undefined
  const on = (e: MediaQueryListEvent) => (reduced.value = e.matches)
  onMounted(() => {
    mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    reduced.value = mq.matches
    mq.addEventListener('change', on)
  })
  onUnmounted(() => mq?.removeEventListener('change', on))
  return reduced
}
