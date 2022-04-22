<template>
  <app-settings-group v-model="appearance" title="common.theme" :items="appearanceItems" />
  <v-divider class="my-3 mx-n3" />
  <app-settings-group v-model="wallpaperColor" title="common.theme_color" :items="colorItems" />
</template>

<script>
import { mdiDesktopTowerMonitor, mdiThemeLightDark, mdiWeatherNight, mdiWhiteBalanceSunny } from '@mdi/js'
import { computed } from 'vue'

import { useSettingStore } from '@/store/setting'

import AppSettingsGroup from './Group.vue'

export default {
  name: 'AppSettingsTheme',

  components: { AppSettingsGroup },

  setup() {
    const setting = useSettingStore()

    const appearanceItems = computed(() => [
      {
        text: 'common.light',
        icon: mdiWhiteBalanceSunny,
        value: 'light',
      },
      {
        value: 'dark',
        text: 'common.dark',
        icon: mdiWeatherNight,
      },
      {
        value: 'system',
        text: 'common.auto',
        icon: mdiDesktopTowerMonitor,
      },
    ])

    const colorItems = computed(() => [
      {
        value: 'RedSandDunes',
        text: 'theme.RedSandDunes',
      },
      {
        value: 'GreenMountainTop',
        text: 'theme.GreenMountainTop',
      },
      {
        value: 'OrangeDesert',
        text: 'theme.OrangeDesert',
      },
      {
        value: 'BlueMountains',
        text: 'theme.BlueMountains',
      },
      {
        value: 'GreenRockyMountains',
        text: 'theme.GreenRockyMountains',
      },
    ])
    const appearance = computed({
      get() {
        return setting.appearance
      },
      set(value) {
        setting.appearance = value
      },
    })

    const wallpaperColor = computed({
      get() {
        return setting.wallpaperColor
      },
      set(value) {
        setting.wallpaperColor = value
      },
    })
    return {
      appearanceItems,
      colorItems,
      appearance,
      wallpaperColor,
    }
  },
}
</script>
