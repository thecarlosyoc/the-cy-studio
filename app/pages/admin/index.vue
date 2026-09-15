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

const search = ref('')
const dateFrom = ref('')
const dateTo = ref('')

const hasFilters = computed(() => !!(search.value || dateFrom.value || dateTo.value))

const filteredWorkItems = computed(() => {
  const query = search.value.trim().toLowerCase()

  return (workItems.value ?? []).filter((item) => {
    if (query && !`${item.title.es} ${item.slug}`.toLowerCase().includes(query)) return false

    const updatedDate = item.updatedAt.slice(0, 10)
    if (dateFrom.value && updatedDate < dateFrom.value) return false
    if (dateTo.value && updatedDate > dateTo.value) return false

    return true
  })
})

function clearFilters() {
  search.value = ''
  dateFrom.value = ''
  dateTo.value = ''
}

const PAGE_SIZE = 10
const page = ref(1)

watch([search, dateFrom, dateTo], () => {
  page.value = 1
})

const totalPages = computed(() => Math.max(1, Math.ceil(filteredWorkItems.value.length / PAGE_SIZE)))
const currentPage = computed(() => Math.min(page.value, totalPages.value))

const paginatedWorkItems = computed(() => {
  const start = (currentPage.value - 1) * PAGE_SIZE
  return filteredWorkItems.value.slice(start, start + PAGE_SIZE)
})

async function confirmDelete() {
  if (!deleteTargetId.value) return
  await $fetch(`/api/admin/work/${deleteTargetId.value}`, { method: 'DELETE' })
  deleteTargetId.value = null
  await refreshWork()
}

async function toggleHidden(id: string, hidden: boolean) {
  await $fetch(`/api/admin/work/${id}`, { method: 'PATCH', body: { hidden } })
  await refreshWork()
}
</script>

<template>
  <div class="bg-paper min-h-screen px-6 md:px-12 pt-32 pb-24">
    <div class="flex items-center justify-between">
      <h1 class="font-display font-bold text-3xl text-ink">Admin</h1>
      <p class="text-ink-soft text-sm">{{ me?.email }}</p>
    </div>
    <p class="mt-1 text-xs text-ink/50">Elige la sección que quieres editar.</p>

    <div class="mt-8 inline-flex gap-1.5 rounded-full bg-ink/5 p-1.5">
      <CoreControl :variant="activeTab === 'work' ? 'solid' : 'soft'" @click="activeTab = 'work'">Work</CoreControl>
      <CoreControl :variant="activeTab === 'about' ? 'solid' : 'soft'" @click="activeTab = 'about'">About</CoreControl>
    </div>

    <section v-if="activeTab === 'work'" class="mt-8">
      <div class="flex items-center justify-between">
        <h2 class="font-display font-bold text-xl text-ink">Work</h2>
        <CoreControl variant="solid" to="/admin/work/new">+ Nuevo</CoreControl>
      </div>
      <p class="mt-1 text-xs text-ink/50">Agrega, edita, oculta o elimina los productos y marcas de tu portafolio.</p>

      <div class="mt-6 flex flex-col sm:flex-row sm:items-center gap-3">
        <input
          v-model="search"
          type="search"
          placeholder="Buscar por título o slug…"
          class="w-full sm:max-w-xs rounded-xl bg-ink/5 px-4 py-2.5 text-sm text-ink placeholder:text-ink-soft focus:outline-none focus:ring-2 focus:ring-ink/20"
        />
        <div class="flex items-center gap-2 sm:ml-auto">
          <AdminDateRangeFilter v-model:from="dateFrom" v-model:to="dateTo" />
          <button v-if="hasFilters" type="button" class="text-sm text-ink-soft hover:text-ink underline whitespace-nowrap" @click="clearFilters">
            Limpiar filtros
          </button>
        </div>
      </div>

      <p v-if="hasFilters" class="mt-3 text-ink-soft text-sm">
        {{ filteredWorkItems.length }} de {{ workItems?.length ?? 0 }} proyectos
      </p>

      <div v-if="filteredWorkItems.length" class="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <AdminWorkGridItem
          v-for="(item, index) in paginatedWorkItems"
          :key="item.id"
          :item="item"
          :index="(currentPage - 1) * PAGE_SIZE + index"
          @toggle-hidden="toggleHidden"
          @delete="deleteTargetId = $event"
        />
      </div>
      <p v-else class="mt-8 text-ink-soft text-sm italic">No hay proyectos que coincidan con estos filtros.</p>

      <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center gap-4">
        <CoreControl variant="soft" :disabled="currentPage === 1" @click="page = currentPage - 1">← Anterior</CoreControl>
        <span class="text-ink-soft text-sm">Página {{ currentPage }} de {{ totalPages }}</span>
        <CoreControl variant="soft" :disabled="currentPage === totalPages" @click="page = currentPage + 1">Siguiente →</CoreControl>
      </div>
    </section>

    <section v-else class="mt-8">
      <h2 class="font-display font-bold text-xl text-ink">About</h2>
      <p class="mt-1 text-xs text-ink/50">Edita los textos y párrafos que aparecen en la sección Sobre mí.</p>

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
