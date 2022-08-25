import { computed } from 'vue'
import { useDisplay, useLayout } from 'vuetify'

export function useMainSize() {
  const display = useDisplay()
  const layout = useLayout()
  const width = computed(() => {
    const containerPadding = 24 * 2
    return display.width.value - parseInt(layout.mainStyles.value?.paddingLeft as string) - containerPadding
  })
  const height = computed(() => {
    return display.height.value ?? 720
  })
  return {
    width,
    height,
  }
}
