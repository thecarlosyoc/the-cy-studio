// Dominio canónico: www.thecystudio.com. El alias de producción en pages.dev redirige (301)
// para que Google indexe solo el dominio propio; los previews quedan fuera del índice.
const PROD_ALIAS = /^the-cy-studio\.pages\.dev$/

export default defineEventHandler((event) => {
  const host = getRequestHost(event)
  if (PROD_ALIAS.test(host)) return sendRedirect(event, `https://www.thecystudio.com${event.path}`, 301)
  if (host.endsWith('.pages.dev')) setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
})
