<template>
  <app-settings-group v-model="appearance" title="common.theme" :items="appearanceItems" />
  <app-settings-group v-model="color" title="common.theme_color" :items="colorItems" />
  <v-btn
    fixed
    bottom
    right
    class="align-self-end text-capitalize mt-2"
    color="primaryContainer"
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
  <v-dialog v-model="customPalette">
    <v-card color="surfaceVariant" rounded="xl" class="py-4 pb-6 px-6 align-self-center">
      <div class="d-flex justify-center">
        <v-icon color="secondary" size="x-large">
          {{ mdiPalette }}
        </v-icon>
      </div>
      <div class="mt-3 d-flex flex-row gap-4 justify-center">
        <v-card
          variant="flat"
          height="128"
          width="128"
          rounded="lg"
          class="d-flex justify-center align-center bg-onSurfaceVariant"
          @click="handleColor"
        >
          <v-icon size="x-large">{{ mdiSelectColor }}</v-icon>
          <v-tooltip activator="parent" location="bottom" open-delay="100">
            {{ t('common.gen_from_color') }}
          </v-tooltip>
        </v-card>
        <v-card
          variant="flat"
          height="128"
          width="128"
          rounded="lg"
          class="d-flex justify-center align-center bg-onSurfaceVariant"
          @click="handleImage"
        >
          <v-icon size="x-large">{{ mdiImagePlus }}</v-icon>
          <v-tooltip activator="parent" location="bottom" open-delay="100">
            {{ t('common.gen_from_image') }}
          </v-tooltip>
        </v-card>
      </div>
    </v-card>
  </v-dialog>
  <v-dialog v-model="colorPalette">
    <v-card color="surfaceVariant" rounded="xl" class="py-4 pb-6 px-6 align-self-center" min-width="300">
      <v-card-title>{{ t('common.gen_color_value') }}</v-card-title>
      <div class="mt-3 d-flex flex-column gap-4 justify-center">
        <v-text-field v-model="colorValue" variant="filled" hide-details></v-text-field>
        <v-btn rounded="pill" variant="flat" color="primary" @click="handleColorChange">{{
          t('common.confirm')
        }}</v-btn>
      </div>
    </v-card>
  </v-dialog>
</template>

<script lang="ts" setup>
import {
  mdiDesktopTowerMonitor,
  mdiImagePlus,
  mdiPalette,
  mdiSelectColor,
  mdiWeatherNight,
  mdiWhiteBalanceSunny,
} from '@mdi/js'
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
const customPalette = ref(false)
const colorPalette = ref(false)
const colorValue = ref('')
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
  customPalette.value = true
}
function handleColor() {
  customPalette.value = false

  colorPalette.value = true
}
function handleImage() {
  upload.value?.click()
  customPalette.value = false
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
      applyCustomTheme(image)
    } catch (e) {
      console.log(e)
    }
  }
}
async function handleColorChange() {
  if (colorValue.value) {
    applyCustomTheme(colorValue.value)
  }
  colorPalette.value = false
}
async function applyCustomTheme(value: string | HTMLImageElement) {
  try {
    const newThemes = await generateVuetifyTheme(value, 'Customize')
    applyTheme(newThemes)
    // store customize theme in localstorage
    customTheme.value = newThemes
    color.value = WallpaperColor.Customize
  } catch (e) {
    console.log(e)
  }
}
</script>
