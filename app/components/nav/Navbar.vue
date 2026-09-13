<!-- app/components/nav/Navbar.vue -->
<script setup lang="ts">
const route = useRoute()
const lang = ref<'es' | 'en'>('es')
</script>

<template>
  <nav class="fixed top-0 left-0 w-full z-50">
    <div
      class="absolute inset-0 backdrop-blur-md backdrop-saturate-150 pointer-events-none"
      style="
        background: linear-gradient(180deg, rgba(18, 17, 14, 0.07) 13.94%, rgba(255, 255, 255, 0) 100%);
        mask-image: linear-gradient(180deg, black 0%, black 40%, transparent 100%);
        -webkit-mask-image: linear-gradient(180deg, black 0%, black 40%, transparent 100%);
      "
    />

    <div class="relative grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] items-center gap-4 px-12 py-4">
      <NuxtLink to="/" class="justify-self-center md:justify-self-start">
        <BrandLogo class="h-6 w-auto text-ink" />
      </NuxtLink>

      <div class="hidden md:flex items-center justify-self-center gap-1.5">
        <CoreControl to="/about" :variant="route.path === '/about' ? 'solid' : 'soft'">
          Sobre mi
        </CoreControl>
        <CoreDot />
        <CoreControl to="/work" :variant="route.path === '/work' ? 'solid' : 'soft'">
          Trabajo
        </CoreControl>
      </div>

      <div class="hidden md:flex items-center justify-self-end gap-4">
        <CoreControl variant="link">Email</CoreControl>
        <CoreControl variant="link">In</CoreControl>
        <CoreToggle v-model="lang" />
      </div>
    </div>
  </nav>
</template>