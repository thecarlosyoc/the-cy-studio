<script setup lang="ts">
import type { AboutSectionAdmin } from '#shared/types/content'

definePageMeta({ middleware: 'admin' })

const route = useRoute()
const { data: section } = await useFetch<AboutSectionAdmin>(`/api/admin/about/${route.params.id}`, {
  headers: useRequestHeaders(['cookie']),
})

if (!section.value) {
  throw createError({ statusCode: 404, statusMessage: 'About section not found' })
}

const form = reactive<AboutSectionAdmin>({ ...section.value })
const initialSnapshot = JSON.stringify(section.value)
const isDirty = computed(() => JSON.stringify(form) !== initialSnapshot)

const saving = ref(false)
const errorMessage = ref('')
const showSuccess = ref(false)

const { pendingConfirm, confirmLeave, cancelLeave, allowNextNavigation } = useUnsavedChangesGuard(isDirty)

async function handleSubmit() {
  saving.value = true
  errorMessage.value = ''
  try {
    await $fetch(`/api/admin/about/${form.id}`, { method: 'PATCH', body: form })
    showSuccess.value = true
    allowNextNavigation()
    setTimeout(() => navigateTo('/admin'), 1200)
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage || err?.statusMessage || 'No se pudo guardar la sección.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="bg-paper min-h-screen px-6 md:px-12 pt-32 pb-24 max-w-3xl mx-auto">
    <div class="flex items-center justify-between">
      <h1 class="font-display font-bold text-3xl text-ink">Editar sección</h1>
      <NuxtLink to="/admin" class="text-sm text-ink-soft hover:text-ink underline">Volver</NuxtLink>
    </div>

    <form @submit.prevent="handleSubmit" class="mt-8 space-y-6">
      <AdminLocalizedField label="Label" v-model="form.label" />

      <AdminLocalizedField v-if="form.heading" label="Heading" v-model="form.heading" />

      <AdminRepeatableLocalized label="Párrafos" v-model="form.paragraphs" multiline />

      <div v-if="form.ctaLabel" class="space-y-3">
        <AdminLocalizedField label="Texto del CTA" v-model="form.ctaLabel" />
        <div>
          <label class="block font-display font-bold text-sm uppercase tracking-wide text-ink">Ruta del CTA</label>
          <input
            v-model="form.ctaTo"
            placeholder="/work"
            class="mt-2 w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
        </div>
      </div>

      <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>

      <CoreControl :variant="isDirty ? 'solid' : 'soft'" :disabled="!isDirty || saving" @click="handleSubmit">
        {{ saving ? 'Guardando…' : 'Guardar cambios' }}
      </CoreControl>
    </form>

    <AdminSuccessModal :open="showSuccess" message="Sección actualizada" @close="navigateTo('/admin')" />

    <AdminConfirmModal
      :open="pendingConfirm"
      title="Cambios sin guardar"
      message="Tienes cambios sin guardar. Si sales ahora, se van a perder."
      confirm-label="Salir sin guardar"
      cancel-label="Seguir editando"
      @confirm="confirmLeave"
      @cancel="cancelLeave"
    />
  </div>
</template>
