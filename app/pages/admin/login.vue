<script setup lang="ts">
const email = ref('')
const password = ref('')
const remember = ref(false)
const errorMessage = ref('')
const loading = ref(false)

async function handleLogin() {
  errorMessage.value = ''
  loading.value = true
  try {
    await $fetch('/api/admin/login', {
      method: 'POST',
      body: { email: email.value, password: password.value, remember: remember.value },
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
        class="w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-cobalt/60"
      />
      <input
        v-model="password"
        type="password"
        placeholder="Contraseña"
        required
        class="w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-cobalt/60"
      />

      <label class="inline-flex items-center gap-2 text-sm text-ink-soft">
        <input type="checkbox" v-model="remember" />
        Recordar mis datos
      </label>

      <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>

      <CoreControl type="submit" variant="solid" :disabled="loading" class="w-full text-center">
        {{ loading ? 'Entrando…' : 'Entrar' }}
      </CoreControl>
    </form>
  </div>
</template>
