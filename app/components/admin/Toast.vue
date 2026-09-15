<!-- app/components/admin/Toast.vue -->
<script setup lang="ts">
const { toast, dismiss } = useAdminToast()
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0 translate-y-2"
      leave-active-class="transition duration-150 ease-in"
      leave-to-class="opacity-0"
    >
      <div
        v-if="toast"
        role="status"
        class="fixed bottom-6 left-1/2 -translate-x-1/2 z-[200] flex items-center gap-4 rounded-full bg-ink text-paper pl-5 pr-3 py-3 shadow-xl"
      >
        <p class="text-sm">{{ toast.message }}</p>
        <button
          v-if="toast.actionLabel"
          type="button"
          class="text-sm font-semibold underline shrink-0"
          @click="toast.onAction?.(); dismiss()"
        >
          {{ toast.actionLabel }}
        </button>
        <button
          type="button"
          aria-label="Cerrar"
          class="shrink-0 rounded-full p-1 text-paper/60 hover:text-paper hover:bg-paper/10 transition-colors"
          @click="dismiss"
        >
          <svg width="14" height="14" viewBox="0 0 20 20" fill="none">
            <path d="M5 5L15 15M15 5L5 15" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
        </button>
      </div>
    </Transition>
  </Teleport>
</template>
