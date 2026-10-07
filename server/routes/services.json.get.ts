// Catálogo de servicios en JSON, para el cotizador (Notion y en línea): así su selector se
// actualiza solo cuando cambia shared/data/services.ts. Público y sin precios, por eso CORS abierto.
import { SERVICES } from '#shared/data/services'

export default defineEventHandler((event) => {
  setResponseHeaders(event, {
    'Access-Control-Allow-Origin': '*',
    'Cache-Control': 'public, max-age=300',
  })
  return SERVICES
})
