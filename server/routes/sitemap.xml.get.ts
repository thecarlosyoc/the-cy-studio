// Sitemap a mano: las rutas fijas + un caso por cada work_item visible, cada una en español y en
// inglés (?lang=en) con sus alternates hreflang. Sin dependencias.
const ORIGIN = 'https://www.thecystudio.com'

export default defineEventHandler(async (event) => {
  // Si la DB falla, el sitemap sigue con las rutas fijas en vez de dar 500.
  const data = await Promise.resolve()
    .then(() => useSupabase().from('work_items').select('slug').eq('hidden', false))
    .then((r) => r.data)
    .catch(() => null)
  const paths = ['/', '/about', '/work', '/services', '/quote', '/contact', ...(data ?? []).map((r) => `/work/${encodeURIComponent(r.slug)}`)]
  const alternates = (p: string) =>
    `<xhtml:link rel="alternate" hreflang="es" href="${ORIGIN}${p}"/>` +
    `<xhtml:link rel="alternate" hreflang="en" href="${ORIGIN}${p}?lang=en"/>` +
    `<xhtml:link rel="alternate" hreflang="x-default" href="${ORIGIN}${p}"/>`
  const urls = paths
    .flatMap((p) => [`${ORIGIN}${p}`, `${ORIGIN}${p}?lang=en`].map((loc) => `<url><loc>${loc}</loc>${alternates(p)}</url>`))
    .join('')
  setResponseHeader(event, 'Content-Type', 'application/xml; charset=utf-8')
  setResponseHeader(event, 'Cache-Control', 'public, s-maxage=3600')
  return `<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">${urls}</urlset>`
})
