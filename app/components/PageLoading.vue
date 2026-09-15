<!-- app/components/PageLoading.vue -->
<!--
  Pantalla de carga del sitio público: cubre la navegación cuando cambiar de
  página tarda (fetch de datos del detalle, etc.) y oculta de paso el salto de
  scroll que hace el router en la página actual. Se engancha a los hooks de
  Nuxt `page:start`/`page:finish` (el primero dispara cuando la página nueva
  empieza a resolver sus datos; el segundo cuando termina).

  Reglas para que no moleste:
  - Solo aparece si la navegación lleva > 120 ms (las rutas rápidas se saltan
    la pantalla y no parpadea).
  - Una vez visible, permanece al menos ~320 ms aunque termine antes.
  - Nunca aparece en /admin.
-->
<script setup lang="ts">
// Umbral antes de comprometernos a mostrar la pantalla (ms).
const SHOW_AFTER = 120
// Tiempo mínimo visible una vez mostrada, para evitar parpadeo (ms).
const MIN_VISIBLE = 320

const show = ref(false)
// Ruta reactiva capturada en setup: el callback del hook lee `route.path` por
// closure (no se puede llamar useRoute() fuera del contexto de setup).
const route = useRoute()

let showTimer: ReturnType<typeof setTimeout> | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined
let shownAt = 0
// Devuelve la función que quita cada hook: NUNCA un solo `unregisterHooks`,
// porque perderíamos el des-registro del segundo hook y quedaría huérfano
// disparando por toda la vida de la app (refs de una instancia desmontada).
let offStart: (() => void) | undefined
let offFinish: (() => void) | undefined

function showLoading() {
  show.value = true
  shownAt = Date.now()
}

function hideSoon() {
  clearTimeout(hideTimer)
  // Si se mostró apenas hace un instante, espera a completar el mínimo.
  const elapsed = Date.now() - shownAt
  hideTimer = setTimeout(() => {
    show.value = false
  }, Math.max(0, MIN_VISIBLE - elapsed))
}

onMounted(() => {
  const app = useNuxtApp()

  offStart = app.hook('page:start', () => {
    if (route.path.startsWith('/admin')) return
    clearTimeout(showTimer)
    clearTimeout(hideTimer)
    showTimer = setTimeout(showLoading, SHOW_AFTER)
  })

  offFinish = app.hook('page:finish', () => {
    clearTimeout(showTimer)
    if (show.value) hideSoon()
  })
})

onUnmounted(() => {
  clearTimeout(showTimer)
  clearTimeout(hideTimer)
  offStart?.()
  offFinish?.()
})
</script>

<template>
  <Transition name="page-loading">
    <div
      v-if="show"
      role="status"
      aria-live="polite"
      class="fixed inset-0 z-[80] flex flex-col items-center justify-center bg-paper"
    >
      <span class="sr-only">Cargando página</span>

      <BrandLogo class="pl-rise pl-logo h-7 w-auto text-ink" />

      <div class="pl-rise pl-bar mt-7 h-[2px] w-16 overflow-hidden rounded-full bg-ink/10">
        <span class="pl-fill" />
      </div>

      <p class="pl-caption pl-rise mt-4 font-mono text-[11px] tracking-[.16em] uppercase text-ink-soft/70">
        cargando
      </p>
    </div>
  </Transition>
</template>

<style scoped>
.page-loading-enter-active,
.page-loading-leave-active {
  transition: opacity 0.3s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-loading-enter-from,
.page-loading-leave-to {
  opacity: 0;
}

/* El logo entra con el mismo "rise" que el resto del sitio (fade + subida). */
.pl-logo {
  animation: pl-rise 0.55s cubic-bezier(0.16, 1, 0.3, 1) both;
}

/* La barra y la etiqueta entran un compás después del logo. */
.pl-bar {
  position: relative;
  animation: pl-rise 0.45s cubic-bezier(0.16, 1, 0.3, 1) 0.12s both;
}
.pl-caption {
  animation: pl-fade 0.4s ease-out 0.2s both;
}

/* Trazo de cobalt que recorre el riel de la barra (indicador de carga). */
.pl-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -30%;
  width: 30%;
  border-radius: 9999px;
  background: #1e2be0;
  animation: pl-sweep 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.pl-rise {
  will-change: opacity, transform;
}

@keyframes pl-rise {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes pl-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes pl-sweep {
  0% {
    left: -30%;
  }
  100% {
    left: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  .pl-logo,
  .pl-bar,
  .pl-caption {
    animation: none;
  }
  .pl-fill {
    animation: none;
    left: auto;
    width: 100%;
    background: rgb(18 17 14 / 0.2);
  }
}
</style>