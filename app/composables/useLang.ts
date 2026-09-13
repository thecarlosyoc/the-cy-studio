// app/composables/useLang.ts
export function useLang() {
  return useState<'es' | 'en'>('lang', () => 'es')
}