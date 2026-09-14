export default defineEventHandler(async (event) => {
  const { email, password, remember } = await readBody<{ email: string; password: string; remember?: boolean }>(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  const { data, error } = await useSupabase().auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  // Checked: persistent cookie (30 days). Unchecked: cleared when the browser closes.
  const session = await useAdminSession(event, { maxAge: remember ? 60 * 60 * 24 * 30 : undefined })
  await session.update({
    accessToken: data.session.access_token,
    refreshToken: data.session.refresh_token,
  })

  return { ok: true }
})
