import { Resend } from 'resend'

interface ContactBody {
  name: string
  email: string
  message: string
  company?: string // honeypot: real users never fill this
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export default defineEventHandler(async (event) => {
  const body = await readBody<ContactBody>(event)

  // Honeypot tripped: pretend success so bots don't learn to skip the field.
  if (body.company) {
    return { ok: true }
  }

  const name = body.name?.trim()
  const email = body.email?.trim()
  const message = body.message?.trim()

  if (!name || !email || !message) {
    throw createError({ statusCode: 400, statusMessage: 'Faltan campos requeridos' })
  }
  if (!EMAIL_RE.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Email inválido' })
  }

  const config = useRuntimeConfig()
  const resend = new Resend(config.resendApiKey)

  const { error } = await resend.emails.send({
    from: 'the CY studio <onboarding@resend.dev>',
    to: config.contactToEmail,
    replyTo: email,
    subject: `Nuevo mensaje de ${name} — the CY studio`,
    text: `Nombre: ${name}\nEmail: ${email}\n\n${message}`,
  })

  if (error) {
    throw createError({ statusCode: 502, statusMessage: 'No se pudo enviar el mensaje' })
  }

  return { ok: true }
})
