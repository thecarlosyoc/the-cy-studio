<script setup lang="ts">
defineProps<{
  open: boolean
  message: string
}>()

const emit = defineEmits<{ close: [] }>()
</script>

<template>
  <Teleport to="body">
    <div v-if="open" class="fixed inset-0 z-[100] flex items-center justify-center px-6">
      <div class="absolute inset-0 bg-ink/40 backdrop-blur-sm" @click="emit('close')" />
      <div class="relative bg-paper rounded-2xl p-8 w-full max-w-sm shadow-xl text-center">
        <svg class="mx-auto h-14 w-14" viewBox="0 0 52 52">
          <circle class="success-circle" cx="26" cy="26" r="24" fill="none" stroke="currentColor" stroke-width="2" />
          <path class="success-check" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" d="M14 27l7 7 17-17" />
        </svg>
        <p class="mt-4 text-ink font-medium">{{ message }}</p>
        <CoreControl variant="solid" class="mt-6" @click="emit('close')">Continuar</CoreControl>
      </div>
    </div>
  </Teleport>
</template>

<style scoped>
.success-circle,
.success-check {
  color: rgb(var(--color-ink));
  stroke-dasharray: 100;
  stroke-dashoffset: 100;
  animation: draw 0.5s ease-out forwards;
}
.success-check {
  animation-delay: 0.35s;
}
@keyframes draw {
  to {
    stroke-dashoffset: 0;
  }
}
</style>
