<script setup lang="ts">
const route = useRoute()
const lang = useLang()
const t = useT()

const user = 'thecarlosyoc'
const domain = 'gmail.com'
const mailHref = computed(() => `mailto:${user}@${domain}`)
const linkedinHref = 'https://www.linkedin.com/in/carlosyoc'

const isAdminRoute = computed(() => route.path.startsWith('/admin'))
const showLogout = computed(() => isAdminRoute.value && route.path !== '/admin/login')

const showLogoutConfirm = ref(false)

async function handleLogout() {
  showLogoutConfirm.value = false
  await $fetch('/api/admin/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="fixed top-0 left-0 w-full z-50">
    <!-- Franja sólida detrás del notch/status bar, sin depender de blur -->
    <div class="bg-paper" style="height: env(safe-area-inset-top);" />

    <nav class="relative">
      <div
        class="absolute inset-0 backdrop-blur-md backdrop-saturate-150 pointer-events-none"
        style="background-color: rgba(255, 255, 255, 0.001); -webkit-backdrop-filter: blur(12px) saturate(1.5);"
      />

      <div
        class="absolute inset-0 pointer-events-none"
        style="
          background: linear-gradient(180deg, rgba(18, 17, 14, 0.07) 13.94%, rgba(255, 255, 255, 0) 100%);
          mask-image: linear-gradient(180deg, black 0%, black 40%, transparent 100%);
          -webkit-mask-image: linear-gradient(180deg, black 0%, black 40%, transparent 100%);
        "
      />

      <div
        class="relative grid items-center gap-4 px-12 py-4"
        :class="isAdminRoute ? 'grid-cols-[1fr_auto_1fr]' : 'grid-cols-1 md:grid-cols-[1fr_auto_1fr]'"
      >
        <NuxtLink
          to="/"
          class="justify-self-center"
          :class="isAdminRoute ? 'col-start-2' : 'md:justify-self-start'"
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
          <CoreControl variant="link" :to="mailHref">{{ t('email') }}</CoreControl>
          <CoreControl variant="link" :to="linkedinHref" target="_blank" rel="noopener noreferrer">{{ t('linkedin') }}</CoreControl>
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