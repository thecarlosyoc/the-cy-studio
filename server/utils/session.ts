import type { H3Event } from 'h3'

interface AdminSessionData {
  accessToken?: string
  refreshToken?: string
}

export function useAdminSession(event: H3Event) {
  return useSession<AdminSessionData>(event, {
    name: 'admin-session',
    password: useRuntimeConfig().sessionSecret,
    maxAge: 60 * 60 * 24 * 7, // 7 days
  })
}

export async function requireAdminSession(event: H3Event) {
  const session = await useAdminSession(event)
  const accessToken = session.data.accessToken

  if (!accessToken) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const { data, error } = await useSupabase().auth.getUser(accessToken)
  if (error || !data.user) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  return data.user
}
