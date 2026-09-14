<script setup lang="ts">
import type { LocalizedText } from '#shared/types/content'

const props = defineProps<{
  label: string
  modelValue: LocalizedText
  multiline?: boolean
}>()

const emit = defineEmits<{ 'update:modelValue': [LocalizedText] }>()

function update(lang: 'es' | 'en', value: string) {
  emit('update:modelValue', { ...props.modelValue, [lang]: value })
}
</script>

<template>
  <div>
    <label class="block font-display font-bold text-sm uppercase tracking-wide text-ink">{{ label }}</label>
    <div class="mt-2 grid grid-cols-1 md:grid-cols-2 gap-3">
      <textarea
        v-if="multiline"
        :value="modelValue.es"
        placeholder="Español"
        rows="8"
        class="w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-ink/20"
        @input="update('es', ($event.target as HTMLTextAreaElement).value)"
      />
      <input
        v-else
        :value="modelValue.es"
        placeholder="Español"
        class="w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-ink/20"
        @input="update('es', ($event.target as HTMLInputElement).value)"
      />
      <textarea
        v-if="multiline"
        :value="modelValue.en"
        placeholder="English"
        rows="8"
        class="w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-ink/20"
        @input="update('en', ($event.target as HTMLTextAreaElement).value)"
      />
      <input
        v-else
        :value="modelValue.en"
        placeholder="English"
        class="w-full rounded-xl bg-ink/5 px-4 py-3 text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-ink/20"
        @input="update('en', ($event.target as HTMLInputElement).value)"
      />
    </div>
  </div>
</template>
