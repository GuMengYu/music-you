<template>
  <section class="d-flex justify-center">
    <div style="max-width: 960px" class="d-flex flex-column gap-4 flex-fill">
      <app-settings-theme />
      <app-settings-other />
      <app-settings-unlock />
      <app-settings-reset />
      <app-settings-tips />
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

import AppSettingsOther from './components/Other.vue'
import AppSettingsReset from './components/Reset.vue'
import AppSettingsTheme from './components/Theme.vue'
import AppSettingsTips from './components/Tips.vue'
import AppSettingsUnlock from './components/Unlock.vue'
const { t } = useI18n()
</script>
