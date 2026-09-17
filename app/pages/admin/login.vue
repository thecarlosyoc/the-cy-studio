<script setup lang="ts">
const email = ref('')
const password = ref('')
const remember = ref(false)
const showPassword = ref(false)
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
          <div class="relative mt-2">
            <input
              id="login-password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              required
              autocomplete="current-password"
              class="w-full rounded-xl bg-ink/5 px-4 py-3 pr-12 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-cobalt/60"
            />
            <button
              type="button"
              :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              class="absolute inset-y-0 right-0 flex w-11 items-center justify-center rounded-r-xl text-ink-soft hover:text-ink focus:outline-none focus-visible:ring-2 focus-visible:ring-cobalt focus-visible:ring-offset-2 focus-visible:ring-offset-paper"
              @click="showPassword = !showPassword"
            >
              <svg v-if="!showPassword" width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M1.5 10S4.5 4 10 4s8.5 6 8.5 6-3 6-8.5 6-8.5-6-8.5-6Z" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5" />
              </svg>
              <svg v-else width="18" height="18" viewBox="0 0 20 20" fill="none">
                <path d="M2.5 2.5l15 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
                <path d="M8.4 4.2A8.6 8.6 0 0 1 10 4c5.5 0 8.5 6 8.5 6a13.9 13.9 0 0 1-2.6 3.4M5.6 5.6C3 7.2 1.5 10 1.5 10s3 6 8.5 6a8.4 8.4 0 0 0 3.1-.6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
                <path d="M8.1 8.1a2.5 2.5 0 0 0 3.5 3.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
            </button>
          </div>
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

<style scoped>
/* Edge ships a native reveal/clear icon on password inputs that would
   overlap this file's custom toggle button and desync from showPassword. */
input[type='password']::-ms-reveal,
input[type='password']::-ms-clear {
  display: none;
}
</style>
