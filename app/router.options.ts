// app/router.options.ts
import type { RouterConfig } from '@nuxt/schema'

export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // Browser back/forward: restore where the user was.
    if (savedPosition) return savedPosition
    // A same-page anchor link: scroll to that section.
    if (to.hash) return { el: to.hash, behavior: 'smooth' }
    // Any other navigation (e.g. clicking into a project from a scrolled
    // work list) starts fresh at the top of the new page.
    return { top: 0, left: 0 }
  },
}
