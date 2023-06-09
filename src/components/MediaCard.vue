<template>
  <v-card v-if="track" rounded="md" height="150" :theme="theme">
    <v-img
      :src="coverImage"
      cover
      :aspect-ratio="16 / 9"
      class="rounded-md"
      gradient="90deg, rgb(0 0 0 / 76%) 0%, rgb(0 0 0 / 0%) 50%, rgb(0 0 0 / 76%) 100%"
    >
      <div class="d-flex flex-column justify-space-between fill-height pt-2">
        <div class="d-flex justify-space-between px-2">
          <v-icon color="primary" size="small"> {{ mdiMusicCircle }} </v-icon>
        </div>
        <div class="d-flex justify-space-between align-center px-2">
          <div class="d-flex flex-column text-caption">
            <span>{{ track?.name }}</span>
            <span>{{ track?.ar?.[0]?.name }}</span>
          </div>
          <v-square-btn color="primaryContainer" variant="flat" elevation="1" class="rounded-md" @click="toggle">
            <v-icon size="small">{{ playing ? mdiPause : mdiPlay }}</v-icon>
          </v-square-btn>
        </div>
        <div class="d-flex justify-space-between align-center mx-1">
          <v-btn density="comfortable" icon variant="text" size="small" @click="prev">
            <v-icon size="small">{{ mdiSkipPrevious }}</v-icon>
          </v-btn>
          <track-slider class="mx-1" />
          <v-btn density="comfortable" icon variant="text" size="small" color="white" @click="next">
            <v-icon size="small">{{ mdiSkipNext }}</v-icon>
          </v-btn>
          <like-toggle :id="track.id" size="small" />
        </div>
      </div>
    </v-img>
  </v-card>
</template>

<script setup lang="ts">
import { mdiMusicCircle, mdiPause, mdiPlay, mdiSkipNext, mdiSkipPrevious } from '@mdi/js'

import usePlayerControl from '@/hooks/usePlayerControl'
import { useSettingStore } from '@/store/setting'
import { sizeOfImage } from '@/util/fn'

const settingStore = useSettingStore()

const { toggle, prev, next, playing, track } = usePlayerControl()

const theme = computed(() => {
  return settingStore.wallpaperColor + 'Dark'
})

const coverImage = computed(() => {
  return sizeOfImage(track.value?.al?.picUrl ?? '', 512)
})
</script>
