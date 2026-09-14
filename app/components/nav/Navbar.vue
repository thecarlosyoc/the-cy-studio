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
  <div ref="navRoot" class="fixed top-0 left-0 w-full z-50">
    <!-- Franja sólida detrás del notch/status bar, sin depender de blur -->
    <div class="bg-paper" style="height: env(safe-area-inset-top);" />

    <nav class="relative border-b border-ink/10 md:border-b-0" style="overflow: clip;">
      <!-- Mobile: sólido, sin blur (falla en iOS Safari durante scroll) -->
      <div class="md:hidden absolute inset-0 bg-paper pointer-events-none" />

      <!-- Desktop: glass con fade, fuerte arriba y desvanece hacia abajo -->
      <div
        class="hidden md:block absolute inset-0 pointer-events-none"
        style="
          backdrop-filter: blur(12px) saturate(1.5);
          -webkit-backdrop-filter: blur(12px) saturate(1.5);
          background: linear-gradient(180deg, rgba(241, 239, 234, 0.9) 0%, rgba(241, 239, 234, 0.5) 55%, rgba(241, 239, 234, 0) 100%);
          mask-image: linear-gradient(180deg, black 0%, black 45%, transparent 100%);
          -webkit-mask-image: linear-gradient(180deg, black 0%, black 45%, transparent 100%);
        "
      />

      <div class="relative grid grid-cols-[1fr_auto_1fr] items-center gap-4 px-12 py-4">
        <NuxtLink
          to="/"
          :class="isAdminRoute ? 'col-start-2 justify-self-center' : 'col-start-1 justify-self-start'"
        >
          <BrandLogo class="h-6 w-auto text-ink" />
        </NuxtLink>

        <div v-if="!isAdminRoute" class="hidden md:flex items-center justify-self-center gap-1.5">
          <CoreControl to="/about" :variant="route.path === '/about' ? 'solid' : 'soft'">
            {{ t('about') }}
          </CoreControl>
          <CoreDot />
          <CoreControl to="/work" :variant="route.path === '/work' ? 'solid' : 'soft'">
            {{ t('work') }}
          </CoreControl>
        </div>

        <div v-if="!isAdminRoute" class="hidden md:flex items-center justify-self-end gap-4">
          <CoreControl variant="link" to="/contact">{{ t('contact') }}</CoreControl>
          <CoreControl variant="link" :to="linkedinHref" target="_blank" rel="noopener noreferrer">{{ t('linkedin') }}</CoreControl>
          <CoreToggle v-model="lang" />
        </div>

        <!-- Mobile: solo el switch de idioma (el resto vive en el Dock) -->
        <div v-if="!isAdminRoute" class="md:hidden col-start-3 flex items-center justify-self-end">
          <CoreToggle v-model="lang" />
        </div>

        <div v-else-if="showLogout" class="col-start-3 flex items-center justify-self-end">
          <CoreControl variant="outline" @click="showLogoutConfirm = true">Salir</CoreControl>
        </div>
      </div>
    </nav>

    <AdminConfirmModal
      :open="showLogoutConfirm"
      title="Cerrar sesión"
      message="¿Seguro que quieres cerrar sesión?"
      confirm-label="Cerrar sesión"
      @confirm="handleLogout"
      @cancel="showLogoutConfirm = false"
    />
  </div>
</template>