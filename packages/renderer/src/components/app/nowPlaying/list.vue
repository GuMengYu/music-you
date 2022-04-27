<template>
  <transition name="slide-fade-y">
    <div v-show="showPlaying" class="rounded-lg play-list-container elevation-4">
      <v-toolbar tag="header" flat class="rounded-lg play-list-header" color="transparent">
        <div class="font-weight-bold">
          {{ $t('main.playing_queue') }}
        </div>
        <v-spacer />
        <v-btn icon>
          <v-icon @click="showPlaying = !showPlaying">
            {{ mdiCloseCircle }}
          </v-icon>
        </v-btn>
      </v-toolbar>
      <v-list max-height="50vh" min-height="20vh" class="play-list-container-list overflow-y-auto">
        <template v-for="(song, index) in playingList.list" :key="song.id">
          <track-item :track="song" :index="index + 1" />
        </template>
        <template v-if="!playingList.list.length">
          <p class="d-flex justify-center font-weight-bold">
            {{ $t('common.empty_playing_list') }}
          </p>
        </template>
      </v-list>
    </div>
  </transition>
</template>

<script setup lang="ts">
import { mdiCloseCircle } from '@mdi/js'
import { storeToRefs } from 'pinia'

import TrackItem from '@/components/app/TrackItem.vue'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'

const playerStore = usePlayerStore()
const appStore = useAppStore()

const { playingList } = storeToRefs(playerStore)
const { showPlaying } = storeToRefs(appStore)
</script>

<style scoped lang="scss">
.play-list-container {
  position: fixed;
  right: 20px;
  bottom: 80px;
  z-index: 7;
  width: 45vw;
  max-width: 550px;
  backdrop-filter: blur(30px);
  .play-list-container-list {
    background: transparent;
    &::-webkit-scrollbar {
      width: 0;
    }
  }
}
</style>
