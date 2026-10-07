// /cotiza (enlace corto de banners y anuncios) → /quote, conservando ?utm_* y ?service=
// para que el cotizador sepa de dónde llegó el lead. Una regla `redirect` de routeRules
// no garantiza conservar la query en todos los presets de despliegue.
export default defineEventHandler((event) => {
  const { search } = getRequestURL(event)
  return sendRedirect(event, `/quote${search}`, 301)
})
