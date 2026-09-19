import { PHOTO_KEYS, type PhotoKey } from '#shared/utils/photos'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const key = getRouterParam(event, 'key')
  if (!PHOTO_KEYS.includes(key as PhotoKey)) {
    throw createError({ statusCode: 400, statusMessage: 'Foto no válida' })
  }
  const { url } = await readBody<{ url?: string }>(event)
  if (!url?.startsWith('https://')) {
    throw createError({ statusCode: 400, statusMessage: 'URL no válida' })
  }

  const { error } = await useSupabase()
    .from('site_photos')
    .upsert({ key, url, updated_at: new Date().toISOString() })
  if (error) throw createError({ statusCode: 500, statusMessage: error.message })

  return { key, url }
})
