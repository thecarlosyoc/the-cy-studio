<script setup lang="ts">
import { PHOTO_KEYS, PHOTO_SLOTS, type PhotoKey } from '#shared/utils/photos'

const { photo, refresh } = await useSitePhotos()
const { show: showToast } = useAdminToast()

const SLOTS = PHOTO_KEYS.map((key) => ({ key, ...PHOTO_SLOTS[key] }))

const busy = ref<string | null>(null)
const error = ref('')

async function onPick(key: PhotoKey, event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return

  busy.value = key
  error.value = ''
  try {
    const { url } = await uploadToBucket(file)
    await $fetch(`/api/admin/site-photos/${key}`, { method: 'PUT', body: { url } })
    await refresh()
    showToast('Foto actualizada.')
  } catch (err: any) {
    error.value = err?.data?.statusMessage || err?.statusMessage || 'No se pudo subir la foto.'
  } finally {
    busy.value = null
  }
}
</script>

<template>
  <div>
    <div class="flex flex-wrap items-start gap-10">
      <div v-for="s in SLOTS" :key="s.key" class="max-w-xs">
        <p class="text-ink font-medium">{{ s.label }}</p>
        <p class="mt-1 text-xs text-ink/50">{{ s.hint }}</p>
        <p v-if="s.altKey" class="mt-1 text-xs text-ink/50">
          El encuadre es fijo: el sitio siempre muestra la misma zona de la foto. La descripción para lectores de pantalla se edita en Textos.
        </p>
        <!-- Solo preview: alto máximo fijo y ancho automático, así conserva el ratio real de la imagen. -->
        <img :src="photo(s.key)" :alt="`Foto actual: ${s.label}`" class="mt-3 h-40 max-w-full w-auto rounded-xl bg-ink/5" />
        <label
          class="mt-3 inline-block rounded-xl px-3.5 py-2.5 text-sm bg-ink/5 text-ink-soft hover:bg-ink/10 transition-colors cursor-pointer"
          :class="busy && 'opacity-40 pointer-events-none'"
        >
          {{ busy === s.key ? 'Subiendo…' : 'Cambiar foto' }}
          <input type="file" accept="image/jpeg,image/png,image/webp" class="sr-only" :disabled="!!busy" @change="onPick(s.key, $event)" />
        </label>
      </div>
    </div>
    <p role="status" class="mt-4 text-sm text-red-600">{{ error }}</p>
  </div>
</template>
