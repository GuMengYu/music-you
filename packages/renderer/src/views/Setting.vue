<template>
  <section>
    <h6 class="text-h5 mb-4">setting</h6>
    <app-settings-theme />

    <v-divider class="mt-4 mb-3 mx-n3" />

    <app-settings-other />
  </section>
</template>

<script setup lang="ts">
import AppSettingsOther from '@/components/app/setting/other.vue'
import AppSettingsTheme from '@/components/app/setting/Theme.vue'
</script>
