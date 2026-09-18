// Caps how many cover videos autoplay at once across the whole page (home has
// two marquees, work has a rail — each with several cards visible at a time).
// Letting every visible video play would be needless bandwidth/CPU for cards
// the user glances past; a handful playing is enough to sell the motion.
// State is module-scope (not inside the composable function) so every
// CardProduct/CardWork instance on the page shares the same pool.
// ponytail: fixed cap, make it responsive (fewer on mobile) if it ever measures slow.
const MAX_CONCURRENT = 4

const playing = new Set<HTMLVideoElement>()
const waiting = new Set<HTMLVideoElement>()

export function useVideoPlaybackGate() {
  function requestPlay(video: HTMLVideoElement) {
    if (playing.has(video)) return
    waiting.delete(video)
    if (playing.size < MAX_CONCURRENT) {
      playing.add(video)
      video.play().catch(() => {}) // autoplay blocked: fail silent, poster stays visible
    } else {
      waiting.add(video)
    }
  }

  function release(video: HTMLVideoElement) {
    const wasPlaying = playing.delete(video)
    waiting.delete(video)
    video.pause()
    if (!wasPlaying) return
    const next = waiting.values().next().value
    if (next) {
      waiting.delete(next)
      playing.add(next)
      next.play().catch(() => {})
    }
  }

  return { requestPlay, release }
}
