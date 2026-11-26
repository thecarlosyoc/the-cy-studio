export default defineEventHandler(async (event) => {
  const { email, password, remember } = await readBody<{ email: string; password: string; remember?: boolean }>(event)

  if (!email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  const { data, error } = await useSupabase().auth.signInWithPassword({ email, password })

  if (error || !data.session) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid credentials' })
  }

  // Real credentials of a non-admin: end only the Supabase session just opened
  // ('local'; the default 'global' would end the user's other sessions too) and set no
  // cookie. requireAdminSession refuses such a user anyway; this keeps the session
  // from existing at all. Same answer as wrong credentials, so the endpoint does not
  // tell which email and password pairs are real accounts.
  if (!isAdminUser(data.user)) {
    const { error: signOutError } = await useSupabase().auth.admin.signOut(data.session.access_token, 'local')
    if (signOutError) console.error('admin login: could not end non-admin session', signOutError.code)
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
