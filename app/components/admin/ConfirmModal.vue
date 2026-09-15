<script setup lang="ts">
defineProps<{
  open: boolean
  title?: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  icon?: 'trash' | 'eye' | 'logout'
}>()

const emit = defineEmits<{ confirm: []; cancel: [] }>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div class="absolute inset-0 bg-ink/40 backdrop-blur-sm" @click="emit('cancel')" />
      <div class="relative bg-paper rounded-2xl p-6 w-full max-w-sm shadow-xl">
        <div
          v-if="icon"
          class="mb-3 flex h-10 w-10 items-center justify-center rounded-full"
          :class="icon === 'trash' ? 'bg-red-600/10 text-red-600' : 'bg-ink/10 text-ink'"
        >
          <svg v-if="icon === 'trash'" width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path
              d="M4 6H16M8 6V4.5C8 3.67157 8.67157 3 9.5 3H10.5C11.3284 3 12 3.67157 12 4.5V6M6 6V15.5C6 16.3284 6.67157 17 7.5 17H12.5C13.3284 17 14 16.3284 14 15.5V6"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <svg v-else-if="icon === 'eye'" width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path
              d="M2 10C2 10 5 4 10 4C15 4 18 10 18 10C18 10 15 16 10 16C5 16 2 10 2 10Z"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linejoin="round"
            />
            <circle cx="10" cy="10" r="2.5" stroke="currentColor" stroke-width="1.5" />
          </svg>
          <svg v-else-if="icon === 'logout'" width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M8 4H4C3.44772 4 3 4.44772 3 5V15C3 15.5523 3.44772 16 4 16H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M13 13.5L17 10L13 6.5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
            <path d="M17 10H8" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </div>
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
