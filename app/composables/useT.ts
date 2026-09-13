// app/composables/useT.ts
import { dict, type DictKey } from '~/data/i18n'

export function useT() {
  const lang = useLang()
  return (key: DictKey) => dict[lang.value][key]
}