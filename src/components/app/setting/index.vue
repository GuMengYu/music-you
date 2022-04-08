<template>
  <v-navigation-drawer
    v-model="app.showSetting"
    fixed
    position="right"
    hide-overlay
    temporary
    width="350"
  >
    <v-toolbar flat>
      <v-toolbar-title text="Settings" class="pl-0" />

      <template #append>
        <v-btn :icon="mdiClose" @click="app.showSetting = false" />
      </template>
    </v-toolbar>

    <v-divider />

    <v-container>

      <app-settings-theme />

      <v-divider class="mt-4 mb-3 mx-n3" />

    </v-container>
  </v-navigation-drawer>
</template>

<script>
  // Components
  import AppSettingsApi from './Api.vue'
  import AppSettingsTheme from './Theme.vue'

  // Composables
  import { useAppStore } from '@/store/app'

  import { mdiClose } from '@mdi/js'
  export default {
    name: 'AppSettingsDrawer',

    components: {
      AppSettingsApi,
      AppSettingsTheme,
    },

    setup () {
      const app = useAppStore()

      return {
        app,
        mdiClose
      }
    },
  }
</script>
