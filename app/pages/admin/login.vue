<script setup lang="ts">
const email = ref('')
const password = ref('')
const errorMessage = ref('')
const loading = ref(false)

async function handleLogin() {
  errorMessage.value = ''
  loading.value = true
  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: { email: email.value, password: password.value },
    })
    await navigateTo('/admin')
  } catch {
    errorMessage.value = 'Credenciales inválidas.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="bg-paper min-h-screen flex items-center justify-center px-6">
    <form @submit.prevent="handleLogin" class="w-full max-w-sm space-y-4">
      <h1 class="font-display font-bold text-2xl text-ink">Admin</h1>

      <input
        v-model="email"
        type="email"
        placeholder="Email"
        required
        class="w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-ink/20"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Contraseña"
        required
        class="w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-ink/20"
      />

      <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>

      <CoreControl variant="solid" class="w-full text-center" @click="handleLogin">
        {{ loading ? 'Entrando…' : 'Entrar' }}
      </CoreControl>
    </form>
  </div>
</template>
