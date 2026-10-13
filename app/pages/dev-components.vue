<!-- pages/dev-components.vue -->
<script setup lang="ts">
const lang = ref<'es' | 'en'>('es')

const seg = ref<'a' | 'b' | 'c'>('a')
const segOptions = [
  { value: 'a' as const, label: 'Todos' },
  { value: 'b' as const, label: 'Web' },
  { value: 'c' as const, label: 'Motion' },
]
const segLong = [
  { value: 'a' as const, label: 'Identidad de marca y sistemas de diseño' },
  { value: 'b' as const, label: 'Sitios web y tiendas en línea' },
  { value: 'c' as const, label: 'Motion graphics y video de lanzamiento' },
]
const showModal = ref(false)
const on = ref(true)
const off = ref(false)
const dFrom = ref('')
const dTo = ref('')
const dFromBad = ref('2026-10-20')
const dToBad = ref('2026-10-01')
const dFromLong = ref('2026-01-01')
const dToLong = ref('2026-12-31')
</script>

<template>
  <div class="min-h-screen bg-paper p-10 pt-24 space-y-8">
    <h1 class="font-display text-2xl text-ink">Component Playground</h1>

    <section>
      <h2 class="font-mono text-sm text-ink-soft mb-2">Core/Dot</h2>
      <CoreDot />
    </section>

    <section>
      <h2 class="font-mono text-sm text-ink-soft mb-2">Core/Control</h2>
      <div class="flex gap-3">
        <CoreControl variant="soft">Escribe aquí</CoreControl>
        <CoreControl variant="solid">Escribe aquí</CoreControl>
        <CoreControl variant="outline">Escribe aquí</CoreControl>
        <CoreControl variant="link">Escribe aquí</CoreControl>
      </div>
    </section>

    <section>
      <h2 class="font-mono text-sm text-ink-soft mb-2">Brand/Logo</h2>
      <BrandLogo class="h-6 w-auto text-ink" />
    </section>

    <section>
      <h2 class="font-mono text-sm text-ink-soft mb-2">Core/Toggle</h2>
      <CoreToggle v-model="lang" />
    </section>

    <section>
      <h2 class="font-mono text-sm text-ink-soft mb-2">Core/Control (link)</h2>
      <div class="flex gap-3">
        <CoreControl variant="link">Email</CoreControl>
        <CoreControl variant="link">In</CoreControl>
      </div>
    </section>
    <section>
      <h2 class="font-mono text-sm text-ink-soft mb-2">Core/SegmentedControl — 5 states</h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Default</p>
          <CoreSegmentedControl v-model="seg" aria-label="Default" :options="segOptions" />
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Loading</p>
          <CoreSegmentedControl v-model="seg" aria-label="Loading" :options="segOptions" loading />
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Error</p>
          <CoreSegmentedControl v-model="seg" aria-label="Error" :options="segOptions" error />
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Empty</p>
          <CoreSegmentedControl v-model="seg" aria-label="Empty" :options="[]" />
        </div>
        <div class="max-w-[320px]">
          <p class="font-mono text-xs text-ink-soft mb-2">Overflow (320px)</p>
          <CoreSegmentedControl v-model="seg" aria-label="Overflow" :options="segLong" />
        </div>
      </div>
    </section>

    <section>
      <h2 class="font-mono text-sm text-ink-soft mb-2">Core/Toggle — 5 states</h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Default</p>
          <CoreToggle v-model="lang" />
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Loading</p>
          <CoreToggle v-model="lang" loading />
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Error</p>
          <CoreToggle v-model="lang" error />
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Empty</p>
          <p class="text-xs text-ink-soft italic">N/A: control binario, siempre tiene valor</p>
        </div>
        <div class="max-w-[160px]">
          <p class="font-mono text-xs text-ink-soft mb-2">Overflow (160px)</p>
          <p class="text-xs text-ink-soft italic">N/A: sin texto que desborde</p>
        </div>
      </div>
    </section>

    <section>
      <h2 class="font-mono text-sm text-ink-soft mb-2">Admin/VisibilitySwitch — 5 states</h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Default</p>
          <AdminVisibilitySwitch v-model="on" />
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Loading</p>
          <AdminVisibilitySwitch v-model="on" loading />
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Error</p>
          <AdminVisibilitySwitch v-model="on" error />
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Empty</p>
          <AdminVisibilitySwitch v-model="off" />
        </div>
        <div class="max-w-[160px]">
          <p class="font-mono text-xs text-ink-soft mb-2">Overflow (160px)</p>
          <p class="text-xs text-ink-soft italic">N/A: sin texto que desborde</p>
        </div>
      </div>
    </section>

    <section>
      <h2 class="font-mono text-sm text-ink-soft mb-2">Admin/Checkbox — 5 states</h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Default</p>
          <AdminCheckbox v-model="on" label="Seleccionar" />
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Loading</p>
          <AdminCheckbox v-model="on" label="Seleccionar" loading />
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Error</p>
          <AdminCheckbox v-model="off" label="Seleccionar" error />
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Empty</p>
          <AdminCheckbox v-model="off" label="Seleccionar" />
        </div>
        <div class="max-w-[160px]">
          <p class="font-mono text-xs text-ink-soft mb-2">Overflow (160px)</p>
          <p class="text-xs text-ink-soft italic">N/A: sin texto que desborde</p>
        </div>
      </div>
    </section>

    <section>
      <h2 class="font-mono text-sm text-ink-soft mb-2">Admin/DateRangeFilter — 5 states</h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Default</p>
          <AdminDateRangeFilter v-model:from="dFrom" v-model:to="dTo" />
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Loading</p>
          <AdminDateRangeFilter v-model:from="dFromLong" v-model:to="dToLong" loading />
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Error</p>
          <AdminDateRangeFilter v-model:from="dFromBad" v-model:to="dToBad" />
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Empty</p>
          <AdminDateRangeFilter v-model:from="dFrom" v-model:to="dTo" />
        </div>
        <div class="max-w-[160px]">
          <p class="font-mono text-xs text-ink-soft mb-2">Overflow (160px)</p>
          <AdminDateRangeFilter v-model:from="dFromLong" v-model:to="dToLong" />
        </div>
      </div>
    </section>

    <section>
      <h2 class="font-mono text-sm text-ink-soft mb-2">Admin/ConfirmModal</h2>
      <CoreControl variant="soft" @click="showModal = true">Abrir modal</CoreControl>
      <AdminConfirmModal
        :open="showModal"
        icon="trash"
        title="Eliminar proyecto"
        message="Esta acción no se puede deshacer."
        @confirm="showModal = false"
        @cancel="showModal = false"
      />
    </section>

    <section>
    <h2 class="font-mono text-sm text-ink-soft mb-2">Nav/Navbar</h2>
      <NavNavbar />
    </section>
  </div>
</template>