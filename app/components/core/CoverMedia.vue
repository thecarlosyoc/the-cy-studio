<!-- app/components/core/CoverMedia.vue -->
<script setup lang="ts">
import type { GalleryVisual } from '#shared/types/content'

// Video cover for a card (home marquee, work rail/grid): autoplay muted loop
// while on screen, capped globally by useVideoPlaybackGate so a page full of
// cards doesn't try to play every video at once. Pauses on hover/focus —
// freezes the current frame, no controls shown — per product call: hovering
// a card should let you look at it, not have it keep moving under your cursor.
const emit = defineEmits<{ playing: [value: boolean] }>()
const props = withDefaults(defineProps<{
  video: GalleryVisual
  poster: string
  alt: string
  // A visible pause control owns playback (WCAG 2.2.2): `paused` stops the video, and
  // `hoverPause` off lets a hero band keep playing under the cursor.
  paused?: boolean
  hoverPause?: boolean
  posterWidth?: number
  // The poster is the page's LCP (the first /work card): preload it at high priority, since a
  // video poster can't take fetchpriority and otherwise arrives while the app hydrates.
  priority?: boolean
}>(), { hoverPause: true, posterWidth: 800 })

// The R2 originals are full-size JPGs (up to 3.4 MB for a card shown at 220-360 px). Posters go through the image
// provider (Cloudflare Image Transformations in production) so the browser downloads a resized, modern format.
const img = useImage()
const posterSrc = computed(() => {
  const src = props.video.poster || props.poster
  return src ? img(src, { width: props.posterWidth, quality: 80, format: 'auto' }) : undefined
})
useHead({
  link: () => (props.priority && posterSrc.value
    ? [{ key: 'lcp-poster', rel: 'preload', as: 'image', href: posterSrc.value, fetchpriority: 'high' }]
    : []),
})

const videoEl = ref<HTMLVideoElement | null>(null)
const { requestPlay, release } = useVideoPlaybackGate()

let isIntersecting = false
// eslint-disable-next-line prefer-const -- reassigned in template event handlers (eslint cannot see it; --fix turned it into const and broke the build)
let hovering = false
let observer: IntersectionObserver | null = null

function syncPlayback() {
  const el = videoEl.value
  if (!el) return
  if (isIntersecting && !(hovering && props.hoverPause) && !props.paused) requestPlay(el)
  else release(el)
}

watch(() => props.paused, syncPlayback)

// Lets a visible pause control start playback again (the video can be off screen or never have started).
defineExpose({ resume: () => videoEl.value && requestPlay(videoEl.value) })

// Reduced motion is followed live: on = stop and stop observing, off = observe again.
let motionMql: MediaQueryList | undefined
function applyMotionPref() {
  const el = videoEl.value
  if (!el) return
  observer?.disconnect()
  observer = null
  isIntersecting = false
  if (motionMql?.matches) {
    release(el)
    return
  }
  observer = new IntersectionObserver(
    ([entry]) => {
      isIntersecting = !!entry?.isIntersecting
      syncPlayback()
    },
    { rootMargin: '300px' },
  )
  observer.observe(el)
}

// Start only after a frame has painted: the videos (MBs each) otherwise start downloading during hydration,
// before the first paint on a slow phone, and Lighthouse counts them toward the LCP (/work: 3.9 s).
let startFrame = 0
onMounted(() => {
  startFrame = requestAnimationFrame(() => {
    startFrame = requestAnimationFrame(() => {
      startFrame = 0
      motionMql = window.matchMedia('(prefers-reduced-motion: reduce)')
      motionMql.addEventListener('change', applyMotionPref)
      applyMotionPref()
    })
  })
})

onBeforeUnmount(() => {
  cancelAnimationFrame(startFrame)
  motionMql?.removeEventListener('change', applyMotionPref)
  observer?.disconnect()
  if (videoEl.value) release(videoEl.value)
})
</script>

<template>
  <video
    ref="videoEl"
    :poster="posterSrc"
    muted
    loop
    playsinline
    preload="none"
    :aria-label="alt"
    class="h-full w-full object-cover"
    @playing="emit('playing', true)"
    @pause="emit('playing', false)"
    @mouseenter="hovering = true; syncPlayback()"
    @mouseleave="hovering = false; syncPlayback()"
    @focusin="hovering = true; syncPlayback()"
    @focusout="hovering = false; syncPlayback()"
  >
    <source v-if="video.format === 'webm'" :src="video.url" type="video/webm" >
    <source v-if="video.format === 'mp4'" :src="video.url" type="video/mp4" >
    <source v-if="video.mp4Url" :src="video.mp4Url" type="video/mp4" >
  </video>
</template>
