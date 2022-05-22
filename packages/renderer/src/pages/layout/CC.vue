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
          <switch-card
            v-model="darkMode"
            title="深色主题"
            :subtitle="darkMode ? '已开启' : '已关闭'"
            :icon="mdiCircleHalfFull"
          />
        </v-col>
        <v-col>
          <switch-card v-model="darkMode" title="跟随系统" subtitle="在日落时开启" :icon="mdiCircleHalfFull" />
        </v-col>
      </v-row>
      <v-row dense class="mt-1">
        <v-col>
          <switch-card v-if="isDev" title="Playground" subtitle="" :icon="mdiBook" @click="toPlayground" />
        </v-col>
      </v-row>
      <v-divider class="my-4" />
      <MediaCard />
    </v-container>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { mdiBook, mdiCircleHalfFull } from '@mdi/js'
import { computed } from 'vue'
import { useTheme } from 'vuetify'

// Composables
import { useAppStore } from '@/store/app'
import { APPEARANCE, useSettingStore } from '@/store/setting'

export default defineComponent({
  setup() {
    const app = useAppStore()
    const setting = useSettingStore()
    const theme = useTheme()
    const router = useRouter()
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
    const isDev = import.meta.env.DEV
    // for dev
    function toPlayground() {
      router.push('/playground')
    }
    return {
      darkMode,
      app,
      mdiCircleHalfFull,
      mdiBook,
      isDev,
      toPlayground,
    }
  },
})
</script>
