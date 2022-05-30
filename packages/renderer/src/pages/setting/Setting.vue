<template>
  <section>
    <h6 class="text-h5 mb-4">setting</h6>
    <app-settings-theme />

    <v-divider class="mt-4 mb-3 mx-n3" />

    <app-settings-other />
    <v-btn color="primary" @click="resetApp"> reset app </v-btn>
  </section>
</template>

<script setup lang="ts">
import AppSettingsOther from './components/Other.vue'
import AppSettingsTheme from './components/Theme.vue'
function resetApp() {
  window.localStorage.clear()
  window.location.reload()
}
</script>
