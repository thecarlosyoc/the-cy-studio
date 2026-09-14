import type { WorkItemRow } from '~~/server/utils/mappers'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  const { data, error } = await useSupabase().from('work_items').select('*').eq('id', id).maybeSingle()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }
  if (!data) {
    throw createError({ statusCode: 404, statusMessage: 'Work item not found' })
  }

  return toWorkItemAdmin(data as WorkItemRow)
})
