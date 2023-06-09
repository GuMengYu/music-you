<script setup lang="ts">
import { useIpcRenderer } from '@vueuse/electron'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'

import AppTitle from '@/components/Title.vue'
import { useSettingStore } from '@/store/setting'
const { t } = useI18n()
const { unlock } = storeToRefs(useSettingStore())
const ipcRenderer = useIpcRenderer()
watch(
  [
    () => unlock.value.youtube.open,
    () => unlock.value.youtube.proxy.host,
    () => unlock.value.youtube.proxy.port,
    () => unlock.value.youtube.proxy.protocol,
  ],
  () => {
    updateYouTubeConfig()
  }
)
function updateYouTubeConfig() {
  ipcRenderer.invoke('updateYoutubeConfig', JSON.stringify(unlock.value.youtube))
}
</script>
<template>
  <section>
    <div>
      <app-title path="解锁播放无版权歌曲" />
    </div>

    <div>
      <v-list-item class="px-0">
        <v-list-item-title class="text-subtitle-2 font-weight-medium">
          youtube 解锁<span class="text-caption">（效果更好一点, 但需要科学上网配置代理, 重启生效）</span>
        </v-list-item-title>
        <template #append>
          <v-switch v-model="unlock.youtube.open" color="primary" hide-details density="compact" inset></v-switch>
        </template>
      </v-list-item>
      <v-row>
        <v-col cols="4">
          <v-text-field
            v-model="unlock.youtube.proxy.host"
            single-line
            hide-details
            density="compact"
            label="Host"
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="unlock.youtube.proxy.port"
            single-line
            density="compact"
            label="Port"
            hide-details
          ></v-text-field>
        </v-col>
        <v-col cols="4">
          <v-text-field
            v-model="unlock.youtube.proxy.protocol"
            single-line
            density="compact"
            label="Protocol"
            hide-details
          ></v-text-field>
        </v-col>
      </v-row>
    </div>
    <div>
      <div>
        <v-list-item class="px-0">
          <v-list-item-title class="text-subtitle-2 font-weight-medium"> UnblockNetEaseMusic</v-list-item-title>
          <template #append>
            <v-switch
              v-model="unlock.unblockNetEaseMusic.open"
              color="primary"
              hide-details
              density="compact"
              inset
            ></v-switch>
          </template>
        </v-list-item>
        <v-row>
          <v-col cols="4">
            <v-text-field
              v-model="unlock.unblockNetEaseMusic.source"
              single-line
              density="compact"
              label="音源平台"
              hide-details
            ></v-text-field>
          </v-col>
          <v-col cols="4" class="align-self-center pl-0">
            <span class="text-caption">（英文逗号隔开,例如: kugou,kuwo,migu）</span>
          </v-col>
        </v-row>
      </div>
    </div>
  </section>
</template>
