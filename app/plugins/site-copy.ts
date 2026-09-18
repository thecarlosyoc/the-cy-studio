// Carga los overrides de copy en el servidor; el cliente los recibe hidratados en el payload.
export default defineNuxtPlugin(async () => {
  const copy = useState<Record<string, { es: string; en: string }>>('site-copy', () => ({}))
  if (import.meta.server) copy.value = await $fetch('/api/site-copy').catch(() => ({}))
})
