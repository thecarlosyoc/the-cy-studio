// app/router.options.ts
import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // Browser back/forward: restore where the user was.
    if (savedPosition) return savedPosition
    // A same-page anchor link: scroll to that section, clear of the fixed navbar
    // (vue-router ignores scroll-margin, so the offset lives here).
    if (to.hash) {
      const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      // A target can ask for more room (sticky bars) with scroll-margin-top; default is the navbar.
      const target = document.querySelector(to.hash)
      const margin = target ? parseFloat(getComputedStyle(target).scrollMarginTop) : 0
      return { el: to.hash, top: margin || 80, behavior: reduce ? 'auto' : 'smooth' }
    }
    // Same page, only the query changed (?lang, ?type): stay where the user is.
    if (to.path === from.path) return false
    // Any other navigation (e.g. clicking into a project from a scrolled
    // work list) starts fresh at the top of the new page.
    return { top: 0, left: 0 }
  },
}
