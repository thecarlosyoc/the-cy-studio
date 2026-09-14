import { randomUUID } from 'node:crypto'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const formData = await readMultipartFormData(event)
  const file = formData?.find((part) => part.name === 'file' && part.filename)

  if (!file) {
    throw createError({ statusCode: 400, statusMessage: 'No file provided' })
  }

  const ext = file.filename!.split('.').pop()?.toLowerCase() || 'bin'
  const path = `${randomUUID()}.${ext}`

  const { error } = await useSupabase()
    .storage.from('work-images')
    .upload(path, file.data, { contentType: file.type })

  if (error) {
    throw createError({ statusCode: 500, statusMessage: error.message })
  }

  const { data } = useSupabase().storage.from('work-images').getPublicUrl(path)
  return { url: data.publicUrl }
})
