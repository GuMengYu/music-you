<template>
  <v-hover v-slot="{ isHovering, props: hoverProps }">
    <v-card
      v-bind="hoverProps"
      rounded="md"
      color="surfaceVariant"
      class="d-flex quick-card align-center"
      flat
      :height="height"
    >
      <div
        v-if="smAndUp"
        :class="`bg-primary`"
        class="rounded-circle d-flex align-center justify-center ml-4"
        style="height: 45px; width: 45px; min-width: 45px"
      >
        <v-icon size="small">
          {{ mdiRadio }}
        </v-icon>
      </div>
      <div class="d-flex align-center justify-space-between flex-fill px-4 gap-1 text-onSurfaceVariant">
        <div class="d-flex text-subtitle-1 flex-column">
          <span class="line-clamp-1">
            {{ fmTrack?.name }}
          </span>
          <artists-link v-if="fmTrack" class="text-subtitle-2 line-clamp-1" :artists="fmTrack.ar ?? fmTrack.artists" />
        </div>
        <div v-if="smAndUp" class="d-flex align-center justify-center" style="height: 48px">
          <v-btn icon size="small" variant="text" @click="trash">
            <v-icon size="small">{{ mdiHeartOffOutline }} </v-icon>
          </v-btn>
          <v-btn icon size="small" variant="text" @click="next">
            <v-icon size="small">{{ mdiSkipNext }}</v-icon>
          </v-btn>
        </div>
      </div>
      <v-img
        :min-width="height"
        :min-height="height"
        :max-height="height"
        :max-width="height"
        class="card-img"
        :lazy-src="placeholderUrl"
        :src="coverImgUrl"
      >
        <div class="action d-flex justify-center align-center fill-height flex-fill">
          <transition name="slide-fade-x">
            <v-btn v-show="isHovering" icon flat color="primary" @click="togglePlay">
              <v-icon>{{ playing ? mdiPause : mdiPlay }}</v-icon>
            </v-btn>
          </transition>
        </div>
      </v-img>
    </v-card>
  </v-hover>
</template>

<script lang="ts" setup>
import { mdiHeartOffOutline, mdiPause, mdiPlay, mdiRadio, mdiSkipNext } from '@mdi/js'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import { useToast } from 'vue-toastification'
import { useDisplay } from 'vuetify'

import { fmToTrash } from '@/api/user'
import placeholderUrl from '@/assets/placeholder.png'
import { usePlayer } from '@/player/player'
import { usePlayerStore } from '@/store/player'
import { sizeOfImage, toHttps } from '@/util/fn'
const player = usePlayer()
const playerStore = usePlayerStore()
const toast = useToast()
const { smAndUp } = useDisplay()

const { fmTrack } = storeToRefs(playerStore)

const props = defineProps<{
  data?: any
  type?: any
  flag?: any
}>()
const coverImgUrl = computed(() => {
  if (fmTrack.value?.album?.picUrl) {
    return sizeOfImage(toHttps(fmTrack.value?.album?.picUrl), 256)
  } else if (fmTrack.value?.al?.picUrl) {
    return sizeOfImage(toHttps(fmTrack.value?.al?.picUrl), 256)
  } else {
    return placeholderUrl
  }
})
const height = computed(() => {
  return smAndUp.value ? 80 : 64
})
const playing = computed(() => {
  return playerStore.playing && playerStore.isCurrentFm
})

async function trash() {
  if (fmTrack.value?.id) {
    await fmToTrash(fmTrack.value.id)
    await player.nextFm()
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
    await player.updatePlayerTrack(fmTrack.value.id, true, true, true) // 替换当前播放歌曲
  } else {
    toast.warning('FM歌曲未加载')
  }
}
async function next() {
  player.nextFm()
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
