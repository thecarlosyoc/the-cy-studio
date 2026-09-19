// Sitemap a mano: 4 rutas fijas + un caso por cada work_item visible. Sin dependencias.
const ORIGIN = 'https://www.thecystudio.com'

export default defineEventHandler(async (event) => {
  // Si la DB falla, el sitemap sigue con las rutas fijas en vez de dar 500.
  const data = await Promise.resolve()
    .then(() => useSupabase().from('work_items').select('slug').eq('hidden', false))
    .then((r) => r.data)
    .catch(() => null)
  const paths = ['/', '/about', '/work', '/contact', ...(data ?? []).map((r) => `/work/${encodeURIComponent(r.slug)}`)]
  const urls = paths.map((p) => `<url><loc>${ORIGIN}${p}</loc></url>`).join('')
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, s-maxage=3600')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`
})
