// app/composables/useAdminToast.ts
interface AdminToastState {
  message: string
  actionLabel?: string
  onAction?: () => void
}

let hideTimer: ReturnType<typeof setTimeout> | undefined

export function useAdminToast() {
  const toast = useState<AdminToastState | null>('admin-toast', () => null)

  function show(message: string, options?: { actionLabel?: string; onAction?: () => void; duration?: number }) {
    if (hideTimer) clearTimeout(hideTimer)
    toast.value = { message, actionLabel: options?.actionLabel, onAction: options?.onAction }
    hideTimer = setTimeout(() => {
      toast.value = null
    }, options?.duration ?? 4000)
  }

  function dismiss() {
    if (hideTimer) clearTimeout(hideTimer)
    toast.value = null
  }

  return { toast, show, dismiss }
}
