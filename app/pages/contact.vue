<script setup lang="ts">
import { dict } from '~/data/i18n'

const t = useT()
const lang = useLang()

const whatsappHref = computed(() => {
  const message = lang.value === 'es' ? dict.es.whatsappPrefill : dict.en.whatsappPrefill
  return `https://wa.me/50245858629?text=${encodeURIComponent(message)}`
})

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

const whatsappIconEl = ref<HTMLElement | null>(null)
useMagnetic(whatsappIconEl)

const form = reactive({ name: '', email: '', message: '', company: '' })
const sending = ref(false)
const sent = ref(false)
const errorMessage = ref('')

// El botón de enviar queda disabled hasta que el formulario tenga datos
// válidos: nombre, un email con forma mínima y un mensaje. El campo `company`
// es el honeypot y no participa.
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const canSubmit = computed(
  () => form.name.trim().length > 0 && EMAIL_RE.test(form.email) && form.message.trim().length > 0,
)

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

<!--
  En desktop, dos columnas: a la izquierda el hero + CTA de WhatsApp; a la
  derecha el formulario. En móvil todo se apila en el mismo orden que tenía
  (hero, texto, WhatsApp, formulario).
-->
<template>
  <div class="bg-paper min-h-screen pt-28 md:pt-32 pb-24">
    <div class="px-6 md:px-16 max-w-5xl mx-auto">
      <div class="grid grid-cols-1 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 items-start">
        <div>
          <h1 class="font-display font-bold text-[40px] md:text-[56px] leading-tight text-ink break-words">
            {{ t('contactHeroTitle') }}
          </h1>
          <p class="mt-4 text-ink-soft text-lg">
            {{ t('contactHeroText') }}
          </p>

          <a
            :href="whatsappHref"
            target="_blank"
            rel="noopener noreferrer"
            class="group mt-8 flex items-center justify-between gap-4 rounded-[28px] border border-ink/15 p-6 md:p-8 transition-colors duration-200 hover:border-cobalt hover:bg-cobalt"
          >
            <div>
              <p class="font-display font-bold text-lg md:text-xl text-ink transition-colors duration-200 group-hover:text-paper">
                {{ t('whatsappTitle') }}
              </p>
              <p class="mt-1 text-ink-soft text-sm transition-colors duration-200 group-hover:text-paper/85">
                {{ t('whatsappSubtitle') }}
              </p>
            </div>
            <span
              ref="whatsappIconEl"
              class="shrink-0 rounded-full bg-ink/10 px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-200 group-hover:bg-paper/20 group-hover:text-paper"
            >
              {{ t('whatsappButton') }}
            </span>
          </a>
        </div>

        <div class="mt-10 lg:mt-0">
          <div v-if="sent" class="rounded-[28px] border border-ink/15 p-8 md:p-10">
            <h2 class="font-display font-bold text-2xl text-ink">{{ t('contactSuccessTitle') }}</h2>
            <p class="mt-2 text-ink-soft">{{ t('contactSuccessText') }}</p>
          </div>

          <form v-else @submit.prevent="handleSubmit" class="space-y-5">
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

            <CoreControl
              type="submit"
              variant="solid"
              :disabled="sending || !canSubmit"
              class="w-full text-center"
            >
              {{ sending ? t('contactSending') : t('contactSubmit') }}
            </CoreControl>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>