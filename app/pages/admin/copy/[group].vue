<script setup lang="ts">
import type { LocalizedText } from '#shared/types/content'
import { COPY_GROUPS } from '~/data/copyGroups'
import { dict } from '~/data/i18n'

definePageMeta({ middleware: 'admin' })

const route = useRoute()
const group = COPY_GROUPS.find((g) => g.id === route.params.group)
if (!group) throw createError({ statusCode: 404, statusMessage: 'Grupo no encontrado' })

const overrides = useState<Record<string, LocalizedText>>('site-copy', () => ({}))
// El admin puede llegar directo: pide los overrides frescos para no editar sobre valores viejos.
const fresh = await $fetch<Record<string, LocalizedText>>('/api/site-copy')

const form = reactive<Record<string, LocalizedText>>(
  Object.fromEntries(
    group.fields.map((f) => [f.key, { es: fresh[f.key]?.es || dict.es[f.key], en: fresh[f.key]?.en || dict.en[f.key] }]),
  ),
)
const initialSnapshot = JSON.stringify(form)
const isDirty = computed(() => JSON.stringify(form) !== initialSnapshot)

const saving = ref(false)
const errorMessage = ref('')
const showSuccess = ref(false)

async function handleSubmit() {
  saving.value = true
  errorMessage.value = ''
  try {
    await $fetch('/api/admin/site-copy', { method: 'PUT', body: form })
    overrides.value = { ...fresh, ...form }
    showSuccess.value = true
    setTimeout(() => navigateTo('/admin'), 1200)
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage || err?.statusMessage || 'No se pudo guardar.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="bg-paper min-h-screen px-6 md:px-12 pt-32 pb-24 max-w-3xl mx-auto">
    <div class="flex items-center justify-between">
      <h1 class="font-display font-bold text-3xl text-ink">{{ group!.label }}</h1>
      <NuxtLink to="/admin" class="text-sm text-ink-soft hover:text-ink underline">Volver</NuxtLink>
    </div>

    <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
      <AdminLocalizedField v-for="f in group!.fields" :key="f.key" v-model="form[f.key]!" :label="f.label" :multiline="f.multiline" />

      <p v-if="errorMessage" class="text-sm text-red-700">{{ errorMessage }}</p>

      <CoreControl :variant="isDirty ? 'solid' : 'soft'" :disabled="!isDirty || saving" @click="handleSubmit">
        {{ saving ? 'Guardando…' : 'Guardar cambios' }}
      </CoreControl>
    </form>

    <AdminSuccessModal :open="showSuccess" message="Texto actualizado" @close="navigateTo('/admin')" />
  </div>
</template>
