export default defineEventHandler(async (event) => {
  const user = await requireAdminSession(event)
  return { email: user.email }
})
