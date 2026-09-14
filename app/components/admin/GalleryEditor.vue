<script setup lang="ts">
const props = defineProps<{
  modelValue: string[]
}>()

const emit = defineEmits<{ 'update:modelValue': [string[]] }>()

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
    emit('update:modelValue', [...props.modelValue, url])
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
    <label class="block font-display font-bold text-sm uppercase tracking-wide text-ink">Galería</label>

    <div class="mt-2 space-y-2">
      <div
        v-for="(url, index) in modelValue"
        :key="url + index"
        draggable="true"
        class="flex items-center gap-3 bg-ink/5 rounded-xl p-2 cursor-grab active:cursor-grabbing transition-colors"
        :class="dragOverIndex === index && 'ring-2 ring-ink/30'"
        @dragstart="onDragStart(index)"
        @dragover.prevent="dragOverIndex = index"
        @dragleave="dragOverIndex = null"
        @drop="onDrop(index)"
      >
        <span class="text-ink-soft select-none" title="Arrastrar para reordenar">⠿</span>
        <img :src="url" class="w-16 h-16 object-cover rounded-lg" />
        <p class="flex-1 text-xs text-ink-soft truncate">{{ url }}</p>
        <button type="button" class="text-ink-soft hover:text-ink px-1" :disabled="index === 0" @click="move(index, -1)">↑</button>
        <button type="button" class="text-ink-soft hover:text-ink px-1" :disabled="index === modelValue.length - 1" @click="move(index, 1)">↓</button>
        <button type="button" class="text-red-600 hover:underline px-1 text-sm" @click="removeAt(index)">Quitar</button>
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
