<!-- app/components/muebleros/LiveDemo.vue -->
<script setup lang="ts">
// Teléfono de ejemplo hecho en código: estado inicial con 3 ventas; cada 3.5 s entra una nueva
// (seis en total) y al terminar vuelve al estado inicial. Con prefers-reduced-motion: sin
// intervalo ni animaciones, queda el estado inicial. Alto fijo en feed y marco: sin salto de layout.
import type { MbSlot } from '~/data/muebleros-images'
const t = useT()

type Sale = { id: number; prod: 1 | 2 | 3 | 4 | 5 | 6; amount: number; room: 0 | 1 | 2 }
const SALES: Sale[] = [
  { id: 0, prod: 1, amount: 6850, room: 0 },
  { id: 1, prod: 2, amount: 12850, room: 1 },
  { id: 2, prod: 3, amount: 4900, room: 2 },
  { id: 3, prod: 4, amount: 5800, room: 0 },
  { id: 4, prod: 5, amount: 8800, room: 1 },
  { id: 5, prod: 6, amount: 1850, room: 2 },
]
const slots: Record<Sale['prod'], MbSlot> = { 1: 'p-sala', 2: 'p-comedor', 3: 'p-ropero', 4: 'p-cama', 5: 'p-recamara', 6: 'p-mesa' }
const prodKeys = { 1: 'mbProd1', 2: 'mbProd2', 3: 'mbProd3', 4: 'mbProd4', 5: 'mbProd5', 6: 'mbProd6' } as const
const roomKeys = ['mbRoom1', 'mbRoom2', 'mbRoom3'] as const
const tabKeys = ['mbTab1', 'mbTab2', 'mbTab3', 'mbTab4'] as const
const segKeys = ['mbSeg1', 'mbSeg2', 'mbSeg3'] as const
const AGO = [3, 8, 21] // minutos fijos por posición en el feed

// "Hoy" es la suma de las salas en todo estado: no existe otra fuente de la cifra.
const initialRooms = () => [{ total: 14650, n: 4 }, { total: 22200, n: 3 }, { total: 9300, n: 2 }]
const rooms = ref(initialRooms())
const feed = ref<Sale[]>([SALES[2], SALES[1], SALES[0]])
const fresh = ref(-1)
const today = computed(() => rooms.value.reduce((a, r) => a + r.total, 0))
const maxRoom = computed(() => Math.max(...rooms.value.map((r) => r.total)))

const q = (n: number) => `Q ${n.toLocaleString('en-US')}`
const fill = (key: 'mbSalesCount' | 'mbAgo', n: number) => t(key).replace('{n}', String(n))
const label = (s: Sale, i: number) => (s.id === fresh.value ? t('mbNow') : fill('mbAgo', AGO[i]))

let k = 0
let timer: ReturnType<typeof setInterval> | undefined
function tick() {
  if (document.hidden) return
  if (k === 6) {
    rooms.value = initialRooms()
    feed.value = [SALES[2], SALES[1], SALES[0]]
    fresh.value = -1
    k = 0
    return
  }
  const s = SALES[(3 + k) % 6]
  feed.value = [{ ...s, id: 10 + k }, ...feed.value].slice(0, 3)
  fresh.value = 10 + k
  rooms.value[s.room].total += s.amount
  rooms.value[s.room].n += 1
  k += 1
}
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(tick, 3500)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div>
    <p class="sr-only">{{ t('mbDemoTag') }}. {{ t('mbDemoToday') }}: {{ q(today) }}</p>
    <div
      aria-hidden="true"
      class="relative mx-auto aspect-[9/19] w-full max-w-[340px] overflow-hidden rounded-[44px] border-8 border-ink bg-paper select-none md:max-w-[360px]"
    >
      <div class="flex h-full flex-col px-3 pt-1.5">
        <!-- Barra de estado: hora fija, señal y batería dibujadas -->
        <div class="flex h-5 items-center justify-between px-2 font-display text-[11px] font-bold tabular-nums text-ink">
          <span>10:24</span>
          <span class="flex items-center gap-1">
            <span class="flex items-end gap-px"><i class="block h-1 w-[3px] bg-ink" /><i class="block h-1.5 w-[3px] bg-ink" /><i class="block h-2 w-[3px] bg-ink" /><i class="block h-2.5 w-[3px] bg-ink" /></span>
            <span class="block h-2.5 w-5 rounded-[3px] border border-ink p-px"><i class="block h-full w-3/4 rounded-[1px] bg-ink" /></span>
          </span>
        </div>
        <!-- Barra de app -->
        <div class="mt-1 flex h-10 items-center gap-2">
          <span class="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-ink/80 font-display text-sm font-bold text-paper">{{ t('mbDemoStore').charAt(0) }}</span>
          <span class="min-w-0 flex-1 truncate font-display text-sm font-bold text-ink">{{ t('mbDemoStore') }}</span>
          <span class="shrink-0 rounded-full border border-ink/30 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[.16em] text-ink">{{ t('mbDemoTag') }}</span>
        </div>

        <p class="mt-1.5 text-xs text-ink-soft">{{ t('mbDemoToday') }}</p>
        <p class="font-display text-[40px] font-bold leading-[44px] tabular-nums text-ink">{{ q(today) }}</p>

        <div class="mt-1.5 grid h-8 grid-cols-3 gap-1 rounded-full bg-ink/5 p-1 text-center font-display text-xs">
          <span v-for="(k2, i) in segKeys" :key="k2" class="flex items-center justify-center rounded-full" :class="i === 0 ? 'bg-ink/80 font-bold text-paper' : 'font-medium text-ink-soft'">{{ t(k2) }}</span>
        </div>

        <ul class="mt-2">
          <li v-for="(r, i) in rooms" :key="i" class="h-11 py-1">
            <div class="flex items-baseline justify-between">
              <span class="min-w-0 truncate font-display text-[13px] text-ink">{{ t(roomKeys[i]) }} <span class="text-xs tabular-nums text-ink-soft">· {{ fill('mbSalesCount', r.n) }}</span></span>
              <span class="font-display text-[13px] font-bold tabular-nums text-ink">{{ q(r.total) }}</span>
            </div>
            <div class="mt-1.5 h-[3px] rounded-full bg-ink/10">
              <div class="bar h-full origin-left rounded-full bg-ink/80" :style="{ transform: `scaleX(${r.total / maxRoom})` }" />
            </div>
          </li>
        </ul>

        <dl class="mt-2 grid grid-cols-3 gap-1.5 text-center">
          <div class="flex flex-col-reverse rounded-xl bg-ink/5 px-1 py-1.5">
            <dt class="text-[11px] leading-tight text-ink-soft">{{ t('mbApartados') }}</dt>
            <dd class="font-display text-base font-bold leading-5 text-ink">6</dd>
          </div>
          <div class="flex flex-col-reverse rounded-xl bg-ink/5 px-1 py-1.5">
            <dt class="text-[11px] leading-tight text-ink-soft">{{ t('mbAbonos') }}</dt>
            <dd class="font-display text-sm font-bold leading-5 tabular-nums text-ink">Q 23,400</dd>
          </div>
          <div class="flex flex-col-reverse rounded-xl bg-ink/5 px-1 py-1.5">
            <dt class="text-[11px] leading-tight text-ink-soft">{{ t('mbPedidos') }}</dt>
            <dd class="font-display text-base font-bold leading-5 text-ink">5</dd>
          </div>
        </dl>

        <p class="mt-2 font-mono text-[10px] uppercase tracking-[.16em] text-ink-soft">{{ t('mbFeedTitle') }}</p>
        <!-- Alto fijo (3 filas): la venta nueva empuja a la última fuera, el layout no se mueve. -->
        <ul class="mt-1 h-[192px] shrink-0 overflow-hidden">
          <li v-for="(s, i) in feed" :key="s.id" class="feed-row relative flex h-16 items-center gap-2 border-b border-ink/10 py-1">
            <i v-if="s.id === fresh" class="fresh-bar absolute inset-y-1 left-0 w-0.5 bg-cobalt" />
            <span class="block h-12 w-12 shrink-0 overflow-hidden rounded-lg [&>picture]:block [&>picture]:h-full">
              <MueblerosPhoto :photo="slots[s.prod]" sizes="48px" decorative />
            </span>
            <span class="min-w-0 flex-1">
              <span class="block truncate font-display text-[13px] leading-4 text-ink">{{ t(prodKeys[s.prod]) }}</span>
              <span class="flex items-center gap-1.5 leading-5">
                <span class="font-display text-[13px] font-bold tabular-nums text-ink">{{ q(s.amount) }}</span>
                <span class="shrink-0 rounded-full border border-ink/30 px-1.5 font-mono text-[10px] uppercase leading-4 tracking-[.08em] text-ink">{{ s.amount > 2500 ? t('mbChipFel') : t('mbDeposit') }}</span>
              </span>
              <span class="block truncate text-[11px] leading-4 tabular-nums text-ink-soft">{{ t(roomKeys[s.room]) }} · {{ label(s, i) }}</span>
            </span>
          </li>
        </ul>

        <!-- Pestañas: "solid" = activa -->
        <div class="mt-auto grid h-12 grid-cols-4 items-center gap-1 border-t border-ink/10 pb-1.5 pt-1.5 text-center font-display text-xs">
          <span v-for="(k2, i) in tabKeys" :key="k2" class="flex h-8 items-center justify-center rounded-full" :class="i === 0 ? 'bg-ink/80 font-bold text-paper' : 'font-medium text-ink-soft'">{{ t(k2) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .bar { transition: transform 600ms cubic-bezier(.22, 1, .36, 1); }
  .feed-row { animation: feed-in 400ms cubic-bezier(.22, 1, .36, 1); }
  .fresh-bar { animation: fresh-off 200ms 1.5s forwards; }
  @keyframes feed-in { from { opacity: 0; } }
  @keyframes fresh-off { to { opacity: 0; } }
}
</style>
