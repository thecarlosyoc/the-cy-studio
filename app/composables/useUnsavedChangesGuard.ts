import type { Ref } from 'vue'

// Confirma antes de abandonar un formulario con cambios sin guardar: intercepta
// la navegación interna (p. ej. el link "Volver") y también el cierre/recarga
// de la pestaña. Los componentes que llamen a `allowNextNavigation()` (después
// de guardar con éxito) se saltan la confirmación en la siguiente navegación.
export function useUnsavedChangesGuard(isDirty: Ref<boolean>) {
  const pendingConfirm = ref(false)
  let resolveNav: ((value: boolean) => void) | null = null
  let bypass = false

  function allowNextNavigation() {
    bypass = true
  }

  onBeforeRouteLeave(() => {
    if (bypass || !isDirty.value) return true

    pendingConfirm.value = true
    return new Promise<boolean>((resolve) => {
      resolveNav = resolve
    })
  })

  function confirmLeave() {
    pendingConfirm.value = false
    resolveNav?.(true)
    resolveNav = null
  }

  function cancelLeave() {
    pendingConfirm.value = false
    resolveNav?.(false)
    resolveNav = null
  }

  function handleBeforeUnload(event: BeforeUnloadEvent) {
    if (bypass || !isDirty.value) return
    event.preventDefault()
    event.returnValue = ''
  }

  onMounted(() => window.addEventListener('beforeunload', handleBeforeUnload))
  onUnmounted(() => window.removeEventListener('beforeunload', handleBeforeUnload))

  return { pendingConfirm, confirmLeave, cancelLeave, allowNextNavigation }
}
