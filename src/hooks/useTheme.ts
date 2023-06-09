import { usePreferredDark } from '@vueuse/core'
import { computed } from 'vue'
import { useTheme } from 'vuetify'

import type { ThemeDefinition } from '@/plugins/vuetify'
import { arrayToObject } from '@/util/fn'

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

export function useDynamicChangeTheme() {
  const vuetifyTheme = useTheme()

  const applyTheme = (themes: ThemeDefinition[]) => {
    const theme = arrayToObject(themes, 'name')

    vuetifyTheme.themes.value = {
      ...vuetifyTheme.themes.value,
      ...theme,
    }
  }
  return {
    applyTheme,
  }
}
