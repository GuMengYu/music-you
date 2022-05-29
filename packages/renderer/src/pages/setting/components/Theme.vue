<template>
  <app-settings-group v-model="appearance" title="common.theme" :items="appearanceItems" />
  <v-divider class="my-3 mx-n3" />
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
      bottom: '86px',
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
  <input v-show="false" ref="upload" type="file" accept="image/png,image/jpeg" @change="handleChange" />
</template>

<script lang="ts">
import { mdiDesktopTowerMonitor, mdiPalette, mdiPlus, mdiWeatherNight, mdiWhiteBalanceSunny } from '@mdi/js'
import { generatePaletteFromURL } from 'md3-theme-generator'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import { useTheme } from 'vuetify'

import type { APPEARANCE } from '@/store/setting'
import { useSettingStore } from '@/store/setting'
import { fileToDataURL } from '@/util/fn'

import AppSettingsGroup from './Group.vue'

export default {
  name: 'AppSettingsTheme',

  components: { AppSettingsGroup },

  setup() {
    const { t } = useI18n()
    const theme = useTheme()
    const setting = useSettingStore()
    const { customPalette, wallpaperColor } = storeToRefs(setting)
    const toast = useToast()
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
        value: 'RedSandDunes',
        text: 'theme.RedSandDunes',
      },
      {
        icon: mdiPalette,
        value: 'GreenMountainTop',
        text: 'theme.GreenMountainTop',
      },
      {
        icon: mdiPalette,
        value: 'OrangeDesert',
        text: 'theme.OrangeDesert',
      },
      {
        icon: mdiPalette,
        value: 'BlueMountains',
        text: 'theme.BlueMountains',
      },
      {
        icon: mdiPalette,
        value: 'GreenRockyMountains',
        text: 'theme.GreenRockyMountains',
      },
    ]
    const colorItems = computed(() => {
      const { darkColors, lightColors } = customPalette?.value ?? {}
      if (darkColors && lightColors) {
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
      set(value: string) {
        wallpaperColor.value = value
      },
    })
    function handleCustomPalette() {
      console.log(upload.value)
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
          const dataURL = await fileToDataURL(files[0])
          const _palette = await generatePaletteFromURL(<string>dataURL)
          const palette = _palette.save()
          customPalette.value = {
            lightColors: palette.light,
            darkColors: palette.dark,
          }
          color.value = 'Customize'
          location.reload()
        } catch (e) {
          console.log(e)
        }
      }
    }
    return {
      appearanceItems,
      colorItems,
      appearance,
      color,
      handleCustomPalette,
      handleChange,
      mdiPalette,
      upload,
    }
  },
}
</script>
