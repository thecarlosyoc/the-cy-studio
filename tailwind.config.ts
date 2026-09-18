export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './pages/**/*.vue',
    './app.vue',
  ],
  theme: {
    extend: {
      // Read from CSS custom properties (app/assets/css/main.css) instead of
      // fixed hex so dark mode (prefers-color-scheme) can flip every one of
      // these without touching a single component. <alpha-value> keeps
      // Tailwind's opacity modifiers (bg-ink/5, border-ink/50...) working.
      colors: {
        paper: 'rgb(var(--color-paper) / <alpha-value>)',
        ink: {
          DEFAULT: 'rgb(var(--color-ink) / <alpha-value>)',
          soft: 'rgb(var(--color-ink-soft) / <alpha-value>)',
        },
        cobalt: 'rgb(var(--color-cobalt) / <alpha-value>)',
      },
      fontFamily: {
        display: ['Space Grotesk', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['Space Mono', 'monospace'],
      },
    },
  },
}