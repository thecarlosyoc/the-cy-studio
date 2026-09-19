<script setup lang="ts">
const route = useRoute()
const lang = useLang()
const t = useT()

const linkedinHref = 'https://www.linkedin.com/in/carlosyoc'

const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const showLogout = computed(() => isAdminRoute.value && route.path !== '/admin/login')

const showLogoutConfirm = ref(false)

async function handleLogout() {
  showLogoutConfirm.value = false
  await $fetch('/api/admin/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}

const navRoot = ref<HTMLElement | null>(null)
const tone = useNavTone(() => (navRoot.value?.getBoundingClientRect().height ?? 72) / 2)

function updateNavbarHeight() {
  if (navRoot.value) {
    // Subtract a hair so the sticky header below tucks slightly under the
    // navbar instead of risking a 1px gap from device-pixel rounding.
    const height = navRoot.value.getBoundingClientRect().height - 1
    document.documentElement.style.setProperty('--navbar-height', `${height}px`)
  }
}

onMounted(() => {
  updateNavbarHeight()
  window.addEventListener('resize', updateNavbarHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateNavbarHeight)
})
</script>

<template>
  <div ref="navRoot" data-nav-chrome class="fixed top-0 left-0 w-full z-50" :class="tone && `nav-on-${tone}`">
    <!-- Franja sólida detrás del notch/status bar, sin depender de blur -->
    <div class="nav-solid bg-paper" style="height: env(safe-area-inset-top);" />

    <nav class="relative border-b border-ink/10 md:border-b-0" style="overflow: clip;">
      <!-- Mobile: sólido, sin blur (falla en iOS Safari durante scroll) -->
      <div class="nav-solid md:hidden absolute inset-0 bg-paper pointer-events-none" />

      <!--
        Desktop: sin fondo propio. El contenedor es puro layout — las
        pastillas (CoreControl `glass`) llevan su propio glass. El logo y el
        switch ES/EN, que sí quedan sueltos sobre contenido que puede ser una
        foto (ver /about), migran acá la función de contraste que antes daba
        el degradado del contenedor: cada uno lleva su propio drop-shadow
        (BrandLogo, CoreToggle) en vez de depender de una capa de blur
        compartida.
      -->

      <div class="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-6 md:px-12 py-4">
        <NuxtLink
          to="/"
          :data-cursor="isAdminRoute ? undefined : t('home')"
          :class="isAdminRoute ? 'col-start-1 justify-self-start md:col-start-2 md:justify-self-center' : 'col-start-1 justify-self-start'"
        >
          <BrandLogo class="h-6 w-auto text-ink" />
        </NuxtLink>

        <!--
          Navegar es la acción más frecuente del sitio (Biblia, "Presupuesto
          de novedad": ~90% familiar / 10% novedad, y la novedad rinde por
          contraste — si está en todas partes deja de destacar en ningún
          lado). Estas pastillas ya no llevan CoreSwapLabel: solo el paso de
          color 150ms que Control.vue aplica por defecto.
        -->
        <div v-if="!isAdminRoute" class="hidden md:flex items-center justify-self-center gap-1.5">
          <CoreControl to="/about" :variant="route.path === '/about' ? 'solid' : 'soft'" glass :aria-label="t('about')">
            {{ t('about') }}
          </CoreControl>
          <NavDot />
          <CoreControl to="/work" :variant="route.path === '/work' ? 'solid' : 'soft'" glass :aria-label="t('work')">
            {{ t('work') }}
          </CoreControl>
        </div>

        <div v-if="!isAdminRoute" class="hidden md:flex items-center justify-self-end gap-4">
          <!-- `link` en Navbar: mismo trato de navegación que las pastillas de
               arriba, sin relevo. `underline` vuelve a su default (true) —
               ya no hay conflicto de relevo bajo el subrayado que justificara
               apagarlo (ver Control.vue). -->
          <CoreControl variant="link" to="/contact" :aria-label="t('contact')">
            {{ t('contact') }}
          </CoreControl>
          <CoreControl variant="link" :to="linkedinHref" target="_blank" rel="noopener noreferrer" :aria-label="t('linkedin')">
            {{ t('linkedin') }}
          </CoreControl>
          <CoreToggle v-model="lang" />
        </div>

        <!-- Mobile: solo el switch de idioma (el resto vive en el Dock) -->
        <div v-if="!isAdminRoute" class="md:hidden col-start-3 flex items-center justify-self-end">
          <CoreToggle v-model="lang" />
        </div>

        <div v-else-if="showLogout" class="col-start-3 flex items-center justify-self-end">
          <CoreControl variant="outline" glass aria-label="Salir" @click="showLogoutConfirm = true">
            Salir
          </CoreControl>
        </div>
      </div>
    </nav>

    <AdminConfirmModal
      :open="showLogoutConfirm"
      icon="logout"
      title="Cerrar sesión"
      message="¿Seguro que quieres cerrar sesión?"
      confirm-label="Cerrar sesión"
      @confirm="handleLogout"
      @cancel="showLogoutConfirm = false"
    />
  </div>
</template>