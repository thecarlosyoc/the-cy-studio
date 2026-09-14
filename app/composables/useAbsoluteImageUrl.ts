// app/composables/useAbsoluteImageUrl.ts

/** Sitewide fallback used for og:image / twitter:image when a page has no image of its own. */
export const DEFAULT_OG_IMAGE = '/images/about.png'

/**
 * Returns a resolver that turns a site-relative image path into an absolute URL
 * (social crawlers do not resolve relative og:image values). Already-absolute
 * URLs are passed through, and empty/missing paths fall back to DEFAULT_OG_IMAGE.
 */
export function useAbsoluteImageUrl() {
  const origin = useRequestURL().origin

  return (path?: string | null) => {
    const target = path?.trim() || DEFAULT_OG_IMAGE
    if (/^https?:\/\//i.test(target)) return target
    return `${origin}${target.startsWith('/') ? '' : '/'}${target}`
  }
}
