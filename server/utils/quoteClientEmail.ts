// Correo de confirmación para el cliente del cotizador (/quote): el mismo resumen que ve
// en pantalla y en el PDF, en su idioma. Texto plano + HTML sencillo con estilos en línea.
import { SERVICES } from '#shared/data/services'
import { QUOTE_SCOPES } from '#shared/data/quote'
import type { QuoteEstimate, QuoteSize } from '#shared/types/quote'

type Lang = 'es' | 'en'

const COPY = {
  es: {
    subject: (ref: string) => `Tu estimado de the CY studio (${ref})`,
    eyebrow: 'Estimado para',
    request: 'Solicitud',
    includes: 'Qué incluye',
    timeLabel: 'Tiempo',
    tagline: 'the CY studio · Diseño y desarrollo digital',
    hello: (name: string) => `Hola, ${name}:`,
    intro: (ref: string) => `Gracias por cotizar con the CY studio. Este es el resumen de tu solicitud ${ref}.`,
    size: { s: 'Pequeño', m: 'Mediano', l: 'Grande' } as Record<QuoteSize, string>,
    total: 'Total estimado',
    vat: 'Más IVA. Con factura electrónica (FEL).',
    usd: 'En dólares, sin IVA.',
    validity: 'Es un rango para orientarte, no una cotización formal. Vigente 15 días.',
    nextTitle: 'Qué sigue',
    next: [
      'Reviso tu solicitud y lo que quieres lograr.',
      'Te escribo para afinar el alcance. Si ya construí algo parecido, te lo enseño en una demo.',
      'Te envío la cotización formal con precio fijo.',
    ],
    contact: 'Si quieres adelantar, responde este correo o escríbeme por WhatsApp:',
  },
  en: {
    subject: (ref: string) => `Your estimate from the CY studio (${ref})`,
    eyebrow: 'Estimate for',
    request: 'Request',
    includes: "What's included",
    timeLabel: 'Time',
    tagline: 'the CY studio · Digital design and development',
    hello: (name: string) => `Hi ${name},`,
    intro: (ref: string) => `Thanks for using the CY studio's estimator. Here's the summary of your request ${ref}.`,
    size: { s: 'Small', m: 'Medium', l: 'Large' } as Record<QuoteSize, string>,
    total: 'Estimated total',
    vat: 'Plus VAT. With a Guatemalan electronic invoice (FEL).',
    usd: 'In US dollars, no VAT.',
    validity: "It's a range to guide you, not a formal quote. Valid for 15 days.",
    nextTitle: 'What happens next',
    next: [
      'I review your request and what you want to achieve.',
      "I message you to fine-tune the scope. If I've built something similar, I'll show it to you in a demo.",
      'I send you the formal fixed-price quote.',
    ],
    contact: 'If you want to move faster, reply to this email or message me on WhatsApp:',
  },
}

const WHATSAPP = 'https://wa.me/50252128955'

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;')

export function quoteClientEmail(opts: { ref: string; name: string; business?: string; lang: Lang; estimate: QuoteEstimate }) {
  const { ref, lang, estimate } = opts
  const c = COPY[lang]
  const first = opts.name.split(' ')[0] || opts.name
  const money = (n: number) => `${estimate.currency === 'GTQ' ? 'Q' : '$'}${n.toLocaleString('en-US')}`
  const total = `${money(estimate.min)} – ${money(estimate.max)}`
  const note = estimate.plusVat ? c.vat : c.usd
  const items = estimate.items.map((i) => ({
    title: SERVICES.find((s) => s.slug === i.slug)?.title[lang] ?? i.slug,
    size: c.size[i.size],
    scope: QUOTE_SCOPES[i.slug]?.[i.size].scope[lang] ?? '',
    time: QUOTE_SCOPES[i.slug]?.[i.size].time[lang] ?? '',
    range: `${money(i.min)} – ${money(i.max)}`,
  }))

  const text = [
    c.hello(first),
    '',
    c.intro(ref),
    '',
    ...items.map((i) => `· ${i.title} (${i.size}): ${i.scope}. ${i.time}. ${i.range}`),
    '',
    `${c.total}: ${total}`,
    note,
    c.validity,
    '',
    `${c.nextTitle}:`,
    ...c.next.map((line, n) => `${n + 1}. ${line}`),
    '',
    `${c.contact} ${WHATSAPP}`,
    '',
    'Carlos Yoc · the CY studio',
    'thecystudio.com',
  ].join('\n')

  // Mismo sistema editorial que la papelería en Figma (archivo 2Yd2ZLPZyejLbNZX1Wfgne):
  // fondo paper, etiquetas en Space Mono, números en cobalto, total en bloque de tinta y la
  // firma de correo (frame 4:72). Tablas y estilos en línea para Gmail, Outlook y Apple Mail;
  // las fuentes caen a Helvetica/Arial donde el cliente de correo no las tenga.
  const display = "'Space Grotesk',Helvetica,Arial,sans-serif"
  const body = "Inter,Helvetica,Arial,sans-serif"
  const tag = (color = '#43413B') => `font-family:'Space Mono',Menlo,monospace;font-size:10px;line-height:1.4;letter-spacing:.16em;text-transform:uppercase;color:${color};`
  const line = 'rgba(18,17,14,0.14)'
  const title = opts.business || opts.name
  const html = `<!doctype html><html><body style="margin:0;background:#F1EFEA;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1EFEA;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;font-family:${body};color:#12110E;font-size:15px;line-height:1.5;">
<tr><td>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
    <td><img src="https://thecystudio.com/images/email-logo.png" width="116" height="17" alt="the CY studio." style="display:block;border:0;"></td>
    <td align="right" style="${tag()}white-space:nowrap;">${esc(c.request)} ${esc(ref)}</td>
  </tr></table>
  <p style="margin:40px 0 0;${tag('#1E2BE0')}">${esc(c.eyebrow)}</p>
  <p style="margin:8px 0 0;font-family:${display};font-size:44px;font-weight:700;line-height:0.95;letter-spacing:-0.04em;">${esc(title)}</p>
  <p style="margin:28px 0 0;">${esc(c.hello(first))}</p>
  <p style="margin:8px 0 0;color:#43413B;">${esc(c.intro(ref)).replace(esc(ref), `<span style="white-space:nowrap;">${esc(ref)}</span>`)}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;"><tr>
    <td style="${tag('#1E2BE0')}white-space:nowrap;padding-right:12px;">01</td>
    <td style="${tag('#12110E')}white-space:nowrap;padding-right:12px;">${esc(c.includes)}</td>
    <td width="100%" style="border-top:1px solid ${line};font-size:0;line-height:0;">&nbsp;</td>
  </tr></table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${items.map((i, n) => `<tr>
    <td width="40" style="padding:14px 0;border-bottom:1px solid ${line};vertical-align:top;font-family:${display};font-size:22px;font-weight:700;line-height:1;color:#1E2BE0;">${String(n + 1).padStart(2, '0')}</td>
    <td style="padding:14px 0;border-bottom:1px solid ${line};vertical-align:top;">
      <p style="margin:0;font-family:${display};font-size:17px;font-weight:500;line-height:1.2;">${esc(i.title)}</p>
      <p style="margin:4px 0 0;font-size:13px;line-height:1.4;color:#43413B;">${esc(i.size)} · ${esc(i.scope)}</p>
      <p style="margin:8px 0 0;font-size:13px;line-height:1.4;"><span style="${tag()}">${esc(c.timeLabel)}</span>&nbsp; ${esc(i.time)}</p>
      <p style="margin:4px 0 0;font-family:${display};font-size:15px;font-weight:500;white-space:nowrap;">${esc(i.range)}</p>
    </td>
  </tr>`).join('\n')}
  </table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:16px;background:#12110E;"><tr><td style="padding:20px 24px 22px;color:#F1EFEA;">
    <p style="margin:0;${tag('#F1EFEA')}font-weight:700;">${esc(c.total)}</p>
    <p style="margin:2px 0 0;${tag('#F1EFEA')}opacity:.7;">${esc(note)}</p>
    <p style="margin:14px 0 0;font-family:${display};font-size:32px;font-weight:700;line-height:1;letter-spacing:-0.04em;white-space:nowrap;">${esc(total)}</p>
  </td></tr></table>
  <p style="margin:12px 0 0;font-size:13px;color:#43413B;">${esc(c.validity)}</p>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:32px;"><tr>
    <td style="${tag('#1E2BE0')}white-space:nowrap;padding-right:12px;">02</td>
    <td style="${tag('#12110E')}white-space:nowrap;padding-right:12px;">${esc(c.nextTitle)}</td>
    <td width="100%" style="border-top:1px solid ${line};font-size:0;line-height:0;">&nbsp;</td>
  </tr></table>
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:10px;">
${c.next.map((l, n) => `<tr><td width="24" style="${tag('#1E2BE0')}vertical-align:top;padding:6px 0;">${String(n + 1).padStart(2, '0')}</td><td style="padding:4px 0;font-size:14px;line-height:1.5;">${esc(l)}</td></tr>`).join('\n')}
  </table>
  <p style="margin:32px 0 0;font-family:${display};font-size:17px;font-weight:500;line-height:1.3;">${esc(c.contact)}</p>
  <p style="margin:16px 0 0;"><a href="${WHATSAPP}" style="display:inline-block;background:#12110E;color:#F1EFEA;text-decoration:none;font-family:${display};font-weight:500;font-size:14px;padding:10px 18px;border-radius:999px;">WhatsApp +502 5212 8955</a></p>
  <table role="presentation" cellpadding="0" cellspacing="0" style="margin-top:40px;border-top:1px solid ${line};width:100%;"><tr><td style="padding-top:20px;">
    <table role="presentation" cellpadding="0" cellspacing="0"><tr>
      <td style="vertical-align:middle;padding-right:24px;">
        <p style="margin:0;font-family:${display};font-size:17px;font-weight:500;line-height:1.2;">Carlos Yoc</p>
        <p style="margin:4px 0 0;${tag()}">founder - product designer</p>
        <p style="margin:2px 0 0;${tag()}">${esc(c.tagline)}</p>
      </td>
      <td style="vertical-align:middle;padding-left:24px;border-left:1px solid ${line};${tag('#12110E')}">
        <a href="https://thecystudio.com" style="color:#12110E;text-decoration:none;">thecystudio.com</a><br>
        <a href="mailto:hola@thecystudio.com" style="color:#12110E;text-decoration:none;">hola@thecystudio.com</a><br>
        <a href="${WHATSAPP}" style="color:#12110E;text-decoration:none;">+502 5212 8955</a>
      </td>
    </tr></table>
  </td></tr></table>
</td></tr></table>
</td></tr></table>
</body></html>`

  return { subject: c.subject(ref), text, html }
}
