<!-- app/components/admin/QuoteRequests.vue -->
<script setup lang="ts">
import { SERVICES } from '~/data/services'
import type { QuoteRequestAdmin, QuoteStatus } from '#shared/types/quote'

const { show } = useAdminToast()

const { data: requests, error } = await useFetch<QuoteRequestAdmin[]>('/api/admin/quotes', {
  headers: useRequestHeaders(['cookie']),
})

const STATUS_LABEL: Record<QuoteStatus, string> = {
  new: 'Nueva',
  contacted: 'Contactado',
  demo: 'Demo agendada',
  won: 'Ganada',
  lost: 'Perdida',
}
const SIZE_LABEL = { s: 'pequeño', m: 'mediano', l: 'grande' }
const TIMING_LABEL = { flexible: 'Sin prisa', month: 'En el próximo mes', urgent: 'Lo antes posible' }

const title = (slug: string) => SERVICES.find((s) => s.slug === slug)?.title.es ?? slug
const money = (r: QuoteRequestAdmin, n: number) => `${r.estimate.currency === 'GTQ' ? 'Q' : '$'}${n.toLocaleString('en-US')}`
const date = (iso: string) => new Date(iso).toLocaleString('es-GT', { dateStyle: 'medium', timeStyle: 'short' })
const whatsappHref = (r: QuoteRequestAdmin) => {
  const digits = r.whatsapp!.replace(/\D/g, '')
  // Un número de 8 dígitos es de Guatemala; se le agrega el 502.
  const phone = digits.length === 8 ? `502${digits}` : digits
  const text = `Hola ${r.name.split(' ')[0]}, soy Carlos de the CY studio. Recibí tu solicitud ${r.ref}.`
  return `https://wa.me/${phone}?text=${encodeURIComponent(text)}`
}

async function setStatus(r: QuoteRequestAdmin, status: QuoteStatus) {
  const previous = r.status
  r.status = status
  try {
    await $fetch(`/api/admin/quotes/${r.id}`, { method: 'PATCH', body: { status } })
    show(`${r.ref}: ${STATUS_LABEL[status]}`)
  } catch {
    r.status = previous
    show('No se pudo cambiar el estado')
  }
}
</script>

<template>
  <div>
    <p v-if="error" class="text-sm text-ink">No se pudieron cargar las solicitudes. ¿Ya existe la tabla quote_requests?</p>
    <p v-else-if="!requests?.length" class="text-sm text-ink-soft">Todavía no hay solicitudes del cotizador.</p>

    <ul v-else class="divide-y divide-ink/10 border-y border-ink/10">
      <li v-for="r in requests" :key="r.id" class="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4 py-5">
        <div class="min-w-0">
          <p class="font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">
            {{ r.ref }} · {{ date(r.createdAt) }} · {{ r.region === 'gt' ? 'Guatemala' : 'Exterior' }} · {{ TIMING_LABEL[r.timing] }}
          </p>
          <p class="mt-2 font-display font-bold text-lg text-ink">
            {{ r.name }}<span v-if="r.business" class="font-normal text-ink-soft"> · {{ r.business }}</span>
          </p>
          <p class="mt-1 text-ink">
            {{ money(r, r.estimate.min) }} – {{ money(r, r.estimate.max) }}{{ r.estimate.plusVat ? ' + IVA' : '' }}
          </p>
          <p class="mt-1 text-sm text-ink-soft">
            {{ r.estimate.items.map((i) => `${title(i.slug)} (${SIZE_LABEL[i.size]})`).join(' · ') }}
          </p>
          <p v-if="r.brief" class="mt-2 text-sm text-ink whitespace-pre-line">{{ r.brief }}</p>
          <p class="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
            <a :href="`mailto:${r.email}?subject=${encodeURIComponent(`Tu cotización ${r.ref} · the CY studio`)}`" class="text-ink-soft hover:text-ink underline">{{ r.email }}</a>
            <a v-if="r.whatsapp" :href="whatsappHref(r)" target="_blank" rel="noopener noreferrer" class="text-ink-soft hover:text-ink underline">WhatsApp {{ r.whatsapp }}</a>
          </p>
        </div>
        <label class="flex items-center gap-2 self-start text-sm text-ink-soft">
          Estado
          <select
            :value="r.status"
            class="rounded-full bg-ink/5 px-3 h-9 text-ink focus:outline-none focus:ring-2 focus:ring-cobalt/60"
            @change="setStatus(r, ($event.target as HTMLSelectElement).value as QuoteStatus)"
          >
            <option v-for="(label, value) in STATUS_LABEL" :key="value" :value="value">{{ label }}</option>
          </select>
        </label>
      </li>
    </ul>
  </div>
</template>
