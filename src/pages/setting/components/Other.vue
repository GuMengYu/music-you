<template>
  <div>
    <app-title path="common.language" />
    <v-list-item class="pa-0">
      <v-list-item-title class="text-caption mr-4"> {{ t('main.setting.language') }} </v-list-item-title>
      <template #append>
        <AppSelect v-model="lang" :items="localeOptions" />
      </template>
    </v-list-item>
  </div>
  <div>
    <app-title path="message.playing_page_mode" />
    <v-list-item class="pa-0">
      <v-list-item-title class="text-caption mr-4"> {{ t('main.setting.playing_page_mode') }} </v-list-item-title>
      <template #append>
        <AppSelect v-model="playingMode" :items="playingModeOptions" />
      </template>
    </v-list-item>
  </div>
  <div>
    <app-title path="common.quality" />
    <v-list-item class="pa-0">
      <v-list-item-title class="text-caption mr-4"> {{ t('main.setting.quality') }} </v-list-item-title>
      <template #append>
        <AppSelect v-model="quality_level" :items="qualityOptions" />
      </template>
    </v-list-item>
    <v-list-item v-if="outputDevices.length" class="pa-0">
      <v-list-item-title class="text-caption mr-4"> {{ t('main.setting.device') }} </v-list-item-title>
      <template #append>
        <AppSelect v-model="outputdevice" :items="outputDeviceOptions" />
      </template>
    </v-list-item>
  </div>
  <div>
    <app-title path="message.visualization" />
    <v-list-item class="pa-0">
      <v-list-item-title class="text-caption mr-4"> {{ t('main.setting.visualization') }}</v-list-item-title>
      <template #append>
        <v-switch v-model="visualization" color="primary" hide-details density="compact" inset></v-switch>
      </template>
    </v-list-item>
  </div>
  <div>
    <app-title path="message.comment" />
    <v-list-item class="pa-0">
      <v-list-item-title class="text-caption mr-4"> {{ t('main.setting.comment') }}</v-list-item-title>
      <template #append>
        <v-switch v-model="comment" color="primary" hide-details density="compact" inset></v-switch>
      </template>
    </v-list-item>
  </div>
  <div>
    <app-title path="message.lyric" />
    <v-list-item class="pa-0">
      <v-list-item-title class="text-caption mr-4"> {{ t('main.setting.trans') }}</v-list-item-title>
      <template #append>
        <v-switch v-model="lyricTrans" color="primary" hide-details density="compact" inset></v-switch>
      </template>
    </v-list-item>
  </div>
  <div v-if="is.windows()">
    <app-title path="common.exitmode" />
    <v-list-item class="pa-0">
      <v-list-item-title class="text-caption"> {{ t('main.setting.exit') }} </v-list-item-title>
      <template #append>
        <AppSelect v-model="exitMode" :items="exitModeOptions" />
      </template>
    </v-list-item>
  </div>
</template>
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import AppSelect from '@/components/menu/Select.vue'
import AppTitle from '@/components/Title.vue'
import useMediaDevices from '@/hooks/useMediaDevices'
import { usePlayer } from '@/player/player'
import { ExitMode, QUALITY_LEVEL, useSettingStore } from '@/store/setting'
import { PLAYING_MODE } from '@/util/enum'
import is from '@/util/is'
const settingStore = useSettingStore()
const {
  locale: lang,
  quality_level,
  visualization,
  comment,
  exitMode,
  outputdevice,
  playingMode,
  lyricTrans,
} = storeToRefs(settingStore)

const { t, locale } = useI18n({ useScope: 'global' })
const player = usePlayer()

const { outputDevices } = useMediaDevices()
const localeOptions = computed(() => {
  return [
    {
      title: t('common.zh-CN'),
      value: 'zhCN',
      activeClass: 'text-primary',
      rounded: true,
    },
    {
      title: t('common.en'),
      value: 'en',
      activeClass: 'text-primary',
      rounded: true,
    },
  ]
})
const playingModeOptions = computed(() => {
  return [
    {
      title: 'Ambilight',
      value: PLAYING_MODE.MD,
      activeClass: 'text-primary',
      rounded: true,
    },
    {
      title: 'WallHaven',
      value: PLAYING_MODE.SIMPLE,
      activeClass: 'text-primary',
      rounded: true,
    },
    // {
    //   title: 'wallhaven',
    //   value: PLAYING_MODE.WALLHAVEN,
    //   activeClass: 'text-primary',
    //   rounded: true,
    // },
  ]
})
const exitModeOptions = computed(() => {
  return [
    {
      title: t('message.exit_prompt'),
      value: ExitMode.prompt,
      activeClass: 'text-primary',
      rounded: true,
    },
    {
      title: t('message.exit_direct'),
      value: ExitMode.exit,
      activeClass: 'text-primary',
      rounded: true,
    },
    {
      title: t('message.exit_min'),
      value: ExitMode.minimize,
      activeClass: 'text-primary',
      rounded: true,
    },
  ]
})
const qualityOptions = computed(() => {
  return [
    {
      title: t('main.setting.standard'),
      value: QUALITY_LEVEL.STANDARD,
      activeClass: 'text-primary',
    },
    {
      title: t('main.setting.higher'),
      value: QUALITY_LEVEL.HIGHER,
      activeClass: 'text-primary',
    },
    {
      title: t('main.setting.extremely'),
      value: QUALITY_LEVEL.EXHIGH,
      activeClass: 'text-primary',
    },
    {
      title: t('main.setting.lossless'),
      value: QUALITY_LEVEL.LOSSLESS,
      activeClass: 'text-primary',
    },
    {
      title: 'Hi-Res(vip)',
      value: QUALITY_LEVEL.HIRES,
      activeClass: 'text-primary',
    },
  ]
})

const outputDeviceOptions = computed(() => {
  if (outputDevices.value.length) {
    return outputDevices.value.map((device) => {
      return {
        title: device.label,
        value: device.deviceId,
        activeClass: 'text-primary',
      }
    })
  } else {
    return [
      {
        title: '无输出设备',
        value: void 0,
        activeClass: 'text-primary',
      },
    ]
  }
})

watch(lang, () => {
  locale.value = lang.value
})

watch(outputdevice, () => {
  player.setoutputDevice()
})

watch(outputDevices, (val) => {
  // set default
  if (!outputdevice.value && val.length) {
    outputdevice.value = val[0].deviceId
  }
})
</script>
