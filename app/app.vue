<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger'

onMounted(() => {
  if (document.fonts?.ready) {
    document.fonts.ready.then(() => ScrollTrigger.refresh())
  }
  window.addEventListener('load', () => ScrollTrigger.refresh())
})
</script>

<template>
  <div class="bg-paper min-h-screen">
    <NavNavbar />
    <div class="pb-28 md:pb-0">
      <NuxtPage />
    </div>
    <NavDock class="md:hidden" />
  </div>
</template>