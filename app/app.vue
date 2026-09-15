<!-- app/app.vue -->
<script setup lang="ts">
import { ScrollTrigger } from 'gsap/ScrollTrigger'

const route = useRoute()
const isAdminRoute = computed(() => route.path.startsWith('/admin'))

// Defense in depth alongside robots.txt: the admin panel must never be indexed.
// Done here rather than in the `admin` middleware so /admin/login (which has no
// middleware) is covered too.
useSeoMeta({
  robots: () => (isAdminRoute.value ? 'noindex, nofollow' : null),
})

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
    <NavDock v-if="!isAdminRoute" />
    <CoreCursor v-if="!isAdminRoute" />
  </div>
</template>

<style>
:root {
  --navbar-height: 96px;
}

.page-enter-active,
.page-leave-active {
  transition: opacity 0.45s cubic-bezier(0.16, 1, 0.3, 1), transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
}
.page-enter-from {
  opacity: 0;
  transform: translateY(12px);
}
.page-leave-to {
  opacity: 0;
  transform: translateY(-12px);
}
@media (prefers-reduced-motion: reduce) {
  .page-enter-active,
  .page-leave-active {
    transition: none;
  }
}
</style>