<!-- app/components/admin/VisualEditor.vue -->
<script setup lang="ts">
import type { GalleryColSpan, GalleryImage, GalleryVisual, GalleryVisualFormat } from '#shared/types/content'

const props = defineProps<{
  modelValue: GalleryVisual | null
  // Miniaturas de la galería: sirven de "línea de tiempo" para elegir dónde
  // insertar el visual (el número de cada imagen es su etiqueta). Se prefiere
  // `images`; `imageCount` se conserva como fallback sin URLs.
  images?: GalleryImage[]
  imageCount?: number
}>()

// Posiciones disponibles: tantas como imágenes + 1 (el visual va entre ellas).
// Se muestran en 1-based para el humano; se guardan en 0-based.
const imageCount = computed(() => props.images?.length ?? props.imageCount ?? 0)

const emit = defineEmits<{ 'update:modelValue': [GalleryVisual | null] }>()

const COL_SPAN_OPTIONS: GalleryColSpan[] = [1, 2, 3]

const uploading = ref<{ file: 'primary' | 'mp4' | 'poster' } | null>(null)
const uploadError = ref('')

function setVisual(patch: Partial<GalleryVisual>) {
  emit('update:modelValue', { colSpan: 1, format: 'webm', ...(props.modelValue ?? {}), ...patch })
}

async function upload(kind: 'primary' | 'mp4' | 'poster', file: File) {
  uploading.value = { file: kind }
  uploadError.value = ''
  try {
    const form = new FormData()
    form.append('file', file)
    const { url, format } = await $fetch<{ url: string; format?: GalleryVisualFormat }>('/api/admin/upload', {
      method: 'POST',
      body: form,
    })

    if (kind === 'primary') {
      if (!format || (format !== 'webm' && format !== 'mp4')) {
        throw new Error('El archivo primario debe ser .webm o .mp4')
      }
      setVisual({ url, format })
    } else if (kind === 'mp4') {
      setVisual({ mp4Url: url })
    } else {
      setVisual({ poster: url })
    }
  } catch (err: any) {
    uploadError.value = err?.data?.statusMessage || err?.statusMessage || err?.message || 'No se pudo subir el archivo.'
  } finally {
    uploading.value = null
  }
}

function handleFileChange(event: Event, kind: 'primary' | 'mp4' | 'poster') {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  upload(kind, file)
}

function setColSpan(colSpan: GalleryColSpan) {
  if (!props.modelValue) return
  emit('update:modelValue', { ...props.modelValue, colSpan })
}

// Posiciones disponibles: tantas como imágenes + 1 (el visual va entre ellas).
// Se muestran en 1-based para el humano; se guardan en 0-based.
const currentPosition = computed(() =>
  Math.min(Math.max(props.modelValue?.position ?? 0, 0), imageCount.value),
)
function positionLabel(slot: number): string {
  const n = imageCount.value
  if (n === 0) return 'El visual será la única celda de la galería'
  if (slot === 0) return 'Antes de la 1ª imagen (primera celda del mosaico)'
  if (slot === n) return 'Después de la última imagen (celda final)'
  return `Después de la ${slot}ª imagen`
}
function setPosition(slot: number) {
  if (!props.modelValue) return
  emit('update:modelValue', { ...props.modelValue, position: slot })
}

// La posición del visual se guarda como índice en la galería (0 = primera
// celda), que es frágil: si en GalleryEditor se reordenan o eliminan imágenes,
// un índice crudo re-apuntaría en silencio a otra celda. Guardamos el ancla —
// la URL de la imagen que estaba justo antes del visual — y re-derivamos la
// posición en la galería nueva para que el visual conserve su lugar. Si el
// ancla ya no existe (imagen eliminada), el clamp de `currentPosition` cubre
// el caso y no forzamos nada.
watch(
  () => props.images,
  (next, prev) => {
    const vis = props.modelValue
    if (!vis) return
    const p = vis.position ?? 0
    if (p <= 0) return // antes de la 1ª imagen: no hay ancla que preservar
    const anchorUrl = (prev ?? [])[p - 1]?.url
    if (anchorUrl === undefined) return
    const idx = (next ?? []).findIndex((img) => img.url === anchorUrl)
    if (idx === -1) return
    const newPosition = idx + 1
    if (newPosition !== p) {
      emit('update:modelValue', { ...vis, position: newPosition })
    }
  },
)
</script>

<template>
  <div>
    <div class="flex items-baseline gap-2">
      <label class="font-display font-bold text-sm uppercase tracking-wide text-ink">Visual animado</label>
      <span class="text-xs text-ink-soft/60">1 por proyecto, en loop</span>
    </div>
    <p class="mt-1 text-xs text-ink-soft/60">
      Formato recomendado: WebM (primario) + MP4 opcional para Safari. Puedes añadir un póster como imagen de carga previa.
    </p>

    <div
      v-if="modelValue"
      class="mt-3 rounded-xl bg-ink/5 p-3 space-y-3"
    >
      <video
        :poster="modelValue.poster || undefined"
        controls
        muted
        playsinline
        class="w-full max-h-64 rounded-lg bg-ink/10 object-contain"
      >
        <source
          v-if="modelValue.format === 'webm'"
          :src="modelValue.url"
          type="video/webm"
        />
        <source
          v-for="(src, i) in [
            modelValue.format === 'mp4' ? modelValue.url : null,
            modelValue.mp4Url ?? null,
          ].filter((s): s is string => !!s)"
          :key="i"
          :src="src"
          type="video/mp4"
        />
      </video>

      <div class="flex items-center gap-2">
        <span class="text-xs text-ink-soft">Columnas:</span>
        <button
          v-for="span in COL_SPAN_OPTIONS"
          :key="span"
          type="button"
          class="w-7 h-7 rounded-md text-xs font-medium transition-colors"
          :class="modelValue.colSpan === span ? 'bg-ink text-paper' : 'bg-ink/10 text-ink-soft hover:bg-ink/20'"
          :title="`${span} columna${span > 1 ? 's' : ''}`"
          @click="setColSpan(span)"
        >
          {{ span }}
        </button>
      </div>

      <div>
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs text-ink-soft shrink-0">Posición en la galería:</span>
          <span v-if="imageCount === 0" class="text-[11px] text-ink-soft/60 italic">
            Sin imágenes todavía — el visual ocupará la primera celda
          </span>
        </div>

        <div
          v-if="imageCount > 0"
          role="radiogroup"
          aria-label="Posición del visual dentro de la galería"
          class="pl-track mt-2 flex items-center gap-1.5 overflow-x-auto pb-1"
        >
          <button
            type="button"
            role="radio"
            :aria-checked="currentPosition === 0"
            :title="positionLabel(0)"
            :class="['pl-slot', currentPosition === 0 ? 'pl-slot-selected' : '']"
            @click="setPosition(0)"
          >
            <span class="pl-slot-dot" />
          </button>

          <template v-for="(img, i) in images ?? []" :key="`${img.url}-${i}`">
            <div
              class="relative w-16 shrink-0 aspect-[4/3] overflow-hidden rounded-lg bg-ink/5 opacity-40 ring-1 ring-ink/20"
              :title="`Imagen ${i + 1} de la galería`"
            >
              <img
                :src="img.url"
                :alt="`Imagen ${i + 1} de la galería`"
                loading="lazy"
                class="h-full w-full object-cover"
              />
              <span
                class="absolute top-0.5 left-0.5 rounded bg-paper/85 px-1 font-mono text-[10px] leading-tight text-ink"
              >
                {{ i + 1 }}
              </span>
            </div>

            <button
              type="button"
              role="radio"
              :aria-checked="currentPosition === i + 1"
              :title="positionLabel(i + 1)"
              :class="['pl-slot', currentPosition === i + 1 ? 'pl-slot-selected' : '']"
              @click="setPosition(i + 1)"
            >
              <span class="pl-slot-dot" />
            </button>
          </template>
        </div>

        <p v-if="imageCount > 0" class="mt-1.5 text-[11px] text-ink-soft/70">
          {{ positionLabel(currentPosition) }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <p class="w-full text-xs text-ink-soft truncate" :title="modelValue.url">Primario ({{ modelValue.format.toUpperCase() }}): {{ fileNameFromUrl(modelValue.url) }}</p>
        <p
          v-if="modelValue.mp4Url"
          class="w-full text-xs text-ink-soft truncate"
          :title="modelValue.mp4Url"
        >
          Fallback MP4: {{ fileNameFromUrl(modelValue.mp4Url) }}
          <button
            type="button"
            class="ml-1 text-red-600 hover:text-red-700"
            title="Quitar fallback MP4"
            @click="emit('update:modelValue', { ...modelValue, mp4Url: undefined })"
          >
            ✕
          </button>
        </p>
        <p
          v-if="modelValue.poster"
          class="w-full text-xs text-ink-soft truncate"
          :title="modelValue.poster"
        >
          Póster: {{ fileNameFromUrl(modelValue.poster) }}
          <button
            type="button"
            class="ml-1 text-red-600 hover:text-red-700"
            title="Quitar póster"
            @click="emit('update:modelValue', { ...modelValue, poster: undefined })"
          >
            ✕
          </button>
        </p>
      </div>

      <button
        type="button"
        title="Quitar el visual completo"
        class="text-xs text-red-600 hover:bg-red-600/10 rounded-lg px-2 py-1"
        @click="emit('update:modelValue', null)"
      >
        Quitar visual
      </button>
    </div>

    <div class="mt-3 flex flex-wrap gap-2">
      <label class="inline-block cursor-pointer">
        <span class="font-body font-medium rounded-full px-4 py-2 bg-ink/5 text-ink hover:bg-ink/10 inline-block">
          {{ uploading?.file === 'primary' ? 'Subiendo…' : '+ Subir video (WebM/MP4)' }}
        </span>
        <input type="file" accept="video/*" class="hidden" :disabled="!!uploading" @change="handleFileChange($event, 'primary')" />
      </label>
      <label class="inline-block cursor-pointer">
        <span class="font-body font-medium rounded-full px-4 py-2 bg-ink/5 text-ink hover:bg-ink/10 inline-block">
          {{ uploading?.file === 'mp4' ? 'Subiendo…' : '+ Fallback MP4 (opcional)' }}
        </span>
        <input type="file" accept="video/mp4" class="hidden" :disabled="!!uploading" @change="handleFileChange($event, 'mp4')" />
      </label>
      <label class="inline-block cursor-pointer">
        <span class="font-body font-medium rounded-full px-4 py-2 bg-ink/5 text-ink hover:bg-ink/10 inline-block">
          {{ uploading?.file === 'poster' ? 'Subiendo…' : '+ Póster (opcional)' }}
        </span>
        <input type="file" accept="image/*" class="hidden" :disabled="!!uploading" @change="handleFileChange($event, 'poster')" />
      </label>
      <p v-if="uploadError" class="w-full mt-1 text-sm text-red-600">{{ uploadError }}</p>
    </div>
  </div>
</template>

<style scoped>
/* Carril de posiciones: los marcadores se leen como "insertar aquí" entre
   las miniaturas (que aparecen con 40% de opacidad, fantasma del orden). */
.pl-slot {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.25rem;
  align-self: stretch;
  flex-shrink: 0;
  border-radius: 9999px;
  border: 1px dashed rgb(18 17 14 / 0.3);
  color: rgb(18 17 14 / 0.55);
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}
.pl-slot:hover {
  border-color: rgb(18 17 14 / 0.55);
  background: rgb(18 17 14 / 0.06);
}
.pl-slot-dot {
  width: 6px;
  height: 6px;
  border-radius: 9999px;
  background: currentColor;
  opacity: 0.75;
}
.pl-slot-selected {
  border-style: solid;
  border-color: transparent;
  background: #1e2be0;
  color: #ffffff;
}
.pl-slot-selected .pl-slot-dot {
  opacity: 1;
}

/* El carril puede desbordar en pantallas estrechas; sin scrollbar visible. */
.pl-track::-webkit-scrollbar {
  display: none;
}
.pl-track {
  scrollbar-width: none;
  -ms-overflow-style: none;
}
</style>