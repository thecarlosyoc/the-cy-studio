import type { WorkItem } from '#shared/types/content'
import type { WorkItemRow } from '~~/server/utils/mappers'

export default defineEventHandler(async (event) => {
  const user = await requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  const body = await readBody<Partial<WorkItem> & { order?: number; hidden?: boolean }>(event)

  const row = fromWorkItemInput(body)
  if (body.order !== undefined) row.order = body.order
  if (body.hidden !== undefined) row.hidden = body.hidden
  row.updated_at = new Date().toISOString()
  row.updated_by = user.email

  const { data, error } = await useSupabase()
    .from('work_items')
    .update(row)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return toWorkItemAdmin(data as WorkItemRow)
})
