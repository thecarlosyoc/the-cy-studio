import { Resend } from 'resend'
import type { QuoteRequestBody, QuoteResponse, QuoteSize } from '#shared/types/quote'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const SIZES: QuoteSize[] = ['s', 'm', 'l']
const SIZE_LABEL: Record<QuoteSize, string> = { s: 'Pequeño', m: 'Mediano', l: 'Grande' }
const TIMING_LABEL = { flexible: 'Sin prisa', month: 'En el próximo mes', urgent: 'Urgente' }

// Texto libre: recortado y con tope, para que el correo y la tabla no reciban novelas.
const clean = (value: unknown, max: number) => (typeof value === 'string' ? value.trim().slice(0, max) : '')

const money = (currency: string, n: number) => `${currency === 'GTQ' ? 'Q' : '$'}${n.toLocaleString('en-US')}`

export default defineEventHandler(async (event): Promise<QuoteResponse> => {
  const body = await readBody<QuoteRequestBody>(event)

  // Honeypot tripped: answer like a success so bots don't learn to skip the field.
  if (body.website) {
    return { ref: 'CY-000000', estimate: estimateQuote([], 'gt') }
  }

  const name = clean(body.name, 120)
  const email = clean(body.email, 200)
  const whatsapp = clean(body.whatsapp, 40)
  const business = clean(body.business, 160)
  const brief = clean(body.brief, 2000)
  const region = body.region === 'abroad' ? 'abroad' : 'gt'
  const timing = body.timing in TIMING_LABEL ? body.timing : 'flexible'
  const lang = body.lang === 'en' ? 'en' : 'es'

  // Un servicio una sola vez, y solo los del catálogo.
  const items = (Array.isArray(body.items) ? body.items : [])
    .filter((i) => i && isQuotableService(i.slug) && SIZES.includes(i.size))
    .filter((i, n, all) => all.findIndex((j) => j.slug === i.slug) === n)
    .map(({ slug, size }) => ({ slug, size }))

  if (!name || !email || !items.length) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan campos requeridos' })
  }
  if (!EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Email inválido' })
  }

  const estimate = estimateQuote(items, region)

  // La solicitud se guarda y se avisa por correo. Basta con que una de las dos funcione
  // para no perder al cliente; si fallan ambas, el formulario muestra el error.
  const { data: row, error: dbError } = await Promise.resolve()
    .then(() => useSupabase()
      .from('quote_requests')
      .insert({ name, email, whatsapp: whatsapp || null, business: business || null, region, timing, brief: brief || null, lang, items, estimate })
      .select('id')
      .single())
    .catch((error: Error) => ({ data: null, error }))
  if (dbError) console.error('[quote] insert failed:', dbError.message)

  const ref = quoteRef(row?.id ?? crypto.randomUUID())
  const range = `${money(estimate.currency, estimate.min)} – ${money(estimate.currency, estimate.max)}${estimate.plusVat ? ' + IVA' : ''}`
  const lines = estimate.items.map((i) => `· ${i.slug} (${SIZE_LABEL[i.size]}): ${money(estimate.currency, i.min)} – ${money(estimate.currency, i.max)}`)

  const { error: mailError } = await Promise.resolve()
    .then(() => new Resend(process.env.RESEND_API_KEY).emails.send({
      from: 'the CY studio <hola@thecystudio.com>',
      to: process.env.CONTACT_TO_EMAIL || 'thecarlosyoc@gmail.com',
      replyTo: email,
      subject: `Cotizador ${ref}: ${name} · ${range}`,
      text: [
        `Nueva solicitud del cotizador (${ref})${dbError ? ' — NO se guardó en la base de datos' : ''}`,
        '',
        `Nombre: ${name}`,
        `Email: ${email}`,
        `WhatsApp: ${whatsapp || '—'}`,
        `Empresa: ${business || '—'}`,
        `Ubicación: ${region === 'gt' ? 'Guatemala' : 'Otro país'} · Idioma: ${lang}`,
        `Para cuándo: ${TIMING_LABEL[timing]}`,
        '',
        `Estimado mostrado: ${range}`,
        ...lines,
        '',
        'Qué necesita:',
        brief || '—',
      ].join('\n'),
    }))
    .catch((error: Error) => ({ error }))
  if (mailError) console.error('[quote] email failed:', mailError.message)

  if (dbError && mailError) {
    throw createError({
      statusCode: 502,
      statusMessage: 'No se pudo enviar la solicitud',
      // Fuera de producción, la respuesta dice qué falló (mensajes de las librerías, sin llaves).
      data: process.env.VERCEL_ENV === 'production' ? undefined : { db: dbError.message, mail: mailError.message },
    })
  }

  return { ref, estimate }
})
