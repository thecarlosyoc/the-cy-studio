<!-- app/app.vue -->
<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

onMounted(() => {
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }
  window.addEventListener('load', () => ScrollTrigger.refresh())
})
</script>

<template>
  <div class="bg-paper min-h-screen" style="overflow-x: clip;">
    <NavNavbar />
    <div :class="isAdminRoute ? '' : 'pb-28 md:pb-0'">
      <NuxtPage />
    </div>
    <NavDock v-if="!isAdminRoute" class="md:hidden" />
  </div>
</template>

<style>
:root {
  --navbar-height: 96px;
}
</style>