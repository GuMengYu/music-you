<template>
  <div>
    <app-title path="common.language" />
    <v-list-item class="pa-0">
      <v-list-item-title class="text-caption"> {{ $t('main.setting.language') }} </v-list-item-title>
      <template #append>
        <AppSelect v-model="lang" :items="localeOptions" />
      </template>
    </v-list-item>
  </div>
  <div>
    <app-title path="common.quality" />
    <v-list-item class="pa-0">
      <v-list-item-title class="text-caption"> {{ $t('main.setting.quality') }} </v-list-item-title>
      <template #append>
        <AppSelect v-model="quality" :items="qualityOptions" />
      </template>
    </v-list-item>
  </div>
  <div>
    <app-title path="message.visualization" />
    <v-list-item class="pa-0">
      <v-list-item-title class="text-caption"> {{ $t('main.setting.visualization') }}</v-list-item-title>
      <template #append>
        <v-switch v-model="visualization" color="primary" hide-details density="compact" inset></v-switch>
      </template>
    </v-list-item>
  </div>
  <div>
    <app-title path="common.exitmode" />
    <v-list-item class="pa-0">
      <v-list-item-title class="text-caption"> {{ $t('main.setting.exit') }} </v-list-item-title>
      <template #append>
        <AppSelect v-model="exitMode" :items="exitModeOptions" />
      </template>
    </v-list-item>
  </div>
  <div>
    <app-title path="message.reset_app" />
    <v-list-item class="pa-0">
      <v-list-item-title class="text-caption"> {{ $t('main.setting.reset') }}</v-list-item-title>
      <template #append>
        <v-dialog v-model="showAlert" persistent>
          <template #activator="{ props }">
            <v-btn color="primary" size="small" v-bind="props" variant="outlined" rounded>
              {{ $t('message.reset_app') }}
            </v-btn>
          </template>
          <v-card class="pt-4 pb-2" rounded="xl" color="surface" width="90vw" max-width="350">
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
                {{ $t('common.disagree') }}
              </v-btn>
              <v-btn color="primary" variant="text" @click="resetApp"> {{ $t('common.agree') }} </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </template>
    </v-list-item>
  </div>
</template>
<script setup lang="ts">
import { mdiRestore } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import AppSelect from '@/components/menu/Select.vue'
import AppTitle from '@/components/Title.vue'
import { ExitMode, useSettingStore } from '@/store/setting'

const settingStore = useSettingStore()
const { locale: lang, quality, visualization, exitMode } = storeToRefs(settingStore)

const { t, locale } = useI18n({ useScope: 'global' })
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
watch(lang, () => {
  locale.value = lang.value
})

const showAlert = ref(false)
function resetApp() {
  showAlert.value = false
  window.localStorage.clear()
  window.location.reload()
}
</script>
