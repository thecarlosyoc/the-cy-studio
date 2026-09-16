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
  demoUrl: undefined,
})

const initialSnapshot = JSON.stringify(form)
const isDirty = computed(() => JSON.stringify(form) !== initialSnapshot)

const activeTab = ref<'info' | 'gallery'>('info')
const isMarca = computed({
  get: () => form.type === 'brand',
  set: (value: boolean) => {
    form.type = value ? 'brand' : 'product'
  },
})

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
        <!-- Navegación por secciones: información del proyecto / galería -->
        <div class="inline-flex gap-1.5 rounded-full bg-ink/5 p-1.5" role="group" aria-label="Secciones del proyecto">
          <CoreControl :variant="activeTab === 'info' ? 'solid' : 'soft'" :aria-pressed="activeTab === 'info'" @click="activeTab = 'info'">
            <span class="inline-flex items-center gap-1.5">
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                <circle cx="10" cy="10" r="7.25" stroke="currentColor" stroke-width="1.5" />
                <path d="M10 9.2V13M10 6.4V6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
              Información del proyecto
            </span>
          </CoreControl>
          <CoreControl :variant="activeTab === 'gallery' ? 'solid' : 'soft'" :aria-pressed="activeTab === 'gallery'" @click="activeTab = 'gallery'">
            <span class="inline-flex items-center gap-1.5">
              <svg width="15" height="15" viewBox="0 0 20 20" fill="none">
                <rect x="2.75" y="3.75" width="14.5" height="12.5" rx="2" stroke="currentColor" stroke-width="1.5" />
                <circle cx="7" cy="8" r="1.25" stroke="currentColor" stroke-width="1.5" />
                <path d="M4.5 14L8.5 9.5L11.5 12.5L13.5 10.5L15.5 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
              </svg>
              Galería del proyecto
            </span>
          </CoreControl>
        </div>

        <!-- Panel: información del proyecto -->
        <div v-if="activeTab === 'info'" class="space-y-6">
          <div>
            <label class="block font-display font-bold text-sm uppercase tracking-wide text-ink">Tipo</label>
            <label class="mt-2 inline-flex items-center gap-2 text-ink-soft cursor-pointer select-none">
              <input
                v-model="isMarca"
                type="checkbox"
                class="w-4 h-4 accent-ink rounded cursor-pointer"
              />
              Es una marca
            </label>
            <p class="mt-1 text-xs text-ink-soft/80">Sin marcar, el proyecto es un producto.</p>
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

          <div>
            <label class="block font-display font-bold text-sm uppercase tracking-wide text-ink">Link de demo</label>
            <input
              v-model="form.demoUrl"
              type="url"
              placeholder="https://…"
              class="mt-2 w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-ink/20"
            />
            <p class="mt-1.5 text-xs text-ink-soft/80">Si está vacío, no se muestra el botón "Ver en acción" en el proyecto.</p>
          </div>
        </div>

        <!-- Panel: galería del proyecto -->
        <div v-else class="space-y-6">
          <AdminGalleryEditor v-model="form.gallery" />
          <AdminVisualEditor v-model="form.visuals" :images="form.gallery" />
        </div>

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
