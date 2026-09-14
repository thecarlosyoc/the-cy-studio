<script setup lang="ts">
import { dict } from '~/data/i18n'

const t = useT()

const seoTitle = 'Contacto — the CY studio'
const seoDescription = dict.es.contactHeroText

useSeoMeta({
  title: seoTitle,
  description: seoDescription,
  ogTitle: seoTitle,
  ogDescription: seoDescription,
  ogType: 'website',
  twitterCard: 'summary_large_image',
  twitterTitle: seoTitle,
  twitterDescription: seoDescription,
})

const form = reactive({ name: '', email: '', message: '', company: '' })
const sending = ref(false)
const sent = ref(false)
const errorMessage = ref('')

async function handleSubmit() {
  sending.value = true
  errorMessage.value = ''
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: { name: form.name, email: form.email, message: form.message, company: form.company },
    })
    sent.value = true
  } catch {
    errorMessage.value = t('contactError')
  } finally {
    sending.value = false
  }
}
</script>

<template>
  <div class="bg-paper min-h-screen pt-28 md:pt-32 pb-24">
    <div class="px-6 md:px-16 max-w-2xl mx-auto">
      <h1 class="font-display font-bold text-[40px] md:text-[64px] leading-tight text-ink break-words">
        {{ t('contactHeroTitle') }}
      </h1>
      <p class="mt-4 text-ink-soft text-lg">
        {{ t('contactHeroText') }}
      </p>

      <div v-if="sent" class="mt-12 rounded-[28px] border border-ink/15 p-8 md:p-10">
        <h2 class="font-display font-bold text-2xl text-ink">{{ t('contactSuccessTitle') }}</h2>
        <p class="mt-2 text-ink-soft">{{ t('contactSuccessText') }}</p>
      </div>

      <form v-else @submit.prevent="handleSubmit" class="mt-12 space-y-5">
        <div>
          <label class="block font-display font-bold text-sm uppercase tracking-wide text-ink">
            {{ t('contactNameLabel') }}
          </label>
          <input
            v-model="form.name"
            type="text"
            required
            class="mt-2 w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
        </div>

        <div>
          <label class="block font-display font-bold text-sm uppercase tracking-wide text-ink">
            {{ t('contactEmailLabel') }}
          </label>
          <input
            v-model="form.email"
            type="email"
            required
            class="mt-2 w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
        </div>

        <div>
          <label class="block font-display font-bold text-sm uppercase tracking-wide text-ink">
            {{ t('contactMessageLabel') }}
          </label>
          <textarea
            v-model="form.message"
            rows="6"
            required
            class="mt-2 w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
        </div>

        <!-- Honeypot: hidden from real visitors, bots often fill every field. -->
        <div class="absolute -left-[9999px]" aria-hidden="true">
          <input v-model="form.company" type="text" tabindex="-1" autocomplete="off" />
        </div>

        <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>

        <CoreControl variant="solid" class="w-full text-center" @click="handleSubmit">
          {{ sending ? t('contactSending') : t('contactSubmit') }}
        </CoreControl>
      </form>
    </div>
  </div>
</template>
