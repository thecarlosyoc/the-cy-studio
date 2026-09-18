<!-- app/components/admin/VisualEditor.vue -->
<script setup lang="ts">
import type { GalleryColSpan, GalleryImage, GalleryVisual } from '#shared/types/content'
import { MAX_GALLERY_VISUALS } from '#shared/utils/gallery'

const props = defineProps<{
  modelValue: GalleryVisual[]
  // Miniaturas de la galería: sirven de "línea de tiempo" para elegir dónde
  // insertar cada visual (el número de cada imagen es su etiqueta). Se prefiere
  // `images`; `imageCount` se conserva como fallback sin URLs.
  images?: GalleryImage[]
  imageCount?: number
}>()

// Posiciones disponibles: tantas como imágenes + 1 (el visual va entre ellas).
// Se muestran en 1-based para el humano; se guardan en 0-based.
const imageCount = computed(() => props.images?.length ?? props.imageCount ?? 0)

const emit = defineEmits<{ 'update:modelValue': [GalleryVisual[]]; 'cover-selected': [] }>()

const MAX = MAX_GALLERY_VISUALS
const COL_SPAN_OPTIONS: GalleryColSpan[] = [1, 2, 3]

const uploading = ref<{ file: 'primary' | 'mp4' | 'poster'; index: number } | null>(null)
const uploadError = ref('')

// Etiqueta del progreso de subida para la región viva (qué archivo y de qué
// visual). El éxito no se anuncia aparte: el video aparece en la tarjeta.
const uploadingLabel = computed(() => {
  if (!uploading.value) return ''
  const { file, index } = uploading.value
  const kind = file === 'primary' ? 'video' : file === 'mp4' ? 'fallback MP4' : 'póster'
  return `Subiendo ${kind} del visual ${index + 1}…`
})

function setVisual(i: number, patch: Partial<GalleryVisual>) {
  const list = [...props.modelValue]
  list[i] = { colSpan: 1, format: 'webm', ...(list[i] ?? {}), ...patch }
  emit('update:modelValue', list)
}

// Un visual nuevo nace sin URL; el primario se sube desde su propia tarjeta.
// Por defecto va después de la última imagen; el position-picker lo mueve.
function addVisual() {
  if (props.modelValue.length >= MAX) return
  emit('update:modelValue', [...props.modelValue, { url: '', colSpan: 1, format: 'webm', position: imageCount.value }])
}

function removeVisual(i: number) {
  const list = [...props.modelValue]
  list.splice(i, 1)
  emit('update:modelValue', list)
}

// Unlike gallery images, a visual is never a cover by default — not every
// project has one, and autoplaying a video the admin never explicitly chose
// would be surprising on the public site.
function isCoverAt(i: number): boolean {
  return !!props.modelValue[i]?.isCover
}

function setCover(i: number) {
  const list = props.modelValue.map((v, idx) => ({ ...v, isCover: idx === i }))
  emit('update:modelValue', list)
  emit('cover-selected')
}

async function upload(kind: 'primary' | 'mp4' | 'poster', file: File, i: number) {
  uploading.value = { file: kind, index: i }
  uploadError.value = ''
  try {
    const { url, format } = await uploadToBucket(file)

    if (kind === 'primary') {
      if (!format || (format !== 'webm' && format !== 'mp4')) {
        throw new Error('El archivo primario debe ser .webm o .mp4')
      }
      setVisual(i, { url, format })
    } else if (kind === 'mp4') {
      setVisual(i, { mp4Url: url })
    } else {
      setVisual(i, { poster: url })
    }
  } catch (err: any) {
    uploadError.value = err?.data?.statusMessage || err?.statusMessage || err?.message || 'No se pudo subir el archivo.'
  } finally {
    uploading.value = null
  }
}

function handleFileChange(event: Event, kind: 'primary' | 'mp4' | 'poster', i: number) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  input.value = ''
  if (!file) return
  upload(kind, file, i)
}

function setColSpan(i: number, colSpan: GalleryColSpan) {
  setVisual(i, { colSpan })
}

function setPosition(i: number, position: number) {
  setVisual(i, { position })
}

// Posición de un visual en concreto: clampeada a [0, imageCount].
function positionOf(i: number): number {
  return Math.min(Math.max(props.modelValue[i]?.position ?? 0, 0), imageCount.value)
}

function positionLabel(slot: number): string {
  const n = imageCount.value
  if (n === 0) return 'El visual será la única celda de la galería'
  if (slot === 0) return 'Antes de la 1ª imagen (primera celda del mosaico)'
  if (slot === n) return 'Después de la última imagen (celda final)'
  return `Después de la ${slot}ª imagen`
}

// La posición de cada visual se guarda como índice en la galería (0 = primera
// celda), que es frágil: si en GalleryEditor se reordenan o eliminan imágenes,
// un índice crudo re-apuntaría en silencio a otra celda. Guardamos el ancla —
// la URL de la imagen que estaba justo antes del visual — y re-derivamos la
// posición en la galería nueva para que cada visual conserve su lugar. Si el
// ancla ya no existe (imagen eliminada), el clamp de `positionOf` cubre el
// caso y no forzamos nada.
watch(
  () => props.images,
  (next, prev) => {
    const list = props.modelValue.map((vis) => {
      const p = vis.position ?? 0
      if (p <= 0) return vis
      const anchorUrl = (prev ?? [])[p - 1]?.url
      if (anchorUrl === undefined) return vis
      const idx = (next ?? []).findIndex((img) => img.url === anchorUrl)
      if (idx === -1) return vis
      const newPosition = idx + 1
      return newPosition !== p ? { ...vis, position: newPosition } : vis
    })
    if (list.some((v, i) => v !== props.modelValue[i])) {
      emit('update:modelValue', list)
    }
  },
)
</script>

<template>
  <div :aria-busy="uploading !== null">
    <div class="flex items-baseline gap-2">
      <label class="font-display font-bold text-sm uppercase tracking-wide text-ink">Visual animado</label>
      <span class="text-xs text-ink-soft/80">{{ modelValue.length }}/{{ MAX }} por proyecto, en loop</span>
    </div>
    <p class="mt-1 text-xs text-ink-soft/80">
      Formato recomendado: WebM (primario) + MP4 opcional para Safari. Puedes añadir un póster como imagen de carga previa.
    </p>

    <div
      v-for="(vis, i) in modelValue"
      :key="`${vis.url}-${i}`"
      class="mt-3 rounded-xl bg-ink/5 p-3 space-y-3"
    >
      <div class="flex items-center justify-between gap-2">
        <span class="font-display font-bold text-xs uppercase tracking-wide text-ink">Visual {{ i + 1 }}</span>
        <div class="flex items-center gap-2">
          <label
            class="flex items-center gap-1.5 cursor-pointer text-xs text-ink-soft select-none"
            :class="!vis.url && 'opacity-40 cursor-not-allowed'"
            title="Usar como portada en la card de Work (reemplaza cualquier imagen de portada)"
          >
            <input
              type="radio"
              name="visual-cover"
              class="accent-ink"
              :disabled="!vis.url"
              :checked="isCoverAt(i)"
              @change="setCover(i)"
            />
            Portada
          </label>
          <button
            type="button"
            class="text-xs text-red-700 hover:bg-red-600/10 rounded-lg px-2 py-1"
            @click="removeVisual(i)"
          >
            Quitar visual
          </button>
        </div>
      </div>

      <video
        v-if="vis.url"
        :poster="vis.poster || undefined"
        controls
        muted
        playsinline
        class="w-full max-h-64 rounded-lg bg-ink/10 object-contain"
      >
        <source
          v-if="vis.format === 'webm'"
          :src="vis.url"
          type="video/webm"
        />
        <source
          v-for="(src, si) in [
            vis.format === 'mp4' ? vis.url : null,
            vis.mp4Url ?? null,
          ].filter((s): s is string => !!s)"
          :key="si"
          :src="src"
          type="video/mp4"
        />
      </video>
      <p v-else class="text-xs text-ink-soft/80 italic">
        Sin video todavía — sube el primario abajo.
      </p>

      <div class="flex items-center gap-2">
        <span class="text-xs text-ink-soft">Columnas:</span>
        <button
          v-for="span in COL_SPAN_OPTIONS"
          :key="span"
          type="button"
          class="w-7 h-7 rounded-md text-xs font-medium transition-colors"
          :class="vis.colSpan === span ? 'bg-ink text-paper' : 'bg-ink/10 text-ink-soft hover:bg-ink/20'"
          :title="`${span} columna${span > 1 ? 's' : ''}`"
          @click="setColSpan(i, span)"
        >
          {{ span }}
        </button>
      </div>

      <div>
        <div class="flex items-center justify-between gap-2">
          <span class="text-xs text-ink-soft shrink-0">Posición en la galería:</span>
          <span v-if="imageCount === 0" class="text-[11px] text-ink-soft/80 italic">
            Sin imágenes todavía — el visual ocupará la primera celda
          </span>
        </div>

        <div
          v-if="imageCount > 0"
          role="radiogroup"
          :aria-label="`Posición del visual ${i + 1} dentro de la galería`"
          class="pl-track mt-2 flex items-center gap-1.5 overflow-x-auto pb-1"
        >
          <button
            type="button"
            role="radio"
            :aria-checked="positionOf(i) === 0"
            :title="positionLabel(0)"
            :class="['pl-slot', positionOf(i) === 0 ? 'pl-slot-selected' : '']"
            @click="setPosition(i, 0)"
          >
            <span class="pl-slot-dot" />
          </button>

          <template v-for="(img, gi) in images ?? []" :key="`${img.url}-${gi}`">
            <div
              class="relative w-16 shrink-0 aspect-[4/3] overflow-hidden rounded-lg bg-ink/5 opacity-40 ring-1 ring-ink/20"
              :title="`Imagen ${gi + 1} de la galería`"
            >
              <img
                :src="img.url"
                :alt="`Imagen ${gi + 1} de la galería`"
                loading="lazy"
                class="h-full w-full object-cover"
              />
              <span
                class="absolute top-0.5 left-0.5 rounded bg-paper/85 px-1 font-mono text-[10px] leading-tight text-ink"
              >
                {{ gi + 1 }}
              </span>
            </div>

            <button
              type="button"
              role="radio"
              :aria-checked="positionOf(i) === gi + 1"
              :title="positionLabel(gi + 1)"
              :class="['pl-slot', positionOf(i) === gi + 1 ? 'pl-slot-selected' : '']"
              @click="setPosition(i, gi + 1)"
            >
              <span class="pl-slot-dot" />
            </button>
          </template>
        </div>

        <p v-if="imageCount > 0" class="mt-1.5 text-[11px] text-ink-soft/80">
          {{ positionLabel(positionOf(i)) }}
        </p>
      </div>

      <div class="flex flex-wrap items-center gap-2">
        <p class="w-full text-xs text-ink-soft truncate" :title="vis.url">Primario ({{ vis.format.toUpperCase() }}): {{ fileNameFromUrl(vis.url) }}</p>
        <p
          v-if="vis.mp4Url"
          class="w-full text-xs text-ink-soft truncate"
          :title="vis.mp4Url"
        >
          Fallback MP4: {{ fileNameFromUrl(vis.mp4Url) }}
          <button
            type="button"
            class="ml-1 text-red-700 hover:text-red-800"
            title="Quitar fallback MP4"
            @click="setVisual(i, { mp4Url: undefined })"
          >
            ✕
          </button>
        </p>
        <p
          v-if="vis.poster"
          class="w-full text-xs text-ink-soft truncate"
          :title="vis.poster"
        >
          Póster: {{ fileNameFromUrl(vis.poster) }}
          <button
            type="button"
            class="ml-1 text-red-700 hover:text-red-800"
            title="Quitar póster"
            @click="setVisual(i, { poster: undefined })"
          >
            ✕
          </button>
        </p>
      </div>

      <div class="flex flex-wrap gap-2">
        <label class="inline-block cursor-pointer rounded-full transition-colors focus-within:ring-2 focus-within:ring-ink/30">
          <span class="font-body font-medium rounded-full px-4 py-2 bg-ink/5 text-ink hover:bg-ink/10 inline-block">
            {{ uploading?.file === 'primary' && uploading.index === i ? 'Subiendo…' : '+ Subir video (WebM/MP4)' }}
          </span>
          <input type="file" accept="video/*" class="sr-only" :disabled="!!uploading" @change="handleFileChange($event, 'primary', i)" />
        </label>
        <label class="inline-block cursor-pointer rounded-full transition-colors focus-within:ring-2 focus-within:ring-ink/30">
          <span class="font-body font-medium rounded-full px-4 py-2 bg-ink/5 text-ink hover:bg-ink/10 inline-block">
            {{ uploading?.file === 'mp4' && uploading.index === i ? 'Subiendo…' : '+ Fallback MP4 (opcional)' }}
          </span>
          <input type="file" accept="video/mp4" class="sr-only" :disabled="!!uploading" @change="handleFileChange($event, 'mp4', i)" />
        </label>
        <label class="inline-block cursor-pointer rounded-full transition-colors focus-within:ring-2 focus-within:ring-ink/30">
          <span class="font-body font-medium rounded-full px-4 py-2 bg-ink/5 text-ink hover:bg-ink/10 inline-block">
            {{ uploading?.file === 'poster' && uploading.index === i ? 'Subiendo…' : '+ Póster (opcional)' }}
          </span>
          <input type="file" accept="image/*" class="sr-only" :disabled="!!uploading" @change="handleFileChange($event, 'poster', i)" />
        </label>
      </div>
    </div>

    <div class="mt-3">
      <button
        type="button"
        class="font-body font-medium rounded-full px-4 py-2 text-ink transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
        :class="modelValue.length >= MAX ? 'bg-ink/5' : 'bg-ink/5 hover:bg-ink/10'"
        :disabled="modelValue.length >= MAX"
        @click="addVisual"
      >
        {{ modelValue.length >= MAX ? `Máximo alcanzado (${MAX})` : '+ Agregar visual' }}
      </button>
      <p
        v-if="uploadingLabel || uploadError"
        role="status"
        aria-live="polite"
        class="mt-2 text-sm"
        :class="uploadError ? 'text-red-700' : 'text-ink-soft'"
      >
        {{ uploadError || uploadingLabel }}
      </p>
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
  width: 1.5rem;
  align-self: stretch;
  flex-shrink: 0;
  border-radius: 9999px;
  border: 1px dashed rgb(var(--color-ink) / 0.5);
  color: rgb(var(--color-ink) / 0.55);
  transition:
    background 0.15s ease,
    border-color 0.15s ease,
    color 0.15s ease;
}
.pl-slot:hover {
  border-color: rgb(var(--color-ink) / 0.55);
  background: rgb(var(--color-ink) / 0.06);
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
  background: rgb(var(--color-cobalt));
  /* paper, not a literal white: in dark mode cobalt flips to a much
     brighter blue (#6b76ff), and white text on it drops to ~3.7:1 — below
     AA. paper/ink invert together, so ink-colored text rides along and
     stays >=5:1 against the brighter dark-mode cobalt. */
  color: rgb(var(--color-paper));
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