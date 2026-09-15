<!-- app/components/admin/WorkGridItem.vue -->
<script setup lang="ts">
import type { WorkItemAdmin } from '#shared/types/content'

const props = defineProps<{
  item: WorkItemAdmin
  index: number
  togglePending?: boolean
  selectMode?: boolean
  selected?: boolean
}>()

defineEmits<{
  (e: 'toggle-hidden', id: string, hidden: boolean): void
  (e: 'delete', id: string): void
  (e: 'toggle-select', id: string): void
}>()

const responsible = computed(() => props.item.updatedBy?.split('@')[0] ?? null)

const extraImagesCount = computed(() => Math.max(0, props.item.gallery.length - 1))
const extraImagesLabel = computed(() =>
  extraImagesCount.value === 1 ? '+1 imagen más' : `+${extraImagesCount.value} imágenes más`,
)

const coverImage = computed(() => getCoverImage(props.item.gallery))

const formattedDate = computed(() =>
  new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(props.item.updatedAt)),
)
</script>

<template>
  <div
    class="relative flex flex-col gap-3 rounded-2xl border border-ink/10 p-4 transition-colors hover:border-ink/30"
    :class="{ 'opacity-50': item.hidden, 'ring-2 ring-ink border-ink/30': selected }"
  >
    <!--
      "Stretched link" pattern: this covers the whole card so any non-interactive
      area (photo, title, date…) navigates to edit. The switch and delete button
      are real siblings — not nested inside this anchor — each raised above it
      with z-10 so they still receive their own clicks. Keeps the DOM valid
      (no button-inside-a-link) and lets screen readers announce them properly.

      In select mode this overlay toggles selection instead of navigating —
      otherwise tapping the card (the natural gesture while multi-selecting)
      would fly you to the edit page and drop your in-progress selection.
    -->
    <NuxtLink
      v-if="!selectMode"
      :to="`/admin/work/${item.id}`"
      :aria-label="`Editar ${item.title.es}`"
      class="absolute inset-0 z-0"
    />
    <div
      v-else
      role="checkbox"
      tabindex="0"
      :aria-checked="!!selected"
      :aria-label="`Seleccionar ${item.title.es}`"
      class="absolute inset-0 z-0 cursor-pointer"
      @click="$emit('toggle-select', item.id)"
      @keydown.enter="$emit('toggle-select', item.id)"
      @keydown.space.prevent="$emit('toggle-select', item.id)"
    />

    <div class="flex items-center justify-between gap-2">
      <div class="relative z-10 flex items-center gap-2">
        <AdminCheckbox
          v-if="selectMode"
          :model-value="!!selected"
          :label="`Seleccionar ${item.title.es}`"
          @update:model-value="$emit('toggle-select', item.id)"
        />
        <span class="font-mono text-2xl font-bold text-ink-soft">#{{ index + 1 }}</span>
      </div>
      <AdminVisibilitySwitch
        class="relative z-10"
        :model-value="!item.hidden"
        :disabled="togglePending"
        @update:model-value="$emit('toggle-hidden', item.id, !$event)"
      />
    </div>

    <div class="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-ink/5 pointer-events-none">
      <NuxtImg
        v-if="coverImage"
        :src="coverImage.url"
        :alt="item.title.es"
        sizes="240px"
        format="webp"
        loading="lazy"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div v-else class="absolute inset-0 flex items-center justify-center text-ink-soft/50 text-xs">
        Sin foto
      </div>

      <span
        v-if="item.hidden"
        class="absolute top-2 left-2 rounded-full bg-ink/80 text-paper text-[10px] font-medium px-2 py-0.5"
      >
        Oculto
      </span>

      <template v-if="extraImagesCount > 0">
        <div class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
        <p class="absolute bottom-2 right-2 text-white text-xs font-medium drop-shadow">{{ extraImagesLabel }}</p>
      </template>
    </div>

    <div class="min-w-0">
      <p class="text-ink font-medium truncate">{{ item.title.es }}</p>
      <p class="text-ink-soft text-xs truncate">{{ item.slug }} · {{ item.type }}</p>
    </div>

    <div class="mt-auto pt-1 flex items-center justify-between gap-2">
      <div class="text-ink-soft text-xs space-y-1 min-w-0">
        <p class="flex items-center gap-1.5">
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none" class="shrink-0">
            <rect x="3" y="4" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.5" />
            <path d="M3 8H17M6 2V5M14 2V5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <span class="truncate">{{ formattedDate }}</span>
        </p>
        <p class="flex items-center gap-1.5" :class="{ 'italic opacity-70': !responsible }">
          <svg width="13" height="13" viewBox="0 0 20 20" fill="none" class="shrink-0">
            <circle cx="10" cy="7" r="3" stroke="currentColor" stroke-width="1.5" />
            <path d="M4 17c0-3.3137 2.6863-6 6-6s6 2.6863 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
          </svg>
          <span class="truncate">{{ responsible ? `@${responsible}` : 'Sin registrar' }}</span>
        </p>
      </div>

      <button
        type="button"
        title="Eliminar"
        aria-label="Eliminar proyecto"
        class="relative z-10 shrink-0 rounded-lg p-2 text-red-600 hover:bg-red-600/10 transition-colors"
        @click="$emit('delete', item.id)"
      >
        <svg width="24" height="24" viewBox="0 0 20 20" fill="none">
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
</template>
