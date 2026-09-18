// Público. Si la tabla aún no existe o falla, responde {} y el sitio usa el respaldo local.
export default defineEventHandler(async () => {
  const { data, error } = await useSupabase().from('site_photos').select('key, url')
  if (error) return {} as Record<string, string>
  return Object.fromEntries((data ?? []).map((r) => [r.key, r.url])) as Record<string, string>
})
