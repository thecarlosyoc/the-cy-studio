<!-- app/components/nav/Navbar.vue -->
<script setup lang="ts">
const route = useRoute()
</script>

<template>
  <nav
    class="flex w-full items-center justify-between px-6 py-4"
    style="background: linear-gradient(180deg, rgba(18, 17, 14, 0.07) 13.94%, rgba(255, 255, 255, 0) 100%);"
  >
    <BrandLogo class="h-6 w-auto text-ink" />

    <div class="flex flex-1 items-center justify-center gap-1.5">
      <CoreControl
        to="/about"
        :variant="route.path === '/about' ? 'solid' : 'soft'"
      >
        Sobre mi
      </CoreControl>
      <CoreDot />
      <CoreControl
        to="/work"
        :variant="route.path === '/work' ? 'solid' : 'soft'"
      >
        Trabajo
      </CoreControl>
    </div>

    <div class="flex items-center gap-4">
      <CoreControl variant="link">Email</CoreControl>
      <CoreControl variant="link">In</CoreControl>
      <CoreToggle v-model="lang" />
    </div>
  </nav>
</template>