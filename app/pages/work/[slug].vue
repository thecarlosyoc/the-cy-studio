<!-- app/pages/work/[slug].vue -->
<script setup lang="ts">
import { workItems } from '~/data/work'

const route = useRoute()
const item = computed(() => workItems.find((i) => i.slug === route.params.slug))
</script>

<template>
  <div v-if="item" class="bg-paper min-h-screen px-6 md:px-12 pt-28 md:pt-32 pb-24 max-w-4xl mx-auto">
    <h1 class="font-display font-bold text-[40px] md:text-[64px] text-ink leading-tight">
      {{ item.title }}
    </h1>
    <p class="mt-4 text-ink-soft text-lg max-w-2xl">
      {{ item.description }}
    </p>
    <hr class="mt-8 border-ink/15" />

    <div class="mt-10 grid grid-cols-1 md:grid-cols-2 gap-10">
      <div class="space-y-8">
        <div>
          <h2 class="font-display font-bold text-sm uppercase tracking-wide text-ink">Mi Rol</h2>
          <ul class="mt-3 space-y-2">
            <li v-for="r in item.role" :key="r" class="text-ink-soft">{{ r }}</li>
          </ul>
        </div>
        <div>
          <h2 class="font-display font-bold text-sm uppercase tracking-wide text-ink">Herramientas</h2>
          <ul class="mt-3 space-y-2">
            <li v-for="t in item.tools" :key="t" class="text-ink-soft">{{ t }}</li>
          </ul>
        </div>
        <div>
          <h2 class="font-display font-bold text-sm uppercase tracking-wide text-ink">Fecha</h2>
          <p class="mt-3 text-ink-soft">{{ item.date }}</p>
        </div>
      </div>

      <div class="space-y-8">
        <div>
          <h2 class="font-display font-bold text-sm uppercase tracking-wide text-ink">Descripción</h2>
          <p class="mt-3 text-ink-soft">{{ item.description }}</p>
        </div>
        <div>
          <h2 class="font-display font-bold text-sm uppercase tracking-wide text-ink">Contexto</h2>
          <p class="mt-3 text-ink-soft">{{ item.context }}</p>
        </div>
      </div>
    </div>

    <div class="mt-14 grid grid-cols-2 md:grid-cols-3 gap-4">
      <img
        v-for="(img, i) in item.gallery"
        :key="i"
        :src="img"
        :alt="`${item.title} imagen ${i + 1}`"
        class="w-full aspect-square rounded-2xl object-cover"
      />
    </div>
  </div>

  <div v-else class="min-h-screen flex items-center justify-center">
    <p class="text-ink-soft">Proyecto no encontrado.</p>
  </div>
</template>