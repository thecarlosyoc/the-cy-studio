import type { WorkItemRow } from '~~/server/utils/mappers'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const { data, error } = await useSupabase().from('work_items').select('*').order('order')
  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return (data as WorkItemRow[]).map(toWorkItemAdmin)
})
