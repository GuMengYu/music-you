<template>
  <v-navigation-drawer
    v-model="app.showControlCenter"
    position="right"
    hide-overlay
    temporary
    width="300"
    floating
    class="bg-surface"
  >
    <v-container>
      <v-row dense>
        <v-col>
          <app-switch-card
            v-model="darkMode"
            title="深色主题"
            :subtitle="darkMode ? '已开启' : '已关闭'"
            :icon="mdiCircleHalfFull"
          />
        </v-col>
        <v-col>
          <app-switch-card v-model="darkMode" title="跟随系统" subtitle="在日落时开启" :icon="mdiCircleHalfFull" />
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <media-playing-card />
    </v-container>
  </v-navigation-drawer>
</template>

<script>
// Components
import { mdiCircleHalfFull } from '@mdi/js'
import { computed } from 'vue'
import { useTheme } from 'vuetify'

import MediaPlayingCard from '@/components/app/MediaPlayingCard.vue'
import AppSwitchCard from '@/components/app/SwitchCard.vue'
// Composables
import { useAppStore } from '@/store/app'
import { APPEARANCE, useSettingStore } from '@/store/setting'

export default {
  name: 'AppSettingsDrawer',

  components: {
    MediaPlayingCard,
    AppSwitchCard,
  },

  setup() {
    const app = useAppStore()
    const setting = useSettingStore()
    const theme = useTheme()
    const isDark = computed(() => {
      return theme.getTheme(theme.current.value)?.dark
    })
    const darkMode = computed({
      get() {
        return isDark.value
      },
      set(value) {
        setting.appearance = value ? APPEARANCE.DARK : APPEARANCE.LIGHT
      },
    })
    return {
      darkMode,
      app,
      mdiCircleHalfFull,
    }
  },
}
</script>
