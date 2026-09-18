import { EDITABLE_COPY_KEYS } from '~~/app/data/copyGroups'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const body = await readBody<Record<string, { es?: string; en?: string }>>(event)
  const now = new Date().toISOString()
  const rows = Object.entries(body ?? {}).map(([key, v]) => {
    if (!EDITABLE_COPY_KEYS.includes(key) || typeof v?.es !== 'string' || typeof v?.en !== 'string') {
      throw createError({ statusCode: 400, statusMessage: `Texto no válido: ${key}` })
    }
    return { key, es: v.es.trim(), en: v.en.trim(), updated_at: now }
  })
  if (!rows.length) return { saved: 0 }

  const { error } = await useSupabase().from('site_copy').upsert(rows)
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })
  return { saved: rows.length }
})
