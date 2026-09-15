<!-- app/components/admin/WorkGridItem.vue -->
<script setup lang="ts">
import type { WorkItemAdmin } from '#shared/types/content'

const props = defineProps<{
  item: WorkItemAdmin
  index: number
}>()

defineEmits<{
  (e: 'toggle-hidden', id: string, hidden: boolean): void
  (e: 'delete', id: string): void
}>()

const responsible = computed(() => props.item.updatedBy?.split('@')[0] ?? null)

const extraImagesCount = computed(() => Math.max(0, props.item.gallery.length - 1))
const extraImagesLabel = computed(() =>
  extraImagesCount.value === 1 ? '+1 imagen más' : `+${extraImagesCount.value} imágenes más`,
)

const formattedDate = computed(() =>
  new Intl.DateTimeFormat('es', { dateStyle: 'medium', timeStyle: 'short' }).format(new Date(props.item.updatedAt)),
)
</script>

<template>
  <div
    class="flex flex-col gap-3 rounded-2xl border border-ink/10 p-4 transition-opacity"
    :class="{ 'opacity-50': item.hidden }"
  >
    <div class="flex items-center justify-between gap-2">
      <span class="font-mono text-2xl font-bold text-ink-soft">#{{ index + 1 }}</span>
      <AdminVisibilitySwitch
        :model-value="!item.hidden"
        @update:model-value="$emit('toggle-hidden', item.id, !$event)"
      />
    </div>

    <div class="relative w-full aspect-[4/3] rounded-lg overflow-hidden bg-ink/5">
      <NuxtImg
        v-if="item.gallery[0]"
        :src="item.gallery[0]"
        :alt="item.title.es"
        sizes="240px"
        format="webp"
        loading="lazy"
        class="absolute inset-0 w-full h-full object-cover"
      />
      <div v-else class="absolute inset-0 flex items-center justify-center text-ink-soft/50 text-xs">
        Sin foto
      </div>

      <template v-if="extraImagesCount > 0">
        <div class="absolute inset-x-0 bottom-0 h-2/3 bg-gradient-to-t from-black/70 to-transparent" />
        <p class="absolute bottom-2 right-2 text-white text-xs font-medium drop-shadow">{{ extraImagesLabel }}</p>
      </template>
    </div>

    <div class="min-w-0">
      <p class="text-ink font-medium truncate">{{ item.title.es }}</p>
      <p class="text-ink-soft text-xs truncate">{{ item.slug }} · {{ item.type }}</p>
    </div>

    <div class="text-ink-soft text-xs space-y-0.5">
      <p>{{ formattedDate }}</p>
      <p :class="{ 'italic opacity-70': !responsible }">{{ responsible ? `@${responsible}` : 'Sin registrar' }}</p>
    </div>

    <div class="mt-auto flex items-center gap-3 pt-2">
      <NuxtLink :to="`/admin/work/${item.id}`" class="text-sm text-ink-soft hover:text-ink underline">Editar</NuxtLink>
      <button type="button" class="text-sm text-red-600 hover:underline" @click="$emit('delete', item.id)">Eliminar</button>
    </div>
  </div>
</template>
