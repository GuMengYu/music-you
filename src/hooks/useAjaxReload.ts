import useInForeground from './useInForeground'

export default function useAjaxReloadHook(pageName: string, cb: () => void) {
  const reloadEventBus = useEventBus('reload')
  const { isActive } = useInForeground(pageName)
  const unsubscribe = reloadEventBus.on(() => {
    isActive.value && cb()
  })
  onUnmounted(() => {
    unsubscribe()
  })
}
