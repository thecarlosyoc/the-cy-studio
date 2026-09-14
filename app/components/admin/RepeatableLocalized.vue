<script setup lang="ts">
import type { LocalizedText } from '#shared/types/content'

const props = defineProps<{
  label: string
  modelValue: LocalizedText[]
  multiline?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [LocalizedText[]] }>()

function updateRow(index: number, lang: 'es' | 'en', value: string) {
  const next = props.modelValue.map((row, i) => (i === index ? { ...row, [lang]: value } : row))
  emit('update:modelValue', next)
}

function addRow() {
  emit('update:modelValue', [...props.modelValue, { es: '', en: '' }])
}

function removeRow(index: number) {
  emit('update:modelValue', props.modelValue.filter((_, i) => i !== index))
}
</script>

<template>
  <div>
    <div class="flex items-center justify-between">
      <label class="block font-display font-bold text-sm uppercase tracking-wide text-ink">{{ label }}</label>
      <button type="button" class="text-sm text-ink-soft hover:text-ink underline" @click="addRow">
        + Agregar
      </button>
    </div>

    <div class="mt-2 space-y-2">
      <div
        v-for="(row, index) in modelValue"
        :key="index"
        :class="['grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-2', multiline && 'items-start']"
      >
        <textarea
          v-if="multiline"
          :value="row.es"
          placeholder="Español"
          rows="6"
          class="w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-ink/20"
          @input="updateRow(index, 'es', ($event.target as HTMLTextAreaElement).value)"
        />
        <input
          v-else
          :value="row.es"
          placeholder="Español"
          class="w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-ink/20"
          @input="updateRow(index, 'es', ($event.target as HTMLInputElement).value)"
        />
        <textarea
          v-if="multiline"
          :value="row.en"
          placeholder="English"
          rows="6"
          class="w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-ink/20"
          @input="updateRow(index, 'en', ($event.target as HTMLTextAreaElement).value)"
        />
        <input
          v-else
          :value="row.en"
          placeholder="English"
          class="w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-ink/20"
          @input="updateRow(index, 'en', ($event.target as HTMLInputElement).value)"
        />
        <button type="button" class="text-sm text-red-600 hover:underline px-2" @click="removeRow(index)">
          Quitar
        </button>
      </div>
    </div>
  </div>
</template>
