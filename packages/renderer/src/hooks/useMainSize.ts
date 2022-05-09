import { computed } from 'vue'
import { useDisplay, useLayout } from 'vuetify'

export function useMainSize() {
  const display = useDisplay()
  const layout = useLayout()
  const width = computed(() => {
    return display.width.value - parseInt(layout.mainStyles.value?.paddingLeft as string)
  })
  const height = computed(() => {
    return display.height.value ?? 720
  })
  return {
    width,
    height,
  }
}
