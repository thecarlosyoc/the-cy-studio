export default defineEventHandler(async (event) => {
  const { email, password } = await readBody<{ email: string; password: string }>(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  const { data, error } = await useSupabase().auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  const session = await useAdminSession(event)
  await session.update({
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
  })

  return { ok: true }
})
