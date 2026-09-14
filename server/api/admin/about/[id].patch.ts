import type { AboutSection } from '#shared/types/content'
import type { AboutSectionRow } from '~~/server/utils/mappers'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  const body = await readBody<Partial<AboutSection> & { order?: number }>(event)

  const row = fromAboutSectionInput(body)
  if (body.order !== undefined) row.order = body.order
  row.updated_at = new Date().toISOString()

  const { data, error } = await useSupabase()
    .from('about_sections')
    .update(row)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return toAboutSectionAdmin(data as AboutSectionRow)
})
