<!-- app/components/core/Cursor.vue -->
<script setup lang="ts">
import gsap from 'gsap'

// Purely decorative trailing ring — never hides or replaces the native
// cursor, only enabled on fine-pointer/hover-capable devices, and respects
// prefers-reduced-motion. Elements opt in with a `data-cursor="label"`
// attribute (see CardWork/CardProduct, the navbar logo) to grow the ring
// and show that text. Add `data-cursor-accent="true"` (see HomeCta) for a
// green accent instead of ink, and `data-cursor-emoji="🚀"` to stack an
// emoji above the label.
//
// Hover state is derived fresh from every mousemove's `e.target`, rather
// than tracked via paired mouseover/mouseout listeners: if the hovered
// element gets removed from the DOM mid-hover (e.g. a client-side route
// change fires while the cursor sits over a project card), a mouseout
// never fires and the ring gets stuck showing the old label forever.
// Re-deriving on every move self-corrects on the very next tick instead.
const route = useRoute()

const ringEl = ref<HTMLElement | null>(null)
const label = ref('')
const emoji = ref('')
const accent = ref(false)
const active = ref(false)
const enabled = ref(false)

let moveX: gsap.QuickToFunc | undefined
let moveY: gsap.QuickToFunc | undefined

function onMove(e: MouseEvent) {
  moveX?.(e.clientX)
  moveY?.(e.clientY)

  const target = (e.target as HTMLElement | null)?.closest?.<HTMLElement>('[data-cursor]')
  if (target) {
    label.value = target.dataset.cursor || ''
    emoji.value = target.dataset.cursorEmoji || ''
    accent.value = target.dataset.cursorAccent === 'true'
    active.value = true
  } else {
    active.value = false
  }
}

// Belt and suspenders: reset immediately on navigation instead of waiting
// for the next mousemove tick to notice nothing matches anymore.
watch(
  () => route.fullPath,
  () => {
    active.value = false
  },
)

onMounted(async () => {
  const canHover = window.matchMedia('(hover: hover) and (pointer: fine)').matches
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  if (!canHover || reduceMotion) return

  enabled.value = true
  await nextTick()
  if (!ringEl.value) return

  gsap.set(ringEl.value, { xPercent: -50, yPercent: -50 })
  moveX = gsap.quickTo(ringEl.value, 'x', { duration: 0.5, ease: 'power3' })
  moveY = gsap.quickTo(ringEl.value, 'y', { duration: 0.5, ease: 'power3' })

  window.addEventListener('mousemove', onMove)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', onMove)
})
</script>

<template>
  <div
    v-if="enabled"
    ref="ringEl"
    class="pointer-events-none fixed left-0 top-0 z-[200] flex items-center justify-center rounded-full border border-ink/25 transition-[width,height,background-color,border-color] duration-200"
    :class="[
      active ? (accent ? 'h-20 w-20 bg-[#D7FF3D] border-[#D7FF3D]' : 'h-20 w-20 bg-ink border-ink') : 'h-6 w-6',
    ]"
  >
    <div v-if="active" class="flex flex-col items-center justify-center gap-0.5">
      <span v-if="emoji" class="text-lg leading-none">{{ emoji }}</span>
      <span
        class="max-w-[56px] font-mono text-[10px] uppercase tracking-wide text-center leading-[1.2]"
        :class="accent ? 'text-ink' : 'text-paper'"
      >
        {{ label }}
      </span>
    </div>
  </div>
</template>
