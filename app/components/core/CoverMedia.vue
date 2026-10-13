<!-- app/components/core/CoverMedia.vue -->
<script setup lang="ts">
import type { GalleryVisual } from '#shared/types/content'

// Video cover for a card (home marquee, work rail/grid): autoplay muted loop
// while on screen, capped globally by useVideoPlaybackGate so a page full of
// cards doesn't try to play every video at once. Pauses on hover/focus —
// freezes the current frame, no controls shown — per product call: hovering
// a card should let you look at it, not have it keep moving under your cursor.
const props = defineProps<{
  video: GalleryVisual
  poster: string
  alt: string
}>()

// The R2 originals are full-size JPGs (up to 3.4 MB for a card shown at 220-360 px). Posters go through the image
// provider (Cloudflare Image Transformations in production) so the browser downloads a resized, modern format.
const img = useImage()
const posterSrc = computed(() => {
  const src = props.video.poster || props.poster
  return src ? img(src, { width: 800, quality: 80, format: 'auto' }) : undefined
})

const videoEl = ref<HTMLVideoElement | null>(null)
const { requestPlay, release } = useVideoPlaybackGate()

let isIntersecting = false
const hovering = false
let observer: IntersectionObserver | null = null

function syncPlayback() {
  const el = videoEl.value
  if (!el) return
  if (isIntersecting && !hovering) requestPlay(el)
  else release(el)
}

onMounted(() => {
  const el = videoEl.value
  if (!el) return

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

  observer = new IntersectionObserver(
    ([entry]) => {
      isIntersecting = !!entry?.isIntersecting
      syncPlayback()
    },
    { rootMargin: '300px' },
  )
  observer.observe(el)
})

onBeforeUnmount(() => {
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
