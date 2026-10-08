<!-- app/components/services/MotionDemo.vue -->
<script setup lang="ts">
// Demo tocable dentro de la tarjeta "Motion para interfaces": el servicio se prueba ahí
// mismo. Un botón recorre los tres estados que la tarjeta promete (respuesta al tocar,
// carga y confirmación) y vuelve solo al inicio. No envía nada.
type State = 'idle' | 'busy' | 'done'

const t = useT()
const state = ref<State>('idle')
let timer: ReturnType<typeof setTimeout> | undefined

function run() {
  if (state.value !== 'idle') return
  state.value = 'busy'
  timer = setTimeout(() => {
    state.value = 'done'
    timer = setTimeout(() => (state.value = 'idle'), 1600)
  }, 900)
}

onBeforeUnmount(() => clearTimeout(timer))

const label = computed(() => ({ idle: t('servicesDemoIdle'), busy: t('servicesDemoBusy'), done: t('servicesDemoDone') })[state.value])
</script>

<template>
  <div class="flex flex-col items-start gap-3 rounded-2xl border border-dashed border-ink/20 p-4 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
    <p class="text-sm text-ink-soft">{{ t('servicesDemoHint') }}</p>
    <button
      type="button"
      class="demo-btn relative flex h-11 w-[124px] shrink-0 items-center justify-center overflow-hidden rounded-full font-display text-[14px] font-medium leading-none tracking-[-.01em] md:h-9 md:text-[15px] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
      :class="`is-${state}`"
      :aria-disabled="state !== 'idle'"
      @click="run"
    >
      <!-- Relleno cobalto que crece desde el centro al confirmar (solo transform). -->
      <span class="demo-fill absolute inset-0 rounded-full bg-cobalt" aria-hidden="true" />
      <span class="relative flex items-center gap-2">
        <span class="demo-icon relative h-3.5 w-3.5" aria-hidden="true">
          <svg class="demo-spin absolute inset-0" viewBox="0 0 16 16" fill="none">
            <circle cx="8" cy="8" r="6" stroke="currentColor" stroke-opacity=".25" stroke-width="2" />
            <path d="M14 8a6 6 0 0 0-6-6" stroke="currentColor" stroke-width="2" stroke-linecap="round" />
          </svg>
          <svg class="demo-check absolute inset-0" viewBox="0 0 16 16" fill="none">
            <path d="M3.5 8.5l3 3 6-7" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" pathLength="1" />
          </svg>
        </span>
        <span aria-live="polite">{{ label }}</span>
      </span>
    </button>
  </div>
</template>

<style scoped>
.demo-btn {
  color: rgb(var(--color-ink));
  background: rgb(var(--color-ink) / 0.05);
  transition: color 0.2s ease, background-color 0.15s ease, transform 0.12s ease-out;
}
@media (hover: hover) and (pointer: fine) {
  .demo-btn.is-idle:hover {
    background: rgb(var(--color-ink) / 0.1);
  }
}
.demo-btn.is-idle:active {
  transform: scale(0.97);
}
.demo-btn.is-done {
  color: rgb(var(--color-paper));
}

.demo-fill {
  transform: scale(0);
  transition: transform 0.35s cubic-bezier(0.23, 1, 0.32, 1);
}
.is-done .demo-fill {
  transform: scale(1.1);
}

/* El ícono ocupa lugar solo cuando hay algo que mostrar. */
.demo-icon {
  width: 0;
  transition: width 0.2s cubic-bezier(0.23, 1, 0.32, 1);
}
.is-busy .demo-icon,
.is-done .demo-icon {
  width: 0.875rem;
}
.demo-spin,
.demo-check {
  opacity: 0;
  transition: opacity 0.15s ease;
}
.is-busy .demo-spin {
  opacity: 1;
  animation: demo-spin 0.7s linear infinite;
}
.demo-check path {
  stroke-dasharray: 1;
  stroke-dashoffset: 1;
}
.is-done .demo-check {
  opacity: 1;
}
.is-done .demo-check path {
  stroke-dashoffset: 0;
  transition: stroke-dashoffset 0.3s cubic-bezier(0.23, 1, 0.32, 1) 0.1s;
}
@keyframes demo-spin {
  to {
    transform: rotate(1turn);
  }
}

@media (prefers-reduced-motion: reduce) {
  .demo-fill {
    transform: scale(1.1);
    opacity: 0;
    transition: opacity 0.15s ease;
  }
  .is-done .demo-fill {
    opacity: 1;
  }
  .is-busy .demo-spin {
    animation-duration: 1.4s;
  }
  .demo-check path {
    stroke-dashoffset: 0;
  }
}
</style>
