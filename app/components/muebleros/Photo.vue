<!-- app/components/muebleros/Photo.vue -->
<script setup lang="ts">
// Foto de /muebleros por slot del manifiesto. El recorte lo pone la clase del padre (aspect + overflow).
import { mbImages, type MbSlot } from '~/data/muebleros-images'
const props = defineProps<{ photo: MbSlot; sizes: string; eager?: boolean; decorative?: boolean }>()
const lang = useLang()
const img = computed(() => mbImages[props.photo])
const attrs = computed(() => ({
  class: 'h-full w-full object-cover',
  style: `object-position:${img.value.focus}`,
  ...(props.eager ? { fetchpriority: 'high' } : {}),
}))
</script>

<template>
  <NuxtPicture
    :src="img.src"
    :width="img.width"
    :height="img.height"
    :alt="decorative ? '' : img.alt[lang]"
    format="avif,webp"
    :sizes="sizes"
    :quality="60"
    :loading="eager ? 'eager' : 'lazy'"
    :img-attrs="attrs"
  />
</template>
