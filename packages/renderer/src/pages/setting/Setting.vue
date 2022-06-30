<template>
  <section class="d-flex justify-center">
    <div style="max-width: 840px" class="d-flex flex-column gap-4 flex-fill">
      <h6 class="text-h5 mb-4">{{ $t('common.setting') }}</h6>
      <app-settings-theme />
      <app-settings-other />
    </div>
  </section>
</template>

<script setup lang="ts">
import AppSettingsOther from './components/Other.vue'
import AppSettingsTheme from './components/Theme.vue'
</script>
