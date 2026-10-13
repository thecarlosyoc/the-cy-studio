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