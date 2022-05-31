<template>
  <v-card rounded="lg" color="surfaceVariant" class="d-flex quick-card align-center" flat :height="80">
    <div
      :class="`bg-primary`"
      class="rounded-circle d-flex align-center justify-center ml-4"
      style="height: 45px; width: 45px; min-width: 45px"
    >
      FM
    </div>
    <div class="d-flex align-center justify-space-between flex-fill px-4 flex-column text-onSurfaceVariant">
      <span :title="title" class="text-caption font-weight-bold text-decoration-none line-clamp-1">
        {{ title }}
      </span>
      <div class="d-flex align-center justify-center gap-3" style="height: 48px">
        <v-btn icon size="x-small" variant="text" @click="trash">
          <v-icon size="x-small">{{ mdiDelete }} </v-icon>
        </v-btn>
        <v-btn icon flat size="x-small" color="primary" @click="togglePlay">
          <v-icon size="x-small">{{ playing ? mdiPause : mdiPlay }}</v-icon>
        </v-btn>
        <v-btn icon size="x-small" variant="text" @click="next">
          <v-icon size="x-small">{{ mdiSkipNextOutline }}</v-icon>
        </v-btn>
      </div>
    </div>
    <v-img
      :min-width="80"
      :min-height="80"
      :max-height="80"
      :max-width="80"
      class="card-img"
      :lazy-src="placeholderUrl"
      :src="coverImgUrl"
    >
    </v-img>
  </v-card>
</template>

<script lang="ts" setup>
import { mdiDelete, mdiPause, mdiPlay, mdiSkipNextOutline } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useToast } from 'vue-toastification'

import { fmToTrash } from '@/api/user'
import placeholderUrl from '@/assets/placeholder.png'
import { usePlayer } from '@/player/player'
import { usePlayerStore } from '@/store/player'
import { sizeOfImage } from '@/util/fn'
const player = usePlayer()
const playerStore = usePlayerStore()
const toast = useToast()

const { fmTrack, track } = storeToRefs(playerStore)

const coverImgUrl = computed(() => {
  if (fmTrack.value?.album?.picUrl) {
    return sizeOfImage(fmTrack.value?.album?.picUrl, 256)
  } else {
    return placeholderUrl
  }
})

const title = computed(() => {
  return `${fmTrack.value?.ar?.[0]?.name ?? fmTrack.value?.artists?.[0].name ?? ''} - ${fmTrack.value?.name} `
})
const playing = computed(() => {
  return playerStore.playing && playerStore.isCurrentFm
})

async function trash() {
  if (fmTrack.value?.id) {
    await fmToTrash(fmTrack.value.id)
    await player.next()
  }
}
async function togglePlay() {
  if (playerStore.isCurrentFm) {
    if (playing.value) {
      await player.pause()
    } else {
      await player.play()
    }
  } else if (fmTrack.value?.id) {
    playerStore.isCurrentFm = true
    await player.updatePlayerTrack(fmTrack.value.id, true) // 替换当前播放歌曲
  } else {
    toast.warning('FM歌曲未加载')
  }
}
async function next() {
  !playerStore.isCurrentFm && (playerStore.isCurrentFm = true)
  await player.next()
  playerStore.updatePersonalFmList()
}

init()
async function init() {
  await playerStore.updatePersonalFmList()
}
</script>

<style scoped lang="scss">
.quick-card {
  .card-img {
    border-top-right-radius: inherit;
    border-bottom-right-radius: inherit !important;
  }
}
</style>
