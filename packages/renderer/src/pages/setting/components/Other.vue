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
    <app-title path="common.quality" />
    <v-list-item class="pa-0">
      <v-list-item-title class="text-caption mr-4"> {{ t('main.setting.quality') }} </v-list-item-title>
      <template #append>
        <AppSelect v-model="quality" :items="qualityOptions" />
      </template>
    </v-list-item>
    <v-list-item class="pa-0">
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
  <div v-if="is.linux() && is.macOS()">
    <app-title path="common.exitmode" />
    <v-list-item class="pa-0">
      <v-list-item-title class="text-caption"> {{ t('main.setting.exit') }} </v-list-item-title>
      <template #append>
        <AppSelect v-model="exitMode" :items="exitModeOptions" />
      </template>
    </v-list-item>
  </div>
  <div>
    <app-title path="message.reset_app" />
    <v-list-item class="pa-0">
      <v-list-item-title class="text-caption mr-4"> {{ t('main.setting.reset') }}</v-list-item-title>
      <template #append>
        <v-dialog v-model="showAlert" persistent>
          <template #activator="{ props }">
            <v-btn color="primary" size="small" v-bind="props" variant="outlined" rounded>
              {{ t('message.reset_app') }}
            </v-btn>
          </template>
          <v-card class="pt-4 align-self-center" rounded="xl" color="surface" width="90vw" max-width="350">
            <div class="d-flex justify-center">
              <v-icon color="secondary">
                {{ mdiRestore }}
              </v-icon>
            </div>
            <v-card-title class="text-center">{{ t('message.reset_app') }}</v-card-title>
            <v-card-subtitle class="text-center">{{ t('message.reset_msg') }}</v-card-subtitle>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" variant="text" @click="showAlert = false">
                {{ t('common.disagree') }}
              </v-btn>
              <v-btn color="primary" variant="text" @click="resetApp"> {{ t('common.agree') }} </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-list-item>
  </div>
</template>
<script setup lang="ts">
import { mdiRestore } from '@mdi/js'
import { uniqBy } from 'lodash-es'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import AppSelect from '@/components/menu/Select.vue'
import AppTitle from '@/components/Title.vue'
import { usePlayer } from '@/player/player'
import { ExitMode, useSettingStore } from '@/store/setting'
import is from '@/util/is'
const settingStore = useSettingStore()
const { locale: lang, quality, visualization, exitMode, outputdevice } = storeToRefs(settingStore)

const { t, locale } = useI18n({ useScope: 'global' })
const player = usePlayer()
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
      title: '低 (128Kbps)',
      value: 128000,
      activeClass: 'text-primary',
    },
    {
      title: '标准 (198Kbps)',
      value: 192000,
      activeClass: 'text-primary',
    },
    {
      title: '较高 (320Kbps)',
      value: 320000,
      activeClass: 'text-primary',
    },
    {
      title: '无损-需VIP',
      value: 999000,
      activeClass: 'text-primary',
    },
  ]
})

const outputDevices = ref<MediaDeviceInfo[]>([])
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
const showAlert = ref(false)
function resetApp() {
  showAlert.value = false
  window.localStorage.clear()
  window.location.reload()
}
// on created get device list
getoutputDevices()
// get media output device list
async function getoutputDevices() {
  const result = await navigator.mediaDevices.enumerateDevices()
  // 过滤输出设备, 同一物理设备的groupId相同
  const uniqed = uniqBy(
    result.filter((d) => d.kind === 'audiooutput'),
    'groupId'
  )
  outputDevices.value = uniqed.filter((device) => device.kind === 'audiooutput')
  // set default
  if (!outputdevice.value) {
    outputdevice.value = outputDevices.value[0].deviceId
  }
}
// handle device change
navigator.mediaDevices.ondevicechange = (e) => {
  getoutputDevices()
}
</script>
