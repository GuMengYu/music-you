<template>
  <v-card v-if="track" rounded="md" :theme="theme" class="drag-area">
    <v-img
      :src="coverImage"
      :cover="true"
      :aspect-ratio="16 / 9"
      style="aspect-ratio: 16 / 9"
      class="rounded-md"
      gradient="90deg, rgb(0 0 0 / 70%) 0%, rgb(0 0 0 / 70%) 100%"
    >
      <div class="d-flex flex-column justify-space-between fill-height pt-2">
        <div class="d-flex justify-space-between px-2">
          <slot name="logo"></slot>
        </div>
        <div class="d-flex justify-space-between align-center px-2">
          <div class="d-flex flex-column text-caption">
            <span>{{ track?.name }}</span>
            <span>{{ track?.ar?.[0]?.name }}</span>
          </div>
          <v-square-btn
            color="primaryContainer"
            variant="flat"
            elevation="1"
            class="rounded-md no-drag-area"
            @click="toggle"
          >
            <v-icon size="small">{{ playing ? mdiPause : mdiPlay }}</v-icon>
          </v-square-btn>
        </div>
        <div class="d-flex justify-space-between align-center mx-1 no-drag-area">
          <v-btn density="comfortable" icon variant="text" size="small" @click="prev">
            <v-icon size="small">{{ mdiSkipPrevious }}</v-icon>
          </v-btn>
          <track-slider class="mx-1" />
          <v-btn density="comfortable" icon variant="text" size="small" color="white" @click="next">
            <v-icon size="small">{{ mdiSkipNext }}</v-icon>
          </v-btn>
          <v-btn
            size="small"
            density="comfortable"
            icon
            :disabled="isCurrentFm"
            color="white"
            variant="text"
            @click="toggleShuffle"
          >
            <v-icon size="x-small" :color="shuffle ? 'primary' : ''">
              {{ shuffleIcon }}
            </v-icon>
          </v-btn>
          <like-toggle :id="track.id" size="small" />
        </div>
      </div>
    </v-img>
  </v-card>
</template>

<script setup lang="ts">
import { mdiArrowLeft, mdiMusicCircle, mdiPause, mdiPlay, mdiSkipNext, mdiSkipPrevious } from '@mdi/js'

import usePlayerControl from '@/hooks/usePlayerControl'
import { useSettingStore } from '@/store/setting'
import { sizeOfImage } from '@/util/fn'

const settingStore = useSettingStore()

const { toggle, prev, next, playing, track, isCurrentFm, toggleShuffle, shuffle, shuffleIcon } = usePlayerControl()

const theme = computed(() => {
  return settingStore.wallpaperColor + 'Dark'
})

const coverImage = computed(() => {
  return sizeOfImage(track.value?.al?.picUrl ?? '', 1024)
})
</script>
