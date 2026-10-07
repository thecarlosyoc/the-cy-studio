import type { QuoteRequestAdmin } from '#shared/types/quote'

export default defineEventHandler(async (event): Promise<QuoteRequestAdmin[]> => {
  await requireAdminSession(event)

  const { data, error } = await useSupabase()
    .from('quote_requests')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(200)
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return data.map((r) => ({
    id: r.id,
    ref: quoteRef(r.id),
    createdAt: r.created_at,
    status: r.status,
    name: r.name,
    email: r.email,
    whatsapp: r.whatsapp,
    business: r.business,
    region: r.region,
    timing: r.timing,
    brief: r.brief,
    lang: r.lang,
    estimate: r.estimate,
    source: r.source ?? null,
  }))
})
