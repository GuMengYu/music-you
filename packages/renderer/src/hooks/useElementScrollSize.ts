import type { MaybeElementRef } from '@vueuse/core'
import { useResizeObserver } from '@vueuse/core'
import { computed } from 'vue'

export const useElementScrollSize = (el: MaybeElementRef) => {
  const scrollWidth = ref(0)
  const clientWidth = ref(0)

  useResizeObserver(el, (entries) => {
    const entry = entries[0]
    const { scrollWidth: sWidth, clientWidth: cWidth } = entry.target
    scrollWidth.value = sWidth
    clientWidth.value = cWidth
  })

  const willScroll = computed(() => {
    return scrollWidth.value > clientWidth.value
  })

  return {
    scrollWidth,
    clientWidth,
    willScroll,
  }
}
