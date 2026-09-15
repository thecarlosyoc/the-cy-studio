<script setup lang="ts">
import type { GalleryColSpan, GalleryImage } from '#shared/types/content'

const props = defineProps<{
  modelValue: GalleryImage[]
}>()

const emit = defineEmits<{ 'update:modelValue': [GalleryImage[]] }>()

const COL_SPAN_OPTIONS: GalleryColSpan[] = [1, 2, 3]

const uploading = ref(false)
const uploadError = ref('')

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  uploading.value = true
  uploadError.value = ''
  try {
    const form = new FormData()
    form.append('file', file)
    const { url } = await $fetch<{ url: string }>('/api/admin/upload', { method: 'POST', body: form })
    emit('update:modelValue', [...props.modelValue, { url, colSpan: 1 }])
  } catch (err: any) {
    uploadError.value = err?.data?.statusMessage || err?.statusMessage || 'No se pudo subir la imagen.'
  } finally {
    uploading.value = false
    input.value = ''
  }
}

function removeAt(index: number) {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== index))
}

function move(index: number, delta: number) {
  const target = index + delta
  if (target < 0 || target >= props.modelValue.length) return
  const next = [...props.modelValue]
  ;[next[index], next[target]] = [next[target]!, next[index]!]
  emit('update:modelValue', next)
}

function setColSpan(index: number, colSpan: GalleryColSpan) {
  const next = [...props.modelValue]
  next[index] = { ...next[index]!, colSpan }
  emit('update:modelValue', next)
}

const dragIndex = ref<number | null>(null)
const dragOverIndex = ref<number | null>(null)

function onDragStart(index: number) {
  dragIndex.value = index
}

function onDrop(index: number) {
  dragOverIndex.value = null
  if (dragIndex.value === null || dragIndex.value === index) return
  const next = [...props.modelValue]
  const [moved] = next.splice(dragIndex.value, 1)
  next.splice(index, 0, moved!)
  emit('update:modelValue', next)
  dragIndex.value = null
}
</script>

<template>
  <div>
    <div class="flex items-baseline gap-2">
      <label class="font-display font-bold text-sm uppercase tracking-wide text-ink">Galería</label>
      <span class="text-xs text-ink-soft/60">Columnas, mover y eliminar</span>
    </div>
    <p class="mt-1 text-xs text-ink-soft/60">
      En mobile el grid solo tiene 2 columnas: las imágenes de 2 o 3 columnas ocupan todo el ancho de la pantalla igual.
    </p>

    <div class="mt-2 space-y-2">
      <div
        v-for="(img, index) in modelValue"
        :key="img.url + index"
        draggable="true"
        class="flex items-center gap-3 bg-ink/5 rounded-xl p-2 cursor-grab active:cursor-grabbing transition-colors"
        :class="dragOverIndex === index && 'ring-2 ring-ink/30'"
        @dragstart="onDragStart(index)"
        @dragover.prevent="dragOverIndex = index"
        @dragleave="dragOverIndex = null"
        @drop="onDrop(index)"
      >
        <span class="text-ink-soft select-none" title="Arrastrar para reordenar">⠿</span>
        <img :src="img.url" class="w-16 h-16 object-cover rounded-lg" />
        <p class="flex-1 text-xs text-ink-soft truncate">{{ img.url }}</p>
        <div class="flex items-center gap-1 shrink-0" role="group" aria-label="Columnas que ocupa">
          <button
            v-for="span in COL_SPAN_OPTIONS"
            :key="span"
            type="button"
            class="w-7 h-7 rounded-md text-xs font-medium transition-colors"
            :class="img.colSpan === span ? 'bg-ink text-paper' : 'bg-ink/10 text-ink-soft hover:bg-ink/20'"
            :title="`${span} columna${span > 1 ? 's' : ''}`"
            @click="setColSpan(index, span)"
          >
            {{ span }}
          </button>
        </div>
        <button type="button" class="text-ink-soft hover:text-ink px-1" :disabled="index === 0" @click="move(index, -1)">↑</button>
        <button type="button" class="text-ink-soft hover:text-ink px-1" :disabled="index === modelValue.length - 1" @click="move(index, 1)">↓</button>
        <button
          type="button"
          title="Eliminar"
          aria-label="Eliminar imagen"
          class="shrink-0 rounded-lg p-1.5 text-red-600 hover:bg-red-600/10 transition-colors"
          @click="removeAt(index)"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 6H16M8 6V4.5C8 3.67157 8.67157 3 9.5 3H10.5C11.3284 3 12 3.67157 12 4.5V6M6 6V15.5C6 16.3284 6.67157 17 7.5 17H12.5C13.3284 17 14 16.3284 14 15.5V6"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>

    <div class="mt-3">
      <label class="inline-block cursor-pointer">
        <span class="font-body font-medium rounded-full px-6 py-3 bg-ink/5 text-ink hover:bg-ink/10 inline-block">
          {{ uploading ? 'Subiendo…' : '+ Subir imagen' }}
        </span>
        <input type="file" accept="image/*" class="hidden" :disabled="uploading" @change="handleFileChange" />
      </label>
      <p v-if="uploadError" class="mt-2 text-sm text-red-600">{{ uploadError }}</p>
    </div>
  </div>
</template>
