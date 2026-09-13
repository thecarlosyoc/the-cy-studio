export default defineEventHandler(async (event) => {
  const session = await useAdminSession(event)
  const accessToken = session.data.accessToken

  if (accessToken) {
    await useSupabase().auth.admin.signOut(accessToken)
  }

  await session.clear()
  return { ok: true }
})
