<template>
  <app-settings-group v-model="appearance" title="common.theme" :items="appearanceItems" />
  <app-settings-group v-model="color" title="common.theme_color" :items="colorItems" />
  <v-btn
    fixed
    bottom
    right
    class="align-self-end text-capitalize mt-2"
    color="primary"
    :style="{
      position: 'fixed',
      right: '16px',
      bottom: '78px',
      borderRadius: '16px',
      height: '64px',
      zIndex: 1,
      transtion: 'all 0.3s ease-in-out',
    }"
    @click="handleCustomPalette"
  >
    <v-icon size="large">
      {{ mdiPalette }}
    </v-icon>
  </v-btn>
  <input v-show="false" ref="upload" type="file" accept="image/png,image/jpeg,image/webp" @change="handleChange" />
</template>

<script lang="ts" setup>
import { mdiDesktopTowerMonitor, mdiPalette, mdiPlus, mdiWeatherNight, mdiWhiteBalanceSunny } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'

import { useDynamicChangeTheme } from '@/hooks/useTheme'
import { generateVuetifyTheme } from '@/plugins/vuetify'
import type { APPEARANCE } from '@/store/setting'
import { useSettingStore, WallpaperColor } from '@/store/setting'

import AppSettingsGroup from './Group.vue'
const { t } = useI18n()
const setting = useSettingStore()
const { customTheme, wallpaperColor } = storeToRefs(setting)
const toast = useToast()
const { applyTheme } = useDynamicChangeTheme()
const upload = ref<HTMLInputElement>()
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

const defaultThemes = [
  {
    icon: mdiPalette,
    value: WallpaperColor.RedSandDunes,
    text: 'theme.RedSandDunes',
  },
  {
    icon: mdiPalette,
    value: WallpaperColor.GreenMountainTop,
    text: 'theme.GreenMountainTop',
  },
  {
    icon: mdiPalette,
    value: WallpaperColor.OrangeDesert,
    text: 'theme.OrangeDesert',
  },
  {
    icon: mdiPalette,
    value: WallpaperColor.BlueMountains,
    text: 'theme.BlueMountains',
  },
  {
    icon: mdiPalette,
    value: WallpaperColor.GreenRockyMountains,
    text: 'theme.GreenRockyMountains',
  },
]
const colorItems = computed(() => {
  if (customTheme.value.length) {
    return [
      ...defaultThemes,
      {
        icon: mdiPalette,
        value: 'Customize',
        text: 'theme.Customize',
      },
    ]
  }
  return [...defaultThemes]
})
const appearance = computed({
  get() {
    return setting.appearance
  },
  set(value: APPEARANCE) {
    setting.appearance = value
  },
})

const color = computed({
  get() {
    return wallpaperColor.value
  },
  set(value: WallpaperColor) {
    wallpaperColor.value = value
  },
})
function handleCustomPalette() {
  upload.value?.click()
}
async function handleChange(e: Event) {
  const { files = [] } = e.target as HTMLInputElement
  if (files?.length) {
    if (files[0].size > 2 * 1024 * 1024) {
      toast.error(t('message.pic_limit'))
      return
    }
    try {
      const objectURL = URL.createObjectURL(files[0])
      const image = new Image()
      image.src = objectURL
      const newThemes = await generateVuetifyTheme(image, 'Customize')
      applyTheme(newThemes)
      // store customize theme in localstorage
      customTheme.value = newThemes
      color.value = WallpaperColor.Customize
      // location.reload()
    } catch (e) {
      console.log(e)
    }
  }
}
</script>
