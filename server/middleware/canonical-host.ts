// Dominio canónico: www.thecystudio.com. Los alias de producción en vercel.app redirigen (301)
// para que Google indexe solo el dominio propio; los previews quedan fuera del índice.
const PROD_ALIAS = /^the-cy-studio(-thecarlosyoc|-git-main-thecarlosyoc)?\.vercel\.app$/

export default defineEventHandler((event) => {
  const host = getRequestHost(event)
  if (PROD_ALIAS.test(host)) return sendRedirect(event, `https://www.thecystudio.com${event.path}`, 301)
  if (host.endsWith('.vercel.app')) setResponseHeader(event, 'X-Robots-Tag', 'noindex, nofollow')
})
