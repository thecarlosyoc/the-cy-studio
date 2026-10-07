import type { QuoteStatus } from '#shared/types/quote'

const STATUSES: QuoteStatus[] = ['new', 'contacted', 'demo', 'won', 'lost']

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  const { status } = await readBody<{ status: QuoteStatus }>(event)
  if (!STATUSES.includes(status)) {
    throw createError({ statusCode: 400, statusMessage: 'Estado inválido' })
  }

  const { error } = await useSupabase().from('quote_requests').update({ status }).eq('id', id)
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return { ok: true }
})
