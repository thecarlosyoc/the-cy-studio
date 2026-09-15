import type { WorkItem } from '#shared/types/content'

// Misma clave en home (/), /work y donde haga falta: al navegar en el cliente,
// useAsyncData reutiliza el resultado ya cargado en la sesión (payload del home)
// y NO vuelve a hacer el round-trip a /api/work — la página de Trabajo pinta
// con datos al instante en lugar de esperar al servidor + Supabase.
export function useWorkItems() {
  return useFetch<WorkItem[]>('/api/work', { key: 'work-items' })
}