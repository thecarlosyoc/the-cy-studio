// Público. Si la tabla falla o no existe, responde {} y el sitio usa i18n.ts.
export default defineEventHandler(async () => {
  const { data, error } = await useSupabase().from('site_copy').select('key, es, en')
  if (error) return {} as Record<string, { es: string; en: string }>
  return Object.fromEntries((data ?? []).map((r) => [r.key, { es: r.es, en: r.en }])) as Record<string, { es: string; en: string }>
})
