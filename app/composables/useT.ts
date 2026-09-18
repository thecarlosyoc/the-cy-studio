// app/composables/useT.ts
import { dict, type DictKey } from '~/data/i18n'

export function useT() {
  const lang = useLang()
  const copy = useState<Record<string, { es: string; en: string }>>('site-copy', () => ({}))
  return (key: DictKey) => copy.value[key]?.[lang.value] || dict[lang.value][key]
}
