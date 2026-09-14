<script setup lang="ts">
defineProps<{
  open: boolean
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
}>()

const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div class="absolute inset-0 bg-ink/40 backdrop-blur-sm" @click="emit('cancel')" />
      <div class="relative bg-paper rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <h2 v-if="title" class="font-display font-bold text-lg text-ink">{{ title }}</h2>
        <p class="mt-2 text-ink-soft">{{ message }}</p>
        <div class="mt-6 flex justify-end gap-3">
          <CoreControl variant="soft" @click="emit('cancel')">{{ cancelLabel ?? 'Cancelar' }}</CoreControl>
          <CoreControl variant="solid" @click="emit('confirm')">{{ confirmLabel ?? 'Confirmar' }}</CoreControl>
        </div>
      </div>
    </div>
  </Teleport>
</template>
