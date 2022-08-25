import { usePreferredDark } from '@vueuse/core'
import { computed } from 'vue'

import { useSettingStore } from '../store/setting'
export function useCurrentTheme() {
  const systemDark = usePreferredDark()
  const settingStore = useSettingStore()

  const themeName = computed(() => {
    let suffix = ''
    settingStore.appearance === 'system'
      ? (suffix = systemDark.value ? 'Dark' : 'Light')
      : settingStore.appearance === 'light'
      ? (suffix = 'Light')
      : settingStore.appearance === 'dark'
      ? (suffix = 'Dark')
      : false
    return `${settingStore.wallpaperColor}${suffix}`
  })
  return {
    themeName,
  }
}
