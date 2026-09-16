<script setup lang="ts">
import type { WorkItem } from '#shared/types/content'

defineProps<{
  item: WorkItem
}>()

const mobileView = ref(false)
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
        <div>
          <h2 class="font-display font-bold text-xs uppercase tracking-wide text-ink">Demo</h2>
          <p v-if="item.demoUrl" class="mt-2 text-ink-soft text-sm break-all">{{ item.demoUrl }}</p>
          <p v-else class="mt-2 text-ink-soft/50 text-sm italic">Sin link de demo — no se muestra el botón</p>
        </div>
      </div>
    </div>

    <div class="mt-6">
      <div class="flex items-center justify-between">
        <h2 class="font-display font-bold text-xs uppercase tracking-wide text-ink">Galería</h2>
        <button
          type="button"
          role="switch"
          :aria-checked="mobileView"
          :title="mobileView ? 'Viendo en mobile · clic para ver desktop' : 'Viendo en desktop · clic para ver mobile'"
          class="flex items-center gap-2 text-xs text-ink-soft"
          @click="mobileView = !mobileView"
        >
          {{ mobileView ? 'Vista mobile' : 'Vista desktop' }}
          <span
            class="relative w-10 h-6 rounded-full transition-colors duration-150 shrink-0"
            :class="mobileView ? 'bg-ink' : 'bg-ink/20'"
          >
            <span
              class="absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-paper transition-transform duration-150"
              :class="mobileView ? 'translate-x-4' : 'translate-x-0'"
            />
          </span>
        </button>
      </div>
      <WorkGalleryGrid v-if="item.gallery.length || item.visuals.length" :images="item.gallery" :visuals="item.visuals" :mobile-preview="mobileView" class="mt-2" />
      <p v-else class="mt-2 text-ink-soft/50 text-sm italic">Sin imágenes ni visual todavía</p>
    </div>
  </div>
</template>
