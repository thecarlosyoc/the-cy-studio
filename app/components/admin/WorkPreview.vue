<script setup lang="ts">
import type { WorkItem } from '#shared/types/content'

defineProps<{
  item: WorkItem
}>()
</script>

<template>
  <div class="bg-paper border border-ink/10 rounded-2xl p-6 lg:sticky lg:top-32">
    <p class="font-mono text-[11px] tracking-[.16em] uppercase text-ink-soft">Preview</p>

    <h1 class="mt-2 font-display font-bold text-3xl text-ink leading-tight">
      {{ item.title.es || 'Título del proyecto' }}
    </h1>
    <p class="mt-2 text-ink-soft">{{ item.description.es || 'Subtítulo del proyecto.' }}</p>

    <hr class="mt-6 border-ink/15" />

    <div class="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="space-y-6">
        <div>
          <h2 class="font-display font-bold text-xs uppercase tracking-wide text-ink">Rol</h2>
          <ul class="mt-2 space-y-1">
            <li v-for="(r, i) in item.role" :key="i" class="text-ink-soft text-sm">{{ r.es }}</li>
            <li v-if="!item.role.length" class="text-ink-soft/50 text-sm italic">Sin rol</li>
          </ul>
        </div>
        <div>
          <h2 class="font-display font-bold text-xs uppercase tracking-wide text-ink">Herramientas</h2>
          <ul class="mt-2 space-y-1">
            <li v-for="tool in item.tools" :key="tool" class="text-ink-soft text-sm">{{ tool }}</li>
            <li v-if="!item.tools.length" class="text-ink-soft/50 text-sm italic">Sin herramientas</li>
          </ul>
        </div>
        <div>
          <h2 class="font-display font-bold text-xs uppercase tracking-wide text-ink">Fecha</h2>
          <p class="mt-2 text-ink-soft text-sm">{{ item.date.es || '—' }}</p>
        </div>
      </div>

      <div class="space-y-6">
        <div>
          <h2 class="font-display font-bold text-xs uppercase tracking-wide text-ink">Descripción</h2>
          <p class="mt-2 text-ink-soft text-sm">{{ item.longDescription.es || '—' }}</p>
        </div>
        <div>
          <h2 class="font-display font-bold text-xs uppercase tracking-wide text-ink">Contexto</h2>
          <p class="mt-2 text-ink-soft text-sm">{{ item.context.es || '—' }}</p>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <h2 class="font-display font-bold text-xs uppercase tracking-wide text-ink">Galería</h2>
      <WorkGalleryGrid v-if="item.gallery.length" :images="item.gallery" class="mt-2" />
      <p v-else class="mt-2 text-ink-soft/50 text-sm italic">Sin imágenes todavía</p>
    </div>
  </div>
</template>
