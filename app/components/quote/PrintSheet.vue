<!--
  Estimado imprimible del cotizador (/quote → "Descargar PDF"). Sigue la cotización
  editorial de la papelería en Figma (archivo 2Yd2ZLPZyejLbNZX1Wfgne, frames 3:20 y 3:100):
  dos hojas carta, medidas en pt para que 1 px de Figma sea 1 pt impreso.
  Solo se ve al imprimir; los estilos que esconden el resto del sitio viven en quote.vue.
-->
<script setup lang="ts">
import { SERVICES } from '#shared/data/services'
import { PLANNED_NOTE, QUOTE_SCOPES, isPlanned } from '#shared/data/quote'
import type { QuoteResponse } from '#shared/types/quote'

const props = defineProps<{ result: QuoteResponse; name: string; business: string; brief: string }>()

const t = useT()
const lang = useLang()

const est = computed(() => props.result.estimate)
const money = (n: number) => `${est.value.currency === 'GTQ' ? 'Q' : '$'}${n.toLocaleString('en-US')}`
const range = (min: number, max: number) => `${money(min)} – ${money(max)}`
// La mitad del rango, redondeada a la misma unidad del estimado (Q100 / $50).
const half = (n: number) => {
  const unit = est.value.currency === 'GTQ' ? 100 : 50
  return Math.round(n / 2 / unit) * unit
}

const items = computed(() => est.value.items.map((item, n) => {
  const service = SERVICES.find((s) => s.slug === item.slug)!
  const scope = QUOTE_SCOPES[item.slug][item.size]
  return {
    ...item,
    number: String(n + 1).padStart(2, '0'),
    title: service.title[lang.value],
    scope: scope.scope[lang.value],
    time: scope.time[lang.value],
    deliverables: service.deliverables.slice(0, 4).map((d) => d[lang.value]),
  }
}))

const dateFmt = (d: Date) => d.toLocaleDateString(lang.value === 'es' ? 'es-GT' : 'en-US', { day: 'numeric', month: 'short', year: 'numeric' }).replace('.', '')
const today = new Date()
const validUntil = new Date(today.getTime() + 15 * 24 * 60 * 60 * 1000)

// Título grande: la empresa si la dio; si no, su nombre.
const title = computed(() => props.business || props.name)
const goal = computed(() => (props.brief.length > 220 ? `${props.brief.slice(0, 217).trimEnd()}…` : props.brief))

const terms = computed(() => [
  t('quotePrintTerm1'),
  t('quotePrintTerm2'),
  t('quotePrintTerm3'),
  ...(est.value.plusVat ? [t('quotePrintTermFel')] : []),
  ...(est.value.items.some((i) => isPlanned(i.slug, i.size)) ? [PLANNED_NOTE[lang.value]] : []),
  t('quotePrintTerm5'),
])
</script>

<template>
  <!-- Space Grotesk for body text too: Inter came out garbled (overlapping
       glyphs) when the printed PDF was opened in Apple Preview. -->
  <div class="quote-print font-display">
    <!-- Hoja 1 · Propuesta -->
    <section class="qp-page">
      <header class="qp-header">
        <BrandLogo class="qp-logo" />
        <p class="qp-tag">{{ t('quoteResultRef').replace('{ref}', result.ref) }}</p>
      </header>

      <p class="qp-tag qp-accent" style="margin-top: 44pt">{{ t('quotePrintEyebrow') }}</p>
      <h1 class="qp-title font-display">{{ title }}</h1>
      <p v-if="goal" class="qp-goal">{{ goal }}</p>

      <div class="qp-meta">
        <div>
          <p class="qp-tag">{{ t('quotePrintFor') }}</p>
          <p class="qp-meta-value font-display">{{ name }}</p>
        </div>
        <div v-if="business">
          <p class="qp-tag">{{ t('quotePrintBusiness') }}</p>
          <p class="qp-meta-value font-display">{{ business }}</p>
        </div>
        <div>
          <p class="qp-tag">{{ t('quotePrintDate') }}</p>
          <p class="qp-meta-value font-display">{{ dateFmt(today) }}</p>
        </div>
        <div>
          <p class="qp-tag">{{ t('quotePrintValidUntil') }}</p>
          <p class="qp-meta-value font-display">{{ dateFmt(validUntil) }}</p>
        </div>
      </div>

      <div class="qp-section" style="margin-top: 32pt">
        <span class="qp-tag qp-accent">01</span>
        <span class="qp-tag qp-ink">{{ t('quotePrintIncludes') }}</span>
        <span class="qp-rule" />
      </div>
      <div v-for="item in items" :key="item.slug" class="qp-service">
        <p class="qp-number font-display">{{ item.number }}</p>
        <div class="qp-service-body">
          <p class="qp-service-title font-display">{{ item.title }}</p>
          <p class="qp-service-scope">{{ item.scope }}</p>
          <ul class="qp-deliverables">
            <li v-for="d in item.deliverables" :key="d">—&nbsp;&nbsp;{{ d }}</li>
          </ul>
        </div>
        <div class="qp-time">
          <p class="qp-tag">{{ t('quotePrintTime') }}</p>
          <p class="qp-time-value font-display">{{ item.time }}</p>
        </div>
      </div>

      <div class="qp-spacer" />
      <footer class="qp-footer">
        <span class="qp-footer-contact font-display">thecystudio.com&nbsp;&nbsp;·&nbsp;&nbsp;hola@thecystudio.com&nbsp;&nbsp;·&nbsp;&nbsp;+502 5212 8955</span>
        <span class="qp-ink">01 / 02</span>
      </footer>
    </section>

    <!-- Hoja 2 · Inversión -->
    <section class="qp-page">
      <header class="qp-header">
        <BrandLogo class="qp-logo" />
        <p class="qp-tag">{{ t('quoteResultRef').replace('{ref}', result.ref) }}</p>
      </header>

      <div class="qp-section" style="margin-top: 40pt">
        <span class="qp-tag qp-accent">02</span>
        <span class="qp-tag qp-ink">{{ t('quotePrintInvestment') }}</span>
        <span class="qp-rule" />
      </div>
      <div v-for="item in items" :key="item.slug" class="qp-row font-display">
        <span>{{ item.title }}</span>
        <span>{{ range(item.min, item.max) }}</span>
      </div>

      <div class="qp-total">
        <div class="qp-total-label">
          <p style="font-weight: 700">{{ t('quotePrintTotal') }}</p>
          <p style="opacity: 0.7">{{ est.plusVat ? t('quotePrintTotalGtq') : t('quotePrintTotalUsd') }}</p>
        </div>
        <p class="qp-total-value font-display">{{ range(est.min, est.max) }}</p>
      </div>

      <div class="qp-payment">
        <div>
          <p class="qp-tag qp-ink">{{ t('quotePrintPayment') }}</p>
          <span class="qp-rule qp-rule-block" />
          <div class="qp-pay-row">
            <span>50 %&nbsp;&nbsp;{{ t('quotePrintPayStart') }}</span>
            <span class="font-display">{{ range(half(est.min), half(est.max)) }}</span>
          </div>
          <div class="qp-pay-row">
            <span>50 %&nbsp;&nbsp;{{ t('quotePrintPayEnd') }}</span>
            <span class="font-display">{{ range(half(est.min), half(est.max)) }}</span>
          </div>
        </div>
        <div>
          <p class="qp-tag qp-ink">{{ t('quotePrintHowToPay') }}</p>
          <span class="qp-rule qp-rule-block" />
          <p class="qp-pay-text">{{ est.plusVat ? t('quotePrintHowToPayText') : t('quotePrintHowToPayAbroad') }}</p>
        </div>
      </div>

      <div class="qp-section" style="margin-top: 28pt">
        <span class="qp-tag qp-accent">03</span>
        <span class="qp-tag qp-ink">{{ t('quotePrintTerms') }}</span>
        <span class="qp-rule" />
      </div>
      <ol class="qp-terms">
        <li v-for="(term, i) in terms" :key="i">
          <span class="qp-tag qp-accent">{{ String(i + 1).padStart(2, '0') }}</span>
          <span>{{ term }}</span>
        </li>
      </ol>

      <div class="qp-spacer" />
      <p class="qp-accept font-display">{{ t('quotePrintAccept') }}</p>
      <footer class="qp-footer" style="margin-top: 24pt">
        <span class="qp-footer-contact font-display">thecystudio.com&nbsp;&nbsp;·&nbsp;&nbsp;hola@thecystudio.com&nbsp;&nbsp;·&nbsp;&nbsp;+502 5212 8955</span>
        <span class="qp-ink">02 / 02</span>
      </footer>
    </section>
  </div>
</template>

<style scoped>
.quote-print {
  --qp-paper: rgb(241 239 234);
  --qp-ink: rgb(18 17 14);
  --qp-ink-soft: rgb(67 65 59);
  --qp-accent: rgb(30 43 224);
  --qp-line: rgb(18 17 14 / 0.14);
  color: var(--qp-ink);
}
.qp-page {
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  width: 612pt;
  min-height: 792pt;
  padding: 40pt 48pt 32pt;
  background: var(--qp-paper);
  break-after: page;
}
.qp-page:last-child {
  break-after: auto;
}
.qp-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.qp-logo {
  height: 16.12pt;
  width: auto;
  color: var(--qp-ink);
  filter: none;
}
.qp-tag {
  font-family: 'Space Mono', monospace;
  font-size: 7pt;
  line-height: 1.4;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--qp-ink-soft);
  white-space: nowrap;
}
.qp-accent {
  color: var(--qp-accent);
}
.qp-ink {
  color: var(--qp-ink);
}
.qp-title {
  margin-top: 8pt;
  font-size: 58pt;
  font-weight: 700;
  line-height: 0.92;
  letter-spacing: -0.05em;
}
.qp-goal {
  margin-top: 14pt;
  max-width: 400pt;
  font-size: 12pt;
  line-height: 1.5;
  color: var(--qp-ink-soft);
}
.qp-meta {
  display: flex;
  margin-top: 28pt;
  padding: 10pt 0;
  border-top: 1px solid var(--qp-line);
  border-bottom: 1px solid var(--qp-line);
}
.qp-meta > div {
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
  gap: 4pt;
}
.qp-meta-value {
  font-size: 11pt;
  font-weight: 700;
  line-height: 1.3;
}
.qp-section {
  display: flex;
  align-items: center;
  gap: 12pt;
}
.qp-rule {
  flex: 1 0 0;
  height: 1px;
  background: var(--qp-line);
}
.qp-rule-block {
  display: block;
  margin: 8pt 0;
}
.qp-service {
  display: flex;
  gap: 16pt;
  align-items: flex-start;
  padding: 12pt 0;
  border-bottom: 1px solid var(--qp-line);
  break-inside: avoid;
}
.qp-number {
  width: 34pt;
  flex-shrink: 0;
  font-size: 20pt;
  font-weight: 700;
  line-height: 1;
  letter-spacing: -0.03em;
  color: var(--qp-accent);
}
.qp-service-body {
  flex: 1 0 0;
  display: flex;
  flex-direction: column;
  gap: 3pt;
}
.qp-service-title {
  font-size: 14pt;
  font-weight: 500;
  line-height: 1.2;
  letter-spacing: -0.01em;
}
.qp-service-scope {
  font-size: 9.5pt;
  line-height: 1.4;
  color: var(--qp-ink-soft);
}
.qp-deliverables {
  padding-top: 3pt;
  font-size: 9pt;
  line-height: 1.5;
}
.qp-time {
  width: 90pt;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 4pt;
  text-align: right;
}
.qp-time-value {
  font-size: 10pt;
  font-weight: 500;
  line-height: 1.3;
  white-space: nowrap;
}
.qp-spacer {
  flex: 1 0 0;
  min-height: 24pt;
}
.qp-footer {
  display: flex;
  justify-content: space-between;
  padding-top: 10pt;
  border-top: 1px solid var(--qp-line);
  font-family: 'Space Mono', monospace;
  font-size: 7pt;
  line-height: 1.4;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  color: var(--qp-ink-soft);
}
.qp-footer-contact {
  font-family: 'Space Grotesk', sans-serif;
}
.qp-row {
  display: flex;
  justify-content: space-between;
  padding: 8pt 0;
  border-bottom: 1px solid var(--qp-line);
  font-size: 12pt;
  font-weight: 500;
  line-height: 1.3;
  font-variant-numeric: tabular-nums;
}
.qp-total {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 16pt;
  margin-top: 14pt;
  padding: 18pt 24pt 20pt;
  background: var(--qp-ink);
  color: var(--qp-paper);
}
.qp-total-label {
  display: flex;
  flex-direction: column;
  gap: 6pt;
  font-family: 'Space Mono', monospace;
  font-size: 7pt;
  line-height: 1.4;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  white-space: nowrap;
}
.qp-total-value {
  font-size: 36pt;
  font-weight: 700;
  line-height: 0.9;
  letter-spacing: -0.05em;
  text-align: right;
  white-space: nowrap;
}
.qp-payment {
  display: flex;
  gap: 24pt;
  margin-top: 28pt;
}
.qp-payment > div {
  flex: 1 0 0;
}
.qp-pay-row {
  display: flex;
  justify-content: space-between;
  gap: 8pt;
  margin-top: 8pt;
  font-size: 10pt;
  line-height: 1.4;
  white-space: nowrap;
}
.qp-pay-row:first-of-type {
  margin-top: 0;
}
.qp-pay-text {
  font-size: 10pt;
  line-height: 1.4;
}
.qp-terms {
  display: flex;
  flex-direction: column;
  gap: 6pt;
  margin-top: 10pt;
}
.qp-terms li {
  display: flex;
  gap: 12pt;
  font-size: 9pt;
  line-height: 1.5;
  color: var(--qp-ink-soft);
}
.qp-accept {
  font-size: 13pt;
  font-weight: 500;
  line-height: 1.25;
  letter-spacing: -0.01em;
}
</style>
