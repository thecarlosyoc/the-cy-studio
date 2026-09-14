import type { AboutSectionRow } from '~~/server/utils/mappers'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  const { data, error } = await useSupabase().from('about_sections').select('*').eq('id', id).maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'About section not found' })
  }

  return toAboutSectionAdmin(data as AboutSectionRow)
})
