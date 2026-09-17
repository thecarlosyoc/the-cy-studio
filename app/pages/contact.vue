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
const successHeadingEl = ref<HTMLElement | null>(null)

async function handleSubmit() {
  sending.value = true
  errorMessage.value = ''
  try {
    await $fetch('/api/contact', {
      method: 'POST',
      body: { name: form.name, email: form.email, message: form.message, company: form.company },
    })
    sent.value = true
    await nextTick()
    successHeadingEl.value?.focus()
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
  <div class="bg-paper min-h-screen pt-28 md:pt-32 pb-24 flex items-center">
    <div class="px-6 md:px-12 max-w-5xl mx-auto w-full">
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
              class="shrink-0 flex items-center gap-2 rounded-full bg-ink/10 px-5 py-2.5 text-sm font-medium text-ink transition-colors duration-200 group-hover:bg-paper/20 group-hover:text-paper"
            >
              {{ t('whatsappButton') }}
              <svg viewBox="0 0 24 24" class="h-4 w-4 fill-current" aria-hidden="true" focusable="false">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12.05 21.785h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884zm8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413z" />
              </svg>
            </span>
          </a>
        </div>

        <div class="mt-10 lg:mt-0">
          <div v-if="sent" role="status" aria-live="polite" class="rounded-[28px] border border-ink/15 p-8 md:p-10">
            <h2 ref="successHeadingEl" tabindex="-1" class="font-display font-bold text-2xl text-ink focus:outline-none">{{ t('contactSuccessTitle') }}</h2>
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
                class="mt-2 w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-cobalt/60"
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
                class="mt-2 w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-cobalt/60"
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
                class="mt-2 w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-cobalt/60"
              />
            </div>

            <!-- Honeypot: hidden from real visitors, bots often fill every field. -->
            <div class="absolute -left-[9999px]" aria-hidden="true">
              <input v-model="form.company" type="text" tabindex="-1" autocomplete="off" />
            </div>

            <p v-if="errorMessage" role="alert" class="text-sm text-red-700">{{ errorMessage }}</p>

            <CoreControl
              type="submit"
              variant="solid"
              :disabled="sending"
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