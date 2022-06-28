<template>
  <div>
    <app-title path="common.language" />
    <v-list-item class="pa-0">
      <v-list-item-header class="text-caption"> {{ $t('main.setting.language') }} </v-list-item-header>
      <v-list-item-media>
        <AppSelect v-model="lang" :items="localeOptions" />
      </v-list-item-media>
    </v-list-item>
  </div>
  <div>
    <app-title path="common.quality" />
    <v-list-item class="pa-0">
      <v-list-item-header class="text-caption"> {{ $t('main.setting.quality') }} </v-list-item-header>
      <v-list-item-media>
        <AppSelect v-model="quality" :items="qualityOptions" />
      </v-list-item-media>
    </v-list-item>
  </div>
  <div>
    <app-title path="message.reset_app" />
    <v-list-item class="pa-0">
      <v-list-item-header class="text-caption"> {{ $t('main.setting.reset') }}</v-list-item-header>
      <v-list-item-media>
        <v-dialog v-model="showAlert" persistent max-width="350">
          <template #activator="{ props }">
            <v-btn color="primary" size="small" v-bind="props" variant="outlined" rounded>
              {{ $t('message.reset_app') }}
            </v-btn>
          </template>
          <v-card class="pt-4 pb-1" rounded="lg" color="surface">
            <div class="d-flex justify-center">
              <v-icon color="secondary" size="large">
                {{ mdiRestore }}
              </v-icon>
            </div>
            <v-card-title class="justify-center onSurface--text">{{ $t('message.reset_app') }}</v-card-title>
            <v-card-subtitle class="text-center onSurfaceVariant--text">{{ $t('message.reset_msg') }}</v-card-subtitle>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn variant="text" @click="showAlert = false">
                {{ $t('common.disagree') }}
              </v-btn>
              <v-btn color="primary" variant="text" @click="resetApp"> {{ $t('common.agree') }} </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-list-item-media>
    </v-list-item>
  </div>
</template>
<script setup lang="ts">
import { mdiRestore } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import AppSelect from '@/components/menu/Select.vue'
import AppTitle from '@/components/Title.vue'
import { useSettingStore } from '@/store/setting'

const settingStore = useSettingStore()
const { locale: lang, quality } = storeToRefs(settingStore)
const { t, locale } = useI18n({ useScope: 'global' })
const localeOptions = [
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

const qualityOptions = [
  {
    title: '128kbs',
    value: 128000,
    activeClass: 'text-primary',
  },
  {
    title: '320kbs',
    value: 320000,
    activeClass: 'text-primary',
  },
  {
    title: 'flac(999kbs)',
    value: 999000,
    activeClass: 'text-primary',
  },
]
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
