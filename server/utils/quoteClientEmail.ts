// Correo de confirmación para el cliente del cotizador (/quote): el mismo resumen que ve
// en pantalla y en el PDF, en su idioma. Texto plano + HTML sencillo con estilos en línea.
import { SERVICES } from '#shared/data/services'
import { QUOTE_SCOPES } from '#shared/data/quote'
import type { QuoteEstimate, QuoteSize } from '#shared/types/quote'

type Lang = 'es' | 'en'

const COPY = {
  es: {
    subject: (ref: string) => `Tu estimado de the CY studio (${ref})`,
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

export function quoteClientEmail(opts: { ref: string; name: string; lang: Lang; estimate: QuoteEstimate }) {
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

  // Colores de la marca: paper, ink, ink-soft, cobalt. Tablas y estilos en línea para que
  // se vea igual en Gmail, Outlook y Apple Mail.
  const td = 'padding:12px 0;border-bottom:1px solid #d8d6d0;vertical-align:top;'
  const html = `<!doctype html><html><body style="margin:0;background:#F1EFEA;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#F1EFEA;"><tr><td align="center" style="padding:32px 16px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:16px;font-family:Inter,Helvetica,Arial,sans-serif;color:#12110E;font-size:15px;line-height:1.5;">
<tr><td style="padding:32px;">
<p style="margin:0 0 4px;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#43413B;">the CY studio · ${esc(ref)}</p>
<p style="margin:24px 0 0;">${esc(c.hello(first))}</p>
<p style="margin:12px 0 0;">${esc(c.intro(ref)).replace(esc(ref), `<span style="white-space:nowrap;">${esc(ref)}</span>`)}</p>
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:24px;border-top:1px solid #d8d6d0;">
${items.map((i) => `<tr><td style="${td}"><strong>${esc(i.title)}</strong> <span style="color:#43413B;">· ${esc(i.size)}</span><br><span style="color:#43413B;">${esc(i.scope)}. ${esc(i.time)}.</span><br><span style="white-space:nowrap;">${esc(i.range)}</span></td></tr>`).join('\n')}
</table>
<p style="margin:24px 0 0;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#43413B;">${esc(c.total)}</p>
<p style="margin:4px 0 0;font-size:28px;font-weight:700;line-height:1.1;color:#1E2BE0;">${esc(total)}</p>
<p style="margin:8px 0 0;color:#43413B;">${esc(note)} ${esc(c.validity)}</p>
<p style="margin:32px 0 0;font-family:'Space Mono',monospace;font-size:11px;letter-spacing:.16em;text-transform:uppercase;color:#43413B;">${esc(c.nextTitle)}</p>
<ol style="margin:8px 0 0;padding-left:20px;">${c.next.map((line) => `<li style="margin-top:6px;">${esc(line)}</li>`).join('')}</ol>
<p style="margin:32px 0 0;">${esc(c.contact)}</p>
<p style="margin:16px 0 0;"><a href="${WHATSAPP}" style="display:inline-block;background:#12110E;color:#F1EFEA;text-decoration:none;font-weight:600;padding:10px 18px;border-radius:999px;">WhatsApp +502 5212 8955</a></p>
<p style="margin:32px 0 0;color:#43413B;">Carlos Yoc · the CY studio<br><a href="https://thecystudio.com" style="color:#43413B;">thecystudio.com</a></p>
</td></tr></table>
</td></tr></table>
</body></html>`

  return { subject: c.subject(ref), text, html }
}
