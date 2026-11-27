// CoreReveal leaves the server at opacity 0 and only fades in once Vue hydrates and its
// IntersectionObserver fires. On a phone that hid the first screen (the /services h1, the first
// /work card) for ~2 s after first paint and made it the late LCP. This runs as soon as the HTML is
// parsed, before the app's module scripts: every reveal already on screen gets `is-visible` right
// away, so the fade starts at first paint instead of after hydration. Reading the rect first makes
// the browser style the hidden state, so the 0.8 s transition still plays. Vue keeps the extra
// class when it hydrates (static class), and CoreReveal's observer only adds it again.
const script = `<script>(function(){var h=innerHeight;document.querySelectorAll('.core-reveal').forEach(function(e){var r=e.getBoundingClientRect();if(r.top<h&&r.bottom>0)e.classList.add('is-visible')})})()</script>`

export default defineNitroPlugin((nitro) => {
  nitro.hooks.hook('render:html', (html) => {
    html.bodyAppend.push(script)
  })
})
