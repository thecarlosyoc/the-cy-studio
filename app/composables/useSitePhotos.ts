const FALLBACK = '/images/about.png'

export async function useSitePhotos() {
  const { data, refresh } = await useFetch<Record<string, string>>('/api/site-photos', { key: 'site-photos' })
  const photo = (key: 'about' | 'home') => data.value?.[key] || FALLBACK
  return { photo, refresh }
}
