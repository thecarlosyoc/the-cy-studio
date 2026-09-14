import type { H3Event } from 'h3'

interface AdminSessionData {
  accessToken?: string
  refreshToken?: string
}

export function useAdminSession(event: H3Event, options?: { maxAge?: number }) {
  // Read-only calls (requireAdminSession, /me, /logout) omit `options` entirely and
  // fall back to a generous default. Login passes `maxAge` explicitly — including
  // `undefined` for a session-only cookie — so an `in` check is required here:
  // `options?.maxAge ?? default` would incorrectly discard an explicit `undefined`.
  const maxAge = options && 'maxAge' in options ? options.maxAge : 60 * 60 * 24 * 30
  return useSession<AdminSessionData>(event, {
    name: 'admin-session',
    password: useRuntimeConfig().sessionSecret,
    maxAge,
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
