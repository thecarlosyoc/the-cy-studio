<script setup lang="ts">
import type { WorkItemAdmin, AboutSectionAdmin } from '#shared/types/content'

definePageMeta({ middleware: 'admin' })

const headers = useRequestHeaders(['cookie'])
const [{ data: me }, { data: workItems, refresh: refreshWork }, { data: aboutSections }] = await Promise.all([
  useFetch('/api/admin/me', { headers }),
  useFetch<WorkItemAdmin[]>('/api/admin/work', { headers }),
  useFetch<AboutSectionAdmin[]>('/api/admin/about', { headers }),
])

const activeTab = ref<'work' | 'about'>('work')
const deleteTargetId = ref<string | null>(null)

async function confirmDelete() {
  if (!deleteTargetId.value) return
  await $fetch(`/api/admin/work/${deleteTargetId.value}`, { method: 'DELETE' })
  deleteTargetId.value = null
  await refreshWork()
}
</script>

<template>
  <div class="bg-paper min-h-screen px-6 md:px-12 pt-32 pb-24">
    <div class="flex items-center justify-between">
      <h1 class="font-display font-bold text-3xl text-ink">Admin</h1>
      <p class="text-ink-soft text-sm">{{ me?.email }}</p>
    </div>

    <div class="mt-8 inline-flex gap-1.5 rounded-full bg-ink/5 p-1.5">
      <CoreControl :variant="activeTab === 'work' ? 'solid' : 'soft'" @click="activeTab = 'work'">Work</CoreControl>
      <CoreControl :variant="activeTab === 'about' ? 'solid' : 'soft'" @click="activeTab = 'about'">About</CoreControl>
    </div>

    <section v-if="activeTab === 'work'" class="mt-8">
      <div class="flex items-center justify-between">
        <h2 class="font-display font-bold text-xl text-ink">Work</h2>
        <CoreControl variant="solid" to="/admin/work/new">+ Nuevo</CoreControl>
      </div>

      <div class="mt-4 divide-y divide-ink/10">
        <div v-for="item in workItems" :key="item.id" class="flex items-center justify-between py-3">
          <div>
            <p class="text-ink font-medium">{{ item.title.es }}</p>
            <p class="text-ink-soft text-sm">{{ item.slug }} · {{ item.type }}</p>
          </div>
          <div class="flex items-center gap-3">
            <NuxtLink :to="`/admin/work/${item.id}`" class="text-sm text-ink-soft hover:text-ink underline">Editar</NuxtLink>
            <button type="button" class="text-sm text-red-600 hover:underline" @click="deleteTargetId = item.id">Eliminar</button>
          </div>
        </div>
      </div>
    </section>

    <section v-else class="mt-8">
      <h2 class="font-display font-bold text-xl text-ink">About</h2>

      <div class="mt-4 divide-y divide-ink/10">
        <div v-for="section in aboutSections" :key="section.id" class="flex items-center justify-between py-3">
          <p class="text-ink font-medium">{{ section.label.es }}</p>
          <NuxtLink :to="`/admin/about/${section.id}`" class="text-sm text-ink-soft hover:text-ink underline">Editar</NuxtLink>
        </div>
      </div>
    </section>

    <AdminConfirmModal
      :open="!!deleteTargetId"
      title="Eliminar proyecto"
      message="¿Seguro que quieres eliminar este proyecto? Esta acción no se puede deshacer."
      confirm-label="Eliminar"
      @confirm="confirmDelete"
      @cancel="deleteTargetId = null"
    />
  </div>
</template>
