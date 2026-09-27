import posthog from 'posthog-js'

// Vercel Hobby no guarda eventos personalizados; las conversiones van a PostHog.
// Sin llave (dev, previews) no se inicializa y capture() no hace nada.
export default defineNuxtPlugin(() => {
  const { posthogKey, posthogHost } = useRuntimeConfig().public
  if (posthogKey) {
    posthog.init(posthogKey, {
      api_host: posthogHost,
      // Sin cookies ni localStorage: no hace falta banner de consentimiento.
      persistence: 'memory',
      autocapture: false,
      // El proyecto trae replay y heatmaps encendidos por defecto; aquí solo van eventos.
      disable_session_recording: true,
      enable_heatmaps: false,
      capture_dead_clicks: false,
      disable_surveys: true,
      capture_pageview: 'history_change',
    })
  }
  return { provide: { track: (event: string, props?: Record<string, unknown>) => posthogKey && posthog.capture(event, props) } }
})
