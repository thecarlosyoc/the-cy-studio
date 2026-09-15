import type { WorkItemRow } from '~~/server/utils/mappers'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  const { data, error } = await useSupabase()
    .from('work_items')
    .select('*')
    .eq('slug', slug)
    .eq('hidden', false)
    .maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Work item not found' })
  }

  return toWorkItem(data as WorkItemRow)
})
