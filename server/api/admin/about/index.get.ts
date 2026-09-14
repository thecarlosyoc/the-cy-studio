import type { AboutSectionRow } from '~~/server/utils/mappers'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const { data, error } = await useSupabase().from('about_sections').select('*').order('order')
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return (data as AboutSectionRow[]).map(toAboutSectionAdmin)
})
