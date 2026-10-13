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
      <h2 class="font-mono text-sm text-ink-soft mb-2">Core/SwapLabel — 5 states</h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Default</p>
          <button type="button" class="group/control inline-flex items-center rounded-full bg-ink/5 px-4 h-9 text-sm text-ink">
            <CoreSwapLabel text="Ver trabajo" />
          </button>
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Loading</p>
          <p class="text-xs text-ink-soft italic">N/A: etiqueta decorativa, sin estado asíncrono</p>
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Error</p>
          <p class="text-xs text-ink-soft italic">N/A: etiqueta decorativa, sin estado de validación</p>
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Empty</p>
          <button type="button" aria-label="Icono" class="group/control inline-flex items-center justify-center rounded-full bg-ink/5 px-4 h-9 text-sm text-ink">
            <CoreSwapLabel text="" icon-position="end">
              <template #icon>
                <svg class="h-4 w-4" viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="1.5">
                  <path d="M5 15L15 5M15 5H7M15 5V13" stroke-linecap="round" stroke-linejoin="round" />
                </svg>
              </template>
            </CoreSwapLabel>
          </button>
        </div>
        <div class="max-w-[160px]">
          <p class="font-mono text-xs text-ink-soft mb-2">Overflow (160px)</p>
          <button type="button" class="group/control inline-flex items-center rounded-full bg-ink/5 px-4 h-9 text-sm text-ink max-w-full overflow-hidden">
            <CoreSwapLabel text="Identidad de marca y sistemas de diseño completos para empresas globales" />
          </button>
        </div>
      </div>
    </section>

    <section>
      <h2 class="font-mono text-sm text-ink-soft mb-2">Core/CoverMedia — 5 states</h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Default</p>
          <div class="w-[220px] h-[300px] rounded-2xl overflow-hidden bg-ink/5">
            <CoreCoverMedia
              :video="{ url: 'https://www.w3schools.com/html/mov_bbb.mp4', format: 'mp4' }"
              poster="/images/placeholder-1.png"
              alt="Video de muestra"
            />
          </div>
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Loading</p>
          <p class="text-xs text-ink-soft italic">N/A: preload="none", el póster se muestra hasta iniciar la reproducción</p>
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Error</p>
          <div class="w-[220px] h-[300px] rounded-2xl overflow-hidden bg-ink/5">
            <CoreCoverMedia
              :video="{ url: 'https://example.com/unreachable-video.mp4', format: 'mp4' }"
              poster="/images/placeholder-1.png"
              alt="Video no disponible"
            />
          </div>
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Empty</p>
          <div class="w-[220px] h-[300px] rounded-2xl overflow-hidden bg-ink/5">
            <CoreCoverMedia
              :video="{ url: '', format: 'mp4' }"
              poster=""
              alt="Sin video"
            />
          </div>
        </div>
        <div class="max-w-[160px]">
          <p class="font-mono text-xs text-ink-soft mb-2">Overflow (160px)</p>
          <div class="w-[160px] h-[220px] rounded-2xl overflow-hidden bg-ink/5">
            <CoreCoverMedia
              :video="{ url: 'https://www.w3schools.com/html/mov_bbb.mp4', format: 'mp4' }"
              poster="/images/placeholder-1.png"
              alt="Video en contenedor reducido"
            />
          </div>
        </div>
      </div>
    </section>

    <section>
      <h2 class="font-mono text-sm text-ink-soft mb-2">Nav/Dock — 5 states</h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Default</p>
          <div class="relative h-24 overflow-hidden [transform:translateZ(0)]">
            <NavDock />
          </div>
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Loading</p>
          <p class="text-xs text-ink-soft italic">N/A: chrome de navegación, sin estado de carga</p>
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Error</p>
          <p class="text-xs text-ink-soft italic">N/A: chrome de navegación, sin estado de error</p>
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Empty</p>
          <p class="text-xs text-ink-soft italic">N/A: enlaces de navegación fijos, sin contenido vacío</p>
        </div>
        <div class="max-w-[160px]">
          <p class="font-mono text-xs text-ink-soft mb-2">Overflow (160px)</p>
          <p class="text-xs text-ink-soft italic">N/A: chrome fijo del viewport (185px), el viewport mínimo de 320px nunca lo recorta</p>
        </div>
      </div>
    </section>

    <section>
      <h2 class="font-mono text-sm text-ink-soft mb-2">Nav/Dot — 5 states</h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Default</p>
          <NavDot />
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Loading</p>
          <p class="text-xs text-ink-soft italic">N/A: elemento decorativo estático, sin estado de carga</p>
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Error</p>
          <p class="text-xs text-ink-soft italic">N/A: elemento decorativo estático, sin estado de error</p>
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Empty</p>
          <p class="text-xs text-ink-soft italic">N/A: elemento decorativo sin contenido ni texto</p>
        </div>
        <div class="max-w-[160px]">
          <p class="font-mono text-xs text-ink-soft mb-2">Overflow (160px)</p>
          <p class="text-xs text-ink-soft italic">N/A: dimensión fija de 8px, sin texto que desborde</p>
        </div>
      </div>
    </section>

    <section>
      <h2 class="font-mono text-sm text-ink-soft mb-2">Nav/Navbar — 5 states</h2>
      <div class="grid gap-6 sm:grid-cols-2">
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Default</p>
          <div class="relative h-24 overflow-hidden [transform:translateZ(0)]">
            <NavNavbar />
          </div>
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Loading</p>
          <p class="text-xs text-ink-soft italic">N/A: chrome de navegación, sin estado de carga</p>
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Error</p>
          <p class="text-xs text-ink-soft italic">N/A: chrome de navegación, sin estado de error</p>
        </div>
        <div>
          <p class="font-mono text-xs text-ink-soft mb-2">Empty</p>
          <p class="text-xs text-ink-soft italic">N/A: enlaces de navegación fijos, no depende de datos vacíos</p>
        </div>
        <div class="max-w-[160px]">
          <p class="font-mono text-xs text-ink-soft mb-2">Overflow (160px)</p>
          <p class="text-xs text-ink-soft italic">N/A: barra fija diseñada para el ancho completo del viewport</p>
        </div>
      </div>
    </section>
  </div>
</template>
