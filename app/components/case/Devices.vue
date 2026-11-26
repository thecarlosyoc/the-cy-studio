<!-- app/components/case/Devices.vue -->
<script setup lang="ts">
import type { SceneImage } from '#shared/types/caseStudy'

// A laptop and a phone, each one «a frame + a screen rectangle placed inside it by four insets in %».
// The frame is a photo-like render of a generic device (no brand) with its background and its screen cut
// out to transparency; it sits over the screen rectangle, which reaches a hair under the bezel so no gap
// shows. Both were generated for this page (2026-11-25) and cut by key colour: the insets below are the
// measured screen hole of each file, so a new frame file needs its own four numbers.
// Each state stacks its own screen in the same rectangle; `active` picks the visible one (cross-fade).
// While the hold is pinned (`!flow`) the content of each screen scrolls with the hold's own timeline.
// `flow`: plain page flow for the static layout (screens at their top, nothing animated).
type Desktop = SceneImage & { sidebar: number; header: number }
type Mobile = SceneImage & { status: number; skip: number }
defineProps<{ states: readonly { desktop: Desktop; mobile: Mobile }[]; active: number; flow?: boolean }>()

const fade = 'absolute inset-0 transition-opacity duration-300 motion-reduce:transition-none'
// Insets of the screen rectangle in each frame: top right bottom left, in % of the frame box.
// Screen hole measured (generated in the Gemini app, 2026-11-26; frames 1878×1099 and 1017×2149 px):
// laptop 5.914 12.247 11.738 12.300; phone 2.047 5.113 2.047 5.211 with a corner radius of 14.23 % of the
// screen's width. The phone frame carries its own camera island (34.4 % from the left, 31.1 % wide).
const FRAMES = '/images/work/payments-credits/'
const LAPTOP = { src: `${FRAMES}device-laptop.webp`, ratio: 1878 / 1099, inset: '5.66% 12% 11.49% 12.05%', sizes: 'sm:100vw md:760px lg:900px xl:900px xxl:900px' }
const PHONE = { src: `${FRAMES}device-phone.webp`, ratio: 1017 / 2149, inset: '1.8% 4.86% 1.8% 4.96%', radius: '14.4% / 6.37%', sizes: 'sm:220px md:280px lg:280px xl:280px xxl:280px' }
const frame = 'pointer-events-none absolute inset-0 z-10 block h-full w-full select-none'
const LAPTOP_SIZES = 'sm:100vw md:700px lg:840px xl:840px xxl:840px'
const PHONE_SIZES = 'sm:210px md:270px lg:270px xl:270px xxl:270px'
// Capture px -> CSS length against the screen rectangle (its width is the capture's width).
const cw = (px: number, of: number) => `calc(${px} / ${of} * 100cqw)`
</script>

<template>
  <div
    class="flex w-full"
    :class="flow ? 'flex-col items-center gap-8 md:flex-row md:items-end md:justify-center md:gap-[3%]' : 'h-full items-center justify-center gap-[3cqw]'"
  >
    <!-- Laptop -->
    <div class="relative shrink-0" :class="flow && 'w-full md:w-[calc(97%-200px)] md:max-w-[760px]'" :style="{ aspectRatio: String(LAPTOP.ratio), ...(flow ? {} : { width: `min(70cqw, calc(99cqh * ${LAPTOP.ratio}))` }) }">
      <NuxtImg :src="LAPTOP.src" alt="" aria-hidden="true" format="webp" :sizes="LAPTOP.sizes" loading="lazy" :class="frame" />
      <!-- screen rectangle -->
      <div class="absolute isolate overflow-hidden bg-[#0b0b0c] [container-type:size]" :style="{ inset: LAPTOP.inset }">
        <div v-for="(s, i) in states" :key="s.desktop.src" :class="[fade, active === i ? 'opacity-100' : 'opacity-0']" :aria-hidden="active !== i">
          <!-- The content that scrolls (animated in a hold), under the two fixed layers. -->
          <div :class="['absolute inset-x-0 top-0', !flow && `dev-move dev-move-${i}`]">
            <CaseShot :img="s.desktop" :sizes="LAPTOP_SIZES" />
          </div>
          <!-- Fixed app chrome: clipped copies of the same image (same src and sizes: fetched once). -->
          <div class="absolute left-0 top-0 overflow-hidden" :style="{ width: cw(s.desktop.sidebar, s.desktop.width), height: '100cqh' }" aria-hidden="true">
            <CaseShot :img="s.desktop" :sizes="LAPTOP_SIZES" alt="" style="width: 100cqw; max-width: none" />
          </div>
          <div class="absolute right-0 top-0 overflow-hidden" :style="{ left: cw(s.desktop.sidebar, s.desktop.width), height: cw(s.desktop.header, s.desktop.width) }" aria-hidden="true">
            <CaseShot :img="s.desktop" :sizes="LAPTOP_SIZES" alt="" :style="{ width: '100cqw', maxWidth: 'none', marginLeft: `calc(-1 * ${cw(s.desktop.sidebar, s.desktop.width)})` }" />
          </div>
        </div>
      </div>
    </div>

    <!-- Phone -->
    <div class="relative shrink-0" :class="flow && 'w-[200px]'" :style="{ aspectRatio: String(PHONE.ratio), ...(flow ? {} : { height: 'min(96cqh, 44cqw)' }) }">
      <NuxtImg :src="PHONE.src" alt="" aria-hidden="true" format="webp" :sizes="PHONE.sizes" loading="lazy" :class="frame" />
      <div class="absolute isolate overflow-hidden bg-[#0b0b0c] [container-type:size]" :style="{ inset: PHONE.inset, borderRadius: PHONE.radius }">
        <div v-for="(s, i) in states" :key="s.mobile.src" :class="[fade, active === i ? 'opacity-100' : 'opacity-0']" :aria-hidden="active !== i">
          <!-- Status bar, fixed: the first rows of the capture. -->
          <div class="absolute inset-x-0 top-0 z-10 overflow-hidden" :style="{ height: cw(s.mobile.status, s.mobile.width) }">
            <CaseShot :img="s.mobile" :sizes="PHONE_SIZES" alt="" />
          </div>
          <!-- Viewport under the status bar; the browser bar (rows status..skip) is never shown. -->
          <div class="absolute inset-x-0 bottom-0 overflow-hidden [container-type:size]" :style="{ top: cw(s.mobile.status, s.mobile.width) }">
            <div :class="['flow-root', !flow && `dev-move dev-move-${i}`]">
              <CaseShot :img="s.mobile" :sizes="PHONE_SIZES" :style="{ marginTop: `calc(-1 * ${cw(s.mobile.skip, s.mobile.width)})` }" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scroll-driven: the content of a screen travels from its top to its bottom (`100cqh - 100%` is exactly the
   overflow of the content over its screen, whatever the screen's size) with the timeline the hold publishes.
   State 0 travels in 4–46 % of the hold and rests until the swap; state 1 in 54–96 %. Without support, or with
   reduced motion, the screens stay at their top. */
@keyframes dev-move-0 {
  0%, 4% { transform: translateY(0); }
  46%, 100% { transform: translateY(calc(100cqh - 100%)); }
}
@keyframes dev-move-1 {
  0%, 54% { transform: translateY(0); }
  96%, 100% { transform: translateY(calc(100cqh - 100%)); }
}
@media (prefers-reduced-motion: no-preference) {
  @supports (animation-timeline: view()) {
    .dev-move { animation: linear both; animation-timeline: --case-hold; animation-range: contain; }
    .dev-move-0 { animation-name: dev-move-0; }
    .dev-move-1 { animation-name: dev-move-1; }
  }
}
</style>
