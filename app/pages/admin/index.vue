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
const deleteTargetIds = ref<string[] | null>(null)

const deleteModalMessage = computed(() => {
  const count = deleteTargetIds.value?.length ?? 0
  return count === 1
    ? '¿Seguro que quieres eliminar este proyecto?'
    : `¿Seguro que quieres eliminar estos ${count} proyectos?`
})

const deleteModalTitle = computed(() => ((deleteTargetIds.value?.length ?? 0) === 1 ? 'Eliminar proyecto' : 'Eliminar proyectos'))

const search = ref('')
const dateFrom = ref('')
const dateTo = ref('')

const hasFilters = computed(() => !!(search.value || dateFrom.value || dateTo.value))

const filteredWorkItems = computed(() => {
  const query = search.value.trim().toLowerCase()

  return (workItems.value ?? []).filter((item) => {
    if (query) {
      const haystack = `${item.title.es} ${item.title.en} ${item.slug} ${item.tools.join(' ')}`.toLowerCase()
      if (!haystack.includes(query)) return false
    }

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

const { show: showToast } = useAdminToast()
const UNDO_WINDOW_MS = 5000

// A single running batch of "not yet actually deleted" items, so that deleting
// something new while an earlier delete's undo window is still open extends it
// instead of silently replacing the toast (and losing that earlier undo).
let pendingRemovals: WorkItemAdmin[] = []
let pendingRemovalTimer: ReturnType<typeof setTimeout> | undefined

function deleteItemsWithUndo(ids: string[]) {
  if (ids.length === 0) return

  const removed = (workItems.value ?? []).filter((item) => ids.includes(item.id))
  if (workItems.value) {
    workItems.value = workItems.value.filter((item) => !ids.includes(item.id))
  }

  pendingRemovals.push(...removed)
  if (pendingRemovalTimer) clearTimeout(pendingRemovalTimer)

  const total = pendingRemovals.length

  pendingRemovalTimer = setTimeout(async () => {
    const toDelete = pendingRemovals.map((item) => item.id)
    pendingRemovals = []
    try {
      await Promise.all(toDelete.map((id) => $fetch(`/api/admin/work/${id}`, { method: 'DELETE' })))
    } finally {
      await refreshWork()
    }
  }, UNDO_WINDOW_MS)

  showToast(total === 1 ? 'Producto eliminado.' : `${total} productos eliminados.`, {
    actionLabel: 'Deshacer',
    duration: UNDO_WINDOW_MS,
    onAction: () => {
      if (pendingRemovalTimer) clearTimeout(pendingRemovalTimer)
      const restored = pendingRemovals
      pendingRemovals = []
      if (workItems.value) {
        workItems.value = [...workItems.value, ...restored].sort((a, b) => a.order - b.order)
      }
    },
  })
}

function requestDelete(id: string) {
  deleteTargetIds.value = [id]
}

function confirmDelete() {
  const ids = deleteTargetIds.value
  deleteTargetIds.value = null
  if (!ids) return
  selectedIds.clear()
  deleteItemsWithUndo(ids)
}

const pendingToggleIds = reactive(new Set<string>())

async function setHidden(ids: string[], hidden: boolean) {
  if (ids.length === 0) return

  ids.forEach((id) => pendingToggleIds.add(id))
  try {
    await Promise.all(ids.map((id) => $fetch(`/api/admin/work/${id}`, { method: 'PATCH', body: { hidden } })))
    await refreshWork()
    if (ids.length > 1) {
      showToast(hidden ? `${ids.length} producto(s) ocultos.` : `${ids.length} producto(s) visibles.`)
    }
  } finally {
    ids.forEach((id) => pendingToggleIds.delete(id))
  }
}

// Showing something back up has no downside, so it happens instantly. Hiding
// removes it from the public site, so it goes through the same confirm
// modal as delete — just with its own icon and copy.
const hideTargetIds = ref<string[] | null>(null)

const hideModalTitle = computed(() => ((hideTargetIds.value?.length ?? 0) === 1 ? 'Ocultar proyecto' : 'Ocultar proyectos'))
const hideModalMessage = computed(() => {
  const count = hideTargetIds.value?.length ?? 0
  return count === 1
    ? '¿Ocultar este proyecto del sitio público? Puedes volver a mostrarlo cuando quieras.'
    : `¿Ocultar estos ${count} proyectos del sitio público? Puedes volver a mostrarlos cuando quieras.`
})

function toggleHidden(id: string, hidden: boolean) {
  if (hidden) {
    hideTargetIds.value = [id]
  } else {
    setHidden([id], false)
  }
}

function confirmHide() {
  const ids = hideTargetIds.value
  hideTargetIds.value = null
  if (!ids) return
  clearSelection()
  setHidden(ids, true)
}

// Bulk selection & actions
const selectMode = ref(false)
const selectedIds = reactive(new Set<string>())

function toggleSelectMode() {
  selectMode.value = !selectMode.value
  if (!selectMode.value) clearSelection()
}

function toggleSelect(id: string) {
  if (selectedIds.has(id)) selectedIds.delete(id)
  else selectedIds.add(id)
}

function clearSelection() {
  selectedIds.clear()
}

const allFilteredSelected = computed(
  () => filteredWorkItems.value.length > 0 && filteredWorkItems.value.every((item) => selectedIds.has(item.id)),
)

function toggleSelectAll() {
  if (allFilteredSelected.value) {
    clearSelection()
  } else {
    filteredWorkItems.value.forEach((item) => selectedIds.add(item.id))
  }
}

function requestBulkDelete() {
  if (selectedIds.size === 0) return
  deleteTargetIds.value = [...selectedIds]
}

const selectedItems = computed(() => (workItems.value ?? []).filter((item) => selectedIds.has(item.id)))
const canBulkHide = computed(() => selectedItems.value.some((item) => !item.hidden))
const canBulkShow = computed(() => selectedItems.value.some((item) => item.hidden))

function requestBulkHide() {
  if (selectedIds.size === 0) return
  hideTargetIds.value = [...selectedIds]
}

async function bulkShow() {
  const ids = [...selectedIds]
  clearSelection()
  await setHidden(ids, false)
}
</script>

<template>
  <div class="bg-paper min-h-screen px-6 md:px-12 pt-32 pb-24">
    <div class="flex items-center justify-between">
      <h1 class="font-display font-bold text-3xl text-ink">Admin</h1>
      <div
        title="Sesión iniciada como"
        class="flex items-center gap-1.5 rounded-full bg-ink/5 px-3 py-1.5 text-ink-soft text-sm"
      >
        <svg width="14" height="14" viewBox="0 0 20 20" fill="none" class="shrink-0">
          <circle cx="10" cy="7" r="3" stroke="currentColor" stroke-width="1.5" />
          <path d="M4 17c0-3.3137 2.6863-6 6-6s6 2.6863 6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
        </svg>
        <span>{{ me?.email }}</span>
      </div>
    </div>
    <p class="mt-1 text-xs text-ink/50">Elige la sección que quieres editar.</p>

    <div class="mt-8 inline-flex gap-1.5 rounded-full bg-ink/5 p-1.5">
      <CoreControl :variant="activeTab === 'work' ? 'solid' : 'soft'" @click="activeTab = 'work'">Productos</CoreControl>
      <CoreControl :variant="activeTab === 'about' ? 'solid' : 'soft'" @click="activeTab = 'about'">Sobre mí</CoreControl>
    </div>

    <section v-if="activeTab === 'work'" class="mt-8">
      <div class="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 class="font-display font-bold text-xl text-ink whitespace-nowrap">Productos digitales y marcas</h2>
          <p class="mt-1 text-xs text-ink/50">Agrega, oculta o elimina los productos y marcas de tu portafolio.</p>
        </div>
        <div class="flex flex-wrap items-center gap-2">
          <AdminSearchFilter v-model="search" />
          <NuxtLink
            to="/admin/work/new"
            class="rounded-xl px-3.5 py-2.5 text-sm font-medium bg-ink/80 text-paper hover:bg-ink-soft/80 transition-colors whitespace-nowrap"
          >
            + Nuevo
          </NuxtLink>
          <button
            type="button"
            class="rounded-xl px-3.5 py-2.5 text-sm transition-colors whitespace-nowrap"
            :class="selectMode ? 'bg-ink text-paper' : 'bg-ink/5 text-ink-soft hover:bg-ink/10'"
            @click="toggleSelectMode"
          >
            Seleccionar
          </button>
          <AdminDateRangeFilter v-model:from="dateFrom" v-model:to="dateTo" />
          <button v-if="hasFilters" type="button" class="text-sm text-ink-soft hover:text-ink underline whitespace-nowrap" @click="clearFilters">
            Limpiar filtros
          </button>
        </div>
      </div>

      <p v-if="hasFilters" class="mt-3 text-ink-soft text-sm">
        {{ filteredWorkItems.length }} de {{ workItems?.length ?? 0 }} proyectos
      </p>

      <div v-if="selectMode && filteredWorkItems.length" class="mt-4 flex items-center gap-2">
        <AdminCheckbox :model-value="allFilteredSelected" label="Seleccionar todo" @update:model-value="toggleSelectAll" />
        <label class="text-xs text-ink-soft cursor-pointer" @click="toggleSelectAll">
          Seleccionar todo{{ hasFilters ? ' (filtrado)' : '' }}
        </label>
      </div>

      <div v-if="selectMode && selectedIds.size > 0" class="mt-3 flex flex-wrap items-center gap-3 rounded-xl bg-ink/5 px-4 py-3">
        <p class="text-sm text-ink font-medium">
          {{ selectedIds.size }} seleccionado{{ selectedIds.size === 1 ? '' : 's' }}
        </p>
        <div class="flex items-center gap-3 sm:ml-auto">
          <button
            type="button"
            :disabled="!canBulkHide"
            class="text-sm text-ink-soft hover:text-ink underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
            @click="requestBulkHide"
          >
            Ocultar
          </button>
          <button
            type="button"
            :disabled="!canBulkShow"
            class="text-sm text-ink-soft hover:text-ink underline disabled:opacity-40 disabled:no-underline disabled:cursor-not-allowed"
            @click="bulkShow"
          >
            Mostrar
          </button>
          <button type="button" class="text-sm text-red-600 hover:underline" @click="requestBulkDelete">Eliminar</button>
          <button type="button" class="text-sm text-ink-soft hover:text-ink underline" @click="clearSelection">Cancelar</button>
        </div>
      </div>

      <div v-if="filteredWorkItems.length" class="mt-4 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        <AdminWorkGridItem
          v-for="(item, index) in paginatedWorkItems"
          :key="item.id"
          :item="item"
          :index="(currentPage - 1) * PAGE_SIZE + index"
          :toggle-pending="pendingToggleIds.has(item.id)"
          :select-mode="selectMode"
          :selected="selectedIds.has(item.id)"
          @toggle-hidden="toggleHidden"
          @delete="requestDelete"
          @toggle-select="toggleSelect"
        />
      </div>
      <p v-else-if="hasFilters" class="mt-8 text-ink-soft text-sm italic">No hay proyectos que coincidan con estos filtros.</p>
      <p v-else class="mt-8 text-ink-soft text-sm italic">Todavía no tienes proyectos. Usa "+ Nuevo" para crear el primero.</p>

      <div v-if="totalPages > 1" class="mt-8 flex items-center justify-center gap-4">
        <CoreControl variant="soft" :disabled="currentPage === 1" @click="page = currentPage - 1">← Anterior</CoreControl>
        <span class="text-ink-soft text-sm">Página {{ currentPage }} de {{ totalPages }}</span>
        <CoreControl variant="soft" :disabled="currentPage === totalPages" @click="page = currentPage + 1">Siguiente →</CoreControl>
      </div>
    </section>

    <section v-else class="mt-8">
      <h2 class="font-display font-bold text-xl text-ink">Edita tu Sobre mí</h2>
      <p class="mt-1 text-xs text-ink/50">Actualiza los párrafos y textos que ven tus visitantes.</p>

      <div class="mt-4 divide-y divide-ink/10">
        <div v-for="section in aboutSections" :key="section.id" class="flex items-center justify-between py-3">
          <p class="text-ink font-medium">{{ section.label.es }}</p>
          <NuxtLink :to="`/admin/about/${section.id}`" class="text-sm text-ink-soft hover:text-ink underline">Editar</NuxtLink>
        </div>
      </div>
    </section>

    <AdminConfirmModal
      :open="!!deleteTargetIds"
      icon="trash"
      :title="deleteModalTitle"
      :message="deleteModalMessage"
      confirm-label="Eliminar"
      @confirm="confirmDelete"
      @cancel="deleteTargetIds = null"
    />
    <AdminConfirmModal
      :open="!!hideTargetIds"
      icon="eye"
      :title="hideModalTitle"
      :message="hideModalMessage"
      confirm-label="Ocultar"
      @confirm="confirmHide"
      @cancel="hideTargetIds = null"
    />
    <AdminToast />
  </div>
</template>
