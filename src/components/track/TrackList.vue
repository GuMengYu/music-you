<script setup lang="ts">
import { mdiClockOutline } from '@mdi/js'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import type { MenuItem } from 'vuetify-ctx-menu/lib/ContextMenuDefine'
import { useContextMenu } from 'vuetify-ctx-menu/lib/main'

import { opPlaylist } from '@/api/music'
import { dailyRecommendDislike } from '@/api/user'
import { useDownloadMusic } from '@/hooks/useDownload'
import { useCurrentTheme } from '@/hooks/useTheme'
import { useTrackOperation } from '@/hooks/useTrackOperation'
import { usePlayQueueStore } from '@/store/playQueue'
import { useUserStore } from '@/store/user'
import type { listType, PlayNowEvent, Track, TrackFrom } from '@/types'
const userStore = useUserStore()
const playQueueStore = usePlayQueueStore()
const { themeName } = useCurrentTheme()
const contextMenu = useContextMenu()
const toast = useToast()
const { t } = useI18n()
const router = useRouter()

type TrackListType = 'album' | 'playlist' | 'artist' | 'fav' | 'daily'
const props = defineProps<{
  tracks: Track[]
  type: TrackListType
  id?: number
  own?: boolean // 是否是自己的歌单id
  header?: boolean
  offsetIndex?: number
  virtualScrollOptimization?: boolean
  setQueue?: boolean
  buffer?: number
}>()

const topSentinel = ref<HTMLDivElement>()
const bottomSentinel = ref<HTMLDivElement>()

const needScorllLength = ref(props.tracks.length > 20 ? 20 : props.tracks.length)
const itemHeight = 56
const renderedItems = ref<Track[]>([])
const totalItemLength = computed(() => props.tracks.length)
const realHeight = computed(() => props.tracks.length * itemHeight)
const renderedHeight = computed(() => renderedItems.value.length * itemHeight)

const sentinelHeight = computed(() => {
  return Math.min(itemHeight * (needScorllLength.value - 2), itemHeight * totalItemLength.value)
})
const topSentinelStyle = computed(() => {
  return { height: `${sentinelHeight.value}px` }
})
const bottomSentinelStyle = computed(() => {
  return { height: `calc(100% - ${renderedHeight.value}px + ${sentinelHeight.value}px)` }
})
const { stop } = useIntersectionObserver(
  [topSentinel, bottomSentinel],
  (e) => {
    e.forEach((e) => {
      e.isIntersecting && loadMore()
    })
  },
  { threshold: [0] }
)
onMounted(async () => {
  const initItems = props.tracks.slice(0, needScorllLength.value)
  renderedItems.value.splice(0, 0, ...initItems)
})

onUnmounted(() => {
  stop()
})

function loadMore() {
  const renderedItemsLength = renderedItems.value.length
  if (renderedItemsLength >= props.tracks.length) {
    return
  } else {
    const more = props.tracks.slice(renderedItemsLength, renderedItemsLength + (props.buffer ?? 8))
    renderedItems.value.splice(renderedItemsLength, 0, ...more)
  }
}
const emits = defineEmits<{
  (event: 'updateList', payload: Track[]): void
}>()

const eventBus = useEventBus<PlayNowEvent>('playNow')

const className = computed(() => {
  if (props.type !== 'album') {
    return 'list-header'
  } else {
    return 'list-header album-header'
  }
})
const showAlbum = computed(() => {
  return props.type !== 'album'
})
const offsetIndex = computed(() => {
  return props.offsetIndex ?? 1
})
function openMenu(payload: { x: number; y: number; track: Track; liked: boolean }) {
  const { x, y, liked, track } = payload
  const option = {
    theme: themeName.value,
    x,
    y,
    items: genMenu(liked, track),
    offsetFooter: 64,
    customClass: 'bg-surfaceVariant',
  }
  contextMenu(option)
}
function genMenu(liked: boolean, track: Track): MenuItem[] {
  const { toPlaylistMenuItems } = useTrackOperation(track)
  const items: MenuItem[] = [
    {
      label: t('common.add_to_queue'),
      onClick: (i) => {
        addToQueue(track)
      },
    },
    {
      label: t('common.to_artist'),
      ...(track.ar && track.ar.length > 1
        ? {
            children: track.ar?.map((artist) => {
              return {
                label: artist.name,
                onClick: () => {
                  toArtist(artist.id)
                },
              }
            }),
          }
        : {
            onClick: (i) => {
              toArtist(track.ar![0].id)
            },
          }),
    },
    {
      label: t('common.to_album'),
      onClick: (i) => {
        toAlbum(track.al!.id)
      },
    },
    {
      label: '下载到本地',
      onClick: async (i) => {
        await useDownloadMusic(track)
      },
    },
    {
      divided: true,
    },
    {
      label: t('common.add_to_playlist'),
      children: toPlaylistMenuItems.value,
    },
  ]
  if (liked) {
    items.push({
      label: t('common.remove_from_fav'),
      onClick: (i) => {
        toggleLike(true, track.id)
      },
    })
  } else {
    items.push({
      label: t('common.add_to_fav'),
      onClick: (i) => {
        toggleLike(false, track.id)
      },
    })
  }
  if (props.own && props.type !== 'fav') {
    items.push({
      label: t('common.remove_from_playlist'),
      onClick: (i) => {
        // “!”非空断言
        trackToPlayList('del', props.id!, track.id)
      },
    })
  }
  if (props.type === 'daily') {
    items.push({
      label: t('common.not_interested'),
      onClick: (i) => {
        notInterested(track.id)
      },
    })
  }
  return items
}
async function toggleLike(liked: boolean, trackId: number) {
  const success = await userStore.favSong(trackId, !liked)
  if (success) {
    if (liked) {
      toast.success(t('message.remove_fav_success'))
    } else {
      toast.success(t('message.add_fav_success'))
    }
  } else {
    toast.error(t('message.something_wrong'))
  }
}
function addToQueue(track: Track) {
  playQueueStore.addToPlayQueue(track, <TrackFrom>{ type: props.type, id: props.id ?? 0 })
}
async function trackToPlayList(op: 'add' | 'del' = 'add', playlistId: number, trackId: number) {
  // add to playlist
  try {
    const { code, message } = await opPlaylist(op, playlistId, trackId)
    if (code === 200) {
      if (op === 'del') {
        updateList('remove', trackId)
        toast.success(t('message.remove_list_success'))
      } else {
        toast.success(t('message.add_list_success'))
      }
    } else {
      toast.error(message!)
    }
  } catch (e) {
    toast.error(t('message.something_wrong'))
  }
}
async function notInterested(trackId: number) {
  try {
    const { code, data, message } = await dailyRecommendDislike(trackId)
    if (code === 200) {
      updateList('replace', trackId, data)
    } else {
      toast.error(message!)
    }
  } catch (e) {
    const { code, message } = (e as any).data
    if (code === 432) {
      toast.info(message)
      updateList('remove', trackId)
    } else {
      toast.error(t('message.something_wrong'))
    }
  }
}
function updateList(type: 'replace' | 'remove', trackId: number, track?: Track) {
  const list = [...props.tracks]
  const index = list.findIndex((i) => i.id === trackId)
  if (index > -1) {
    if (type === 'replace' && track) {
      list.splice(index, 1, track)
    } else {
      list.splice(index, 1)
    }
    emits('updateList', list)
  }
}
function toArtist(id: number) {
  router.push(`/artist/${id}`)
}
function toAlbum(id: number) {
  router.push(`/album/${id}`)
}
function handlePlay(id: number) {
  const payload: PlayNowEvent = {
    id,
    setQueue: <boolean>props.setQueue,
    from: { id: 0, type: 'unknown' },
  }
  if (props.id) {
    payload.from = { id: props.id, type: props.type as listType }
  }
  eventBus.emit(payload)
}
</script>
<template>
  <div>
    <div v-if="header">
      <div class="px-2 text-caption" :class="[className]">
        <span class="d-flex justify-center">#</span>
        <span>{{ t('common.title') }}</span>
        <span v-if="showAlbum">{{ t('main.albums') }}</span>
        <span class="d-flex justify-center align-center"
          ><v-icon size="small"> {{ mdiClockOutline }}</v-icon></span
        >
      </div>
      <v-divider class="mx-4 my-2" />
    </div>
    <div class="container" :style="{ height: `${realHeight}px` }">
      <div ref="topSentinel" class="top_sentinel" :style="topSentinelStyle"></div>
      <v-list class="track-list py-0">
        <track-item
          v-for="(track, index) in renderedItems"
          :key="track.id"
          :track="track"
          :index="index + offsetIndex"
          :album="showAlbum"
          @play="handlePlay(track.id)"
          @openctxmenu="openMenu"
        />
      </v-list>
      <div ref="bottomSentinel" :style="bottomSentinelStyle" class="bottom_sentinel">
        <div class="presstential" :style="{ height: `${sentinelHeight}px` }"></div>
        <div class="tracks_placeholder" :style="{ height: `calc(100% - ${sentinelHeight}px)` }"></div>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
.list-header {
  display: grid;
  grid-gap: 5px;
  grid-template-columns: [index] 48px [first] 3fr [second] 2fr [last] minmax(140px, 160px);
  &.album-header {
    grid-template-columns: [index] 48px [first] 4fr [last] minmax(140px, 160px);
  }
}
.container {
  position: relative;
}
.top_sentinel {
  position: absolute;
  top: 0;
  width: 100%;
  pointer-events: none;
  overflow: hidden;
}
.bottom_sentinel {
  position: absolute;
  bottom: 0;
  width: 100%;
  pointer-events: none;
  overflow: hidden;
}
</style>
