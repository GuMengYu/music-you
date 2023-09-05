<script lang="ts" setup>
import { mdiDotsHorizontal, mdiDotsVertical } from '@mdi/js'
import type { PropType } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRouter } from 'vue-router'
import { useToast } from 'vue-toastification'
import type { MenuItem } from 'vuetify-ctx-menu/lib/ContextMenuDefine'
import { useContextMenu } from 'vuetify-ctx-menu/lib/main'

import { opPlaylist } from '@/api/music'
import { dailyRecommendDislike } from '@/api/user'
import { usePlayQueueStore } from '@/store/playQueue'
import { useUserStore } from '@/store/user'
import type { listType, PlayNowEvent, Track, TrackFrom } from '@/types'
const { themeName } = useCurrentTheme()
const contextMenu = useContextMenu()
const toast = useToast()
const { t } = useI18n()
const router = useRouter()
const userStore = useUserStore()
const playQueueStore = usePlayQueueStore()

const props = defineProps({
  track: {
    type: Object as PropType<Track>,
    default: null,
  },
  iconDirection: {
    type: String as PropType<'vertical' | 'horizontal'>,
    default: 'horizontal',
  },
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
        // updateList('remove', trackId)
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
      // updateList('replace', trackId, data)
    } else {
      toast.error(message!)
    }
  } catch (e) {
    const { code, message } = (e as any).data
    if (code === 432) {
      toast.info(message)
      // updateList('remove', trackId)
    } else {
      toast.error(t('message.something_wrong'))
    }
  }
}
// function updateList(type: 'replace' | 'remove', trackId: number, track?: Track) {
//   const list = [...props.tracks]
//   const index = list.findIndex((i) => i.id === trackId)
//   if (index > -1) {
//     if (type === 'replace' && track) {
//       list.splice(index, 1, track)
//     } else {
//       list.splice(index, 1)
//     }
//     emits('updateList', list)
//   }
// }
function toArtist(id: number) {
  router.push(`/artist/${id}`)
}
function toAlbum(id: number) {
  router.push(`/album/${id}`)
}
</script>
<template>
  <v-btn icon size="small" @click="openMenu"
    ><v-icon>{{ iconDirection === 'horizontal' ? mdiDotsHorizontal : mdiDotsVertical }}</v-icon></v-btn
  >
</template>
<style scoped>
/* scoped css */
</style>
