// Slugs antiguos (título del caso) -> slugs cortos. 301 para no romper links indexados.
const LEGACY: Record<string, string> = {
  'Huella de carbono': 'carbon-footprint',
  'CRM para la gestión global de clientes': 'crm',
  'Plataforma de seguimiento del crecimiento de los colaboradores': 'employee-wellbeing',
  'App de gestión de riesgo para coordinadores de campo': 'field-risk',
  'Sistema para gestión de pagos y créditos.': 'payments-credits',
}

export default defineEventHandler((event) => {
  const path = event.path.split('?')[0] ?? ''
  if (!path.startsWith('/work/')) return
  let old: string
  try {
    old = decodeURIComponent(path.slice('/work/'.length)).replace(/\/$/, '')
  } catch {
    return
  }
  const next = LEGACY[old]
  if (next) return sendRedirect(event, `/work/${next}`, 301)
})
