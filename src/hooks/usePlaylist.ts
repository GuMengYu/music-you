import { useMemo } from 'react'
import { groupBy } from 'lodash-es'
import { useUserStore } from '@/store/user'
import { specialType } from '@/util/metadata'
import { Playlist } from '@/types'

export function useMyPlaylist() {
  const { playlists, account } = useUserStore()

  const filteredPlaylist = useMemo(() => {
    const uid = account?.profile.userId
    return groupBy(playlists, (i) => {
      return i.userId === uid ? 'create' : 'sub'
    })
  }, [playlists, account])

  const createdPlaylist = useMemo(() => {
    return filteredPlaylist['create']?.filter(playlist => playlist.specialType !== specialType.fav.type)
  }, [filteredPlaylist])

  const isCreatedPlaylist = (playlist: Playlist) => playlist.creator.userId === account.account.id && playlist.specialType !== specialType.fav.type

  return {
    isCreatedPlaylist,
    createdPlaylist,
    subscribePlaylist: filteredPlaylist['sub'] ?? [],
    favList: playlists.find(playlist => playlist.specialType === specialType.fav.type),
  }
}
