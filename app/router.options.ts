// app/router.options.ts
import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // First navigation of the page (hard load or reload) with a hash: the link wins over the position the
    // browser saved, otherwise /services#slug would reopen the row without scrolling to it.
    // Browser back/forward keeps the saved position.
    if (savedPosition && !(to.hash && from.matched.length === 0)) return savedPosition
    // A same-page anchor link: scroll to that section, clear of the fixed navbar
    // (vue-router ignores scroll-margin, so the offset lives here).
    if (to.hash) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      // A target can ask for more room (sticky bars) with scroll-margin-top; default is the navbar.
      let target: HTMLElement | null = null
      try {
        target = document.getElementById(decodeURIComponent(to.hash.slice(1)))
      } catch {
        // malformed hash: no target, fall back to the default offset
      }
      const margin = target ? parseFloat(getComputedStyle(target).scrollMarginTop) : 0
      return { el: to.hash, top: margin || 80, behavior: reduce || from.matched.length === 0 ? 'auto' : 'smooth' }
    }
    // Same page, only the query changed (?lang, ?type): stay where the user is.
    if (to.path === from.path) return false
    // Any other navigation (e.g. clicking into a project from a scrolled
    // work list) starts fresh at the top of the new page.
    return { top: 0, left: 0 }
  },
}
