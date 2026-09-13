export default defineNuxtRouteMiddleware(async () => {
  const { error } = await useFetch('/api/admin/me', {
    headers: useRequestHeaders(['cookie']),
  })

  if (error.value) {
    return navigateTo('/admin/login')
  }
})
