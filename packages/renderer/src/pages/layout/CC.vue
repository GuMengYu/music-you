<template>
  <v-navigation-drawer
    v-model="app.showControlCenter"
    location="right"
    hide-overlay
    temporary
    width="300"
    floating
    class="bg-surface"
  >
    <v-toolbar density="compact" color="surface">
      <v-toolbar-title class="text-caption font-weight-bold text-onSurfaceVariant">{{
        $t('common.shortcut')
      }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon size="small" @click="app.showControlCenter = false">
        <v-icon size="small"> {{ mdiClose }} </v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider />
    <v-container>
      <v-row dense>
        <v-col class="d-flex">
          <switch-card
            v-model="darkMode"
            :title="$t('common.dark_theme')"
            :subtitle="$tc('common.open', darkMode ? 1 : 2)"
            :icon="mdiCircleHalfFull"
          />
        </v-col>
        <v-col class="d-flex">
          <switch-card :title="$t('common.setting')" :icon="mdiCog" @click="to('setting')" />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col class="d-flex">
          <switch-card
            v-model="miniplayer"
            title="迷你控制栏"
            :subtitle="$tc('common.open', miniplayer ? 1 : 2)"
            :icon="mdiCircleHalfFull"
          />
        </v-col>
        <v-col class="d-flex">
          <switch-card v-if="isDev" title="playground" :icon="mdiCog" @click="to('playground')" />
        </v-col>
      </v-row>
      <MediaCard class="mt-4" />
      <PlayingList class="mt-4" />
    </v-container>
  </v-navigation-drawer>
</template>

<script lang="ts">
import { mdiCircleHalfFull, mdiClose, mdiCog, mdiTestTube } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { useTheme } from 'vuetify'

// Composables
import { useAppStore } from '@/store/app'
import { APPEARANCE, useSettingStore } from '@/store/setting'

import PlayingList from '../components/PlayingList.vue'
export default defineComponent({
  components: { PlayingList },
  setup() {
    const app = useAppStore()
    const setting = useSettingStore()
    const theme = useTheme()
    const router = useRouter()
    const { miniplayer } = storeToRefs(setting)
    const darkMode = computed<boolean>({
      get() {
        return theme.current.value.dark
      },
      set(value) {
        setting.appearance = value ? APPEARANCE.DARK : APPEARANCE.LIGHT
      },
    })
    const isDev = import.meta.env.DEV ?? false
    // for dev
    function to(name: 'setting' | 'playground') {
      router.push(`/${name}`)
    }
    return {
      darkMode,
      miniplayer,
      app,
      mdiCircleHalfFull,
      mdiTestTube,
      mdiClose,
      mdiCog,
      isDev,
      to,
    }
  },
})
</script>
