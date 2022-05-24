<script setup lang="ts">
import {
  mdiAlbum,
  mdiClockOutline,
  mdiDelete,
  mdiDownload,
  mdiFaceMan,
  mdiHeart,
  mdiHeartBroken,
  mdiPlaylistMusic,
} from '@mdi/js'
import { useToast } from 'vue-toastification'
import type { MenuItem } from 'vuetify-ctx-menu/lib/ContextMenuDefine'
import { useContextMenu } from 'vuetify-ctx-menu/lib/ContextMenuInstance'

import { useTheme } from '@/hooks/useTheme'
import { useUserStore } from '@/store/user'
import type { Track } from '@/types'

const userStore = useUserStore()
const theme = useTheme()
const contextMenu = useContextMenu()
const toast = useToast()

const props = defineProps<{
  tracks: Track[]
  type: string
}>()
const eventBus = useEventBus<number>('addToQueue')

const playlists = computed(() => {
  return userStore.playlists.map((i) => {
    return {
      id: i.id,
      name: i.name,
    }
  })
})
const className = computed(() => {
  if (props.type !== 'album') {
    return 'list-header'
  } else {
    return 'list-header album-header'
  }
})
function openMenu(payload: { x: number; y: number; track: Track; liked: boolean }) {
  const { x, y, liked, track } = payload
  const option = {
    theme: theme.value,
    x,
    y,
    items: genMenu(liked, track),
  }
  contextMenu(option)
}
function genMenu(liked: boolean, track: Track): MenuItem[] {
  const items = [
    {
      icon: mdiPlaylistMusic,
      label: '添加到播放队列',
      onClick: () => {
        addToQueue(i)
      },
    },
    {
      icon: mdiFaceMan,
      label: '转至艺人',
      onClick: (i) => {
        go()
      },
    },
    {
      icon: mdiAlbum,
      label: '转至专辑',
      onClick: (i) => {
        go()
      },
    },
    {
      icon: mdiPlaylistMusic,
      label: '加入歌单',
      children: playlists.value.map((list) => {
        return {
          label: list.name,
          onClick: (i) => {
            addToPlayList(list.id, i.id)
          },
        }
      }),
    },
    {
      icon: mdiDownload,
      label: '下载到本地',
      onClick: (i) => {
        download()
      },
    },
    // todo add
    // {
    //   icon: mdiDelete,
    //   label: '从此歌单删除',
    //   onClick: (i) => {
    //     console.log(i)
    //   },
    // },
  ]
  if (liked) {
    items.push({
      icon: mdiHeartBroken,
      label: '从"喜欢的音乐"移除',
      onClick: (i) => {
        toggleLike(true, i.track)
      },
    })
  } else {
    items.push({
      icon: mdiHeart,
      label: '添加到"喜欢的音乐"',
      onClick: (i) => {
        toggleLike(false, i.track)
      },
    })
  }
  return items
}
function download() {
  // todo download
}
function fav() {
  // todo fav
}
async function toggleLike(liked: boolean, track: Track) {
  const success = await userStore.favSong(track.id, !liked)
  if (success) {
    if (liked) {
      toast.success('已从"喜欢的音乐"移除')
    } else {
      toast.success('已添加至"喜欢的音乐"')
    }
  } else {
    toast.error('操作频繁或者网络出现错误')
  }
}
function addToQueue(track: Track) {
  // add to queue
}
function addToPlayList(playlistId: number, trackId: number) {
  // add to playlist
}
function go() {
  // todo go
}
</script>
<template>
  <v-list class="track-list">
    <div class="px-2 text-caption" :class="[className]">
      <span class="d-flex justify-center">#</span>
      <span>{{ $t('common.title') }}</span>
      <span v-if="type === 'list'">{{ $t('main.albums') }}</span>
      <span class="d-flex justify-end align-center mr-16"
        ><v-icon small> {{ mdiClockOutline }}</v-icon></span
      >
    </div>
    <v-divider class="mx-4 my-2" />
    <track-item
      v-for="(track, idx) in tracks"
      :key="track.id"
      :track="track"
      :index="idx + 1"
      :type="type"
      @play="eventBus.emit(track.id)"
      @openctxmenu="openMenu"
    />
  </v-list>
</template>
<style lang="scss" scoped>
.track-list {
  .list-header {
    display: grid;
    grid-gap: 16px;
    grid-template-columns: [index] 40px [first] 3fr [second] 2fr [last] minmax(100px, 1fr);
    &.album-header {
      grid-template-columns: [index] 40px [first] 4fr [last] minmax(100px, 1fr);
    }
  }
}
</style>
