<script setup lang="ts">
import type { WorkItem } from '#shared/types/content'

definePageMeta({ middleware: 'admin' })

const form = reactive<WorkItem>({
  slug: '',
  type: 'product',
  title: { es: '', en: '' },
  description: { es: '', en: '' },
  longDescription: { es: '', en: '' },
  role: [],
  tools: [],
  context: { es: '', en: '' },
  date: { es: '', en: '' },
  gallery: [],
  visuals: [],
})

const initialSnapshot = JSON.stringify(form)
const isDirty = computed(() => JSON.stringify(form) !== initialSnapshot)

const toolsText = computed({
  get: () => form.tools.join(', '),
  set: (value: string) => {
    form.tools = value.split(',').map((s) => s.trim()).filter(Boolean)
  },
})

const saving = ref(false)
const errorMessage = ref('')
const showSuccess = ref(false)

const { pendingConfirm, confirmLeave, cancelLeave, allowNextNavigation } = useUnsavedChangesGuard(isDirty)

async function handleSubmit() {
  saving.value = true
  errorMessage.value = ''
  try {
    await $fetch('/api/admin/work', { method: 'POST', body: form })
    showSuccess.value = true
    allowNextNavigation()
    setTimeout(() => navigateTo('/admin'), 1200)
  } catch (err: any) {
    errorMessage.value = err?.data?.statusMessage || err?.statusMessage || 'No se pudo crear el proyecto.'
  } finally {
    saving.value = false
  }
}
</script>

<template>
  <div class="bg-paper min-h-screen px-6 md:px-8 pt-28 pb-24 max-w-7xl mx-auto">
    <div class="flex items-center justify-between">
      <h1 class="font-display font-bold text-3xl text-ink">Nuevo proyecto</h1>
      <NuxtLink to="/admin" class="text-sm text-ink-soft hover:text-ink underline">Volver</NuxtLink>
    </div>

    <!-- Form 2/3 + preview fijo 1/3 en desktop: el form aprovecha el ancho. -->
    <div class="mt-8 grid grid-cols-1 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] gap-8 items-start">
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <div>
          <label class="block font-display font-bold text-sm uppercase tracking-wide text-ink">Tipo</label>
          <div class="mt-2 inline-flex gap-1.5 rounded-full bg-ink/5 p-1.5">
            <CoreControl :variant="form.type === 'product' ? 'solid' : 'soft'" @click="form.type = 'product'">Producto</CoreControl>
            <CoreControl :variant="form.type === 'brand' ? 'solid' : 'soft'" @click="form.type = 'brand'">Marca</CoreControl>
          </div>
        </div>

        <div>
          <label class="block font-display font-bold text-sm uppercase tracking-wide text-ink">Nombre de proyecto</label>
          <input
            v-model="form.slug"
            required
            class="mt-2 w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
        </div>

        <AdminLocalizedField label="Título" v-model="form.title" />
        <AdminLocalizedField label="Subtítulo" v-model="form.description" multiline />
        <AdminRepeatableLocalized label="Rol" v-model="form.role" />

        <div>
          <label class="block font-display font-bold text-sm uppercase tracking-wide text-ink">Herramientas</label>
          <input
            v-model="toolsText"
            placeholder="Figma, Notion, FigJam"
            class="mt-2 w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-ink/20"
          />
        </div>

        <AdminLocalizedField label="Fecha" v-model="form.date" />
        <AdminLocalizedField label="Descripción" v-model="form.longDescription" multiline />
        <AdminLocalizedField label="Contexto" v-model="form.context" multiline />
        <AdminGalleryEditor v-model="form.gallery" />
        <AdminVisualEditor v-model="form.visuals" :images="form.gallery" />

        <p v-if="errorMessage" class="text-sm text-red-600">{{ errorMessage }}</p>

        <CoreControl variant="solid" @click="handleSubmit">{{ saving ? 'Guardando…' : 'Crear proyecto' }}</CoreControl>
      </form>

      <AdminWorkPreview :item="form" />
    </div>

    <AdminSuccessModal :open="showSuccess" message="Proyecto creado" @close="navigateTo('/admin')" />

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
