import type { QuoteEstimate, QuoteItemInput, QuoteRegion, QuoteSize } from '#shared/types/quote'

// Misma lógica que la "Calculadora de costo de proyecto" de Notion
// (/mnt/project-files/cotizador/calculadora-costo-proyecto.html): horas × tarifa + colchón.
// Si cambias las tarifas allá, cámbialas aquí también.
// Las tarifas incluyen la comisión de Recurrente (4.5 % + IVA, más Q2.50 por cobro):
// no hay recargo por tarjeta y se factura siempre el total.
const RATES: Record<QuoteRegion, { design: number; code: number }> = {
  gt: { design: 32, code: 37 },
  abroad: { design: 48, code: 53 },
}
const BUFFER = 0.3
// Referencia del Banguat, aproximada. El estimado es un rango; la cotización formal usa la del día.
const USD_TO_GTQ = 7.7

// Horas por servicio y tamaño: [mín, máx] de diseño y de código.
// Supuestos iniciales para el estimado público; ajústalos con tus horas reales.
// Las claves son los slugs de shared/data/services.ts.
type Hours = { design: [number, number]; code: [number, number] }
const h = (design: [number, number], code: [number, number] = [0, 0]): Hours => ({ design, code })

export const QUOTE_HOURS: Record<string, Record<QuoteSize, Hours>> = {
  'product-design': { s: h([40, 60]), m: h([70, 110]), l: h([120, 180]) },
  'design-system': { s: h([30, 45]), m: h([50, 80]), l: h([90, 140], [20, 40]) },
  'ux-audit': { s: h([12, 18]), m: h([20, 30]), l: h([32, 45]) },
  'landing-page': { s: h([8, 12], [10, 14]), m: h([12, 18], [14, 20]), l: h([18, 24], [20, 28]) },
  website: { s: h([20, 30], [30, 45]), m: h([30, 45], [45, 70]), l: h([45, 70], [70, 110]) },
  frontend: { s: h([0, 0], [20, 35]), m: h([0, 0], [40, 70]), l: h([0, 0], [80, 140]) },
  'brand-identity': { s: h([16, 24]), m: h([28, 40]), l: h([45, 65]) },
  'social-content': { s: h([10, 14]), m: h([16, 22]), l: h([26, 36]) },
  motion: { s: h([12, 18]), m: h([20, 30]), l: h([35, 50]) },
  'ui-motion': { s: h([6, 10], [8, 14]), m: h([12, 18], [16, 26]), l: h([20, 30], [30, 45]) },
}

export function isQuotableService(slug: string) {
  return Object.hasOwn(QUOTE_HOURS, slug)
}

export function estimateQuote(items: QuoteItemInput[], region: QuoteRegion): QuoteEstimate {
  const rate = RATES[region]
  const currency = region === 'gt' ? 'GTQ' : 'USD'
  const fx = currency === 'GTQ' ? USD_TO_GTQ : 1
  // Redondeo hacia afuera para que el rango no prometa de menos: Q100 / $50.
  const step = currency === 'GTQ' ? 100 : 50
  const cost = (i: 0 | 1, hours: Hours) =>
    (hours.design[i] * rate.design + hours.code[i] * rate.code) * (1 + BUFFER) * fx

  const parts = items.map(({ slug, size }) => {
    const hours = QUOTE_HOURS[slug]![size]
    return {
      slug,
      size,
      min: Math.floor(cost(0, hours) / step) * step,
      max: Math.ceil(cost(1, hours) / step) * step,
    }
  })

  return {
    currency,
    min: parts.reduce((sum, p) => sum + p.min, 0),
    max: parts.reduce((sum, p) => sum + p.max, 0),
    plusVat: currency === 'GTQ',
    items: parts,
  }
}

// Número corto para hablar de la solicitud por WhatsApp o correo: "CY-3F9A1C".
export function quoteRef(id: string) {
  return `CY-${id.replace(/-/g, '').slice(0, 6).toUpperCase()}`
}
