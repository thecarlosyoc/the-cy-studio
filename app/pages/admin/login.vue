<script setup lang="ts">
const email = ref('')
const password = ref('')
const remember = ref(false)
const errorMessage = ref('')
const loading = ref(false)
const emailInputEl = ref<HTMLInputElement | null>(null)

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
    await nextTick()
    emailInputEl.value?.focus()
  } finally {
    loading.value = false
  }
}
</script>

<!--
  Reuses the site's existing card language instead of inventing a new one:
  same rounded-[28px] border border-ink/15 box as the WhatsApp CTA and the
  success state on /contact, same uppercase-label-above-input pattern as the
  contact form, same pt-28/md:pt-32/pb-24 navbar clearance as other pages.
  The navbar already centers the wordmark on admin routes (see Navbar.vue),
  so no logo is duplicated inside the card.
-->
<template>
  <div class="bg-paper min-h-screen flex items-center justify-center px-6 pt-28 md:pt-32 pb-24">
    <div class="w-full max-w-sm rounded-[28px] border border-ink/15 p-8 md:p-10">
      <h1 class="font-display font-bold text-2xl text-ink">Admin</h1>
      <p class="mt-1 text-sm text-ink-soft">Acceso privado del estudio.</p>

      <form @submit.prevent="handleLogin" class="mt-8 space-y-5">
        <div>
          <label for="login-email" class="block font-display font-bold text-sm uppercase tracking-wide text-ink">
            Email
          </label>
          <input
            id="login-email"
            ref="emailInputEl"
            v-model="email"
            type="email"
            required
            autocomplete="username"
            spellcheck="false"
            class="mt-2 w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-cobalt/60"
          />
        </div>

        <div>
          <label for="login-password" class="block font-display font-bold text-sm uppercase tracking-wide text-ink">
            Contraseña
          </label>
          <input
            id="login-password"
            v-model="password"
            type="password"
            required
            autocomplete="current-password"
            class="mt-2 w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-cobalt/60"
          />
        </div>

        <label class="-my-2 flex items-center gap-2 py-2 text-sm text-ink-soft select-none">
          <input
            type="checkbox"
            v-model="remember"
            class="h-4 w-4 rounded border-ink/30 accent-cobalt focus-visible:ring-2 focus-visible:ring-cobalt/60 focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
          />
          Recordar mis datos
        </label>

        <p v-if="errorMessage" role="alert" class="text-sm text-red-700">{{ errorMessage }}</p>

        <CoreControl type="submit" variant="solid" :disabled="loading" :aria-busy="loading" class="w-full text-center">
          {{ loading ? 'Entrando…' : 'Entrar' }}
        </CoreControl>
      </form>
    </div>
  </div>
</template>
