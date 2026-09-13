<script setup lang="ts">
definePageMeta({ middleware: 'admin' })

const { data: me } = await useFetch('/api/admin/me', {
  headers: useRequestHeaders(['cookie']),
})

async function handleLogout() {
  await $fetch('/api/admin/logout', { method: 'POST' })
  await navigateTo('/admin/login')
}
</script>

<template>
  <div class="bg-paper min-h-screen px-6 md:px-12 pt-32 pb-24">
    <div class="flex items-center justify-between">
      <h1 class="font-display font-bold text-3xl text-ink">Admin</h1>
      <CoreControl variant="outline" @click="handleLogout">Salir</CoreControl>
    </div>
    <p class="mt-2 text-ink-soft">Conectado como {{ me?.email }}</p>
  </div>
</template>
