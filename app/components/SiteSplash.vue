<!-- app/components/SiteSplash.vue -->
<!--
  Splash del primer render (entrada fría al sitio con conexión lenta).

  Vive en el HTML que devuelve el servidor como primer elemento del body, así
  que se pinta en cuanto llegan los primeros bytes — sin depender de ningún
  bundle JS. Nace OCULTO y un CSS keyframe lo revela 1.5 s después de que sus
  estilos se aplican, SOLO SI la app todavía no se hidrató (app.vue lo elimina
  del DOM en onMounted). En conexiones rápidas se elimina antes del revelado →
  nunca parpadea. En conexiones lentas cubre el hueco entre el paint y el fin
  de la hidratación con el logo + barra cobalt de la casa.

  No confundir con PageLoading (navegación interna SPA): este es solo para el
  "primer recurso" de la entrada al sitio.
-->
<template>
  <div id="cy-splash" class="sy-splash" aria-hidden="true">
    <BrandLogo class="sy-logo" />
    <div class="sy-bar"><span class="sy-fill" /></div>
    <p class="sy-caption">cargando</p>
  </div>
</template>

<script setup lang="ts">
// Al terminar la hidratación la app ya tiene su propio contenido: el splash
// desaparece. En las conexiones rápidas esto ocurre antes del revelado (nace
// oculto y solo se muestra 1.5 s después si para entonces la app todavía no
// estaba lista), así que nunca parpadea. Si el JS nunca llegara a cargar, la
// animación `sy-hide` lo retira sola a los ~12 s y el HTML renderizado por el
// servidor queda legible.
onMounted(() => {
  document.getElementById('cy-splash')?.remove()
})
</script>

<style scoped>
/* Estado base: oculto. El keyframe lo revela solo si la app tarda en
   hidratarse; el delay coincide con el reveal del logo/caption. */
.sy-splash {
  position: fixed;
  inset: 0;
  z-index: 90;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #f1efea;
  pointer-events: none;
  opacity: 0;
  visibility: hidden;
  animation:
    sy-reveal 0s step-end 1.5s forwards,
    sy-hide 0.4s ease-in 12s forwards;
}

.sy-logo {
  width: auto;
  height: 1.75rem;
  color: #12110e;
  opacity: 0;
  transform: translateY(14px) scale(0.985);
  animation: sy-rise 0.55s cubic-bezier(0.16, 1, 0.3, 1) 1.5s both;
  will-change: opacity, transform;
}

.sy-bar {
  position: relative;
  margin-top: 1.75rem;
  height: 2px;
  width: 64px;
  overflow: hidden;
  border-radius: 9999px;
  background: rgba(18, 17, 14, 0.1);
}

.sy-fill {
  position: absolute;
  top: 0;
  bottom: 0;
  left: -30%;
  width: 30%;
  border-radius: 9999px;
  background: #1e2be0;
  animation: sy-sweep 1.1s cubic-bezier(0.4, 0, 0.2, 1) infinite;
}

.sy-caption {
  margin-top: 1rem;
  font-family: 'Space Mono', monospace;
  font-size: 11px;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: rgba(67, 67, 59, 0.7);
  animation: sy-fade 0.4s ease-out 1.5s both;
}

@keyframes sy-reveal {
  0% {
    opacity: 0;
    visibility: hidden;
  }
  100% {
    opacity: 1;
    visibility: visible;
  }
}

@keyframes sy-hide {
  from {
    opacity: 1;
    visibility: visible;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
}

@keyframes sy-rise {
  from {
    opacity: 0;
    transform: translateY(14px) scale(0.985);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

@keyframes sy-fade {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes sy-sweep {
  0% {
    left: -30%;
  }
  100% {
    left: 100%;
  }
}

@media (prefers-reduced-motion: reduce) {
  /* Sin movimiento: el splash ni se muestra (el reveal y la salida de 12 s son
     ellos mismos cambios abruptos de todo el overlay). El contenido renderizado
     por el servidor queda directamente visible. */
  .sy-splash {
    animation: none;
    opacity: 0;
    visibility: hidden;
  }
  .sy-logo,
  .sy-caption {
    animation: none;
    opacity: 1;
    transform: none;
  }
  .sy-fill {
    animation: none;
    left: auto;
    width: 100%;
    background: rgba(18, 17, 14, 0.2);
  }
}
</style>