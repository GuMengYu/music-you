<template>
  <section class="d-flex justify-center">
    <v-container style="max-width: 960px" class="d-flex flex-column gap-4 flex-fill">
      <h6 class="text-h5 mb-4">{{ t('common.setting') }}</h6>
      <app-settings-theme />
      <app-settings-other />
      <app-settings-tips />
    </v-container>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import AppSettingsOther from './components/Other.vue'
import AppSettingsTheme from './components/Theme.vue'
import AppSettingsTips from './components/Tips.vue'
const { t } = useI18n()
</script>
