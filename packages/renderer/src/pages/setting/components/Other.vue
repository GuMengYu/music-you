<template>
  <app-title path="common.other" class="mb-2 pl-1" />

  <v-list-item>
    <v-list-item-header>
      <v-list-item-title>{{ $t('common.language') }}</v-list-item-title>
    </v-list-item-header>
    <v-list-item-media>
      <App-Select v-model="lang" :items="localeOptions" />
    </v-list-item-media>
  </v-list-item>
  <v-list-item>
    <v-list-item-header>
      <v-list-item-title>{{ $t('common.quality') }}</v-list-item-title>
    </v-list-item-header>
    <v-list-item-media>
      <App-Select v-model="quality" :items="qualityOptions" />
    </v-list-item-media>
  </v-list-item>
  <v-divider class="mt-4 mb-3 mx-n3" />
</template>
<script setup lang="ts">
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
    title: '128kb',
    value: 128000,
    activeClass: 'text-primary',
  },
  {
    title: '320kb',
    value: 320000,
    activeClass: 'text-primary',
  },
  {
    title: 'flac',
    value: 999000,
    activeClass: 'text-primary',
  },
]
watch(lang, () => {
  locale.value = lang.value
})
</script>
