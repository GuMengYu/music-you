import type { MaybeRef } from '@vueuse/core'
import { useToast } from 'vue-toastification'
import type { MenuItem } from 'vuetify-ctx-menu/lib/ContextMenuDefine'

import { opPlaylist } from '@/api/music'
import { useUserStore } from '@/store/user'
import type { Track } from '@/types'
import { specialType } from '@/util/metadata'

export function useTrackOperation(track: MaybeRef<Track>) {
  const userStore = useUserStore()
  const toast = useToast()
  const _track = ref()

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

  const toPlaylistMenuItems = computed<MenuItem[]>(() => {
    if (isRef(track)) {
      _track.value = track.value
    } else {
      _track.value = track
    }
    return playlists.value.map((list) => {
      return {
        label: list.name,
        onClick: async () => {
          try {
            const { code, message } = await opPlaylist('add', list.id, _track.value.id)
            if (code === 200) {
              toast.success(`已添加到: ${list.name}`)
            } else {
              toast.error(message!)
            }
          } catch (e) {
            toast.error('添加到歌单出错了')
          }
        },
      }
    })
  })

  return { toPlaylistMenuItems }
}
