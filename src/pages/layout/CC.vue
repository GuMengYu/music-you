<template>
  <v-navigation-drawer
    v-model="app.showControlCenter"
    location="right"
    hide-overlay
    temporary
    width="310"
    floating
    class="bg-surface rounded-s-lg"
  >
    <v-toolbar density="compact" color="surface rounded-ts-lg">
      <v-toolbar-title class="text-caption font-weight-bold text-onSurfaceVariant">{{
        $t('common.shortcut')
      }}</v-toolbar-title>
      <v-spacer />
      <v-btn icon size="small" class="mr-1" @click="app.showControlCenter = false">
        <v-icon size="small"> {{ mdiClose }} </v-icon>
      </v-btn>
    </v-toolbar>
    <v-divider />
    <div class="pa-3">
      <account-extended-fab class="mb-4" />
      <v-row dense>
        <v-col class="d-flex">
          <switch-card
            v-model="darkMode"
            rounded="lg"
            :title="t('common.dark_theme')"
            :subtitle="t('common.open', darkMode ? 1 : 2)"
            :icon="darkMode ? mdiBrightness4 : mdiBrightness6"
          />
        </v-col>
        <v-col class="d-flex">
          <switch-card rounded="lg" :title="$t('common.setting')" :icon="mdiCog" @click="to('setting')" />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col class="d-flex">
          <switch-card
            v-model="miniplayer"
            rounded="lg"
            title="隐藏底部播放"
            :subtitle="t('common.hide', miniplayer ? 1 : 2)"
            :icon="mdiDockBottom"
          />
        </v-col>
        <v-col class="d-flex">
          <switch-card
            v-model="navLeft"
            rounded="lg"
            title="侧边导航栏"
            :subtitle="t('common.open', navLeft ? 1 : 2)"
            :icon="mdiPageLayoutSidebarLeft"
          />
        </v-col>
      </v-row>
      <v-row dense>
        <v-col class="d-flex" cols="6">
          <switch-card rounded="lg" :title="t('common.relaunch')" :icon="mdiCog" @click="appRelaunch" />
        </v-col>
      </v-row>
      <!--      <MediaCard class="mt-4" />-->
      <!--      <PlayingList class="mt-4" />-->
      <media-card v-if="miniplayer" class="mt-4" />
    </div>
  </v-navigation-drawer>
</template>

<script lang="ts" setup>
import {
  mdiBrightness4,
  mdiBrightness6,
  mdiClose,
  mdiCog,
  mdiDockBottom,
  mdiPageLayoutSidebarLeft,
  mdiTestTube,
} from '@mdi/js'
import { useIpcRenderer } from '@vueuse/electron'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useTheme } from 'vuetify'

import { useAppStore } from '@/store/app'
import { APPEARANCE, useSettingStore } from '@/store/setting'

import PlayingList from '../components/PlayingList.vue'

const { t } = useI18n()
const app = useAppStore()
const setting = useSettingStore()
const theme = useTheme()
const router = useRouter()
const { miniplayer, navLeft } = storeToRefs(setting)
const ipcRenderer = useIpcRenderer()
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
function appRelaunch() {
  ipcRenderer.invoke('relaunch')
}
</script>
