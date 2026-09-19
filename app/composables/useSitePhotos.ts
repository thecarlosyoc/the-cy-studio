const FALLBACK = '/images/about.png'

export async function useSitePhotos() {
  const { data, refresh } = await useFetch<Record<string, string>>('/api/site-photos', { key: 'site-photos' })
  const photo = (key: 'about' | 'home') => data.value?.[key] || FALLBACK
  return { photo, refresh }
}

/**
 * og:image / twitter:image from the photo managed in the admin (not the static
 * fallback file), resized and compressed: WhatsApp drops previews with heavy images.
 */
export async function useOgImage(key: 'about' | 'home') {
  // Nuxt context is lost after an `await`: resolve these first.
  const img = useImage()
  const origin = useRequestURL().origin
  const { photo } = await useSitePhotos()
  const src = img(photo(key), { width: 1200, quality: 80 })
  return /^https?:\/\//i.test(src) ? src : `${origin}${src}`
}
