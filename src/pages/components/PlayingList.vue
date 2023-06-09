<template>
  <div class="d-flex flex-column">
    <div v-if="nextList.length">
      <RecycleScroller
        v-slot="{ item: track, index }"
        class="scroller"
        :style="{
          height: `${listHeight}px`,
        }"
        :items="nextList"
        :item-size="64"
        key-field="id"
      >
        <TrackI :track="track" :index="index + 1" @play="play" />
      </RecycleScroller>
    </div>
    <template v-if="noMore">
      <p class="d-flex justify-center font-weight-bold text-caption">
        {{ t('common.empty_playing_list') }}
      </p>
    </template>
  </div>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useDisplay } from 'vuetify'

// import type { MenuItem } from 'vuetify-ctx-menu/lib/ContextMenuDefine'
// import { useContextMenu } from 'vuetify-ctx-menu/lib/main'
import { usePlayer } from '@/player/player'
import { usePlayQueueStore } from '@/store/playQueue'

// import type { Track } from '@/types'
import TrackI from './Track.vue'

// const contextMenu = useContextMenu()
const playQueueStore = usePlayQueueStore()
const player = usePlayer()
const { t } = useI18n()
const { queue, priorityQueue } = storeToRefs(playQueueStore)
const display = useDisplay()

const listHeight = computed(() => {
  // nav header 48px + header border 1px + padding 32px + divider 32px + media card 130px + action button 132px + footer 74px
  return display.height.value - 316
})
const nextList = computed(() => {
  return queue.value.tracks
})

const noMore = computed(() => {
  return !(nextList.value.length + priorityQueue.value.length)
})

function play(trackId: number) {
  player.updatePlayerTrack(trackId)
}

// todo context menu
// function openMenu(payload: { x: number; y: number; track: Track; liked: boolean }) {
//   const { x, y, liked, track } = payload
//   const option = {
//     theme: themeName.value,
//     x,
//     y,
//     items: genMenu(liked, track),
//     offsetFooter: 64,
//   }
//   contextMenu(option)
// }
// function genMenu(liked: boolean, track: Track): MenuItem[] {
//   const items: MenuItem[] = [
//     {
//       label: t('common.add_to_queue'),
//       onClick: (i) => {
//       },
//     },
//   ]
//   return items
// }
</script>
