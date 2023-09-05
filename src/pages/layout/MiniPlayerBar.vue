<template>
  <v-card
    v-if="track?.id"
    ref="playerCard"
    rounded="lg"
    :theme="theme"
    elevation="24"
    class="d-flex flex-column no-drag-area"
    :style="{
      position: 'absolute',
      zIndex: 9999,
      // right: '16px',
      // bottom: '32px',
    }"
    height="140"
    width="140"
  >
    <v-img :src="coverImage" :cover="true" class="rounded-lg" :gradient="`90deg, ${maskColor} 0%, ${maskColor} 100%`">
      <div class="d-flex flex-column justify-space-between fill-height pa-1">
        <div class="d-flex justify-space-between">
          <like-toggle :id="track.id" size="small" :color="colorPalette?.primaryContainer" />
          <!--          <v-btn density="comfortable" icon variant="text" size="small" @click="showPlayingPage">-->
          <!--            <v-icon size="small">{{ mdiArrowExpand }}</v-icon>-->
          <!--          </v-btn>-->
          <v-btn v-if="!isProgram" density="comfortable" icon size="small" variant="text" @click="openContextMenu">
            <v-icon size="small">{{ mdiDotsHorizontal }}</v-icon>
          </v-btn>
        </div>
        <div class="d-flex justify-center flex-column align-center">
          <play-toggle-plain />
        </div>

        <div class="d-flex justify-space-between align-center control-buttons">
          <v-btn density="comfortable" icon variant="text" size="small" @click="prev">
            <v-icon size="small">{{ mdiSkipPreviousOutline }}</v-icon>
          </v-btn>
          <track-slider />

          <v-btn density="comfortable" icon variant="text" size="small" @click="next">
            <v-icon size="small">{{ mdiSkipNextOutline }}</v-icon>
          </v-btn>
        </div>
      </div>
    </v-img>
  </v-card>
</template>
<script setup lang="ts">
import { mdiDotsHorizontal, mdiSkipNextOutline, mdiSkipPreviousOutline } from '@mdi/js'
import type { Handler } from '@vueuse/gesture'
import { useDrag } from '@vueuse/gesture'
import { useMotionProperties, useSpring } from '@vueuse/motion'
import { useI18n } from 'vue-i18n'
import { useToast } from 'vue-toastification'
import type { VCard } from 'vuetify/components'
import type { MenuItem } from 'vuetify-ctx-menu/lib/ContextMenuDefine'
import { useContextMenu } from 'vuetify-ctx-menu/lib/main'

import { opPlaylist } from '@/api/music'
import { getHeartBeatList } from '@/api/user'
import PlayTogglePlain from '@/components/toggle/PlayTogglePlain.vue'
import TrackSlider from '@/components/TrackSlider.vue'
import usePlayerControl from '@/hooks/usePlayerControl'
import { useCurrentTheme } from '@/hooks/useTheme'
import { usePlayer } from '@/player/player'
import { generateVuetifyTheme } from '@/plugins/vuetify'
import { useAppStore } from '@/store/app'
import { usePlayQueueStore } from '@/store/playQueue'
import { useSettingStore } from '@/store/setting'
import { useUserStore } from '@/store/user'
import type { PlayNowEvent } from '@/types'
import { hexToRgb, sizeOfImage } from '@/util/fn'
import { specialType } from '@/util/metadata'
const appStore = useAppStore()
const userStore = useUserStore()
const toast = useToast()
const player = usePlayer()
const playQueueStore = usePlayQueueStore()
const settingStore = useSettingStore()
const { t } = useI18n()
const router = useRouter()

const contextMenu = useContextMenu()

const { themeName } = useCurrentTheme()

const colorPalette = ref()
const playerCard = ref<InstanceType<typeof VCard>>()
const playerCardDom = computed(() => playerCard.value?.$el)
const { track, isCurrentFm, isProgram, prev, next, togglePlayingQueue, togglePipLyric } = usePlayerControl()

const theme = computed(() => {
  return settingStore.wallpaperColor + 'Dark'
})

const coverImage = computed(() => {
  return sizeOfImage(track.value?.al?.picUrl ?? '', 1024)
})
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
const artists = computed(() => {
  return track.value?.ar ?? []
})

const eventBus = useEventBus<PlayNowEvent>('playNow')
eventBus.on((payload) => {
  const { id, from, setQueue } = payload
  player.updatePlayerTrack(id, true, true, false, from)
  if (setQueue) {
    playQueueStore.setQueue(id)
  }
})
const albumPicUrl = computed(() => sizeOfImage(track.value?.al?.picUrl ?? '', 128))

watchEffect(async () => {
  if (albumPicUrl.value) {
    await initColorPalette()
  }
})

const { innerWidth, innerHeight } = window
const position = ref([innerWidth - 172, innerHeight - 172])

const { motionProperties } = useMotionProperties(playerCardDom, {
  cursor: 'grab',
  x: position.value[0],
  y: position.value[1],
})

const { set } = useSpring(motionProperties as any)
const dragHandler: Handler<'drag'> = (state) => {
  const {
    movement: [moveX, moveY],
    dragging,
  } = state

  const [_x, _y] = position.value
  const [x, y] = [moveX + _x, moveY + _y]
  if (!dragging) {
    position.value = [x, y]
    set({ x: position.value[0], y: position.value[1], cursor: 'grab' })
    return
  }

  set({
    cursor: 'grabbing',
    x,
    y,
  })
}
useDrag(dragHandler, {
  domTarget: playerCardDom,
})

async function initColorPalette() {
  if (albumPicUrl.value) {
    const image = new Image()
    image.crossOrigin = 'anonymous'
    image.src = albumPicUrl.value
    const palette = await generateVuetifyTheme(image, 'Palette')
    colorPalette.value = palette[0].colors // light theme
  }
}
const maskColor = computed(() => {
  if (colorPalette.value) {
    const { primary } = colorPalette.value
    return `rgba(${hexToRgb(primary)}, 0.8)`
  } else {
    return 'rgba(0 0 0, 0)'
  }
})

const showHeartBeat = computed(() => {
  return userStore.logged && !isProgram && !isCurrentFm && track.value && userStore.likes.includes(track.value.id)
})
async function showPlayingPage() {
  appStore.showLyric = true
}

function openContextMenu(event: MouseEvent) {
  const { x, y } = event
  const buildMenu = () => {
    const items: MenuItem[] = [
      {
        label: '展开播放',
        onClick: () => {
          showPlayingPage()
        },
      },
      {
        label: t('common.add_playlist'),
        children: [
          ...playlists.value.map((list) => {
            return {
              label: list.name,
              onClick: () => {
                track.value?.id && trackToPlayList(list.id, track.value.id)
              },
            }
          }),
        ],
      },
      {
        label: t('common.show_pip'),
        onClick: () => {
          togglePipLyric()
        },
      },
      {
        divided: true,
      },
      {
        label: t('common.queue'),
        onClick: () => {
          togglePlayingQueue()
        },
      },

      {
        label: '去歌手页',
        onClick: () => {
          togglePlayingQueue()
        },
        children: artists.value.map((artist) => {
          return {
            label: artist.name,
            onClick: () => {
              const id = artist.id
              if (id) {
                router.push({
                  name: 'artist',
                  params: {
                    id,
                  },
                })
              }
            },
          }
        }),
      },
      {
        label: '去专辑页',
        onClick: () => {
          const albumId = track.value?.al?.id
          if (albumId) {
            router.push({
              name: 'album',
              params: {
                id: albumId,
              },
            })
          }
        },
      },
    ]
    if (showHeartBeat.value) {
      items.push({
        label: '心动模式',
        onClick: () => {
          generateHeartBeatList()
        },
      })
    }
    return items
  }
  const option = {
    theme: themeName.value,
    x,
    y,
    items: buildMenu(),
    offsetFooter: 32,
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
  }
}
</script>
