<template>
  <v-app-bar v-if="track?.id" location="bottom" fixed class="player-footer px-2" :order="-1" :height="74">
    <TrackSlider class="track-slider" tooltip />
    <div class="playing-control">
      <div class="playing-bar__left">
        <v-hover v-slot="{ isHovering, props }">
          <v-img
            v-bind="props"
            class="rounded-md"
            :aspect-ratio="1"
            :min-width="56"
            :max-width="56"
            :max-height="56"
            :src="albumPicUrl"
            cover
          >
            <v-btn v-show="isHovering" width="56" height="56" icon @click.stop="showPlayingPage">
              <v-icon color="primary">{{ mdiArrowExpand }}</v-icon>
            </v-btn>
          </v-img>
        </v-hover>

        <div class="ml-2 mr-4 d-flex align-start flex-column">
          <div class="d-flex align-center line-clamp-1 text-h6">
            <Router-Link v-if="track.al" :to="`/album/${track.al.id}`" class="text-onSurface"
              >{{ track?.name }}
            </Router-Link>
            <span v-else> {{ track?.name }} </span>
            <!--
              <span v-if="track.meta?.type" class="text-caption font-weight-bold text-secondary">
                · {{ track.meta.type }}
              </span>

              <span v-if="track.meta?.br" class="text-caption font-weight-bold text-secondary">
                · {{ `${Math.ceil((track.meta.br ?? 0) / 1000)}` }}kbps
              </span> -->
          </div>

          <artists-link :artists="track?.ar" class="text-caption line-clamp-1" />
        </div>
        <like-toggle :id="track?.id" />
        <v-btn icon variant="text" @click="openContextMenu">
          <v-icon size="small">{{ mdiDotsHorizontal }}</v-icon>
          <v-tooltip activator="parent" location="top" open-delay="100"> 添加到歌单 </v-tooltip>
        </v-btn>
        <v-spacer />
      </div>
      <Control />
      <div class="playing-bar__right">
        <v-btn v-if="showHeartBeat" icon :loading="heartbeatLoading" @click="generateHeartBeatList">
          <v-icon size="x-small">
            {{ mdiHeartPulse }}
          </v-icon>
          <v-tooltip activator="parent" location="top" open-delay="100"> 心动模式 </v-tooltip>
        </v-btn>
        <v-btn icon :color="showPipLyric ? 'primary' : ''" @click="togglePipLyric">
          <v-icon size="x-small">
            {{ mdiPictureInPictureTopRight }}
          </v-icon>
          <v-tooltip activator="parent" location="top" open-delay="100">
            {{ showPipLyric ? t('common.hide_pip') : t('common.show_pip') }}
          </v-tooltip>
        </v-btn>
        <!-- <v-btn icon @click="toggleMinimal">
            <v-icon size="x-small">
              {{ mdiDockWindow }}
            </v-icon>
          </v-btn> -->
        <VolumeSlider orientation="horizontal" />
        <v-btn icon :color="isQueue ? 'primary' : ''" :disabled="isCurrentFm" @click="toQueue">
          <v-icon ref="playlistBtn" size="small">
            {{ mdiPlaylistMusic }}
          </v-icon>
        </v-btn>
      </div>
    </div>
  </v-app-bar>
</template>
<script setup lang="ts">
import {
  mdiArrowExpand,
  mdiDotsHorizontal,
  mdiHeartPulse,
  mdiPictureInPictureTopRight,
  mdiPlaylistMusic,
} from '@mdi/js'
import { useEventBus } from '@vueuse/core'
import { storeToRefs } from 'pinia'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import { useContextMenu } from 'vuetify-ctx-menu/lib/main'

import { opPlaylist } from '@/api/music'
import { getHeartBeatList } from '@/api/user'
import TrackSlider from '@/components/TrackSlider.vue'
import { useEmojiAnimation } from '@/hooks/useEmojiAnimation'
import useInForeground from '@/hooks/useInForeground'
import { useCurrentTheme } from '@/hooks/useTheme'
import { usePlayer } from '@/player/player'
import { useAppStore } from '@/store/app'
import { usePlayerStore } from '@/store/player'
import { usePlayQueueStore } from '@/store/playQueue'
import { useUserStore } from '@/store/user'
import { sizeOfImage } from '@/util/fn'
import { specialType } from '@/util/metadata'
// utitlity
const playerStore = usePlayerStore()
const playQueueStore = usePlayQueueStore()
const appStore = useAppStore()
const userStore = useUserStore()
const router = useRouter()
const player = usePlayer()
const toast = useToast()
const { t } = useI18n()

const contextMenu = useContextMenu()

const { themeName } = useCurrentTheme()

const heartbeatLoading = ref(false)

const playlists = computed(() => {
  return userStore.createdPlaylists
    .map((i) => {
      return {
        id: i.id,
        name: i.name,
        specialType: i.specialType,
      }
    })
    .filter((playlist) => playlist.specialType !== specialType.fav.type)
})

// store state
const { track, showPipLyric, isCurrentFm } = storeToRefs(playerStore)
const albumPicUrl = computed(() => sizeOfImage(track.value?.al?.picUrl ?? '', 128))

const showHeartBeat = computed(() => {
  return userStore.logged && track.value && userStore.likes.includes(track.value.id)
})
// 播放并开启飞越小动画
const playlistBtn = ref<HTMLButtonElement>()
const { playAnimation } = useEmojiAnimation(playlistBtn)
const eventBus = useEventBus<number>('addToQueue')
eventBus.on((id, setQueue) => {
  player.updatePlayerTrack(id)
  playAnimation('🎉')
  if (setQueue) {
    playQueueStore.setQueue(id)
  }
})

// 跳转播放列表

const { isActive: isQueue } = useInForeground('queue')
function toQueue() {
  if (isQueue.value) {
    router.back()
  } else {
    router.push('/queue')
  }
}

// 桌面歌词
function togglePipLyric() {
  if (!showPipLyric.value) {
    player.pipLyric?.enter()
  } else {
    player.pipLyric?.leave()
  }
}
player.pipLyric!.onLeave = function () {
  console.log('on leave')
  showPipLyric.value = false
}
player.pipLyric!.onEnter = function () {
  console.log('on enter')
  showPipLyric.value = true
}

// async function toggleMinimal() {
//   if (is.electron()) {
//     const ipcRenderer = useIpcRenderer()
//     await ipcRenderer.invoke('minimalWindow')
//   }
// }

async function showPlayingPage() {
  // if (is.electron() && settingStore.playingMode === PLAYING_MODE.MD && !settingStore.visualization) {
  //   const ipcRenderer = useIpcRenderer()
  //   await ipcRenderer.invoke('adjustWidth')
  // }
  appStore.showLyric = true
}

function openContextMenu(event: MouseEvent) {
  const { x, y } = event
  const option = {
    theme: themeName.value,
    x,
    y,
    items: [
      ...playlists.value.map((list) => {
        return {
          label: list.name,
          onClick: () => {
            track.value?.id && trackToPlayList(list.id, track.value.id)
          },
        }
      }),
    ],
    offsetFooter: 48,
    customClass: 'bg-surfaceVariant',
  }
  contextMenu(option)
}

async function trackToPlayList(playlistId: number, trackId: number) {
  // add to playlist
  try {
    const { code, message } = await opPlaylist('add', playlistId, trackId)
    if (code === 200) {
      toast.success(t('message.add_list_success'))
    } else {
      toast.error(message!)
    }
  } catch (e) {
    toast.error(t('message.something_wrong'))
  }
}
async function generateHeartBeatList() {
  heartbeatLoading.value = true
  try {
    if (track.value?.id) {
      const id = track.value?.id
      const list = await getHeartBeatList(id)
      if (list.length) {
        playQueueStore.updatePlayQueue(0, 'intelligence', '心动智能列表', list)
        toast.success(t('message.heartbeat_success'))
      } else {
        toast.warning(t('common.no_more'))
      }
    }
  } catch (e) {
    toast.error(t('message.something_wrong'))
  } finally {
    heartbeatLoading.value = false
  }
}
</script>

<style lang="scss" scoped>
.player-footer {
  bottom: 0;
  width: 100vw;
  z-index: 1007;
  display: flex;
  flex-flow: column nowrap;
  overflow: visible;
  padding: 0 12px;
  :deep(.v-toolbar__content) {
    padding: 8px 0;
  }

  .playing-control {
    display: flex;
    width: 100%;

    .playing-bar__left {
      display: flex;
      flex: 1;
      align-items: center;
    }

    .playing-bar__right {
      display: flex;
      flex: 1;
      align-items: center;
      justify-content: flex-end;

      .volume-bar {
        width: 100%;
        max-width: 165px;
      }
    }
  }
  .track-slider {
    position: absolute;
    top: -10px;
  }
}
</style>
