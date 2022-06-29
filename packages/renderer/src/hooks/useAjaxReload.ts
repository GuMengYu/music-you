import useInForeground from './useInForeground'

export default function useAjaxReloadHook(pageName: string, cb: () => void) {
  const eventBus = useEventBus('reload')
  const { isActive } = useInForeground(pageName)
  const unsubscribe = eventBus.on(() => {
    isActive.value && cb()
  })
  onUnmounted(() => {
    unsubscribe()
  })
}
