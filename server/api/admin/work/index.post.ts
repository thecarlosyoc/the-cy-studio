import type { WorkItem } from '#shared/types/content'
import type { WorkItemRow } from '~~/server/utils/mappers'

export default defineEventHandler(async (event) => {
  const user = await requireAdminSession(event)

  const body = await readBody<Partial<WorkItem>>(event)
  if (!body.slug || !body.type || !body.title || !body.description || !body.context || !body.date) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const supabase = useSupabase()
  const { count } = await supabase.from('work_items').select('*', { count: 'exact', head: true })

  const { data, error } = await supabase
    .from('work_items')
    .insert({
      ...fromWorkItemInput(body),
      order: count ?? 0,
      role: body.role ?? [],
      tools: body.tools ?? [],
      gallery: body.gallery ?? [],
      updated_by: user.email,
    })
    .select()
    .single()

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  return toWorkItemAdmin(data as WorkItemRow)
})
