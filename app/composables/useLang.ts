// app/composables/useLang.ts
// El idioma arranca de ?lang=en para que el servidor renderice el inglés en su propia URL
// (indexable). app.vue mantiene la URL sincronizada cuando cambia.
export function useLang() {
  return useState<'es' | 'en'>('lang', () => (useRoute().query.lang === 'en' ? 'en' : 'es'))
}
