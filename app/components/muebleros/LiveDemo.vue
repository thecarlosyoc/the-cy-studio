<!-- app/components/muebleros/LiveDemo.vue -->
<script setup lang="ts">
// Panel de ejemplo dentro de un marco de teléfono, hecho en código.
// Cada pocos segundos entra una venta de muestra y los totales suben, para que se lea en tiempo real.
// Sin prefers-reduced-motion: ni intervalo ni transiciones, queda el estado inicial estático.
const t = useT()

type Sale = { id: number; prod: 1 | 2 | 3 | 4 | 5 | 6; amount: number; deposit: number; room: 0 | 1 | 2 }
const SALES: Omit<Sale, 'id'>[] = [
  { prod: 1, amount: 4800, deposit: 2000, room: 2 },
  { prod: 2, amount: 6200, deposit: 3000, room: 0 },
  { prod: 3, amount: 2900, deposit: 1000, room: 1 },
  { prod: 4, amount: 3500, deposit: 1500, room: 0 },
  { prod: 5, amount: 5400, deposit: 2500, room: 1 },
  { prod: 6, amount: 2200, deposit: 1000, room: 2 },
]
const roomKeys = ['mbRoom1', 'mbRoom2', 'mbRoom3'] as const
const prodKeys = { 1: 'mbProd1', 2: 'mbProd2', 3: 'mbProd3', 4: 'mbProd4', 5: 'mbProd5', 6: 'mbProd6' } as const

// Estado inicial: ya incluye las 3 primeras ventas del feed. 7,900 + 6,350 + 4,200 = 18,450.
const initialRooms = () => [{ total: 7900, n: 4 }, { total: 6350, n: 3 }, { total: 4200, n: 2 }]
const rooms = ref(initialRooms())
const feed = ref<Sale[]>([SALES[0], SALES[1], SALES[2]].map((s, i) => ({ ...s, id: i })).reverse())
const today = computed(() => rooms.value.reduce((a, r) => a + r.total, 0))

const q = (n: number) => `Q ${n.toLocaleString('en-US')}`
const sales = (n: number) => t('mbSalesCount').replace('{n}', String(n))

let cursor = 3
let timer: ReturnType<typeof setInterval> | undefined
function tick() {
  if (document.hidden) return
  // Tras 6 ventas el día vuelve al estado inicial, así "Hoy" nunca llega a cifras increíbles.
  if (cursor > 0 && cursor % 9 === 0) rooms.value = initialRooms()
  const s = SALES[cursor % SALES.length]
  feed.value = [{ ...s, id: cursor }, ...feed.value].slice(0, 3)
  rooms.value[s.room].total += s.amount
  rooms.value[s.room].n += 1
  cursor += 1
}
onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
  timer = setInterval(tick, 3500)
})
onUnmounted(() => clearInterval(timer))
</script>

<template>
  <div class="mx-auto w-full max-w-[300px] rounded-[36px] border-[6px] border-ink bg-paper p-3 shadow-xl select-none">
    <div class="flex items-center justify-between">
      <p class="font-display text-sm font-bold text-ink">{{ t('mbDemoToday') }}</p>
      <p class="rounded-full border border-ink/15 px-2.5 py-1 font-mono text-[11px] uppercase tracking-[.16em] text-ink">{{ t('mbDemoTag') }}</p>
    </div>
    <p class="mt-1 font-display text-[34px] font-bold leading-none tabular-nums text-ink">{{ q(today) }}</p>

    <ul class="mt-3 divide-y divide-ink/10 rounded-2xl bg-ink/5">
      <li v-for="(r, i) in rooms" :key="i" class="flex h-11 items-center justify-between px-3">
        <span class="min-w-0">
          <span class="block truncate font-display text-sm text-ink">{{ t(roomKeys[i]) }}</span>
          <span class="block text-xs tabular-nums text-ink-soft">{{ sales(r.n) }}</span>
        </span>
        <span class="font-display text-sm font-bold tabular-nums text-ink">{{ q(r.total) }}</span>
      </li>
    </ul>

    <dl class="mt-2 grid grid-cols-3 gap-2 text-center">
      <div class="flex flex-col-reverse rounded-2xl bg-ink/5 px-1 py-2">
        <dt class="mt-1 text-xs leading-tight text-ink-soft">{{ t('mbApartados') }}</dt>
        <dd class="font-display text-lg font-bold leading-none text-ink">6</dd>
      </div>
      <div class="flex flex-col-reverse rounded-2xl bg-ink/5 px-1 py-2">
        <dt class="mt-1 text-xs leading-tight text-ink-soft">{{ t('mbAbonos') }}</dt>
        <dd class="font-display text-sm font-bold leading-[18px] tabular-nums text-ink">Q 23,400</dd>
      </div>
      <div class="flex flex-col-reverse rounded-2xl bg-ink/5 px-1 py-2">
        <dt class="mt-1 text-xs leading-tight text-ink-soft">{{ t('mbPedidos') }} · {{ t('mbPedidosUnit') }}</dt>
        <dd class="font-display text-lg font-bold leading-none text-ink">5</dd>
      </div>
    </dl>

    <p class="mt-3 font-mono text-[11px] uppercase tracking-[.16em] text-ink-soft">{{ t('mbFeedTitle') }}</p>
    <!-- Alto fijo (3 filas): la venta nueva empuja a la última fuera, el layout no se mueve. -->
    <ul class="mt-1 h-[168px] overflow-hidden">
      <li v-for="s in feed" :key="s.id" class="feed-row h-14 border-b border-ink/10 py-1.5">
        <p class="truncate font-display text-sm text-ink">{{ t(prodKeys[s.prod]) }}</p>
        <p class="truncate text-xs tabular-nums text-ink-soft">{{ q(s.amount) }} · {{ t('mbDeposit') }} {{ q(s.deposit) }} · {{ t(roomKeys[s.room]) }}</p>
      </li>
    </ul>
  </div>
</template>

<style scoped>
@media (prefers-reduced-motion: no-preference) {
  .feed-row { animation: feed-in 400ms cubic-bezier(.22, 1, .36, 1); }
  @keyframes feed-in { from { opacity: 0; } }
}
</style>
